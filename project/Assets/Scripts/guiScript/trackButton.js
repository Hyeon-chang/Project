var gSkin : GUISkin;
var courses : Transform[];
var buttonW : int = 64;
var buttonH : int = 64;
var buttonSound : AudioClip;

private var nextLevel : String = null;
private var readyToNextLevel : boolean = false;

function Awake(){
	
}

function Start(){
	
}

function Update () {
	
}

function OnGUI(){
	if(gSkin){
		GUI.skin = gSkin;
	}
	else{
		Debug.Log("GUI Skin object missing!");
	}
	
	for( var course in courses){
	
		var position : Vector2;
		position = getButtonPosition(course);
		
		if(GUI.Button(Rect(position.x - buttonH * 0.5f, Screen.height - position.y - buttonW , buttonW, buttonH),"","racing")){			
			audio.PlayOneShot(buttonSound);
			readyToNextLevel = true;
	   		curTime = Time.time;
			nextLevel = course.name;
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

function getButtonPosition(course : Transform) : Vector2{
	var temp : Vector2;
	temp = new Vector2();
	
	var fieldOfView = Camera.mainCamera.fieldOfView;
	var tangent = Mathf.Tan( fieldOfView*0.5*Mathf.Deg2Rad );
	var height : float;
	var width : float;
	
	var screenWidth : float = Screen.width;
	var screenHeight : float = Screen.height;
	
	if(Screen.width > Screen.height){
		height = Camera.mainCamera.transform.position.y * tangent * 2;
		
		
		width = height * ( screenWidth/screenHeight );
		//print("width :"+width+" height :" + height);
	}
	else{	
		
		width = Camera.mainCamera.transform.position.y * tangent * 2;
		height = width * (screenHeight/screenWidth);
		//print("width :"+width+" height :" + height);
	
	}
	
	temp.x = ((course.position.x + width * 0.5) / width) * screenWidth;
	temp.y = ((course.position.z + height * 0.5) / height) * screenHeight;
		
	print(temp);
	return temp;
	
}

@script ExecuteInEditMode();