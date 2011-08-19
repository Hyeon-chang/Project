private var gameInfo : GameObject ;
private var script : selectedCarScript;

function Update () {
}

function Start(){
	gameInfo = GameObject.Find("gameInfo");
	script = gameInfo.GetComponent("selectedCarScript");
}

function OnGUI(){
	
	var selStrings : String[] = ["Raicing", "Flag Capture", "Tour"];

	
	script.mod = GUI.SelectionGrid (Rect (25, 25, 100, 30), script.mod, selStrings, 3);



}