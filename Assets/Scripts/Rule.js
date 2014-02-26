#pragma strict
private var functionPointer : Function;
private var functionPointerSubRule : Function;
//Enum defined in LevelCreator.js
//private enum ruleFunction {Tower, Row, Grid, HumanReadable, Calculus};

var levelCreator : LevelCreator;


private static var historyGameState1 : int[];
private static var historyGameState2 : int[]; //these are check against eachother to stabilize the inputdata
private static var historyGameState3 : int[]; //tests are only done when all 3 are the same

var FinishState : List.<int> = new List.<int>(); //what the solution looks like for games except 
													//"Woords" which needs multiple solutions at once.
													
var CubesData : Array;

function Start () {
	levelCreator = gameObject.GetComponent(LevelCreator);
	CubesData = new Array();
	var tempString : String = "BHARLG";
	var cubesObjects : Array =  GameObject.FindGameObjectsWithTag("Player");
	for(var cube : UnityEngine.GameObject in cubesObjects) {
		tempString = cube.GetComponent(BoxCollisionScript).MyDataPacket;
		tempString += cube.GetComponent(BoxCollisionScript).MyIdNumber + " ,"; 
		CubesData.Push(tempString);

	 }

	tempString = "dsdfs";
	switch(levelCreator.RuleEnum) {
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
	};
	
	switch(levelCreator.currentSubRule) {
	case subRule.DesiExponential: 
		functionPointerSubRule = DesiExponentialTester;
		break;
	case subRule.Addition:
		functionPointerSubRule = AdditionTester;
		break;
	case subRule.WholeLiner:
		functionPointerSubRule = WholeLinerTester;
		break;
	case subRule.AnyWord:
		functionPointerSubRule = AnyWordTester;
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
	functionPointerSubRule(boxes);
	Debug.Log("Tower");
	
	
	
}

private function GridTester (boxes : List.<int>) {
	Debug.Log("Grid");
	for (var c : int = 0 ; c < FinishState.Count ; c++){
		if (c == boxes.Count || boxes[c] != FinishState[c]) {
			return;
		}
	}
	Debug.Log("SUCCESS GOAL MET!!!!!!!!!!!!");
}

private function HumanReadableTester (boxes : List.<int>) {
	functionPointerSubRule(boxes);
	Debug.Log("Human Readable");
}


private function DesiExponentialTester(boxes : List.<int>){
	return;
}

private function AdditionTester(boxes : List.<int>){
	var c : int = 0;
	var answer : int = 0;
	var tempIntCaster : int = 0;
	while(c < boxes.Count){
		while(boxes[c]!=-1) {
		tempIntCaster = CubesData[boxes[c]];
			answer += tempIntCaster;
			c++;
		}
		if(answer == FinishState[0]) {
			Debug.Log("SUCCESS GOAL MET!!!!!!!!!!!!");
			
			return;
		}
		answer = 0;
		c++;
	}
}

private function WholeLinerTester(boxes : List.<int>){
	for (var c : int = 0 ; c < FinishState.Count ; c++){
		if (c == boxes.Count || boxes[c] != FinishState[c]) {
			return;
		}
	}
	Debug.Log("SUCCESS GOAL MET!!!!!!!!!!!!");
}

private function AnyWordTester(boxes : List.<int>){

}
