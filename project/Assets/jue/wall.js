/*
	트랙 복귀 Script Make by : Sung Mun Jue
	설명 : 'b' Key를 눌렀을 경우 트랙에 다시 복귀하는 Script
	       자동차와 트랙과 8방향을 check한 후에 가장 짧은 거리로 복귀
	       복귀시 자동차는 트랙의 진행방향으로, 자동차의 속도는 0으로
*/

var point : Vector3;
point = Vector3.zero;
var hit : RaycastHit[];	
hit = new RaycastHit[8];

function Start (){
	
}

function Update () 
{
	/*
	for(var i = 0; i<8; i++)
	{
		Debug.DrawLine(point, hit[i].point);
	}
	*/
	if(Input.GetKeyDown('b')){ 
			Distance(); 
	} 
}

function Example(){
	var r : Quaternion = Quaternion.AngleAxis(45,Vector3.up);
	print(r);
	var d : Vector3 = new Vector3(1,0,0);
	print(d);
	for(var i = 0; i<8; i++)
	{
		d = r*d;
		print(d);
	}
}

function Distance(){
	var car : GameObject;
	car = GameObject.Find("car");
	var carscript : Car;
	carscript = car.GetComponent("Car");
	var carPosition : Vector3;
	
	// 자동차의 현재위치 받아오기 (carPositino변수)
	if(carscript != null)
	{	
		carPosition = car.transform.position;
	}
	
	// carPosition를 위로 올리기 
	var up : Vector3;
	carPosition = carPosition + up.up*120;
	
	
	// 가장 가까운 트렉 위치 찾기
	// 자동차의 현재위치에서 트랙에 8방향의 직선의 거리를 check한후 가장 짧은 거리위치 받아오기
	var rotation : Quaternion = Quaternion.AngleAxis(45,Vector3.up);	// 백터를 45도 방향으로 돌려주는 변수
	var direction : Vector3 = new Vector3(1,0,0); // x 방향 벡터
	var shortestDistance : float = 1000.0f; 
	var shortestIndex : int = -1;
		
	//가장 짧은 distance의 Index 알아내기
	for(var i = 0; i < 8 ; i++){
		direction = rotation*direction; // 방향 벡터 계산
		Physics.Raycast(carPosition, direction, hit[i], 200);
		if(hit[i].distance > 1f){
			if(hit[i].collider != null && hit[i].distance < shortestDistance ){
				shortestIndex = i;
				shortestDistance = hit[i].distance;
			}	
		}		
	}
	
	if(shortestIndex != -1)
	{
		// 자동차의 회전방향을 트랙의 방향으로
		car.transform.rotation = hit[shortestIndex].transform.rotation;
					
		//자동차 복귀 좌표 구하기
		var roadHit : RaycastHit;	
		Physics.Raycast(hit[shortestIndex].point, Vector3.down , roadHit, 200);
		
		// 자동차 복귀 하기
		car.transform.position = roadHit.point + Vector3(0,0.3,0);
		car.rigidbody.velocity = Vector3.zero;
	}
	
	else{
		car.transform.position += Vector3(0,0.3,0);
		car.rigidbody.velocity = Vector3.zero;
	}
		
}