﻿#pragma strict

public var longlivety : float = 5.0;
private var parentScript : BoxCollisionScript;
function Start () {
	parentScript = transform.parent.gameObject.GetComponent(BoxCollisionScript);
}

function Update () {
	longlivety -= Time.deltaTime;
	
	if(longlivety > 0){
		//show thing
	}
	else{
		parentScript.HasActiveCorrectMarker = false;
		parentScript.HasActiveWrongMarker = false;
		Destroy(gameObject);
	}
}