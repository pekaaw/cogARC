#pragma strict

// ------------These are the real world unit vectors
var gyroUnitXVec3 : UnityEngine.Vector3 = new UnityEngine.Vector3(0,0,0);//down
var gyroUnitYVec3 : UnityEngine.Vector3 = new UnityEngine.Vector3(0,0,0);//in
var gyroUnitZVec3 : UnityEngine.Vector3 = new UnityEngine.Vector3(0,0,0);//right
//--------------------------------------------------

// ------------These are the gameobjects used to find the real world unit vectors
var sideVec3 : UnityEngine.GameObject; //x
var topVec3 : UnityEngine.GameObject; //y
var backVec3 : UnityEngine.GameObject;//z
var centerVec3 : UnityEngine.GameObject;// center 
//--------------------------------------------------

//-------------output text for debug on mobil-------
var outputTextC : UnityEngine.TextMesh;
//--------------------------------------------------

function Start () {
if(SystemInfo.supportsGyroscope){
	Input.gyro.enabled = true;
	}
}

function Update () {
	if(Input.gyro.enabled){  
	//set gyro orientation
		var newRot : UnityEngine.Quaternion = ConvertRotation(Input.gyro.attitude) * GetRotFix();

		newRot = Quaternion.Inverse(newRot);
		
		gameObject.transform.rotation = newRot;
		
		//calculate real-world-orientation
	} else {
		//this is no gyro on the device
		gameObject.transform.rotation = Quaternion.identity;
	
	}
		gyroUnitYVec3 = centerVec3.transform.position - topVec3.transform.position;
		
		gyroUnitZVec3 = centerVec3.transform.position - backVec3.transform.position;
		
		gyroUnitXVec3 = centerVec3.transform.position - sideVec3.transform.position;
	
}

function collisionIsVertical (ownPos : UnityEngine.Vector3,otherPos : UnityEngine.Vector3) : int {
	var differenceVector : UnityEngine.Vector3 = otherPos - ownPos;
	var XAngle : float = Vector3.Angle(gyroUnitXVec3,differenceVector);
	var YAngle : float = Vector3.Angle(gyroUnitYVec3,differenceVector);
	var ZAngle : float = Vector3.Angle(gyroUnitZVec3,differenceVector);
	if(YAngle < 60) 
	{
		outputTextC.text = "TOP";
	
		return Sides.TOP;
	} 
	else if(YAngle < 120){
		return 0;
		/* ----don't remove this we might need it later----
		if(XAngle < 60)
		{
			outputTextC.text = "RIGHT";
			//return 2;
		
		}
		else if (XAngle < 120){
		//front or back
			if(ZAngle < 90) {
				outputTextC.text = "BACK";
			//	return 4;
			
			} 
			else
			{
				outputTextC.text = "FRONT";
			//	return 5;
			}
		} else
		{
			outputTextC.text = "LEFT";
			//return 3;
		}
		*/
	} else {
		outputTextC.text = "Bottom";
		return Sides.BOTTOM;
	}
}

private static function ConvertRotation(q : Quaternion) : Quaternion
{
// incase of change, original was +x+y-z-w	
    return new Quaternion(q.x, q.y, -q.z, -q.w);
}

private function GetRotFix() : Quaternion
{
	return Quaternion.identity;
	// implement if-statements is you want to rotate the camera 
	// abnormally at certain screen.orientations
	// the screen orientation is set in the unity player options 
}
