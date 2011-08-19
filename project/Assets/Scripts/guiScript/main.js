var backGround : Texture2D;
var buttonWidth : int = 328;
var buttonHeight : int = 94;
var buttonGap : int = 100;
var gSkin : GUISkin;
var imageYOffset : ArrayList;
var images : Texture2D[];
var SingleRace : AudioClip;
var MultiRace : AudioClip;
var Credit : AudioClip;
var Exit : AudioClip;


private var curTime : int;
private var init : boolean = false;
private var nextLevel : String = null;
private var readyToNextLevel : boolean = false;


function FixedUpdate () {
	for(var j : int =0 ; j < images.Length ; j++){
		imageYOffset[j] = imageYOffset[j] + 1;
		if(imageYOffset[j] > Screen.height){
			var k : int = j - 1;
			if(k < 0){
				k = 3;
			}						
			imageYOffset[j] = imageYOffset[k] - (images[j].height + 20);
			
		}
		//print(j + " " + imageYOffset[j]);
	}
}

function OnGUI(){
	if(gSkin){
		GUI.skin = gSkin;
	}
	else
		Debug.Log("Manu GUI Sking object missing!");
	
	
	
	if(!init){
	
		imageYOffset = new ArrayList() ;
		
		var otherImageOffset = 0 ;
		init = true;
		
		for ( var j : int = 0 ; j < images.Length ; j++){
			imageYOffset.Add(otherImageOffset);
			otherImageOffset -= (images[j].height + 20);			
			
		}
		
	}
	
	var backgroundStyle : GUIStyle = new GUIStyle();
	backgroundStyle.normal.background = backGround;
	
	GUI.Label(Rect(0,0,Screen.width, Screen.height),"",backgroundStyle);
	var i : int = 1;
	
	var manuCoordX : int = Screen.width * 0.131f;
	var manuCoordY : int = Screen.height * 0.468f;	
	
	if(GUI.Button(Rect(manuCoordX , Screen.height * 0.468f , buttonWidth ,buttonHeight),"Single Race")){
	    audio.PlayOneShot(SingleRace);
		readyToNextLevel = true;
	   	curTime = Time.time;
		nextLevel = "carselect";

	}
	
	if(GUI.Button(Rect(manuCoordX , manuCoordY + buttonGap*i++,buttonWidth ,buttonHeight),"Multi Race")){
	    audio.PlayOneShot(MultiRace);	
	}
	
	if(GUI.Button(Rect(manuCoordX , manuCoordY + buttonGap*i++,buttonWidth ,buttonHeight),"Credit")){
		audio.PlayOneShot(Credit);
	}
	
	if(GUI.Button(Rect(manuCoordX , manuCoordY + buttonGap*i++ ,buttonWidth ,buttonHeight),"Exit")){
		audio.PlayOneShot(Exit);
		Application.Quit();
	}
	
	
	
	
	if(init){
		for(i = 0 ; i <images.Length; i++){
			GUI.DrawTexture(Rect(Screen.width - 420, imageYOffset[i], images[i].width,images[i].height),images[i]);		
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

@script ExecuteInEditMode();
