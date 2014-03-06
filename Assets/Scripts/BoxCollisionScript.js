#pragma strict
enum Sides {LEFT, BACK, RIGHT, FRONT, TOP , BOTTOM}; // copy of same in worldstate
// Other scripts used by this:
var MyWorldCenterC : GyroRotor;
var myWorldState : WorldState;
var getRulesFromCreation : LevelCreator;

private var RuleEnum : ruleFunction; // the current rule effects how the gamestate is set up
var MyIdNumber : int; //this boxs unik ID number
public var MyDataPacket : String; //this boxs data

function Awake() {


}

function Start () {
	var tempObjectForFindingScripts : UnityEngine.GameObject;
	tempObjectForFindingScripts =  GameObject.Find("Scripts");
	myWorldState = tempObjectForFindingScripts.GetComponent(WorldState);
	getRulesFromCreation = tempObjectForFindingScripts.GetComponent(LevelCreator);
	
	tempObjectForFindingScripts =  GameObject.Find ("RealworldaxisVisualizer");
	if(tempObjectForFindingScripts){
		MyWorldCenterC = tempObjectForFindingScripts.GetComponent(GyroRotor);
	} else {
		Application.Quit();
	}
	RuleEnum = getRulesFromCreation.RuleEnum;
	
	
}

function Update () {

}

function OnTriggerEnter (other : Collider) {
	if(other.tag == "Player") {
	//	renderer.material.color = Color.blue;
	
	//var side : int = MyWorldCenterC.passCollitionData(this.gameObject.transform.position,other.gameObject.transform.position);
	//myWorldState.SetData(MyIdNumber,other.gameObject.GetComponent(BoxCollisionScript).MyIdNumber, side);
	}
}

function OnTriggerStay (other : Collider) {
var verticalSide : int; // 0 : horizontal ; 1 : top ; 2 : bottom
	if(other.tag == "Player") {
		//renderer.material.color = Color.green;
		
		verticalSide = MyWorldCenterC.collisionIsVertical( // if the collision is not vertical 
				this.gameObject.transform.position,
				other.gameObject.transform.position);
		
		
		//::::::::: RULES : ROW , Pair , Human Readable , Grid , Calculus :::::::::::
		if (!(verticalSide)) { // if the collision is not vertical 
			if(RuleEnum != ruleFunction.Tower){	// if tower-rules are not in effect
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
				if(RuleEnum == ruleFunction.HumanReadable) {
					return; // wrong direction readable
				}
					if(diffZ > 0) {
						side = Sides.FRONT;
					} else {
						side = Sides.BACK;
					}
				}
				if(RuleEnum != ruleFunction.Grid) {
					myWorldState.SetDataChainNonOverwrite(MyIdNumber,other.gameObject.GetComponent(BoxCollisionScript).MyIdNumber, side);
				} else {
					myWorldState.SetDataWorldState(MyIdNumber,other.gameObject.GetComponent(BoxCollisionScript).MyIdNumber, side);
				}
			}
		}
		//::::::::: RULES : Tower :::::::::::

		else {
			//make a tower; uses verticalSide;
			if (RuleEnum == ruleFunction.Tower) {
				myWorldState.SetDataChainNonOverwrite(MyIdNumber,other.gameObject.GetComponent(BoxCollisionScript).MyIdNumber, verticalSide);
			}
		}
	}
}
function OnTriggerExit (other : Collider) {
	if(other.tag == "Player"){
	//	renderer.material.color = Color.red;
	}
}
	
