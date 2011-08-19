
var wheel1 : Transform;
var wheel2 : Transform;
var wheel3 : Transform;
var wheel4 : Transform;

public var wheelForce = 100000;
public var steerMaxAngle = 30;

private var contactCount = 0;
private var activeWayPoint : Point;

function Start () {

	activeWayPoint = Point.start;

	rigidbody.centerOfMass = Vector3 (0, 0, 0);
	rigidbody.inertiaTensorRotation = Quaternion.identity;
	rigidbody.inertiaTensor = Vector3 (1, 1, 1) * rigidbody.mass;
}


function UpdateWithTargetPosition (target : Vector3) {
	
//////////////////////////////////////////////////////////////////////////////////////////

	relativeTarget = transform.InverseTransformPoint(target);
	targetAngle = Mathf.Atan2(relativeTarget.x, relativeTarget.z);
	targetAngle *= Mathf.Rad2Deg;
	
	//if( contactCount == 0 ) Debug.Log("no conatact");
	
	if ( contactCount > 0 ){
	
		targetAngle = Mathf.Clamp(targetAngle, -steerMaxAngle, steerMaxAngle);
		
		wheel1.localEulerAngles = Vector3(0, targetAngle, 0);
		wheel2.localEulerAngles = Vector3(0, targetAngle, 0);
		transform.localEulerAngles.y += targetAngle*Time.deltaTime;
		
		
		
		var forward = transform.TransformDirection(Vector3.forward);
		var leftside_point = transform.TransformPoint(Vector3(-1, 0.25, 0));
		var rightside_point = transform.TransformPoint(Vector3(1, 0.25, 0));

		var hit : RaycastHit;    
		
		Debug.DrawRay(leftside_point , forward*3 , Color.red);
		Debug.DrawRay(rightside_point, forward*3, Color.red);
 
		var force = wheelForce * contactCount;
		
		if(Physics.Raycast(leftside_point, forward, hit, 3)){
		
			Debug.Log("left");		
			distance = Vector3.Distance(transform.position, hit.collider.gameObject.transform.position );
			transform.localEulerAngles.y +=30*Time.deltaTime;
		}
		
		if(Physics.Raycast(rightside_point, forward, hit, 3)){ 
		
		Debug.Log("right");
		
			distance = Vector3.Distance(transform.position, hit.collider.gameObject.transform.position );
			transform.localEulerAngles.y -= 30*Time.deltaTime;
		}
		
		
		
//////////////////////////////////////////////////////////////////////////////////////////
		
		if( rigidbody.velocity.magnitude < 10) rigidbody.AddRelativeForce (0, 0, force*5);			
		if (Mathf.Abs(targetAngle) > 15 || rigidbody.velocity.magnitude > 20) rigidbody.drag = 5;
		else	rigidbody.drag = 0;
		
		
		//Debug.Log("contactCount : " + contactCount + "\t\tvelocity : " + rigidbody.velocity.magnitude);
	}

	contactCount = 0;
}

function FixedUpdate () {

	targetPosition = activeWayPoint.CalculateTargetPosition (transform.position);
	UpdateWithTargetPosition (targetPosition);
}


function OnTriggerEnter (triggerWaypoint : Collider) {

	if (activeWayPoint.collider == triggerWaypoint) {
	
		activeWayPoint = activeWayPoint.next;
	}
}


function OnCollisionStay (collision : Collision) {

	for (var i : ContactPoint in collision.contacts) {
		
		if (i.thisCollider.transform == wheel1.transform) contactCount++;
		if (i.thisCollider.transform == wheel2.transform) contactCount++;
		if (i.thisCollider.transform == wheel3.transform) contactCount++;
		if (i.thisCollider.transform == wheel4.transform) contactCount++;
		
		Debug.DrawRay(i.point, i.normal * 5, Color.white);
	}
}


function OnDrawGizmosSelected () {

		Gizmos.color = Color.green;
		if(activeWayPoint != null)
		Gizmos.DrawLine (transform.position, activeWayPoint.transform.position);
}