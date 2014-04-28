#pragma strict

public var TimeOut : float = 3.0f;
public var self : GameObject;

private var timer : float = 0.0f;

function Start () {
	timer = 0.0f;
}

function Update () {
	timer += Time.deltaTime;
	if(timer > TimeOut){
		timer = 0;
		self.SetActive(false);
	}
}
