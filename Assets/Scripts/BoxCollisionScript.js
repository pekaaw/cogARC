#pragma strict

var MyWorldCenterC : GyroRotor;
var myWorldState : WorldState;
var MyIdNumber : int;
function Start () {

}

function Update () {

}

function OnTriggerEnter (other : Collider) {
	if(other.tag == "Player") {
		renderer.material.color = Color.blue;
	
	//var side : int = MyWorldCenterC.passCollitionData(this.gameObject.transform.position,other.gameObject.transform.position);
	//myWorldState.SetData(MyIdNumber,other.gameObject.GetComponent(BoxCollisionScript).MyIdNumber, side);
	}
}

function OnTriggerStay (other : Collider) {
	if(other.tag == "Player") {
		renderer.material.color = Color.green;
	
	//var side : int = MyWorldCenterC.passCollitionData(this.gameObject.transform.position,other.gameObject.transform.position);
	if (!MyWorldCenterC.collisionIsVertical(this.gameObject.transform.position,other.gameObject.transform.position)){
		var side : int;
		if(gameObject.transform.position.x < other.gameObject.transform.position.x) {
			side = 5;
		}
		else {
			side = 4;
		}
		myWorldState.SetData(MyIdNumber,other.gameObject.GetComponent(BoxCollisionScript).MyIdNumber, side);

		}
	}
}
function OnTriggerExit (other : Collider) {
	if(other.tag == "Player"){
		renderer.material.color = Color.red;
	}
}
	
