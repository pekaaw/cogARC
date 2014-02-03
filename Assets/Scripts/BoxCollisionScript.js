#pragma strict

var MyWorldCenterC : GyroRotor;

function Start () {

}

function Update () {

}

function OnTriggerEnter (other : Collider) {
//var MyWorldCenterGO : UnityEngine.GameObject = gameObject.FindGameObjectWithTag("MyWorldCenter");
//MyWorldCenterC = MyWorldCenterC.GetComponent(GyroRotor);
		if(other.tag == "Player") renderer.material.color = Color.blue;
		MyWorldCenterC.passCollitionData(this.gameObject.transform.position,other.gameObject.transform.position);
	}
function OnTriggerStay (other : Collider) {
//var MyWorldCenterGO : UnityEngine.GameObject = gameObject.FindGameObjectWithTag("MyWorldCenter");
//MyWorldCenterC = MyWorldCenterC.GetComponent(GyroRotor);
		if(other.tag == "Player") renderer.material.color = Color.green;
		MyWorldCenterC.passCollitionData(this.gameObject.transform.position,other.gameObject.transform.position);
	}
function OnTriggerExit (other : Collider) {
//var MyWorldCenterGO : UnityEngine.GameObject = gameObject.FindGameObjectWithTag("MyWorldCenter");
//MyWorldCenterC = MyWorldCenterC.GetComponent(GyroRotor);
		if(other.tag == "Player") renderer.material.color = Color.red;
	}