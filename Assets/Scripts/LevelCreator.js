#pragma strict

public var RuleEnum : ruleFunction;

private var functionPointerCreator : Function;
public enum ruleFunction {Tower, Grid, HumanReadable, Pair};
public enum subRule {Addition,DesiExponential,WholeLiner,AnyWord};


var ruleScript : Rule;
var unsortedCubes : Array; //cubes with tag "Player" found on stage used to set material/text.
var sortedCubes : Array = new Array();
//var unsortedCubesIDs : Array = new Array(); //the cubes Ids to be added to the FinishState.
var numberOfCubes : int = 10;
var FinishState : List.<int> = new List.<int>(); //what the solution looks like for games execpt 
													//"Woords" with needs multiple solutions at once.
													



function Start () {
	ruleScript = gameObject.GetComponent(Rule);
	var nextItem : GameObject; //for making random order
	var nextIndex : int;

	switch(RuleEnum) {
	case ruleFunction.Pair:
		functionPointerCreator = PairCreator;
		break;
	case ruleFunction.Tower:
		functionPointerCreator = TowerCreator;
			Debug.Log("Pair");

		break;
	case ruleFunction.Grid:
		functionPointerCreator = GridCreator;
		break;
	case ruleFunction.HumanReadable: 
		functionPointerCreator = HumanReadableCreator;
		break;
	}
	
	
	
	
	unsortedCubes =  GameObject.FindGameObjectsWithTag("Player");
	
	for(var c: int = 0; c < 10; c++) {
		nextIndex = Random.Range(0,unsortedCubes.Count); //I am writing the magic number 10 here for number of cubes because unity won't let me use a variable for it, yeah so f...you unity
		nextItem = unsortedCubes[nextIndex];
		sortedCubes.Add(nextItem);
		unsortedCubes.RemoveAt(nextIndex);

	}
	
	functionPointerCreator();
	
	
}

function Update () {

}

public function Creator (){
	functionPointerCreator();
	ruleScript.setFinishState(FinishState);
}

private function PairCreator () {
	Debug.Log("Pair Creator");
	
	for(var c: int = 0; c < sortedCubes.Count; c+=2) {
	var nextItem1 : GameObject;
	var nextItem2 : GameObject; 
	nextItem1 = sortedCubes[c];
	nextItem2 = sortedCubes[c+1];
		FinishState.Add(nextItem1.GetComponent(BoxCollisionScript).MyIdNumber);
		FinishState.Add(nextItem2.GetComponent(BoxCollisionScript).MyIdNumber);
		FinishState.Add(-1);//separator to next pair
		
		// set skin A[c] to cube sortedCubes[c] 
		// set skin B[c+1] to cube sortedCubes[c+1]
		
	}
	var debugstate : String = "";
	for(var q:int = 0 ; q < FinishState.Count; q++) {
		debugstate += FinishState[q] + ", ";
	}
	Debug.Log("GOAL THIS ROUND IS\n" + debugstate);
}

private function TowerCreator () {
	Debug.Log("Tower");
}

private function GridCreator () {
	Debug.Log("Grid");
}

private function HumanReadableCreator () {
	Debug.Log("Human Readable");
}


