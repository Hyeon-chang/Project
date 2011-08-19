var isWindowOpen : boolean = false;
var mainSkin     : GUISkin;
var buttonH : int = 100;
var buttonG : int = 700;

function Update () {
	if(Input.GetKeyDown(KeyCode.Escape )){
	  	if(isWindowOpen) isWindowOpen = false;
	 	 else isWindowOpen = true;
	 }
}

function OnGUI () {
	// Make a background box
	if(isWindowOpen){
		GUI.Box (Rect (buttonG,buttonH,300,250), "Load Menu" ,mainSkin.box );
	
		// Make the first button. If it is pressed, Application.Loadlevel (1) will be executed
		if (GUI.Button (Rect (buttonG+40,buttonH+50,220,40), "Main menu",mainSkin.customStyles[0])) {
			Application.LoadLevel (0);
		}
	
		// Make the second button.
		if (GUI.Button (Rect (buttonG+40,buttonH+100,220,40), "ReStart",mainSkin.customStyles[1])) {
			Application.LoadLevel (3);
		}
		if (GUI.Button (Rect (buttonG+40,buttonH+150,220,40), "CarSelect",mainSkin.customStyles[2])) {
			Application.LoadLevel (1);
		}
		if (GUI.Button (Rect (buttonG+40,buttonH+200,220,40), "MapSelect",mainSkin.customStyles[3])) {
			Application.LoadLevel (2);
		}
	}
}

