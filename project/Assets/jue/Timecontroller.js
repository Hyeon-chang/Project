/*
	Time Mode Script Make by : Sung Mun Jue
	설명 : Time Mode시 GUI 화면에 내용을 출력
		  
*/

var startTime : float;		// 게임 시작 시간 
var currentTime : float;	// 게임의 현재 시간
var delay : float;			// 게임 종료까지 Delay 시간

var car : GameObject;
var carScript : Car;

var isgameWinning : boolean = false; 	// Game Winning State
var isgameOver : boolean = false;		// Game Over State
var isState : boolean = false; 			// GUI 출력 상태 State

var delayToggle : boolean = false;

public var carPrefabArray : GameObject[];
public var selectedCar : GameObject ;
private var someScript : selectedCarScript;
private var carScriptName : String;

function Start()
{
	selectedCar = GameObject.Find("gameInfo");
	if(selectedCar){
		someScript = selectedCar.transform.GetComponent(selectedCarScript);
		carScriptName = someScript.carScriptName;
		
		var rotation = Quaternion.identity;
		rotation.eulerAngles = Vector3(0,336,0);
		for(var GO : GameObject in carPrefabArray){
	    	if(GO.transform.name == someScript.carName)
	     		 car =  Instantiate(GO, new Vector3(-115, 43, 11.6448164), rotation);
	     }
	     
	     
	}
	else{
			car =  Instantiate(carPrefabArray[0], new Vector3(-115, 43, 11.6448164), rotation);
			
	}
	
	car.name = "car";
	carScript = car.GetComponent("Car");
	Camera.mainCamera.GetComponent("SmoothFollow").SendMessage("SetTarget", car);
	GameObject.Find("mapCamara").GetComponent("mapCamera").SetTarget(car);
	GameObject.Find("HUD").GetComponent("gameHUD").SetTarget(car);
	car.SetActiveRecursively(false);
	//SetTime(); // 임시로 타임 스타트 함. 3초 카운트 후 다시 실행 요
}

function Update () {
	// Time Mode 상태 파악
	// Time Mode 승리 
	ProgressTime();
	if(currentTime <= 300 && carScript.racingState==3){
		isgameWinning = true;		
		if(!delayToggle){
			SetDelay();
			delayToggle = true;
		}
	}
	
	// Time Mode 패배 
	if(currentTime >= 300 && carScript.racingState <= 3){
		isgameOver = true;			
		if(!delayToggle){
			SetDelay();
			delayToggle = true;
		}
	}
	//print(someScript.mod);
}

// currentTime check 함수
function ProgressTime()
{
	currentTime = Time.time - startTime;	
}

// Time Mode 시간 초기화 함수
function SetTime()
{
	startTime = Time.time;
}


function SetDelay()
{
	if(isgameOver || isgameWinning)
		delay = Time.time;
		isState = true;
}

function OnGUI()
{
	if(isState)
	{
		

		/* GUI
		var timestring : String;
		timestring = currentTime.ToString();
		GUILayout.TextField(timestring,15);	
		*/
		car.SetActiveRecursively(true);
		if(isgameWinning)
		{
			GUI.TextField(Rect(Screen.width/2,Screen.height/2, 100,100),"You are Winner~~~");
		}
		if(isgameOver)
		{
			GUI.TextField(Rect(Screen.width/2,Screen.height/2, 100,100),"You are Loooooooooooser~~");	
		}
		
		if( (isgameWinning || isgameOver)&& Time.time - delay > 3.0f)
		{
			Application.LoadLevel("carselect");
		}
	}
}