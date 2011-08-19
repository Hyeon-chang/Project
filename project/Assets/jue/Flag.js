var nextFlag : GameObject;
var makeFlag : int;
var flagNumber : int;
var totalFlag : int;
var nextFlagName : String;

function Start()
{
	MakeFlag();	
}

function MakeFlag()
{
	while(totalFlag != flagNumber)
	{	
		makeFlag = Random.value*30;
		nextFlagName = makeFlag + "" ;
		print(nextFlagName);
		nextFlag = GameObject.Find(nextFlagName);
		nextFlag.SetActiveRecursively(false);
		
		flagNumber++;
	}

}
function Update ()
{
	
}

/*
function OnTriggerExit(other : Collider)
{
	var script : Car;
	script = other.transform.parent.GetComponent("Car");
	if(script != null && other.name != "Collider_Top" && other.transform.name == "mycar")
	{
		script.RacingState(this.checkPointNumber);
		nextFlag.renderer.enabled = true;
		this.renderer.enabled = false;	
	}
}
*/
