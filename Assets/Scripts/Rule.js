#pragma strict
private var functionPointer : Function;
//Enum defined in LevelCreator.js
//private enum ruleFunction {Tower, Row, Grid, HumanReadable, Calculus};
var levelCreator : LevelCreator;


static var historyGameState1 : int[];
static var historyGameState2 : int[];
static var historyGameState3 : int[];

var FinishState : List.<int> = new List.<int>(); //what the solution looks like for games execpt 
													//"Woords" with needs multiple solutions at once.

function Start () {



	switch(levelCreator.Rule) {
	case ruleFunction.Pair: 
		functionPointer = PairTester;
		break;
	case ruleFunction.Tower:
		functionPointer = TowerTester;
		break;
	case ruleFunction.Grid:
		functionPointer = GridTester;
		break;
	case ruleFunction.HumanReadable: 
		functionPointer = HumanReadableTester;
		break;
	}
}

function Update () {

}


public function setFinishState(newState : List.<int>) {
	FinishState = newState;
}

//Task Completion Tests

public function Test (boxes : List.<int>){
//::::::::::this block of code is only to stabilize the input[start]::::::::::::
	historyGameState3 = historyGameState2;
	historyGameState2 = historyGameState1;
	historyGameState1 = boxes.ToArray();
	
	if(!historyGameState3 || historyGameState3.length != historyGameState1.Length || historyGameState3.length != historyGameState2.length) {
		return;
	}
	for(var c:int = 0 ; c < historyGameState1.length ; c ++) {
		if(historyGameState1[c] != historyGameState2[c] || historyGameState2[c] != historyGameState3[c]) {
			Debug.Log("UNexpected CHANGE in HISTORY");
			return;
		}
	}
	//::::::::::this block of code is only to stabilize the input[end]::::::::::::


	functionPointer(boxes);
	if(FinishState.Count < 1){
		//congrats, save score, load next level
	}
}

private function PairTester (boxes : List.<int>) {
	Debug.Log("Pair");
	
	
	var q : int = 0;
	while(q+1 < historyGameState1.length){ 
		
		for(var r : int = 0; r < FinishState.Count; r+=3){
			if((historyGameState1[q] == FinishState[r] && historyGameState1[q + 1] == FinishState[r + 1]) ||
				(historyGameState1[q + 1] == FinishState[r] && historyGameState1[q] == FinishState[r + 1])) {
					if(q + 2 > historyGameState1.length && historyGameState1[q+2] != -1) {
						Debug.Log("UNexpected Third Part OF a PaiR");
						return;
					}
					//pair found
					//light flares at the cubes with IDs FinishState[r] and FinishState[r+1]
					Debug.Log("SUCCESS GOAL MET!!!!!!!!!!!!");
					for(var t:int = 0; t < 3; t++){ //remove finishState[r, r+1, r+2]
						FinishState.RemoveAt(r);
					}
					r-=3;
				}
			}
			do{
				q++;
			} while(q < historyGameState1.Length && historyGameState1[q-1] != -1);
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
