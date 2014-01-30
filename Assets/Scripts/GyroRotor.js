#pragma strict

// next idea:
/*
try seeing the rotor in its natural position in the world, not based on the Camera.
maybe it makes more sense how it rotates

*/
var gyroUnitXVec3 : UnityEngine.Vector3 = new UnityEngine.Vector3(0,0,0);//down
var gyroUnitYVec3 : UnityEngine.Vector3 = new UnityEngine.Vector3(0,0,0);//in
var gyroUnitZVec3 : UnityEngine.Vector3 = new UnityEngine.Vector3(0,0,0);//right


function Start () {
if(SystemInfo.supportsGyroscope){
	//Screen.orientation = ScreenOrientation.PortraitUpsideDown;
	Input.gyro.enabled = true;
	//Input.compass.enabled = true;
	}
}


function Update () {
	if(Input.gyro.enabled){
		var newRot : UnityEngine.Quaternion = ConvertRotation(Input.gyro.attitude) * GetRotFix();
		/*gameObject.transform.rotation.x = -newRot.x;
		gameObject.transform.rotation.y = -newRot.y;
		gameObject.transform.rotation.z = -newRot.z;
		gameObject.transform.rotation.w = newRot.w;
		*/
	
		newRot = Quaternion.Inverse(newRot);
		
		gameObject.transform.rotation = newRot;
		/*
		//var a : String = Input.gyro.attitude.ToString();
		var worldCenterObject : UnityEngine.GameObject = gameObject.FindGameObjectWithTag("MyWorldCenter"); 
		var degreesUp : float = worldCenterObject.transform.rotation.eulerAngles.y;
		var a : String = degreesUp - 90;
		//var a : String = worldCenterObject.transform.rotation.eulerAngles.ToString();
		gameObject.GetComponentInChildren(TextMesh).text = a;
		//if(Input.compass.enabled){
		//	gameObject.transform.rotation = gameObject.transform.rotation * UnityEngine.Quaternion.Euler(Input.compass.rawVector.x,Input.compass.rawVector.y,Input.compass.rawVector.z);
		
	//	}*/
	
		var topVec3 : UnityEngine.Vector3 = gameObject.FindGameObjectWithTag("MyWorldVectorY").transform.position;
		var centerVec3 : UnityEngine.Vector3 = gameObject.FindGameObjectWithTag("MyWorldVectorCenter").transform.position;
		gyroUnitYVec3 = centerVec3 - topVec3;
		
		var backVec3 : UnityEngine.Vector3 = gameObject.FindGameObjectWithTag("MyWorldVectorZ").transform.position;
		gyroUnitZVec3 = centerVec3 - backVec3;
		
		var sideVec3 : UnityEngine.Vector3 = gameObject.FindGameObjectWithTag("MyWorldVectorX").transform.position;
		gyroUnitYVec3 = centerVec3 - sideVec3;
		
		var a : String = gyroUnitYVec3.ToString();
		gameObject.GetComponentInChildren(TextMesh).text = a;
	}
}


function passCollitionData (ownPos : UnityEngine.Vector3,otherPos : UnityEngine.Vector3){
	var differenceVector : UnityEngine.Vector3 = otherPos - ownPos;
	var XAngle : float = Vector3.Angle(gyroUnitXVec3,differenceVector);
	var YAngle : float = Vector3.Angle(gyroUnitYVec3,differenceVector);
	var ZAngle : float = Vector3.Angle(gyroUnitZVec3,differenceVector);
	
	if(YAngle < 60) 
	{
		//top or bottom collition?
	} 
	else if(YAngle < 120){
		//side collition
		
		if(XAngle < 60)
		{
			//right or left side collition?
		}
		else if (XAngle < 120)
			if(ZAngle < 90) {
				//front or back collition?
			} 
			else
			{
				//front or back collition? 
			}
		else
		{
			//right or left side collition?
		}
	} else {
		//top or bottom collition?
	}
	
 } 


//private static function InvertQuaternion(q : Quaternion) : Quaternion 
//{
//return new Quaternion(q);
//}

private static function ConvertRotation(q : Quaternion) : Quaternion
{
// original was +x+y-z-w
    return new Quaternion(q.x, q.y, -q.z, -q.w);
}

private function GetRotFix() : Quaternion
{
    if (Screen.orientation == ScreenOrientation.Portrait)
        return Quaternion.identity;
    if (Screen.orientation == ScreenOrientation.LandscapeLeft
    || Screen.orientation == ScreenOrientation.Landscape)
        return Quaternion.Euler(0, 0, -90);
    if (Screen.orientation == ScreenOrientation.LandscapeRight)
        return Quaternion.Euler(0, 0, 90);
    if (Screen.orientation == ScreenOrientation.PortraitUpsideDown)
        return Quaternion.Euler(0, 0, 180);
    return Quaternion.identity;
}