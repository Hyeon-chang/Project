private var limitLeft : float;
private var limitRight : float;
public var carList : Transform[];
public var gap : float = 10;
public var MoveSound : AudioClip;
public var SelectSound : AudioClip;

private var selectedCar : GameObject;
private var someScript : selectedCarScript;

//private var sound : SelectModeSound = null;
//sound = transform.GetComponent(SelectModeSound);

private var newPos : Vector3;
private var target : Vector3;
private var distance : float = 8.0f;
private var carmeraMoving : boolean = false;
private var nextLevel : String = null;
private var readyToNextLevel : boolean = false;

private var selectTransform : Transform;

function Awake(){
    
}

function ApplyLimit(){
      limitLeft = carList[0].transform.position.x;
      limitRight = carList[carList.Length-1].transform.position.x;
}

function Start(){
      ApplyLimit();
      
      selectedCar = GameObject.Find("gameInfo");
      someScript = selectedCar.transform.GetComponent(selectedCarScript);
}

function RotateCar(){
      if(selectTransform){
            selectTransform.Rotate(Vector3.up*Time.deltaTime*50);
      }
}

function Update (){
	if(!carmeraMoving){
	   RotateCar();
       if(Input.GetKeyDown("left")){
             if((transform.position.x > carList[0].transform.position.x - 0.02f)&&(transform.position.x < carList[0].transform.position.x + 0.02f)){
            	audio.PlayOneShot(MoveSound);
                  //sound.CannotMoveSound(..);          
            }
            else{
                  target = transform.position + new Vector3(-gap, 0, 0);
                  newPos = target;
                  //sound.ToLeftSound(..);
                  audio.PlayOneShot(MoveSound);
                  carmeraMoving = true;
            }
        }
        else if(Input.GetKeyDown("right")){
            if((transform.position.x > carList[carList.Length-1].transform.position.x - 0.02f)&&(transform.position.x < carList[carList.Length-1].transform.position.x + 0.02f)){
                  audio.PlayOneShot(MoveSound);
                  //sound.CannotMoveSound(..);
            }
            else{
                  target = transform.position + new Vector3(gap, 0, 0);
                  newPos = target;
                  audio.PlayOneShot(MoveSound);
                  //sound.ToRightSound(..); 
                  carmeraMoving = true;  
            }
        }
        else if(Input.GetKeyDown("space")){
            if(selectTransform){
                someScript.carName = selectTransform.name;
                someScript.carScriptName = selectTransform.GetComponent("carInfo").carScriptName;
                
                audio.PlayOneShot(SelectSound);
                readyToNextLevel = true;
	   			curTime = Time.time;
	   			
				nextLevel = "wholeMap";
               //sound.ChoiceSound(..);    
            } 
        }
        if(readyToNextLevel){
			if(Time.time - curTime >1){
			 		if(nextLevel != null){
						Application.LoadLevel(nextLevel);
			}
		}
	}
      
      }
      
      if(carmeraMoving){
          transform.position = Vector3.Lerp(transform.position, newPos, Time.deltaTime*7);           
     	  if(Vector3.Distance(transform.position, newPos) < 0.01f){
   	              carmeraMoving  = false;
     	   }
     }
}

function OnGUI(){
    if(!carmeraMoving){
      var hit : RaycastHit;
      Physics.Raycast(transform.position, transform.forward, hit, distance+2);
        
      for (var t : Transform in carList)
	  {
	     if(t.name == hit.transform.name){
	          selectTransform = t;
	          //t.name에 해당하는 차 정보를 화면에 출력
	     }
	  }
	}
	
	
}