#pragma strict
function Start () {
if(SystemInfo.supportsGyroscope){
	Screen.orientation = ScreenOrientation.Portrait;
	Input.gyro.enabled = true;
	}
}


function Update () {
	if(Input.gyro.enabled){
	
		gameObject.transform.rotation = ConvertRotation(Input.gyro.attitude) * GetRotFix();
		var a : String = Input.gyro.attitude.ToString();
		gameObject.GetComponentInChildren(TextMesh).text = a;
	}
}

private static function ConvertRotation(q : Quaternion) : Quaternion
{
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