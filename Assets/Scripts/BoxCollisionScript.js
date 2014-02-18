#pragma strict
enum Sides {LEFT, BACK, RIGHT, FRONT, TOP , BOTTOM}; // copy of same in worldstate

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
var verticalSide : int; // 0 : horizontal ; 1 : top ; 2 : bottom
	if(other.tag == "Player") {
		renderer.material.color = Color.green;
		//::::::::: RULES : ROW , Pair , Human Readable , Grid , Calculus :::::::::::
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
			// ::::::::::: IF HUMAN READABLE RULE RETURN 'FALSE' HERE
				if(diffZ > 0) {
					side = Sides.FRONT;
				} else {
					side = Sides.BACK;
				}
			}
			myWorldState.SetDataChainNonOverwrite(MyIdNumber,other.gameObject.GetComponent(BoxCollisionScript).MyIdNumber, side);
		}
		//::::::::: RULES : Tower :::::::::::

		else {
			//make a tower; uses verticalSide;
			myWorldState.SetDataChainNonOverwrite(MyIdNumber,other.gameObject.GetComponent(BoxCollisionScript).MyIdNumber, verticalSide);

		}
	}
}
function OnTriggerExit (other : Collider) {
	if(other.tag == "Player"){
		renderer.material.color = Color.red;
	}
}
	
