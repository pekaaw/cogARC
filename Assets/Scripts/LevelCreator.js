#pragma strict

// Data from this level
static public var LevelDataInstance : LevelData;





// TODO: outputTextC4 should be removed. It is a debug feature
//var outputTextC4 : UnityEngine.TextMesh;
//
//private var pauseScript : PauseScreenScript;
//private var ruleScript : Rule;
//private var gridGoalScript : GridGoalScript;
//
//public var NextLevel : int;
//public var RuleEnum : ruleFunction;

//private var functionPointerCreator : Function;
//private var functionPointerSubCreator : Function;
//private var functionPointerPreCreator : Function;
//
//
//public enum ruleFunction { Grid, Pair, Tower, HumanReadable};
//public enum subRule {Addition,compositeNumbers,WholeLiner,AnyWord};
//public var CurrentSubRule : subRule;
//
//public var CubeDesignsArray : Array = new Array();
//public enum CubeDesignEnum {ColouredBox,BoxImage, Text, TextAndCubeColour};
//public var DesignEnum : CubeDesignEnum;
//
//private var unsortedCubes : Array; //cubes with tag "Player" found on stage used to set material/text.
//private var sortedCubes : Array = new Array();
////var unsortedCubesIDs : Array = new Array(); //the cubes Ids to be added to the FinishState.
//var numberOfCubes : int = 10;
//
////what the solution looks like for games except "Woords" with needs multiple solutions at once.
//var FinishState : List.<int> = new List.<int>(); 
//												
//
//
//var numberOfLevels:int = 9;
//private var currentLevel: int = 0; // last level is one less than number of levels, starts at 0
//
//public var gridMinValue : int;
//public var gridMaxValue : int;
//final private var colorsUsedForGrid : int = 2;

function Awake() {

	if( LevelDataInstance == null ) {
		LevelDataInstance = ScriptableObject.CreateInstance("LevelData");
	}
	
	Debug.Log(LevelDataInstance.RuleEnum);
	for(var q : int = LevelDataInstance.CubeDesignsArray.length ; q < LevelDataInstance.numberOfCubes; q++) {
		LevelDataInstance.CubeDesignsArray.push(new BoxDesign());
	}
	
	//LevelDataInstance.gridGoalScript = GameObject.Find("GridGoal").GetComponent(GridGoalScript);
	LevelDataInstance.pauseScript = gameObject.GetComponent(PauseScreenScript);
	LevelDataInstance.ruleScript =  gameObject.GetComponent(Rule);

	LoadLevel();
}

function Start () {
	
}

function Update () {

}

function LoadLevel(){
	LevelDataInstance.pauseScript.togglePauseScreen();
	
	AfterLevelCleanup();
	
	if (LevelDataInstance.currentLevel < LevelDataInstance.numberOfLevels) {
		LevelDataInstance.currentLevel++;
		redoCreation();	//load next level of same game
	} else {
		Application.Quit();
		Application.LoadLevel(LevelDataInstance.NextLevel); //load next scene
	}

}

function AfterLevelCleanup(){
	LevelDataInstance.sortedCubes.clear(); // this is used to put the boxes in random order at the beginning of each level
}

public function redoCreation() {
	LevelDataInstance.unsortedCubes = GameObject.FindGameObjectsWithTag("Player");

	var nextItem : GameObject; //for making random order
	var nextIndex : int;

	switch(LevelDataInstance.RuleEnum) {
		case ruleFunction.Pair:
			LevelDataInstance.functionPointerCreator = PairCreator;
			LevelDataInstance.functionPointerPreCreator = NULLFUNCTION;

			break;
		case ruleFunction.Tower:
			LevelDataInstance.functionPointerCreator = TowerCreator;
			LevelDataInstance.functionPointerPreCreator = NULLFUNCTION;
				Debug.Log("Pair");

			break;
		case ruleFunction.Grid:
			LevelDataInstance.functionPointerCreator = GridCreator;
			LevelDataInstance.functionPointerPreCreator = presetGridDataBeforeSort;
			break;
		case ruleFunction.HumanReadable: 
			LevelDataInstance.functionPointerCreator = HumanReadableCreator;
			LevelDataInstance.functionPointerPreCreator = presetStringDataBeforeSort;
			break;
	}
	
	switch(LevelDataInstance.CurrentSubRule) {
		case subRule.Addition:
			LevelDataInstance.functionPointerSubCreator = AdditionCreator;
			break;
		case subRule.CompositeNumbers:
			LevelDataInstance.functionPointerSubCreator = CompositeNumbersCreator;
			break;
		case subRule.WholeLiner:
			LevelDataInstance.functionPointerSubCreator = WholeLinerCreator;
			break;
		case subRule.AnyWord: 
			LevelDataInstance.functionPointerSubCreator = AnyWordCreator;
			break;
		default: break;
	}
	
	LevelDataInstance.functionPointerPreCreator(); // set some data before the cubes are randomized
	
	LevelDataInstance.ruleScript.ruleSetup(); // sets the rules in the rulescript
	LevelDataInstance.ruleScript.MakeLocalCopyPacketData(LevelDataInstance.unsortedCubes); //sets an array with copies of the cobes datapackets. for reference when checking finishstate.
	
	for(var c: int = 0; c < LevelDataInstance.numberOfCubes; c++) {
		nextIndex = Random.Range(0,LevelDataInstance.unsortedCubes.Count); //I am writing the magic number 10 here for number of cubes because unity won't let me use a variable for it, yeah so f...you unity
		nextItem = LevelDataInstance.unsortedCubes[nextIndex];
		LevelDataInstance.sortedCubes.Add(nextItem);
		LevelDataInstance.unsortedCubes.RemoveAt(nextIndex);

	}
	
	LevelDataInstance.functionPointerCreator();
	LevelDataInstance.ruleScript.setFinishState(LevelDataInstance.FinishState);
	
	
	var debugstate : String = "";
	for(var q:int = 0 ; q < LevelDataInstance.FinishState.Count; q++) {
		debugstate += LevelDataInstance.FinishState[q] + ", ";
	}
	Debug.Log("GOAL THIS ROUND IS\n" + debugstate);
}



private function PairCreator () {
	Debug.Log("Pair Creator");
	
	for(var c: int = 0; c < LevelDataInstance.sortedCubes.Count; c+=2) {
		var nextItem1 : GameObject;
		var nextItem2 : GameObject; 
		nextItem1 = LevelDataInstance.sortedCubes[c];
		nextItem2 = LevelDataInstance.sortedCubes[c+1];
		LevelDataInstance.FinishState.Add(nextItem1.GetComponent(BoxCollisionScript).MyIdNumber);
		LevelDataInstance.FinishState.Add(nextItem2.GetComponent(BoxCollisionScript).MyIdNumber);
		LevelDataInstance.FinishState.Add(-1);//separator to next pair
		
		
		var myDebugColor : UnityEngine.Color;
		switch(c) {
			case 0 : myDebugColor = Color.red; break;
			case 2 : myDebugColor = Color.blue; break;
			case 4 : myDebugColor = Color.yellow; break;
			case 6 : myDebugColor = Color.green; break;
			case 8 : myDebugColor = Color.grey; break;
			default : myDebugColor = Color.cyan; break;
		}

		var PPPPPk: GameObject = LevelDataInstance.sortedCubes[c];
		var PPk: BoxDesignScript = PPPPPk.GetComponent(BoxDesignScript);
		PPk.setDesign(LevelDataInstance.CubeDesignsArray[c] as BoxDesign,LevelDataInstance.DesignEnum);
		
		PPPPPk = LevelDataInstance.sortedCubes[c+1];
		PPk = PPPPPk.GetComponent(BoxDesignScript);
		PPk.setDesign(LevelDataInstance.CubeDesignsArray[c] as BoxDesign,LevelDataInstance.DesignEnum);
			/*
		(sortedCubes[c] as GameObject).renderer.material.color = myDebugColor;
		(sortedCubes[c+1] as GameObject).renderer.material.color = myDebugColor;
	*/	
		// set skin A[c] to cube sortedCubes[c] 
		// set skin B[c+1] to cube sortedCubes[c+1]
		
	}
}

private function TowerCreator () {
	Debug.Log("Tower");
}











private function presetStringDataBeforeSort() {



}







private function presetGridDataBeforeSort(){
	var q: int = 0;
	var coloredTitles:int =  Mathf.Lerp(LevelDataInstance.gridMinValue, LevelDataInstance.gridMaxValue, LevelDataInstance.currentLevel/LevelDataInstance.numberOfLevels);

	for(var cube : UnityEngine.GameObject in LevelDataInstance.unsortedCubes){

	 	if(q < coloredTitles){
	 		cube.GetComponent(BoxCollisionScript).MyDataPacket = "1";
	 		cube.renderer.material.color = Color.blue;
	 		//::TO DO::set skin colored
	 	}
	 	else if (q < LevelDataInstance.numberOfCubes-1){
	 		cube.GetComponent(BoxCollisionScript).MyDataPacket = "0";
	 		cube.renderer.material.color = Color.yellow;
	 		//::TO DO::set skin uncolored
	 	}
	 	else {
	 		cube.renderer.material.color = Color.black;

	 		cube.GetComponent(BoxCollisionScript).MyDataPacket = "" + (LevelDataInstance.colorsUsedForGrid + 1) ; //not in use
	 	}
	 	q++;
	 }
}

private function GridCreator () {
	Debug.Log("Grid");
	var tempInt : int;
	
	
	var currentState : String = ""; 
	

	for(var cube : GameObject in LevelDataInstance.sortedCubes){
		tempInt = parseInt(cube.GetComponent(BoxCollisionScript).MyDataPacket);
		Debug.Log("tempInt is: " + tempInt);
		if(tempInt < LevelDataInstance.colorsUsedForGrid){
			if(LevelDataInstance.FinishState.Count >= LevelDataInstance.numberOfCubes) {
				return;
			}
			LevelDataInstance.FinishState.Add(tempInt);
			currentState += cube.GetComponent(BoxCollisionScript).MyIdNumber + " ";
		}
		
		// TODO: remove debugstuff	
		LevelDataInstance.outputTextC4.text = currentState;

	}
}

private function HumanReadableCreator () {
	Debug.Log("Human Readable");
}

function AdditionCreator() {

}

function WholeLinerCreator(){

}

function CompositeNumbersCreator(){

}

function AnyWordCreator(){
	
}

function NULLFUNCTION() {
	return;
}
