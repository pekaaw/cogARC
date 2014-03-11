﻿#pragma strict
private var functionPointer : Function;
private var functionPointerSubRule : Function;
//Enum defined in LevelCreator.js
//private enum ruleFunction {Tower, Row, Grid, HumanReadable, Calculus};

var levelCreator : LevelCreator;
	var outputTextC : UnityEngine.TextMesh;
	var outputTextC2 : UnityEngine.TextMesh;
	var outputTextC3 : UnityEngine.TextMesh;




private static var historyGameState1 : int[];
private static var historyGameState2 : int[]; //these are check against eachother to stabilize the inputdata
private static var historyGameState3 : int[]; //tests are only done when all 3 are the same

var CubesData : Array;		//local copy of the data contained in the 

function Start () {

}

function Update () {
var currentState : String = ""; 
	for(var d : int  = 0 ; d < levelCreator.Data.FinishState.Count ; d++) {
		currentState += levelCreator.Data.FinishState[d] + " ";
	}

 outputTextC.text = currentState;

}


function OnGUI () {
	var x1 : int = 20;
	var y1 : int = 20;
	var width : int = Screen.width - 2 * x1;
	var height : int = Screen.height / 4; // this is the height of the goal-box- 
										//frame and also the width and 
										//height of the grid-goal-visualizer.
	var margine : int = 5; //increasing this will make the grid-goal-visualizer smaller.
	var textureA : Texture = Resources.Load("coloredtitle") as Texture; // images used for the grid-goal-visualizer
	var textureB : Texture = Resources.Load("uncoloredtitle") as Texture;
	

	
	GUI.Box (Rect (x1,y1,width,height), "Your Task");
	if(levelCreator.Data.RuleEnum == ruleFunction.Grid) {
		var scaleX : int = (height-margine) / 3 - margine;
		var scaleY : int = scaleX;
		var i : int = 0;
		for(var c:int = 0; c < 3 ; c++) {
			var figy : int = y1 + (scaleY + margine) * c + margine;
			for(var q :int = 0; q < 3 ; q++) {
				var figx : int = x1 + (scaleX + margine) * q + margine;
				if(levelCreator.Data.FinishState[i] == 1) {
					GUI.DrawTexture(Rect(figx,figy,scaleX,scaleY), textureA, ScaleMode.ScaleToFit, true);
				} else {
					GUI.DrawTexture(Rect(figx,figy,scaleX,scaleY), textureB, ScaleMode.ScaleToFit, true);

				}
				i++;
			}
		
		}
		
		
	}
	  



}




public function MakeLocalCopyPacketData(cubesObjects : Array) {
	CubesData = new Array();
	var tempString : String = "BHARLG";
	
	for(var qbs : int = 0; qbs < levelCreator.Data.numberOfCubes; qbs ++) {
		CubesData.Push("BHARLG");
	}
	for(var cube : UnityEngine.GameObject in cubesObjects) {
		tempString = cube.GetComponent(BoxCollisionScript).MyDataPacket + "";
		CubesData[cube.GetComponent(BoxCollisionScript).MyIdNumber] = tempString;
	 }
}

public function ruleSetup(){
	levelCreator = gameObject.GetComponent(LevelCreator);

	switch(levelCreator.Data.RuleEnum) {
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
	
	switch(levelCreator.Data.CurrentSubRule) {
		case subRule.CompositeNumbers: 
			functionPointerSubRule = compositeNumbersTester;
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

//Task Completion Tests

public function Test (boxes : List.<int>){
//::::::::::this block of code is only to stabilize the input[start]::::::::::::

	

	historyGameState3 = historyGameState2;// order 1
	historyGameState2 = historyGameState1; // order 2
	historyGameState1 = boxes.ToArray(); //order 3
	
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
	var currentdebugstate : String = "";
	
	for ( var f:int = 0 ; f < historyGameState1.length;f++) {
		currentdebugstate += historyGameState1[f] + " ";
	}
	outputTextC2.text = currentdebugstate;
 
	functionPointer(boxes);
	if(levelCreator.Data.FinishState.Count < 1){
		levelCreator.LoadLevel();
		//congrats, save score, load next level
	}
}

private function PairTester (boxes : List.<int>) {
	Debug.Log("Pair");
	
	
	var q : int = 0;
	while(q+1 < historyGameState1.length){ 
		
		for(var r : int = 0; r < levelCreator.Data.FinishState.Count; r+=3){
			if((historyGameState1[q] == levelCreator.Data.FinishState[r] && historyGameState1[q + 1] == levelCreator.Data.FinishState[r + 1]) ||
				(historyGameState1[q + 1] == levelCreator.Data.FinishState[r] && historyGameState1[q] == levelCreator.Data.FinishState[r + 1])) {
					if(q + 2 > historyGameState1.length && historyGameState1[q+2] != -1) {
						Debug.Log("UNexpected Third Part OF a PaiR");
						return;
					}
					//pair found
					//light flares at the cubes with IDs levelCreator.Data.FinishState[r] and levelCreator.Data.FinishState[r+1]
					Debug.Log("SUCCESS GOAL MET!!!!!!!!!!!!");
					for(var t:int = 0; t < 3; t++){ //remove finishState[r, r+1, r+2]
						levelCreator.Data.FinishState.RemoveAt(r);
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
	var tempString : String; //because unity is being a Bitch.
	var tempInt : int;//because unity is being a Bitch.
	for (var c : int = 0 ; c < levelCreator.Data.FinishState.Count ; c++){
	tempString = CubesData[boxes[c]];//because unity is being a Bitch.
	tempInt = parseInt(tempString);//because unity is being a Bitch.
		if (c == boxes.Count || tempInt != levelCreator.Data.FinishState[c]) {
			return;
		}
	}
	levelCreator.Data.FinishState.Clear();
	Debug.Log("SUCCESS GOAL MET!!!!!!!!!!!!");
}

private function HumanReadableTester (boxes : List.<int>) {
	functionPointerSubRule(boxes);
	Debug.Log("Human Readable");
}


private function compositeNumbersTester(boxes : List.<int>){
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
		if(answer == levelCreator.Data.FinishState[0]) {
			Debug.Log("SUCCESS GOAL MET!!!!!!!!!!!!");
			
			return;
		}
		answer = 0;
		c++;
	}
}

private function WholeLinerTester(boxes : List.<int>){
	for (var c : int = 0 ; c < levelCreator.Data.FinishState.Count ; c++){
		if (c == boxes.Count || boxes[c] != levelCreator.Data.FinishState[c]) {
			return;
		}
	}
	Debug.Log("SUCCESS GOAL MET!!!!!!!!!!!!");
}

private function AnyWordTester(boxes : List.<int>){

}
