#pragma strict

public var Rule : ruleFunction;

private var functionPointerTester : Function;
private var functionPointerCreator : Function;
private enum ruleFunction {Tower, Grid, HumanReadable, Pair};

var unsortedCubes : Array; //cubes with tag "Player" found on stage used to set material/text.
var sortedCubes : Array = new Array();
//var unsortedCubesIDs : Array = new Array(); //the cubes Ids to be added to the FinishState.
var numberOfCubes : int = 10;
var FinishState : List.<int> = new List.<int>(); //what the solution looks like for games execpt 
													//"Woords" with needs multiple solutions at once.
													
static var historyGameState1 : int[];
static var historyGameState2 : int[];
static var historyGameState3 : int[];


function Start () {
	var nextItem : GameObject; //for making random order
	var nextIndex : int;

	switch(Rule) {
	case ruleFunction.Pair:
		functionPointerTester = PairTester;
		functionPointerCreator = PairCreator;
		break;
	case ruleFunction.Tower:
		functionPointerTester = TowerTester;
		functionPointerCreator = TowerCreator;
		break;
	case ruleFunction.Grid:
		functionPointerTester = GridTester;
		functionPointerCreator = GridCreator;
		break;
	case ruleFunction.HumanReadable: 
		functionPointerTester = HumanReadableTester;
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



//Task Completion Tests

public function Test (boxes : List.<int>){
	functionPointerTester(boxes);
}

private function PairTester (boxes : List.<int>) {
	Debug.Log("Pair");
	historyGameState3 = historyGameState2;
	historyGameState2 = historyGameState1;
	historyGameState1 = boxes.ToArray();
	for(var c:int = 0 ; c < historyGameState1.length ; c ++) {
		if(historyGameState1[c] != historyGameState2[c] || historyGameState2[c] != historyGameState3[c]) {
			Debug.Log("UNexpected CHANGE in HISTORY");
			return;
		}
	}
	
	for(var q : int = 0; q < historyGameState1.length; q+=2){
		if(q + 2 > historyGameState1.length && historyGameState1[q+2] != -1) {
			Debug.Log("UNexpected Third Part OF a PaiR");
			return;
		}
		for(var r : int = 0; r < FinishState.Count; r+=2)
		if((historyGameState1[q] == FinishState[r] && historyGameState1[q + 1] == FinishState[r + 1]) ||
			(historyGameState1[q + 1] == FinishState[r] && historyGameState1[q] == FinishState[r + 1])) {
				//pair found
				//light flares at the cubes with IDs FinishState[r] and FinishState[r+1]
				Debug.Log("SUCCESS GOAL MET!!!!!!!!!!!!");
				for(var t:int = 0; t < 3; t++){ //remove finishState[r, r+1, r+2]
					FinishState.RemoveAt(q);
					r--;
				}
			}
	}
}

private function TowerTester (boxes : List.<int>) {
	Debug.Log("Tower");
}

private function GridTester (boxes : List.<int>) {
	Debug.Log("Grid");
}

private function HumanReadableTester (boxes : List.<int>) {
	Debug.Log("Human Readable");
}
