static var start : Point;

var next : Point;
var isStart = false;

function CalculateTargetPosition (position : Vector3) {

	if (Vector3.Distance (transform.position, position) < 3) {
	
		return next.transform.position;
	}
	else {
	
		return transform.position;
	}
}

function Awake () {

	if (!next)
		Debug.Log ("This waypoint is not connected.", this);
		
	if (isStart)
		start = this;
}

function OnDrawGizmos () {

	//Gizmos.color = Color (0, 1, 0, 0.5);
	//Gizmos.DrawCube (transform.position, collider.size*10);
}

function OnDrawGizmosSelected () {

	if (next) {
	
		Gizmos.color = Color.green;
		Gizmos.DrawLine (transform.position, next.transform.position);
	}
}