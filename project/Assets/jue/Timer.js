/*
	카운트 다운 Script Make by : Sung Mun Jue
	설명 : Time Mode 시작시 3,2,1 출력후, 게임 모드를 시작하게 하는 Script
*/

var startingTime : float;		// 카운트 다운 time 시작 시간
var timechecking : float;		// 카운트 다운 시간

var timer : GameObject;
var ReadyObject : GameObject;	// Ready Object
var SetObject : GameObject;		// Set Object
var GoObject : GameObject;		// Time Mode 시작 Object
var timescript : Timecontroller;	// Time Mode Script 
	
function Start() {
	startingTime = 3.0;
}

function Update () {
	timechecking = startingTime - Time.time;
	CountDown();
}

function CountDown()
{
	// Ready Object 보여주기
	if (2.0<timechecking && timechecking < 3.0)
	{
		ReadyObject.renderer.enabled = true;
	}
	
	// Set Object 보여주기 && Ready Object Destroy
	if (1.0<timechecking && timechecking <= 2.0)
	{
		Destroy(ReadyObject);
		SetObject.renderer.enabled = true;	
	}
	
	// Time Mode Script 시작 시간 초기화
	if (0.9<= timechecking && timechecking <= 1.1)
	{
		timescript.SetTime();
	}
	
	// TimeMode Object 보여주기 && 현재 오브젝트 Destroy
	if (timechecking <= 1.0)
	{
		Destroy(SetObject);
		timescript.isState = true;
		Destroy(this);
	}
}