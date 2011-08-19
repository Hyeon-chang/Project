var car : GameObject;

var selfNiddle : GameObject;
var positionY : float = -200.0f;


function Update () {
	transform.position = car.transform.position;
	transform.position.y = positionY;
	var carRotation = car.transform.rotation;
	var rotationY = carRotation.eulerAngles.y;
	var cameraRotation = Quaternion.identity;
	cameraRotation.eulerAngles = Vector3( 70,rotationY,0);
	transform.rotation = cameraRotation;
	
	cameraRotation.eulerAngles = Vector3( 0,rotationY,0);
	selfNiddle.transform.rotation = cameraRotation;
	selfNiddle.transform.position = car.transform.position;
	selfNiddle.transform.position.y = -275.0;
}

function SetTarget(target : GameObject){
	car = target;
}