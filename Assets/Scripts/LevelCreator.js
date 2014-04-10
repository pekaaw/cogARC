#pragma strict

// Data from this level
public var Data : LevelData;

private var loadingScript : LoadingScreen;
private var ruleScript : Rule;
private var functionPointerCreator : Function;
private var functionPointerSubCreator : Function;
private var functionPointerPreCreator : Function;
private var unsortedCubes : Array; //cubes with tag "Player" found on stage used to set material/text.
private var sortedCubes : Array = new Array();
private var currentLevel: int = 0; // last level is one less than number of levels, starts at 0
final private var colorsUsedForGrid : int = 2;
private var additionTaskIsMadeInAdvance:boolean = true;

private var WOOORDSFILE : List.<String>;
private var numberOfWordsThisLevel : int;

//private var hasBeenSetUp : boolean = false;



function Awake() {
	if( Data == null ) {
		Debug.LogWarning("Data is null");

		Data = new LevelData();
		
		while(Data.CubeDesignsArray.Count < 10){
			Data.CubeDesignsArray.Add( new BoxDesign());
		}
		
		encodeDesignArray();
		decodeDesignArray();
	}
	else
	{
		decodeDesignArray();
	}
	
	Debug.Log(Data.RuleEnum);
	//for(var q : int = Data.CubeDesignsArray.length ; q < Data.numberOfCubes; q++) {
		//Data.CubeDesignsArray.push(new BoxDesign());
	//}
	
	//Data.gridGoalScript = GameObject.Find("GridGoal").GetComponent(GridGoalScript);
	ruleScript =  gameObject.GetComponent(Rule);

	loadingScript = gameObject.GetComponent(LoadingScreen);
	

	LoadLevel();
}

function Start () {
	
}

function Update () {
	//GameObject.Find("DebugText4").GetComponent(TextMesh).text = Data.SaveDesignString;

}

function LoadLevel(){
	
	AfterLevelCleanup();
	
	if (currentLevel < Data.numberOfLevels) {
		currentLevel++;
		redoCreation();	//load next level of same game
		loadingScript.Activate(Data.GameName, Data.LevelGoalText, Data.numberOfLevels, currentLevel);
		if(	!gameObject.GetComponent(TimerAndScore).CheckToggleTimerActive())  //unpause the timer
		{
			gameObject.GetComponent(TimerAndScore).ToggleTimerActive(); //unpause the timer
		}

	} else {
	
		Application.Quit();
		Application.LoadLevel(Data.NextLevel); //load next scene
	}
	
}

function AfterLevelCleanup(){
	sortedCubes.clear(); // this is used to put the boxes in random order at the beginning of each level
}

public function redoCreation() {
// God, i am unsatisfied!
	unsortedCubes = GameObject.FindGameObjectsWithTag("Player");
	var nextItem : GameObject; //for making random order
	var nextIndex : int;

	var isTextAnswer : boolean = false;
	//if(!hasBeenSetUp) {

		switch(Data.RuleEnum) {
			case ruleFunction.Pair:
				functionPointerCreator = PairCreator;
				functionPointerPreCreator = PresetActivateAll;		

				break;
			case ruleFunction.Tower:
				functionPointerCreator = TowerCreator;
				functionPointerPreCreator = NULLFUNCTION;
				isTextAnswer = true;

				break;
			case ruleFunction.Grid:
				functionPointerCreator = GridCreator;
				functionPointerPreCreator = PresetGridDataBeforeSort;
		
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
					functionPointerPreCreator = PresetAdditionNumbers;
					

					break;
				case subRule.CompositeNumbers:
					functionPointerSubCreator = CompositeNumberCreator;
					functionPointerPreCreator = setOneToNineNumbers;
				
					break;
				case subRule.WholeLiner:
					functionPointerSubCreator = WholeLinerCreator;
					functionPointerPreCreator = PresetActivateAll;
					break;
				case subRule.AnyWord: 
					functionPointerSubCreator = AnyWordCreator;
					functionPointerPreCreator = PresetWoordsData;
			
				

					break;
				default: break;
			}
		}
	//	hasBeenSetUp = true;
	//}
	
	functionPointerPreCreator(); // set some data before the cubes are randomized
		
	ruleScript.MakeLocalCopyPacketData(unsortedCubes); //sets an array with copies of the cubes datapackets. for reference when checking finishstate.

	ruleScript.ruleSetup(isTextAnswer); // sets the rules in the rulescript
	
	for(var c: int = 0; c < Data.numberOfCubes; c++) {

		nextIndex = Random.Range(0,unsortedCubes.length-1); //I am writing the magic number 10 here for number of cubes because unity won't let me use a variable for it, yeah so f...you unity
		
		if((unsortedCubes[nextIndex] as GameObject).GetComponent(BoxCollisionScript).MyDataPacket != "")
		{
			nextItem = unsortedCubes[nextIndex];
			sortedCubes.Add(nextItem);
			unsortedCubes.RemoveAt(nextIndex);
		} else {
			unsortedCubes.RemoveAt(nextIndex);
		}
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
		
		var tempCubeObject: GameObject = sortedCubes[c];
		var tempDesignScript: BoxDesignScript = tempCubeObject.GetComponent(BoxDesignScript);
		tempDesignScript.setDesign(Data.CubeDesignsArray[c] as BoxDesign,Data.DesignEnum);
		
		tempCubeObject = sortedCubes[c+1];
		tempDesignScript = tempCubeObject.GetComponent(BoxDesignScript);
		tempDesignScript.setDesign(Data.CubeDesignsArray[c+1] as BoxDesign,Data.DesignEnum);
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
	functionPointerSubCreator();
}

private function HumanReadableCreator () {
	Debug.Log("Human Readable");
	functionPointerSubCreator();
}






private function PresetWoordsData() {
	var c : int = 0;
	var dataStrings : String[] = new String [Data.numberOfCubes];
	if(!WOOORDSFILE || WOOORDSFILE.Count < 1) {
		WOOORDSFILE = gameObject.GetComponent(ReadLevelFromFile).ReadFile(Data.FileStringContent);
	}
	while(c < Data.numberOfCubes && WOOORDSFILE[c] != "-1") 
	{
		dataStrings[c] = WOOORDSFILE[c];
		c++;
	}
	numberOfWordsThisLevel = parseInt(WOOORDSFILE[c+1]);
	WOOORDSFILE.RemoveRange(0,c+3);
	while(c < Data.numberOfCubes) 
	{
		dataStrings[c] = "$CUBE_NOT_IN_USE$";
 		c++;
 	}
  
	SetStringDataInOrder(unsortedCubes , dataStrings);
} 




private function SetStringDataWithoutOrder(cubes : Array , dataStrings : String[]) {
	var design : BoxDesign;
	//sets string[0] to ParamCubes[0] and string[7] to ParamCubes[7] 
	for( var i:int;i<cubes.length;i++) {
		if(dataStrings[i] != "$CUBE_NOT_IN_USE$") {
			design = new BoxDesign();
			(cubes[i] as GameObject).GetComponent(BoxCollisionScript).MyDataPacket = dataStrings[i];
			design.BoxText = dataStrings[i];
			(cubes[i] as GameObject).GetComponent(BoxDesignScript).setDesign(design,Data.DesignEnum);
		} else {
			(cubes[i] as GameObject).renderer.material.color = Color.black;
			(cubes[i] as GameObject).GetComponent(BoxCollisionScript).MyDataPacket = "";
		}
	}
}


private function SetStringDataInOrder(cubes : Array , dataStrings : String[]) {
var design : BoxDesign;
	//sets string[0] to sceneCube[0] and string[7] to sceneCube[7] 
	for( var i:int;i<cubes.length;i++) {
		if(dataStrings[i] != "$CUBE_NOT_IN_USE$") {
			design = new BoxDesign();
			design.BoxText = dataStrings[i];
			(cubes[i] as GameObject).GetComponent(BoxCollisionScript).MyDataPacket =
			 dataStrings[i];
			 (cubes[i] as GameObject).GetComponent(BoxDesignScript).setDesign(design,Data.DesignEnum);
		} else {/*
			for( var cube : GameObject in cubes){
				if((cubes[i] as GameObject).GetComponent(BoxCollisionScript).MyIdNumber == cube.GetComponent(BoxCollisionScript).MyIdNumber){
					cube.renderer.material.color = Color.black;
					cube.GetComponent(BoxCollisionScript).MyDataPacket = "";
				}
			}
			*/
			(cubes[i] as GameObject).renderer.material.color = Color.black;
			(cubes[i] as GameObject).GetComponent(BoxCollisionScript).MyDataPacket = "";
		}
	}
}

private function setOneToNineNumbers () {
	var arr = new Array ();
	for(var q : int = 0 ; q < 10; q ++)
	{
		arr.Push (q + "");
	}
	SetStringDataWithoutOrder(unsortedCubes, arr.ToBuiltin(String));

}

function PresetActivateAll() {
	for(var cube : UnityEngine.GameObject in unsortedCubes)
		{
			cube.GetComponent(BoxCollisionScript).MyDataPacket = "true";
		}
	return;
}

private function PresetAdditionNumbers(){
	var design : BoxDesign;
	var tempInt : int;
	var tempString : String;
	
	if(additionTaskIsMadeInAdvance){
		for(var tempDesign : BoxDesign in Data.CubeDesignsArray){
			tempString = tempDesign.BoxText;
			if(String.IsNullOrEmpty(tempString)){
				additionTaskIsMadeInAdvance = false;
			}
		}
	}
	
	if(!additionTaskIsMadeInAdvance)
	{
		for(var cube : UnityEngine.GameObject in unsortedCubes)
		{
			design = Data.CubeDesignsArray[cube.GetComponent(BoxCollisionScript).MyIdNumber] as BoxDesign;
			tempInt = Random.Range(0, (currentLevel + 1) * 10) - (currentLevel + 1) * 5;
			if(tempInt < 0){
				tempString = tempInt + "";
			} else
			{
				tempString = "+" + tempInt;
			}
			design.BoxText = tempString;
			cube.GetComponent(BoxCollisionScript).MyDataPacket = tempInt + "";
						
			cube.GetComponent(BoxDesignScript).setDesign( design, Data.DesignEnum);

		}
	}	
	else 
	{
		for(var cube : UnityEngine.GameObject in unsortedCubes)
		{
			design = Data.CubeDesignsArray[cube.GetComponent(BoxCollisionScript).MyIdNumber] as BoxDesign;
			tempString = design.BoxText;
			while (tempString[0] == "+" || tempString[0] == " ") {
				tempString = tempString.Substring(1, tempString.Length - 1);
			}
			try 
			{
				tempInt = parseInt(tempString);
			}
			catch (e) {
				Debug.LogError(e + "\n Please set the data correctly if you are going to set it.");
			}
			if(tempInt < 0){
				tempString = tempInt + "";
			} else
			{
				tempString = "+" + tempInt;
			}
			
			cube.GetComponent(BoxCollisionScript).MyDataPacket = tempInt + "";

			cube.GetComponent(BoxDesignScript).setDesign( design, Data.DesignEnum);
	
		}
	
	}
}

private function PresetGridDataBeforeSort(){
	var q: int = 0;
	var coloredTitles:int =  Mathf.Lerp(Data.gridMinValue, Data.gridMaxValue, currentLevel/Data.numberOfLevels);


	Debug.LogWarning((Data.CubeDesignsArray[0] as BoxDesign).BoxColor);
	Debug.LogWarning((Data.CubeDesignsArray[1] as BoxDesign).BoxColor);

	for(var cube : UnityEngine.GameObject in unsortedCubes){
		var designScript: BoxDesignScript = cube.GetComponent(BoxDesignScript);
	 	if(cube.GetComponent(BoxCollisionScript).MyIdNumber < coloredTitles){
	 		cube.GetComponent(BoxCollisionScript).MyDataPacket = "1";
			designScript.setDesign(Data.CubeDesignsArray[0] as BoxDesign,Data.DesignEnum);
			//cube.renderer.material.color = Color.red;

	 		//::TO DO::set skin colored
	 	}
	 	else if (cube.GetComponent(BoxCollisionScript).MyIdNumber < Data.numberOfCubes-1){
	 		cube.GetComponent(BoxCollisionScript).MyDataPacket = "0";
			designScript.setDesign(Data.CubeDesignsArray[1] as BoxDesign,Data.DesignEnum);
	 		//cube.renderer.material.color = Color.green;

	 		//::TO DO::set skin uncolored
	 	}
	 	else {
	 		cube.renderer.material.color = Color.black;

	 		cube.GetComponent(BoxCollisionScript).MyDataPacket = "";//not in use
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
		if(Data.FinishState.Count >= Data.numberOfCubes) {
			return;
		}
		Data.FinishState.Add(tempInt);
	//	currentState += cube.GetComponent(BoxCollisionScript).MyIdNumber + " ";
	
		
		// TODO: remove debugstuff	
		//Data.outputTextC4.text = currentState;

	}
	var c:int = 0;
	c++;
}



function AdditionCreator() {

	var tempInt : int = 0;
	var tempFloat : float = 0.0f;

	tempFloat = (currentLevel + 0.0f)/(Data.numberOfLevels + 0.0f);
	Data.CurrentNumberOfBoxesUsedForTask = Mathf.Lerp(Data.MinNumberOfBoxesUsedForTask, Data.MaxNumberOfBoxesUsedForTask, tempFloat);
	for(var i : int = 0 ; i < Data.CurrentNumberOfBoxesUsedForTask ; i++)
	{
		tempInt += parseInt((sortedCubes[i] as GameObject).GetComponent(BoxCollisionScript).MyDataPacket);
	}
	Data.FinishState.Add(tempInt);

}

function WholeLinerCreator(){
//strict string - should have full length
	for(var i:int = 0; i < sortedCubes.length; i++)
	{
		Data.FinishState.Add(i);
	}
	Data.FinishState.Add(-1);


}

function CompositeNumberCreator(){
var goal : int = 0;
	for(var q : int = 0 ; q < Data.CurrentNumberOfBoxesUsedForTask ; q++)
	{
		goal *= 10;
		goal += parseInt((sortedCubes[q] as GameObject).GetComponent(BoxCollisionScript).MyDataPacket);
	}
	Data.FinishState.Add(goal);
	Data.FinishState.Add(-1);
	
	
}


function AnyWordCreator(){
	var c : int = 0;
 	for(var q:int = 0; q < numberOfWordsThisLevel ; q ++) {
 		do{
 			Data.FinishState.Add(parseInt(WOOORDSFILE[c]));
 			c++;
 		} while(WOOORDSFILE[c] != "-1");
 		Data.FinishState.Add(-1);
 		WOOORDSFILE.RemoveRange(0,c + 1);
 		c = 0;
 	
 	}
   


}

function NULLFUNCTION() {
	//this function does nothing
	return;
}

function encodeDesignArray() : void {
	var CubeDesignObject : Boomlagoon.JSON.JSONObject = new Boomlagoon.JSON.JSONObject();
	var SingleDesignObject : Boomlagoon.JSON.JSONObject;
	var length : int = Data.CubeDesignsArray.Count;
	var design : BoxDesign;
	
	CubeDesignObject.Add( "NumberOfBoxes", length.ToString() );

	for( var x : int = 0; x < length; x++ )
	{
		// get design from inspector
		design = Data.CubeDesignsArray[x];

		// Create a JSONObject out of the design
		SingleDesignObject = design.ToJSONObject();
		
		// Add the designJsonObject to the collection of jsonobjects
		CubeDesignObject.Add( x.ToString(), SingleDesignObject );
	}
	
	// Save the jsonobject with designs in a serializable field in data
	Data.SaveDesignString = CubeDesignObject.ToString();
}

function decodeDesignArray() {
	var cubeDesignsInJSONObject : Boomlagoon.JSON.JSONObject;
	var cubeDesignJSONObject : Boomlagoon.JSON.JSONObject;
	var cubeDesignJSONValue : Boomlagoon.JSON.JSONValue;
	var length : int;
	var counter : int;

	// Get the designs from the JSON-string in Data
	cubeDesignsInJSONObject = Boomlagoon.JSON.JSONObject.Parse(Data.SaveDesignString) ;
	
	// If we do not have data, try to make them
	if( Data.SaveDesignString == null || Data.SaveDesignString == "" || cubeDesignsInJSONObject == null)
	{
		encodeDesignArray();
		cubeDesignsInJSONObject = Boomlagoon.JSON.JSONObject.Parse(Data.SaveDesignString) ;
	}
	
	// If we still have no data, print error and return
	if( Data.SaveDesignString == null || Data.SaveDesignString == "" || cubeDesignsInJSONObject == null)
	{
		Debug.LogError("You have not specified the design that the boxes should use.");
		return;
	}

	// Find number of cubedesigns
	length = parseInt( cubeDesignsInJSONObject["NumberOfBoxes"].Str );

	// for each design: add it to the data
	for( counter = 0; counter < length; counter++ )
	{
	
		// Get the data for this BoxDesign
		cubeDesignJSONValue = cubeDesignsInJSONObject.GetValue(counter.ToString());
		
		// Parse it till a readable format
		cubeDesignJSONObject = Boomlagoon.JSON.JSONObject
								.Parse(	cubeDesignJSONValue.ToString());

	 	//Replace data
		if( counter < Data.CubeDesignsArray.Count )
		{
			(Data.CubeDesignsArray[counter] as BoxDesign).FromJSONObject(cubeDesignJSONObject);
		}
		// or add data
		else
		{
			var myDesign : BoxDesign = new BoxDesign();
			myDesign.FromJSONObject(cubeDesignJSONObject);
			Data.CubeDesignsArray.Add( myDesign );
		}

	}
}