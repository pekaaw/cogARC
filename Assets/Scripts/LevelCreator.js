#pragma strict

// Data from this level
public var Data : LevelData;

public var SaveDesignString : String;

private var LoadingScript : LoadingScreen;
private var ruleScript : Rule;
private var functionPointerCreator : Function;
private var functionPointerSubCreator : Function;
private var functionPointerPreCreator : Function;
private var unsortedCubes : Array; //cubes with tag "Player" found on stage used to set material/text.
private var sortedCubes : Array = new Array();
private var currentLevel: int = 0; // last level is one less than number of levels, starts at 0
final private var colorsUsedForGrid : int = 2;


function Awake() {
	if( Data == null ) {
		Debug.LogWarning("Data is null");
//		Data = ScriptableObject.CreateInstance("LevelData");
		Data = new LevelData();
	}
	else
	{
		SaveDesignString = Data.SaveDesignString;
		
		// some mysterious place
		// 	AssetDatabase.CreateAsset( Data, "MyData" );
	}
	
	Debug.Log(Data.RuleEnum);
	//for(var q : int = Data.CubeDesignsArray.length ; q < Data.numberOfCubes; q++) {
		//Data.CubeDesignsArray.push(new BoxDesign());
	//}
	
	//Data.gridGoalScript = GameObject.Find("GridGoal").GetComponent(GridGoalScript);
	ruleScript =  gameObject.GetComponent(Rule);

	LoadingScript = gameObject.GetComponent(LoadingScreen);

	LoadLevel();
}

function Start () {
	
}

function Update () {
	if( Data.SaveDesignString ) {
		//Debug.LogWarning("JSON String" + Data.SaveDesignString); 
		GameObject.Find("DebugText4").GetComponent(TextMesh).text = Data.SaveDesignString;
	}


}

function LoadLevel(){
	LoadingScript.Activate(Data.GameName, Data.GameHint, Data.numberOfLevels, currentLevel);
	
	AfterLevelCleanup();
	
	if (currentLevel < Data.numberOfLevels) {
		currentLevel++;
		redoCreation();	//load next level of same game
	} else {
		Application.Quit();
		Application.LoadLevel(Data.NextLevel); //load next scene
	}

}

function AfterLevelCleanup(){
	sortedCubes.clear(); // this is used to put the boxes in random order at the beginning of each level
}

public function redoCreation() {
	unsortedCubes = GameObject.FindGameObjectsWithTag("Player");

	var nextItem : GameObject; //for making random order
	var nextIndex : int;
	
	var presetData: boolean = false;
	var isTextAnswer : boolean = false;

	switch(Data.RuleEnum) {
		case ruleFunction.Pair:
			functionPointerCreator = PairCreator;
			functionPointerPreCreator = NULLFUNCTION;

			break;
		case ruleFunction.Tower:
			functionPointerCreator = TowerCreator;
			functionPointerPreCreator = NULLFUNCTION;
			isTextAnswer = true;
				Debug.Log("Pair");

			break;
		case ruleFunction.Grid:
			functionPointerCreator = GridCreator;
			functionPointerPreCreator = presetGridDataBeforeSort;
			presetData = true;
			break;
		case ruleFunction.HumanReadable: 
			functionPointerCreator = HumanReadableCreator;
			functionPointerPreCreator = NULLFUNCTION;
			isTextAnswer = true;
			break;
	}
	if(isTextAnswer){
		switch(Data.CurrentSubRule) {
			case subRule.Addition:
				functionPointerSubCreator = AdditionCreator;
				break;
			case subRule.CompositeNumbers:
				functionPointerSubCreator = AnyWordCreator;
				break;
			case subRule.WholeLiner:
				functionPointerSubCreator = WholeLinerCreator;
				break;
			case subRule.AnyWord: 
				functionPointerSubCreator = AnyWordCreator;
				break;
			default: break;
		}
	}
	if(presetData) {
		functionPointerPreCreator(); // set some data before the cubes are randomized
		ruleScript.MakeLocalCopyPacketData(unsortedCubes); //sets an array with copies of the cubes datapackets. for reference when checking finishstate.
	}
	ruleScript.ruleSetup(isTextAnswer); // sets the rules in the rulescript
	
	for(var c: int = 0; c < Data.numberOfCubes; c++) {
		nextIndex = Random.Range(0,unsortedCubes.Count); //I am writing the magic number 10 here for number of cubes because unity won't let me use a variable for it, yeah so f...you unity
		nextItem = unsortedCubes[nextIndex];
		sortedCubes.Add(nextItem);
		unsortedCubes.RemoveAt(nextIndex);

	}
	
	functionPointerCreator();
	
	var debugstate : String = "";
	for(var q:int = 0 ; q < Data.FinishState.Count; q++) {
		debugstate += Data.FinishState[q] + ", ";
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

		var PPPPPk: GameObject = sortedCubes[c];
		var PPk: BoxDesignScript = PPPPPk.GetComponent(BoxDesignScript);
		PPk.setDesign(Data.CubeDesignsArray[c] as BoxDesign,Data.DesignEnum);
		
		PPPPPk = sortedCubes[c+1];
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








private function setStringDataWithoutOrder(cubes : Array , dataStrings : String[]) {
	//sets string[0] to ParamCubes[0] and string[7] to ParamCubes[7] 
	for( var i:int;i<cubes.length;i++) {
		(cubes[i] as GameObject).GetComponent(BoxCollisionScript).MyDataPacket = dataStrings[i];
		
	}
}


private function setStringDataInOrder(cubes : Array , dataStrings : String[]) {
	//sets string[0] to sceneCube[0] and string[7] to sceneCube[7] 
	for( var i:int;i<cubes.length;i++) {
		(cubes[i] as GameObject).GetComponent(BoxCollisionScript).MyDataPacket =
			 dataStrings[(cubes[i] as GameObject).GetComponent(BoxCollisionScript).MyIdNumber];
		
	}
}

private function presetGridDataBeforeSort(){
	var q: int = 0;
	var coloredTitles:int =  Mathf.Lerp(Data.gridMinValue, Data.gridMaxValue, currentLevel/Data.numberOfLevels);

	for(var cube : UnityEngine.GameObject in unsortedCubes){

	 	if(cube.GetComponent(BoxCollisionScript).MyIdNumber < coloredTitles){
	 		cube.GetComponent(BoxCollisionScript).MyDataPacket = "1";
	 		cube.renderer.material.color = Color.blue;
	 		//::TO DO::set skin colored
	 	}
	 	else if (cube.GetComponent(BoxCollisionScript).MyIdNumber < Data.numberOfCubes-1){
	 		cube.GetComponent(BoxCollisionScript).MyDataPacket = "0";
	 		cube.renderer.material.color = Color.yellow;
	 		//::TO DO::set skin uncolored
	 	}
	 	else {
	 		cube.renderer.material.color = Color.black;

	 		cube.GetComponent(BoxCollisionScript).MyDataPacket = "" + (colorsUsedForGrid + 1) ; //not in use
	 	}
	 	q++;
	 }
}

private function GridCreator () {
	Debug.Log("Grid");
	var tempInt : int;
	
	
	//var currentState : String = ""; 
	

	for(var cube : GameObject in sortedCubes){
		tempInt = parseInt(cube.GetComponent(BoxCollisionScript).MyDataPacket);
	//	Debug.Log("tempInt is: " + tempInt);
		if(tempInt < colorsUsedForGrid){
			if(Data.FinishState.Count >= Data.numberOfCubes) {
				return;
			}
			Data.FinishState.Add(tempInt);
	//		currentState += cube.GetComponent(BoxCollisionScript).MyIdNumber + " ";
		}
		
		// TODO: remove debugstuff	
		//Data.outputTextC4.text = currentState;

	}
}

private function HumanReadableCreator () {
	Debug.Log("Human Readable");
}

function AdditionCreator() {

}

function WholeLinerCreator(){
//strict string - should have full length

}

function AnyWordCreator(){
// find solution in currentstate - the point is not to have full length
	
}

function NULLFUNCTION() {
	//this function does nothing
	return;
}
