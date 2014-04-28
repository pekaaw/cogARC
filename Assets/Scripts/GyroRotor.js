#pragma strict

// ------------These are the real world unit vectors
private var gyroUnitXVec3 : UnityEngine.Vector3 = new UnityEngine.Vector3(0,0,0);//down
private var gyroUnitYVec3 : UnityEngine.Vector3 = new UnityEngine.Vector3(0,0,0);//in
private var gyroUnitZVec3 : UnityEngine.Vector3 = new UnityEngine.Vector3(0,0,0);//right
final var verticalRange : int = 40; // how many degrees deviant from strait up is counted as top-bottom collision

// ------------These are the gameobjects used to find the real world unit vectors
private var sideVec3 : UnityEngine.GameObject; //x
private var topVec3 : UnityEngine.GameObject; //y
private var backVec3 : UnityEngine.GameObject;//z
private var centerVec3 : UnityEngine.GameObject;// center 
//--------------------------------------------------

//-------------output text for debug on mobil-------
private var outputTextC : UnityEngine.TextMesh;
//--------------------------------------------------

function Start () {
	if(SystemInfo.supportsGyroscope){
		Input.gyro.enabled = true;
		sideVec3 = GameObject.FindGameObjectWithTag("MyWorldVectorX");
		topVec3 = GameObject.FindGameObjectWithTag("MyWorldVectorY");
		backVec3 = GameObject.FindGameObjectWithTag("MyWorldVectorZ");
		centerVec3 = GameObject.FindGameObjectWithTag("MyWorldVectorCenter");
	}
}

function Update () {
	if(Input.gyro.enabled){  
		//Set gyro orientation.
		var newRot : UnityEngine.Quaternion = ConvertRotation(Input.gyro.attitude) * GetRotFix();
		newRot = Quaternion.Inverse(newRot);
		
		gameObject.transform.rotation = newRot;
		
		//Calculate real-world-orientation.
		gyroUnitYVec3 = centerVec3.transform.position - topVec3.transform.position;
		gyroUnitZVec3 = centerVec3.transform.position - backVec3.transform.position;
		gyroUnitXVec3 = centerVec3.transform.position - sideVec3.transform.position;
	} else {
		//THere is no gyro on the device.
		gameObject.transform.rotation = Quaternion.identity;
		gyroUnitYVec3 = Vector3(0,1,0);
		gyroUnitZVec3 = Vector3(0,0,1);
		gyroUnitXVec3 = Vector3(1,0,0);
	}
}

function collisionIsVertical (ownPos : UnityEngine.Vector3, otherPos : UnityEngine.Vector3) : int {
	var differenceVector : UnityEngine.Vector3 = otherPos - ownPos;
	var XAngle : float = Vector3.Angle(gyroUnitXVec3,differenceVector);
	var YAngle : float = Vector3.Angle(gyroUnitYVec3,differenceVector);
	var ZAngle : float = Vector3.Angle(gyroUnitZVec3,differenceVector);
	if(YAngle < verticalRange) 
	{
		return Sides.TOP;
	} 
	else if(YAngle < (180 - verticalRange)){
		return 0;
	} else {
		return Sides.BOTTOM;
	}
}

private static function ConvertRotation(q : Quaternion) : Quaternion
{
	//In case of change, original was +x+y-z-w	.
    return new Quaternion(q.x, q.y, -q.z, -q.w);
}

private function GetRotFix() : Quaternion
{
	return Quaternion.identity;
	// Implement if-statements if you want to rotate the camera
	// 	abnormally at certain screen.orientations.
	//The screen orientation is set in the unity player options.
}
