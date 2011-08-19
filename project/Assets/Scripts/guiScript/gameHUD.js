var car : GameObject;
var carscript:Car;
var carSound : SoundController;
var timecontroller : Timecontroller;
var mySkin : GUISkin;
var curRPM : float;
var speedSkin : GUISkin;

function Start(){	
	
}
function Update () {
}

public var needleTexture: Texture2D = null;
var		tacho_texture 		: Texture;
var		lap                 : Texture;
var		Ranking             : Texture;
var one    : Texture;
var two    : Texture;
var three  : Texture;
var four   : Texture;
	
	
function OnGUI(){
//GUI.Skin=mySkin;
//This is the tachotexture
 
GUI.Label( Rect( Screen.width - 266, Screen.height -235, 256, 256 ), tacho_texture );	// x position, y position, size x, size y
GUI.Label( Rect( 50,65, 256, 256 ), lap );
GUI.Label( Rect( Screen.width/2+460, Screen.height-650, 256, 256 ), Ranking );

//Here comes the tachoneedle rotation
var matrixBackup:Matrix4x4  = GUI.matrix;


var pitch = carSound.prevPitchFactor;
curRPM = Mathf.Lerp(curRPM,pitch,0.01f);


var thisAngle:float = curRPM * 256.0f -128; 
var lapa = carscript.racingState;
//print("p : " +carSound.prevPitchFactor+ "angle : " + thisAngle);
//var thisAngle:float =  -128 +car.rigidbody.velocity.magnitude * 3.6f;
//var pos:Vector2 = Vector2(Screen.width/2+460+64,Screen.height-144+64); // rotatepoint in texture plus x/y coordinates. our needle is at 16/16. Texture is 128/128. Makes middle 64 plus 16 = 80

//GUIUtility.RotateAroundPivot(thisAngle, pos);

//var thisRect:Rect = Rect(Screen.width/2+460,Screen.height-144,128,128); //x position, y position, size x, size y

var pos:Vector2 = Vector2(Screen.width - 140,Screen.height - 110); // rotatepoint in texture plus x/y coordinates. our needle is at 16/16. Texture is 128/128. Makes middle 64 plus 16 = 80

GUIUtility.RotateAroundPivot(thisAngle, pos);

var thisRect:Rect = Rect(Screen.width -144,Screen.height -227,13,128); //x position, y position, size x, size y
GUI.DrawTexture(thisRect, needleTexture);  
GUI.matrix = matrixBackup; 





//---------------------------------------------- Debug ------------------------------------------------------------------------------------------
//Speed value
GUI.Label( Rect( Screen.width - 180, Screen.height-68, 73, 41 ),(Mathf.Round(car.rigidbody.velocity.magnitude * 1.8f).ToString()),speedSkin.label);

GUI.Label( Rect( 50 ,120 ,256,256), FormatSeconds(timecontroller.currentTime),speedSkin.customStyles[0]); 
GUI.Label( Rect( 50 ,30 ,256,256), Racing(lapa)); 
//
}

function SetTarget(target : GameObject){
	car = target;
	carscript = target.GetComponent("Car");	
	carSound = target.GetComponent("SoundController");	
	
}
function Racing(lapa : int) : Texture{
	
	var returnTexture : Texture;
	switch(lapa){
	    case -1:
			 returnTexture = one ;
			break;
		case 0:
			 returnTexture = one ;
			break;
			
		case 1:
		 	 returnTexture = two;
			break;
			
		case 2:
			returnTexture = three;
			break;
			
		case 3:
			returnTexture = four ;
			break;
	}
	return returnTexture;
}


function RPM(gear : int) : float {
	var pitch : float;
	switch(gear){
		case 0:
			pitch = Mathf.Lerp(0.1f,0.8f,carSound.prevPitchFactor);
			break;
		case 1:
			pitch = Mathf.Lerp(0.2f,0.82f,carSound.prevPitchFactor);
			break;
		case 2:
			pitch = Mathf.Lerp(0.3f,0.85f,carSound.prevPitchFactor);
			break;
		case 3:
			pitch = Mathf.Lerp(0.35f,0.90f,carSound.prevPitchFactor);
			break;
		case 4:
			pitch = Mathf.Lerp(0.4f,1,carSound.prevPitchFactor);
			break;
	}
	print(gear);
	return pitch;
	
	
}

function FormatSeconds(elapsed : float ) : String
{
    var d : int = elapsed * 100.0f;
    var minutes : int = d / (60 * 100);
    var seconds : int = (d % (60 * 100)) / 100;
    var hundredths : int = d % 100;
    return String.Format("{0:00}: {1:00}.{2:00}", minutes, seconds, hundredths);
}

//@script ExecuteInEditMode();