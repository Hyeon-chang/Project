var checkPointNumber : int;
var nextCheckPoint : GameObject;

function Update () {

}

function OnTriggerExit(other : Collider)
{
	var script : Car;
	script = other.transform.parent.GetComponent("Car");
	if(script != null && other.name != "Collider_Top")// && other.transform.parent.name == "mycar" )
	{
		script.RacingState(this.checkPointNumber);
		nextCheckPoint.renderer.enabled = true;
		this.renderer.enabled = false;	
	}
}


