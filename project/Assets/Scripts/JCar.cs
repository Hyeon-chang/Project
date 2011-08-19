/**
 * A simple car physics script using wheel colliders.
 * Jaap Kreijkamp jaap@ctrl-j.com.au
 *
 * orientation should be that front of car is in direction of
 * the 'blue arrow' in Unity, the roof should be in direction of
 * the green angle. Thus with rotation 0, 0, 0, adding 1 to Z
 * will move car 1m forward, adding 1 to Y will move car 1m
 * upward. The wheels should be children of the car object this
 * script is added to and connected to the wheelFL, wheelFR, ...
 * variables.
 *
 * Please modify script and do whatever you like with it,
 * in it's current state it should give a working car,
 * but by no means perfect (or even close) behavior.
 * It's my first attempt and don't really need in my current
 * project so haven't put too much effort into it to perfect
 * it. As often people are looking for help to getting
 * a car working with wheel colliders, I'd appreciate when
 * improvements are posted back on the unity forums.
 *
 * Lastly, thanks to all the people helping me on forums (especially
 * the order of initialisation problem and other example
 * code that helped me much in learning how to do stuff like
 * this).
 */

using UnityEngine;
using System.Collections;

// used to indicate if car is frontwheeldrive, backwheeldrive or 4wheeldrive
// also (mis)used to indicate if a wheel is a front wheel or a back wheel
public enum JWheelType {
	Front = 1,
	Back = 2,
	All = 3
}


public class JCar : MonoBehaviour {	

	// if connected the controls will block if object not active
	// (for example steer only if car camera is active).
	public GameObject checkForActive;
	public int racingState = 0;
	
	
	// if set car records position, accel, ... data every time
	// handle motor is called.
	//public JRecordRoute recordRoute;
	
	// returns current speed in Km/H
	public float CurrentSpeed {
		get { return rigidbody.velocity.magnitude * 3.6f; }
	}
	
	public int CurrentGear {
		get { return currentGear; }
	}
	
	public float MotorRPM {
		get { return motorRPM; }
	}
	
	public bool MotorRunning {
		get { return audioSource.isPlaying; }
	}
	
	public float TotalDistance {
		get { return totaldist; }
	}
	
	public Transform wheelFR; // connect to Front Right Wheel transform
	public Transform wheelFL; // connect to Front Left Wheel transform
	public Transform wheelBR; // connect to Back Right Wheel transform
	public Transform wheelBL; // connect to Back Left Wheel transform

	// power curves (power1 is for gear 1 and reverse!)
	// horizontal axis is RPM
	// vertical axis is power, where 5000f equals to 100%
	// (you can go over 5000f if you want, but for easier tuning it's probably
	//  better to adjust the torque parameter and keep the curve below 5000f.)
	// the default values are totally useless, so you have to edit the curves,
	// you can do this by adding CurveEditor.cs and ResponseCurveEditor.cs to
	// your project (in Editor directory of JCar or in the Animation-API example).
	// the best way to set curves is steep increase with top at 2000RPM, then
	// slow decrease back to 0 at high RPM, say 5000.
	// power1 starts curve at halfway to have enough power to drive away, power2
	// starts curve at 1/4 or so, you can drive away with gear2 but it's more
	// difficult
	public AnimationCurve power1 = AnimationCurve.Linear(0.0f, 5000.0f, 8000f, 0.0f);
	public AnimationCurve power2 = AnimationCurve.Linear(0.0f, 5000.0f, 8000f, 0.0f);
	public AnimationCurve power3 = AnimationCurve.Linear(0.0f, 5000.0f, 8000f, 0.0f);
	public AnimationCurve power4 = AnimationCurve.Linear(0.0f, 5000.0f, 8000f, 0.0f);
	public AnimationCurve power5 = AnimationCurve.Linear(0.0f, 5000.0f, 8000f, 0.0f);

	public float suspensionDistance = 0.2f; // amount of movement in suspension
	public float springs = 2f; // suspension springs
	public float dampers = 0.01f; // how much damping the suspension has
	public float wheelRadius = 0.25f; // the radius of the wheels
	public float torque = 150f; // the base power of the engine (per wheel, and before gears)
	public float brakeTorque = 2000f; // the power of the braks (per wheel)
	public float wheelWeight = 3f; // the weight of a wheel
	public Vector3 shiftCentre = new Vector3(0.0f, -0.25f, 0.0f); // offset of centre of mass
	
	public float maxSteerAngle = 30.0f; // max angle of steering wheels
	public JWheelType wheelDrive = JWheelType.Front; // which wheels are powered
	
	public float idleRPM = 500.0f; // idle rpm
	
	public float fwdStiffnessFront = 0.15f; // for wheels, determines slip
	public float fwdStiffnessBack = 0.15f; // for wheels, determines slip
	public float swyStiffnessFront = 0.03f; // for wheels, determines slip
	public float swyStiffnessBack = 0.015f; // for wheels, determines slip
	
	// gear ratios (index 0 is reverse)
	public float[] gears = { -10f, 9f, 6f, 4.5f, 3f, 2.5f };
	
	// how much RPM can increase/decrease per second
	public float maxRPMIncrease = 500f;
	public float maxRPMDecrease = 1000f;
	
	
	public float killEngineSoundTimeout = 3.0f; // time until engine sound is cut off (in s.)
		
	int currentGear = 1; // duh.
		
	// shortcut to the component audiosource (engine sound).
	AudioSource audioSource;

	float totaldist = 0f;
	float rpmtodist; // used for distance calculation initialized in Start
	
	// every wheel has a wheeldata struct, contains useful wheel specific info
	public class WheelData {
		public Transform transform;
		public GameObject go;
		public WheelCollider col;
		public Vector3 startPos;
		public float rotation = 0.0f;
		public float maxSteer;
		public JWheelType wheeltype;
		public bool floorcontact;
	};
	
	float CalcPower(int gear, float rpm) {
		AnimationCurve ac;
		switch (gear) {
			case 0 : ac = power1; break;
			case 1 : ac = power1; break;
			case 2 : ac = power2; break;
			case 3 : ac = power3; break;
			case 4 : ac = power4; break;
			case 5 : ac = power5; break;
			default : ac = power5; break;
		}
		// we use 5000 in power curve as about 100% so we div by 5000 here...
		float val = ac.Evaluate(rpm) * torque / 5000f;
		return (gear == 0)?-val:val;
	}
	
	protected WheelData[] wheels; // array with the wheel data
	
	// setup wheelcollider for given wheel data
	// wheel is the transform of the wheel
	// maxSteer is the angle in degrees the wheel can steer (0f for no steering)
	// motor if wheel is driven by engine or not
	WheelData SetWheelParams(Transform wheel, float maxSteer, JWheelType wheeltype) {
		if (wheel == null) {
			throw new System.Exception("wheel not connected to script!");
		}
		WheelData result = new WheelData(); // the container of wheel specific data

		// we create a new gameobject for the collider and move, transform it to match
		// the position of the wheel it represents. This allows us to do transforms
		// on the wheel itself without disturbing the collider.
		GameObject go = new GameObject("WheelCollider");
		go.transform.parent = transform; // the car, not the wheel is parent
		go.transform.position = wheel.position; // match wheel pos
		
		// create the actual wheel collider in the collider game object
		WheelCollider col = (WheelCollider) go.AddComponent(typeof(WheelCollider));
		col.motorTorque = 0.0f;
		
		// store some useful references in the wheeldata object
		result.transform = wheel; // access to wheel transform 
		result.go = go; // store the collider game object
		result.col = col; // store the collider self
		result.startPos = go.transform.localPosition; // store the current local pos of wheel
		result.maxSteer = maxSteer; // store the max steering angle allowed for wheel
		result.wheeltype = wheeltype; // store if wheel is connected to engine


		// see docs, haven't really managed to get this work
		// like i would but just try out a fiddle with it.
		WheelFrictionCurve fc = col.forwardFriction;
		// fc.asymptoteValue = 5000.0f;
		// fc.extremumSlip = 2.0f;
		// fc.asymptoteSlip = 20.0f;
		fc.stiffness = (wheeltype==JWheelType.Front)?fwdStiffnessFront:fwdStiffnessBack;
		col.forwardFriction = fc;
		fc = col.sidewaysFriction;
		// fc.asymptoteValue = 7500.0f;
		// fc.asymptoteSlip = 2.0f;
		fc.stiffness = (wheeltype==JWheelType.Front)?swyStiffnessFront:swyStiffnessBack;
		col.sidewaysFriction = fc;
		
		return result; // return the WheelData
	}
	
	// Use this for initialization
	void Start () {
		rigidbody.isKinematic = true;
		// used for distance calculation using rpm of wheels
		rpmtodist = 2f * Mathf.PI * wheelRadius / 60f;
		
		// 4 wheels, if needed different size just modify and modify
		// the wheels[...] block below.
		wheels = new WheelData[4];
		
		// we use 4 wheels, but you can change that easily if neccesary.
		// this is the only place that refers directly to wheelFL, ...
		// so when adding wheels, you need to add the public transforms,
		// adjust the array size, and add the wheels initialisation here.
		wheels[0] = SetWheelParams(wheelFR, maxSteerAngle, JWheelType.Front);
		wheels[1] = SetWheelParams(wheelFL, maxSteerAngle, JWheelType.Front);
		wheels[2] = SetWheelParams(wheelBR, 0.0f, JWheelType.Back);
		wheels[3] = SetWheelParams(wheelBL, 0.0f, JWheelType.Back);
		
		// found out the hard way: some parameters must be set AFTER all wheel colliders
		// are created, like wheel mass, otherwise your car will act funny and will
		// flip over all the time.
		foreach (WheelData w in wheels) {
			WheelCollider col = w.col;
			col.suspensionDistance = suspensionDistance;
			JointSpring js = col.suspensionSpring;
			js.spring = springs;
			js.damper = dampers;			
			col.suspensionSpring = js;
			col.radius = wheelRadius;
			col.mass = wheelWeight;
						
		}
		
		// we move the centre of mass (somewhere below the centre works best.)
		rigidbody.centerOfMass += shiftCentre;
		rigidbody.mass = rigidbody.mass;
		rigidbody.isKinematic = false;
		
		// shortcut to audioSource should be engine sound, if null then no engine sound.
		audioSource = (AudioSource) GetComponent(typeof(AudioSource));
		if (audioSource == null) {
			Debug.Log("No audio source, add one to the car with looping engine noise (but can be turned off");
		}
		
	}
	
	
	float shiftDelay = 0.0f;
	
	// handle shifting a gear up
	public void ShiftUp() {
		float now = Time.timeSinceLevelLoad;
		
		// check if we have waited long enough to shift
		if (now < shiftDelay) return;
		
		// check if we can shift up
		if (currentGear < gears.Length - 1) {
			currentGear ++;
			
			// we delay the next shift with 1s. (sorry, hardcoded)
			shiftDelay = now + 1.0f;
		}
	}
	
	// handle shifting a gear down
	public void ShiftDown() {
		float now = Time.timeSinceLevelLoad;

		// check if we have waited long enough to shift
		if (now < shiftDelay) return;
		
		// check if we can shift down (note gear 0 is reverse)
		if (currentGear > 0) {
			currentGear --;

			// we delay the next shift with 1/10s. (sorry, hardcoded)
			shiftDelay = now + 0.1f;
		}
	}
	
	float motorRPM = 0.0f;
	float killEngine = 0.0f;
		
	public void HandleMotor(float steer, float accel) {
		float delta = Time.fixedDeltaTime;
		bool brake = false;
		/*
		if (recordRoute != null) {
			recordRoute.Add(this.gameObject, accel, steer, CurrentGear);
		}
		*/
		if (accel < 0.0f) {
			// if we try to decelerate we brake.
			brake = true;
			accel = 0.0f;
		}

		float rpm = 0.0f;
		int motorizedWheels = 0;

		// calc rpm from current wheel speed and do some updating
		foreach (WheelData w in wheels) {
			WheelHit hit;
			WheelCollider col = w.col;
			bool motor = ((w.wheeltype & wheelDrive) != 0);
			
			// only calculate rpm on wheels that are connected to engine
			if (motor) {
				rpm += col.rpm;
				motorizedWheels++;
			}
			
			// calculate the local rotation of the wheels from the delta time and rpm
			// then set the local rotation accordingly (also adjust for steering)
			w.rotation = Mathf.Repeat(w.rotation + delta * col.rpm * 360.0f / 60.0f, 360.0f);
			w.transform.localRotation = Quaternion.Euler(w.rotation, col.steerAngle, 0.0f);
			
			// let the wheels contact the ground, if no groundhit extend max suspension distance
			Vector3 lp = w.transform.localPosition;
			if (col.GetGroundHit(out hit)) {
				lp.y -= Vector3.Dot(w.transform.position - hit.point, transform.up) - col.radius;
				w.floorcontact = true;
			}
			else {
				lp.y = w.startPos.y - suspensionDistance;
				w.floorcontact = false;
			}
			w.transform.localPosition = lp;
		}
		// calculate the actual motor rpm from the wheels connected to the engine
		// note we haven't corrected for gear yet.
		if (motorizedWheels > 1) {
			rpm = rpm / motorizedWheels;
		}
		// we use the rpm to calculate distance car has driven
		totaldist += rpm * rpmtodist * delta;
		
		// correct RPM for gear used
		float calcRPM = Mathf.Abs(rpm * gears[currentGear]);
		motorRPM = Mathf.Clamp(calcRPM, motorRPM - maxRPMDecrease * delta, motorRPM + maxRPMIncrease * delta);
		
		// don't blow the engine
		if (motorRPM > 6500.0f) motorRPM = 6500.0f;
		
		// calc torque given RPM, gear, accel (throttle) and number of motorized wheels
		float newTorque = CalcPower(currentGear, motorRPM) * accel / motorizedWheels;

		// go set torque to the wheels
		foreach (WheelData w in wheels) {
			WheelCollider col = w.col;
			
			// of course, only the wheels connected to the engine can get engine torque
			if ((w.wheeltype & wheelDrive) != 0) {
				if (w.floorcontact) {
					col.motorTorque = newTorque * accel;				}
				else {
					col.motorTorque = newTorque * accel * .1f;
				}
			}
			// check if we have to brake
			col.brakeTorque = (brake)?brakeTorque:0.0f;
			
			// set steering angle
			col.steerAngle = steer * w.maxSteer;
		}
		// let engine not run below idle
		motorRPM = Mathf.Max(motorRPM, idleRPM);
		
		// if we have an audiosource (motorsound) adjust pitch using rpm		
		if (audioSource != null) {
			// calculate pitch (keep it within reasonable bounds)
			float pitch = Mathf.Clamp(1.0f + ((motorRPM - idleRPM) / (idleRPM)), 1.0f, 10.0f);
			audioSource.pitch = pitch;
			
			if ((motorRPM > idleRPM + 1f) || (accel > 0.0f)) {
				// turn on sound if it's not playing yet and RPM is > idle
				if (!audioSource.isPlaying) {
					audioSource.Play();
				}
				// how long we should wait with engine RPM is idle before killing engine sound
				killEngine = Time.time + killEngineSoundTimeout;
			}
			else if ((audioSource.isPlaying) && (Time.time > killEngine)) {
				// standing still, kill engine sound.
				audioSource.Stop();
			}
		}
	}
	
	public int getRacingState(){
		return racingState;
	}
	
	public void setRacingState(int i){
		racingState = i;
	}
}
