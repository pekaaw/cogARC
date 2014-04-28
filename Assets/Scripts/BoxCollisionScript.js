#pragma strict
public var HalfCubeScale:float = 0.6f;
public var HasActiveCorrectMarker : boolean = false;
public var HasActiveWrongMarker : boolean = false;
public var MyDataPacket : String; //This box's data.
public var MyIdNumber : int; //This boxs unik ID number.

enum Sides {LEFT, BACK, RIGHT, FRONT, TOP , BOTTOM}; // copy of same in worldstate
// Other scripts used by this:
private var MyWorldCenterC : GyroRotor;
private var myWorldState : WorldState;
private var getRulesFromCreation : LevelCreator;
private var RuleEnum : ruleFunction; //The current rule effects how the gamestate is set up.
private var markerWithTransform : GameObject;

function Start () {
	var tempObjectForFindingScripts : UnityEngine.GameObject;
	
	var transformDistributer : TransformDistributor;
	var frameMarkerContainerTemp : GameObject;
	frameMarkerContainerTemp = GameObject.Find("FrameMarkerContainer");
	transformDistributer = frameMarkerContainerTemp.GetComponent(TransformDistributor);
	if(!transformDistributer){
		frameMarkerContainerTemp.AddComponent(TransformDistributor);
		transformDistributer = frameMarkerContainerTemp.GetComponent(TransformDistributor);
	}
	
	//markerWithTransform = transformDistributer.GetMarker(0);
	markerWithTransform = transformDistributer.GetMarker(MyIdNumber);
	
	if(markerWithTransform){
		gameObject.transform.parent = markerWithTransform.transform;
		gameObject.transform.localPosition = Vector3(0,-HalfCubeScale,0);
		gameObject.transform.localRotation = Quaternion.identity;
		gameObject.transform.localScale = Vector3(HalfCubeScale * 2,HalfCubeScale * 2, HalfCubeScale * 2);
	} else {
		Debug.LogError("Something is wrong with a framemarker, or a framemarker is missing from ");
	}
	
	tempObjectForFindingScripts =  GameObject.Find("Scripts");
	myWorldState = tempObjectForFindingScripts.GetComponent(WorldState);
	getRulesFromCreation = tempObjectForFindingScripts.GetComponent(LevelCreator);
	
	tempObjectForFindingScripts =  GameObject.Find ("RealworldaxisVisualizer");
	if(tempObjectForFindingScripts){
		MyWorldCenterC = tempObjectForFindingScripts.GetComponent(GyroRotor);
	} else {
		Application.Quit();
	}
	RuleEnum = getRulesFromCreation.Data.RuleEnum;
}

function IWasWrongForOnce(){
	if(MyDataPacket != "" && !HasActiveWrongMarker)
	{
		if(HasActiveCorrectMarker){
			GameObject.Destroy(transform.GetChild(0).gameObject);
			HasActiveCorrectMarker = false;
		}
		var obj = new GameObject("NonEmpty " + MyIdNumber);
		obj = Instantiate(Resources.Load("Prefab/WrongMark"));
		obj.transform.parent = transform;
		obj.transform.position = transform.position;
		HasActiveWrongMarker = true;
	}
}

function IWasRightAllAlong(){
	if(MyDataPacket != "" && !HasActiveCorrectMarker)
	{
		if(HasActiveWrongMarker){
			GameObject.Destroy(transform.GetChild(0).gameObject);
			HasActiveWrongMarker = false;
		}
		var obj = new GameObject("NonEmpty " + MyIdNumber);
		obj = Instantiate(Resources.Load("Prefab/RightMark"));
		obj.transform.parent = transform;
		obj.transform.position = transform.position;
		HasActiveCorrectMarker = true;
	}
}

function OnTriggerStay (other : Collider) {
var verticalSide : int; // 0 : horizontal ; 1 : top ; 2 : bottom
	if(other.tag == "Player" && MyDataPacket != "" && other.GetComponent(BoxCollisionScript).MyDataPacket != "") {
		verticalSide = MyWorldCenterC.collisionIsVertical( //If the collision is not vertical .
				this.gameObject.transform.position,
				other.gameObject.transform.position);

		//RULES : ROW , Pair , Human Readable , Grid , Calculus
		if (!(verticalSide)) { //-if the collision is not vertical .
			if(RuleEnum != ruleFunction.Tower){	//If tower-rules are not in effect.
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
				//IF HUMAN READABLE RULE RETURN 'FALSE' HERE
				if(RuleEnum == ruleFunction.HumanReadable) {
					return; //Wrong direction readable.
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
		// RULES == Tower.
		else {
			//Make a tower; uses verticalSide.
			if (RuleEnum == ruleFunction.Tower) {
				myWorldState.SetDataChainNonOverwrite(MyIdNumber,other.gameObject.GetComponent(BoxCollisionScript).MyIdNumber, verticalSide);
			}
		}
	}
}
