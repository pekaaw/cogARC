#pragma strict

var MyWorldCenterC : GyroRotor;
var myWorldState : WorldState;
var MyIdNumber : int;
function Start () {

}

function Update () {

}

function OnTriggerEnter (other : Collider) {
//var MyWorldCenterGO : UnityEngine.GameObject = gameObject.FindGameObjectWithTag("MyWorldCenter");
//MyWorldCenterC = MyWorldCenterC.GetComponent(GyroRotor);
		if(other.tag == "Player") renderer.material.color = Color.blue;
		var side : int = MyWorldCenterC.passCollitionData(this.gameObject.transform.position,other.gameObject.transform.position);
		myWorldState.SetData(MyIdNumber,other.gameObject.GetComponent(BoxCollisionScript).MyIdNumber, side);
	}
function OnTriggerStay (other : Collider) {
//var MyWorldCenterGO : UnityEngine.GameObject = gameObject.FindGameObjectWithTag("MyWorldCenter");
//MyWorldCenterC = MyWorldCenterC.GetComponent(GyroRotor);
		if(other.tag == "Player") renderer.material.color = Color.green;
		var side : int = MyWorldCenterC.passCollitionData(this.gameObject.transform.position,other.gameObject.transform.position);
		myWorldState.SetData(MyIdNumber,other.gameObject.GetComponent(BoxCollisionScript).MyIdNumber, side);

	}
function OnTriggerExit (other : Collider) {
//var MyWorldCenterGO : UnityEngine.GameObject = gameObject.FindGameObjectWithTag("MyWorldCenter");
//MyWorldCenterC = MyWorldCenterC.GetComponent(GyroRotor);
		if(other.tag == "Player") renderer.material.color = Color.red;
		myWorldState.RemoveConnection(MyIdNumber , other.gameObject.GetComponent(BoxCollisionScript).MyIdNumber);
	}