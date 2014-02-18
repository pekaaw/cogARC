#pragma strict
enum Sides {LEFT, BACK, RIGHT, FRONT}; // copy of same in worldstate

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
		var diffX : int  = gameObject.transform.position.x - other.gameObject.transform.position.x;
		var diffZ : int  = gameObject.transform.position.y - other.gameObject.transform.position.y;
		

		if(Mathf.Abs(diffX) > Mathf.Abs(diffZ)) {
			if(diffX > 0) {
				side = Sides.RIGHT;
			} else {
				side = Sides.LEFT;
			}
		}
		else {
			if(diffZ > 0) {
				side = Sides.FRONT;
			} else {
				side = Sides.BACK;
			}
		}
		myWorldState.SetData(MyIdNumber,other.gameObject.GetComponent(BoxCollisionScript).MyIdNumber, side);

		}
		else {
			//make a tower;;
		}
	}
}
function OnTriggerExit (other : Collider) {
	if(other.tag == "Player"){
		renderer.material.color = Color.red;
	}
}
	
