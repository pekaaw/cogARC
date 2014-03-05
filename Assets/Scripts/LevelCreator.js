#pragma strict
												var outputTextC4 : UnityEngine.TextMesh;

private var pauseScript : PauseScreenScript;
private var ruleScript : Rule;


public var RuleEnum : ruleFunction;
private var functionPointerCreator : Function;
private var functionPointerSubCreator : Function;

public enum ruleFunction { Grid, Pair, Tower, HumanReadable};
public enum subRule {Addition,compositeNumbers,WholeLiner,AnyWord};
var currentSubRule : subRule;

private var cubeDesignsArray : Array = new Array();

private var unsortedCubes : Array; //cubes with tag "Player" found on stage used to set material/text.
private var sortedCubes : Array = new Array();
//var unsortedCubesIDs : Array = new Array(); //the cubes Ids to be added to the FinishState.
var numberOfCubes : int = 9;
var FinishState : List.<int> = new List.<int>(); //what the solution looks like for games execpt 
													//"Woords" with needs multiple solutions at once.
													

var numberOfLevels:int = 9;
private var currentLevel: int = 0; // last level is one less than number of levels, starts at 0

public var gridMinValue : int = 5;
public var gridMaxValue : int = 9;
final private var colorsUsedForGrid : int = 2;

function Awake() {
	Debug.Log(RuleEnum);
	for(var q : int = 0 ; q < numberOfCubes; q++) {
		cubeDesignsArray.push(BoxDesign);
	}
	
	pauseScript = gameObject.GetComponent(PauseScreenScript);
	ruleScript =  gameObject.GetComponent(Rule);
	LoadLevel();
}

function Start () {
	
}

function Update () {

}

function LoadLevel(){
	pauseScript.togglePauseScreen();
	if (currentLevel < numberOfLevels) {
		currentLevel++;
		redoCreation();
	} else {
		//SYSTEM.LOAD(NEXT_GAME_SCENE);
	}

}

public function redoCreation() {
	unsortedCubes =  GameObject.FindGameObjectsWithTag("Player");

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
		presetGridDataBeforeSort();
		break;
	case ruleFunction.HumanReadable: 
		functionPointerCreator = HumanReadableCreator;
		break;
	}
	switch(currentSubRule) {
	case subRule.Addition:
		functionPointerSubCreator = AdditionCreator;
		break;
	case subRule.compositeNumbers:
		functionPointerSubCreator = compositeNumbersCreator;
		break;
	case subRule.WholeLiner:
		functionPointerSubCreator = WholeLinerCreator;
		break;
	case subRule.AnyWord: 
		functionPointerSubCreator = AnyWordCreator;
		break;
	default: break;
	}
	
	
	ruleScript.ruleSetup(unsortedCubes);
	
	
	for(var c: int = 0; c < 10; c++) {
		nextIndex = Random.Range(0,unsortedCubes.Count); //I am writing the magic number 10 here for number of cubes because unity won't let me use a variable for it, yeah so f...you unity
		nextItem = unsortedCubes[nextIndex];
		sortedCubes.Add(nextItem);
		unsortedCubes.RemoveAt(nextIndex);

	}
	
	functionPointerCreator();
	ruleScript.setFinishState(FinishState);
	
	
	var debugstate : String = "";
	for(var q:int = 0 ; q < FinishState.Count; q++) {
		debugstate += FinishState[q] + ", ";
	}
	Debug.Log("GOAL THIS ROUND IS\n" + debugstate);
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
		
		var myDebugColor : UnityEngine.Color;
		switch(c) {
			case 0 : myDebugColor = Color.red; break;
			case 2 : myDebugColor = Color.blue; break;
			case 4 : myDebugColor = Color.yellow; break;
			case 6 : myDebugColor = Color.green; break;
			case 8 : myDebugColor = Color.grey; break;
			default : myDebugColor = Color.cyan; break;
		}
		
		(sortedCubes[c] as GameObject).renderer.material.color = myDebugColor;
		(sortedCubes[c+1] as GameObject).renderer.material.color = myDebugColor;
		
		// set skin A[c] to cube sortedCubes[c] 
		// set skin B[c+1] to cube sortedCubes[c+1]
		
	}
}

private function TowerCreator () {
	Debug.Log("Tower");
}

private function presetGridDataBeforeSort(){
	var q: int = 0;
	var coloredTitles:int =  Mathf.Lerp(gridMinValue, gridMaxValue, currentLevel/numberOfLevels);

	for(var cube : UnityEngine.GameObject in unsortedCubes){

	 	if(q < coloredTitles){
	 		cube.GetComponent(BoxCollisionScript).MyDataPacket = "1";
	 		cube.renderer.material.color = Color.blue;
	 		//::TO DO::set skin colored
	 	}
	 	else if (q <= numberOfCubes){
	 		cube.GetComponent(BoxCollisionScript).MyDataPacket = "0";
	 		cube.renderer.material.color = Color.yellow;
	 		//::TO DO::set skin uncolored
	 	}
	 	else {
	 		cube.GetComponent(BoxCollisionScript).MyDataPacket = "" + (colorsUsedForGrid + 1) ; //not in use
	 	}
	 	q++;
	 }
}

private function GridCreator () {
	Debug.Log("Grid");
	var tempInt : int;
	
	
	var currentState : String = ""; 
	

	for(var cube : GameObject in sortedCubes){
		tempInt = parseInt(cube.GetComponent(BoxCollisionScript).MyDataPacket);
		Debug.Log("tempInt is: " + tempInt);
		if(tempInt < colorsUsedForGrid){
			if(FinishState.Count >= numberOfCubes) {
				return;
			}
			FinishState.Add(tempInt);
			currentState += cube.GetComponent(BoxCollisionScript).MyIdNumber + " ";
		}
			outputTextC4.text = currentState;

	}
}

private function HumanReadableCreator () {
	Debug.Log("Human Readable");
}


function AdditionCreator() {


}
function WholeLinerCreator(){


}
function compositeNumbersCreator(){


}
function AnyWordCreator(){
	
	
	}

