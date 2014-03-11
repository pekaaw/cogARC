#pragma strict

// Data from this level
static public var Data : LevelData;


function Awake() {

	if( Data == null ) {
		Data = ScriptableObject.CreateInstance("LevelData");
	}
	
	Debug.Log(Data.RuleEnum);
	for(var q : int = Data.CubeDesignsArray.length ; q < Data.numberOfCubes; q++) {
		Data.CubeDesignsArray.push(new BoxDesign());
	}
	
	//Data.gridGoalScript = GameObject.Find("GridGoal").GetComponent(GridGoalScript);
	Data.pauseScript = gameObject.GetComponent(PauseScreenScript);
	Data.ruleScript =  gameObject.GetComponent(Rule);

	LoadLevel();
}

function Start () {
	
}

function Update () {

}

function LoadLevel(){
	Data.pauseScript.togglePauseScreen();
	
	AfterLevelCleanup();
	
	if (Data.currentLevel < Data.numberOfLevels) {
		Data.currentLevel++;
		redoCreation();	//load next level of same game
	} else {
		Application.Quit();
		Application.LoadLevel(Data.NextLevel); //load next scene
	}

}

function AfterLevelCleanup(){
	Data.sortedCubes.clear(); // this is used to put the boxes in random order at the beginning of each level
}

public function redoCreation() {
	Data.unsortedCubes = GameObject.FindGameObjectsWithTag("Player");

	var nextItem : GameObject; //for making random order
	var nextIndex : int;

	switch(Data.RuleEnum) {
		case ruleFunction.Pair:
			Data.functionPointerCreator = PairCreator;
			Data.functionPointerPreCreator = NULLFUNCTION;

			break;
		case ruleFunction.Tower:
			Data.functionPointerCreator = TowerCreator;
			Data.functionPointerPreCreator = NULLFUNCTION;
				Debug.Log("Pair");

			break;
		case ruleFunction.Grid:
			Data.functionPointerCreator = GridCreator;
			Data.functionPointerPreCreator = presetGridDataBeforeSort;
			break;
		case ruleFunction.HumanReadable: 
			Data.functionPointerCreator = HumanReadableCreator;
			Data.functionPointerPreCreator = presetStringDataBeforeSort;
			break;
	}
	
	switch(Data.CurrentSubRule) {
		case subRule.Addition:
			Data.functionPointerSubCreator = AdditionCreator;
			break;
		case subRule.CompositeNumbers:
			Data.functionPointerSubCreator = CompositeNumbersCreator;
			break;
		case subRule.WholeLiner:
			Data.functionPointerSubCreator = WholeLinerCreator;
			break;
		case subRule.AnyWord: 
			Data.functionPointerSubCreator = AnyWordCreator;
			break;
		default: break;
	}
	
	Data.functionPointerPreCreator(); // set some data before the cubes are randomized
	
	Data.ruleScript.ruleSetup(); // sets the rules in the rulescript
	Data.ruleScript.MakeLocalCopyPacketData(Data.unsortedCubes); //sets an array with copies of the cobes datapackets. for reference when checking finishstate.
	
	for(var c: int = 0; c < Data.numberOfCubes; c++) {
		nextIndex = Random.Range(0,Data.unsortedCubes.Count); //I am writing the magic number 10 here for number of cubes because unity won't let me use a variable for it, yeah so f...you unity
		nextItem = Data.unsortedCubes[nextIndex];
		Data.sortedCubes.Add(nextItem);
		Data.unsortedCubes.RemoveAt(nextIndex);

	}
	
	Data.functionPointerCreator();
	Data.ruleScript.setFinishState(Data.FinishState);
	
	
	var debugstate : String = "";
	for(var q:int = 0 ; q < Data.FinishState.Count; q++) {
		debugstate += Data.FinishState[q] + ", ";
	}
	Debug.Log("GOAL THIS ROUND IS\n" + debugstate);
}



private function PairCreator () {
	Debug.Log("Pair Creator");
	
	for(var c: int = 0; c < Data.sortedCubes.Count; c+=2) {
		var nextItem1 : GameObject;
		var nextItem2 : GameObject; 
		nextItem1 = Data.sortedCubes[c];
		nextItem2 = Data.sortedCubes[c+1];
		Data.FinishState.Add(nextItem1.GetComponent(BoxCollisionScript).MyIdNumber);
		Data.FinishState.Add(nextItem2.GetComponent(BoxCollisionScript).MyIdNumber);
		Data.FinishState.Add(-1);//separator to next pair
		
		
		var myDebugColor : UnityEngine.Color;
		switch(c) {
			case 0 : myDebugColor = Color.red; break;
			case 2 : myDebugColor = Color.blue; break;
			case 4 : myDebugColor = Color.yellow; break;
			case 6 : myDebugColor = Color.green; break;
			case 8 : myDebugColor = Color.grey; break;
			default : myDebugColor = Color.cyan; break;
		}

		var PPPPPk: GameObject = Data.sortedCubes[c];
		var PPk: BoxDesignScript = PPPPPk.GetComponent(BoxDesignScript);
		PPk.setDesign(Data.CubeDesignsArray[c] as BoxDesign,Data.DesignEnum);
		
		PPPPPk = Data.sortedCubes[c+1];
		PPk = PPPPPk.GetComponent(BoxDesignScript);
		PPk.setDesign(Data.CubeDesignsArray[c] as BoxDesign,Data.DesignEnum);
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
	var coloredTitles:int =  Mathf.Lerp(Data.gridMinValue, Data.gridMaxValue, Data.currentLevel/Data.numberOfLevels);

	for(var cube : UnityEngine.GameObject in Data.unsortedCubes){

	 	if(q < coloredTitles){
	 		cube.GetComponent(BoxCollisionScript).MyDataPacket = "1";
	 		cube.renderer.material.color = Color.blue;
	 		//::TO DO::set skin colored
	 	}
	 	else if (q < Data.numberOfCubes-1){
	 		cube.GetComponent(BoxCollisionScript).MyDataPacket = "0";
	 		cube.renderer.material.color = Color.yellow;
	 		//::TO DO::set skin uncolored
	 	}
	 	else {
	 		cube.renderer.material.color = Color.black;

	 		cube.GetComponent(BoxCollisionScript).MyDataPacket = "" + (Data.colorsUsedForGrid + 1) ; //not in use
	 	}
	 	q++;
	 }
}

private function GridCreator () {
	Debug.Log("Grid");
	var tempInt : int;
	
	
	var currentState : String = ""; 
	

	for(var cube : GameObject in Data.sortedCubes){
		tempInt = parseInt(cube.GetComponent(BoxCollisionScript).MyDataPacket);
		Debug.Log("tempInt is: " + tempInt);
		if(tempInt < Data.colorsUsedForGrid){
			if(Data.FinishState.Count >= Data.numberOfCubes) {
				return;
			}
			Data.FinishState.Add(tempInt);
			currentState += cube.GetComponent(BoxCollisionScript).MyIdNumber + " ";
		}
		
		// TODO: remove debugstuff	
		Data.outputTextC4.text = currentState;

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
