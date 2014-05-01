#pragma strict
//Enum defined in LevelCreator.js
//private enum ruleFunction {Tower, Row, Grid, HumanReadable, Calculus};
private var levelCreator : LevelCreator;
private var gameSequence : GameSceneSequence;
private var timerScript : TimerAndScore;
private var logScript : EventLogger;
private var DebugText : String = "Arne";
private var isTextAnswer : boolean; 
private static var historyHasChangedFromBefore : boolean = true; // if the boxes has been moved since last test()
private static var historyGameState1 : int[];
private static var historyGameState2 : int[]; //these are check against eachother to stabilize the inputdata
private static var historyGameState3 : int[]; //tests are only done when all 3 are the same

private var functionPointer : Function = NULLFUNCTION;
private var functionPointerSubRule : Function = NULLFUNCTION;
private var functionPointerHintGUI : Function = NULLFUNCTION;

private static var colorColored : Color;
private static var colorUncolored : Color;

private var hideGui : boolean = false;
private static var killHintOrder : boolean = true;// hint is displayed while this is false;
private static var killHintTimer : float;// hint is displayed when this is greater than 0 or -1;
private static var killHintString : String;
private static var killHintPos : Vector3;
private static var myMainCamera : Camera;

private var boxPositions : Transform[];
private var guiBoxPosition : Rect;
private var cogarcSkin : GUISkin;
private var CubesData : Array;		//local copy of the data contained in the 

private var wrapText : GUIStyle;


private var completedWoords : List.<int> = new List.<int>();








function Awake() {
	timerScript = gameObject.GetComponent(TimerAndScore);
	logScript = gameObject.GetComponent(EventLogger);
	gameSequence = GameObject.Find("SceneSequence").GetComponent(GameSceneSequence);
	myMainCamera = GameObject.Find("ARCamera 1").camera;
	levelCreator = gameObject.GetComponent(LevelCreator);
	var tempArr : Array = GameObject.FindGameObjectsWithTag("Player");
	boxPositions =  new Transform[levelCreator.Data.numberOfCubes];
	
	for(var cube :GameObject in tempArr) {
		boxPositions[cube.GetComponent(BoxCollisionScript).MyIdNumber] = cube.transform;
		var sgdu : int = cube.GetComponent(BoxCollisionScript).MyIdNumber;
	}
	cogarcSkin = Resources.Load("GUISkins/cogARC");
	wrapText = new GUIStyle();
	wrapText.wordWrap = true;
	wrapText.fontSize = 45;
	var OnGridGUItextureA : Texture = Resources.Load("coloredtitle") as Texture; // images used for the grid-goal-visualizer
	var OnGridGUItextureB : Texture = Resources.Load("uncoloredtitle") as Texture; // images used for the grid-goal-visualizer
}

function Start() {
	if(levelCreator.Data.CubeDesignsArray && levelCreator.Data.RuleEnum == ruleFunction.Grid) {
		colorColored = (levelCreator.Data.CubeDesignsArray[0] as BoxDesign).BoxColor;
		colorUncolored = (levelCreator.Data.CubeDesignsArray[1] as BoxDesign).BoxColor;
	}
}

function Update () {
	if( !timerScript.TimesUp) 
	{
		killHintTimer -=  Time.deltaTime; //Only used for certain games.
	}								//A hint is displayed when this is greater than 0.
	else 
	{
		EndLevel();
	}
}

function ShowWrongMarker(pos : Transform){
		pos.gameObject.GetComponent(BoxCollisionScript).IWasWrongForOnce();
}

function ShowCorrectMarker(pos : Transform){
	pos.gameObject.GetComponent(BoxCollisionScript).IWasRightAllAlong();
}

function DrawRectangleForGridHint(rect : Rect, colored : boolean)
{
	var color : Color;
    var texture: Texture2D = new Texture2D(1, 1);
    if(colored){
    	color = colorColored;
    } else {
    	color = colorUncolored;
    }
    texture.SetPixel(0, 0, color);
    texture.wrapMode = TextureWrapMode.Repeat;
    texture.Apply();
    GUI.DrawTexture(rect, texture);
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

public function ruleSetup(isTextAnswerParam : boolean){
	isTextAnswer = isTextAnswerParam;
	
	switch(levelCreator.Data.RuleEnum) {
		case ruleFunction.Pair: 
			functionPointer = PairTester;
			functionPointerHintGUI = OnPresetStringGUI;
			break;
		case ruleFunction.Tower:
			functionPointer = TowerTester;
			functionPointerHintGUI = OnPresetStringGUI;
			break;
		case ruleFunction.Grid:
			functionPointer = GridTester;
			functionPointerHintGUI = OnGridGUI;
			if(levelCreator.Data.HintHasTimeLimit){
				killHintTimer = levelCreator.Data.CurrentGridHintValue;
			}
			break;
		case ruleFunction.HumanReadable: 
			functionPointer = HumanReadableTester;
			functionPointerHintGUI = OnPresetStringGUI;
			break;
	};
	
	if(isTextAnswer){
		switch(levelCreator.Data.CurrentSubRule) {
			case subRule.CompositeNumbers: 
				functionPointerSubRule = compositeNumbersTester;
				functionPointerHintGUI = OnCompositeGUI;
				break;
			case subRule.Addition:
				functionPointerSubRule = AdditionTester;
				functionPointerHintGUI = OnAdditionGUI;
				break;
			case subRule.WholeLiner:
				functionPointerSubRule = WholeLinerTester;
				break;
			case subRule.AnyWord:
				functionPointerSubRule = AnyWordTester;
				//functionPointerHintGUI = OnWoordsStringGUI;
				break;
			default : functionPointerSubRule = NULLFUNCTION;//this function does nothing
		}
	}
}
//Task Completion Tests
public function Test (boxes : List.<int>){
	//Boxes contains the id numbers of the boxes.
	//This code block test to make sure that you get the same input three times
	//	before it let you advance.
	if(timerScript.CheckToggleTimerActive() && levelCreator.Data.LevelLoaded == true) // should testing be done
	{
		if(levelCreator.Data.FinishState.Count > 0 && !timerScript.TimesUp )	//has this level been completed
		{
			//Saves the previous two game states.
			historyGameState3 = historyGameState2;
			historyGameState2 = historyGameState1;
			historyGameState1 = boxes.ToArray();
		
			if(!historyGameState3 || historyGameState3.length != historyGameState1.Length || historyGameState3.length != historyGameState2.length) {
				historyHasChangedFromBefore = true;
				return;
			}
			
			for(var c:int = 0 ; c < historyGameState1.length ; c ++) {
				if(historyGameState1[c] != historyGameState2[c] || historyGameState2[c] != historyGameState3[c]) {
					//Debug.Log("Unexpected CHANGE in HISTORY");
					historyHasChangedFromBefore = true;
					killHintOrder = true;// hides the hint when addition rule
					return;
				}
			}
			//Checking of history is done here
			if (!historyHasChangedFromBefore){
				return;
			}
			historyHasChangedFromBefore = false;

			functionPointer(boxes); //This is the testing
		}
		else // finishState is empty
		{		//congrats, save score, load next level
			EndLevel();
		}
	}
}

function EndLevel()
{
	levelCreator.Data.LevelLoaded = false;
	if(timerScript.CheckToggleTimerActive()) 
	{
		timerScript.ToggleTimerActive();
	}
	yield WaitForSeconds (2);
	HideGui();
	killHintOrder = true;// hides the hint when addition rule
	logScript.SendEvents();
	levelCreator.LoadLevel();
}

private function PairTester (boxes : List.<int>) {
	var q : int = 0;
	while(q+1 < historyGameState1.length){ 
		
		for(var r : int = 0; r < levelCreator.Data.FinishState.Count; r+=3){
			if((historyGameState1[q] == levelCreator.Data.FinishState[r] && historyGameState1[q + 1] == levelCreator.Data.FinishState[r + 1]) ||
				(historyGameState1[q + 1] == levelCreator.Data.FinishState[r] && historyGameState1[q] == levelCreator.Data.FinishState[r + 1])) 
			{
				if((q + 2 > historyGameState1.length && historyGameState1[q+2] != -1) || 
					q != 0 && historyGameState1[q-1] != -1) {
					//Debug.Log("UNexpected Third Part OF a PaiR");
					return;
				}
				//pair found
				ShowCorrectMarker(boxPositions[levelCreator.Data.FinishState[r]]);
				ShowCorrectMarker(boxPositions[levelCreator.Data.FinishState[r+1]]);
				timerScript.scoreBonus(levelCreator.Data.CorrectBonus);
				logScript.LogEvent(levelCreator.Data.FinishState.GetRange(r,2), CubesData,levelCreator.currentLevel, 1);
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
}

private function GridTester (boxes : List.<int>) {
	var tempString : String; //Because unity is being a Bitch.
	var tempInt : int;//Because unity is being a Bitch.
	for (var c : int = 0 ; c < levelCreator.Data.FinishState.Count ; c++)
	{
		tempString = CubesData[boxes[c]];//Because unity is being a Bitch.
		tempInt = parseInt(tempString);//Because unity is being a Bitch.
		if (c == boxes.Count || tempInt != levelCreator.Data.FinishState[c]) {
			for (var box : Transform in boxPositions){
				ShowWrongMarker(box); //on all the boxes used
			}
			logScript.LogEvent(boxes, CubesData,levelCreator.currentLevel, 2);

			timerScript.scoreBonus(-levelCreator.Data.CorrectBonus); // give negative bonus
			return;
		}
	}
	levelCreator.Data.FinishState.Clear();
	
	for (var box : Transform in boxPositions){
		ShowCorrectMarker(box); //On all the boxes used.
	}
	logScript.LogEvent(boxes, CubesData,levelCreator.currentLevel, 1);
	timerScript.scoreBonus(levelCreator.Data.CorrectBonus);
}

private function HumanReadableTester (boxes : List.<int>) {
	functionPointerSubRule(boxes);
}


private function compositeNumbersTester(boxes : List.<int>){
	var c : int = 0;
	var tempIntCaster : int = 0;
	var numberOfDegits : int = 0;
	while(c < boxes.Count )
	{
		if(boxes[c] == -1) { //Try next "word".
			tempIntCaster = 0;
			numberOfDegits = 0;
		
		} else {
			tempIntCaster *= 10; //The old state is multiplied by 10, this does nothing the first time (0 * 10 = 0) in each word
			numberOfDegits ++; // counting number of digits in the current.
			tempIntCaster += parseInt(CubesData[boxes[c]] as String);
		
			if(tempIntCaster == levelCreator.Data.FinishState[0] //If the answer is right and you used enough cubes and not to many.
				&& numberOfDegits == levelCreator.Data.CurrentNumberOfBoxesUsedForTask) 
			{
				for(var l : int = c ; l > c - numberOfDegits ; l --)
				{
					ShowCorrectMarker(boxPositions[boxes[l]]); //on all the boxes used
				}
				logScript.LogEvent(boxes.GetRange(c-numberOfDegits + 1,numberOfDegits), CubesData,levelCreator.currentLevel, 1);

				timerScript.scoreBonus(levelCreator.Data.CorrectBonus);
				levelCreator.Data.FinishState.Clear();
				return;
			}
		}
		c++;
	}
}

private function AdditionTester(boxes : List.<int>){
	var c : int = 0;
	var answer : int = 0;
	var tempIntCaster : int = 0;
	var letterCount : int = 0;
	while(c < boxes.Count && letterCount < levelCreator.Data.CurrentNumberOfBoxesUsedForTask){
		while(boxes[c]!=-1 && letterCount < levelCreator.Data.CurrentNumberOfBoxesUsedForTask) {
			tempIntCaster = parseInt(CubesData[boxes[c]] as String);
			answer += tempIntCaster;
			letterCount++;
			c++;
		}
		SetAdditionHintActive(answer + "", boxPositions[boxes[(c - letterCount)]]);

		if(letterCount == levelCreator.Data.CurrentNumberOfBoxesUsedForTask) {		
			if(answer == levelCreator.Data.FinishState[0]) {
				for(var pk : int = 0 ; pk < levelCreator.Data.CurrentNumberOfBoxesUsedForTask ; pk++){
					ShowCorrectMarker(boxPositions[boxes[(c - pk-1)]]); //on all the boxes used
				}
				logScript.LogEvent(
					boxes.GetRange(c-levelCreator.Data.CurrentNumberOfBoxesUsedForTask ,
					levelCreator.Data.CurrentNumberOfBoxesUsedForTask),
					CubesData,levelCreator.currentLevel ,
					1
					);

				timerScript.scoreBonus(levelCreator.Data.CorrectBonus);		
				levelCreator.Data.FinishState.Clear();

				return;
			} else { // else give a penalty? penalty in this game is overpowered so we removed it
				//timerScript.scoreBonus(-levelCreator.Data.CorrectBonus);		
			}
		}
		letterCount = 0;
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
	for(var pk : int = 0 ; pk < boxes.Count ; pk++){
		ShowCorrectMarker(boxPositions[boxes[pk]]); //on all the boxes used
	}
	logScript.LogEvent(boxes,CubesData,levelCreator.currentLevel ,1);
	levelCreator.Data.FinishState.Clear();
	timerScript.scoreBonus(levelCreator.Data.CorrectBonus);
}

private function AnyWordTester(boxes : List.<int>){ 
//NB: checks if current state contains the finishstate-word. 
/*eks: if "1,2,3,-1,5,8,9,6,-1" contains "5,8,9,6" - True
								contains "5,8,9" - False
								contains "5,8,9,6,2" - False
								contains "1,2,3" - True
Note: only the word starting at index 0 of the finishstate will be used for testing
*/
	var inIndex:int = 0;
	var finIndex:int = 0;	
	var logPostWoord : List.<int> = new List.<int>(); // simonLogging	

	while(inIndex < boxes.Count)
	{
		while(finIndex < levelCreator.Data.FinishState.Count)
		{
			var wordFound:boolean = false;
			if(CubesData[boxes[inIndex]] == CubesData[levelCreator.Data.FinishState[finIndex]]){// finds a possible start of this word
				var tempInIndex:int = inIndex;
				var tempFinIndex:int = finIndex;
				// while boxes follows the pattern of this word
				while(tempInIndex < boxes.Count && tempFinIndex < levelCreator.Data.FinishState.Count 
				&& CubesData[boxes[tempInIndex]] + "" == CubesData[levelCreator.Data.FinishState[tempFinIndex]] + "" ) {
						
					tempInIndex ++;
					tempFinIndex ++;
					if(levelCreator.Data.FinishState[tempFinIndex] == -1 && boxes[tempInIndex] == -1) //If a -1 is found for both at the same time we will have a correct word.
					{
						wordFound = true;
						while (tempFinIndex < levelCreator.Data.FinishState.Count && levelCreator.Data.FinishState[tempFinIndex] == -1)
						{
							levelCreator.Data.FinishState.RemoveAt(tempFinIndex); //Delete the -1 after the word and additional -1's after the word, this last part will mostly be skipped.
						}
						
						completedWoords.Insert(0,-1);// simonLogging
						
						while ((tempFinIndex - 1) < levelCreator.Data.FinishState.Count && tempFinIndex > 0 && levelCreator.Data.FinishState[tempFinIndex-1] != -1) 
						{
							tempFinIndex--;
							timerScript.scoreBonus(levelCreator.Data.CorrectBonus);
							completedWoords.Insert(0,levelCreator.Data.FinishState[tempFinIndex]); // simonLogging
							logPostWoord.Insert(0,completedWoords[0]); // simonLogging
							ShowCorrectMarker(boxPositions[levelCreator.Data.FinishState[tempFinIndex]]); //On all the boxes used
							levelCreator.Data.FinishState.RemoveAt(tempFinIndex); // remove the word it self, here we can count points for letters.
							
						}
						logScript.LogEvent(logPostWoord,CubesData,levelCreator.currentLevel ,1);// simonLogging
						return; //Because I don't want to check if you have more than one word correct in the same frame.
						
					} else { 
						if(levelCreator.Data.FinishState[tempFinIndex] == -1 || boxes[tempInIndex] == -1) //Else did one of the words end?
						{
							//If so skip both to the next word.
							while(tempFinIndex < levelCreator.Data.FinishState.Count && levelCreator.Data.FinishState[tempFinIndex] != -1){
								tempFinIndex++;
							}
							while(tempInIndex < boxes[tempInIndex] && boxes[tempInIndex] != -1){
								tempInIndex++;
							}
							tempFinIndex++;
							tempInIndex++;
						}
					}
				}	
			}
			if(!wordFound){ // if the word was found it will already be ready for the next word.
				while (levelCreator.Data.FinishState[finIndex] != -1)//otherwise skip to next word,finishstate
				{
					finIndex++;
				}
				finIndex++;
			}
		}
		//::::::::::::::::::::::::::::::::::: simonLogging ::::::::bigchunk
		for(var simonSays : int = 0 ; simonSays < completedWoords.Count; simonSays++) {
			if( simonSays == 0 || completedWoords[simonSays-1] == -1)
			{ // the beginning of a word
				if(completedWoords[simonSays] != -1 && boxes[inIndex] != -1 && CubesData[completedWoords[simonSays]] == CubesData[boxes[inIndex]])
				{
					var loggingTempIndex : int = 0;
					while(
					 simonSays + loggingTempIndex < completedWoords.Count &&
					 inIndex + loggingTempIndex < boxes.Count &&
					 completedWoords[simonSays + loggingTempIndex] != -1 &&
					 boxes[inIndex + loggingTempIndex] != -1 &&
					 CubesData[completedWoords[simonSays + loggingTempIndex]] == CubesData[boxes[inIndex + loggingTempIndex]])
					{
						logPostWoord.Add(completedWoords[simonSays + loggingTempIndex]);
						loggingTempIndex ++;
						if(completedWoords[simonSays + loggingTempIndex] == -1 && boxes[inIndex + loggingTempIndex] == -1) 
						{
							// woord found
							
							
							
							if(!logScript.EqualsLastLoggedWord(logPostWoord,CubesData)){
								logScript.LogEvent(logPostWoord,CubesData,levelCreator.currentLevel ,1);// simonLogging
							}

						}	else 
						{
							if (completedWoords[simonSays + loggingTempIndex] == -1 || boxes[inIndex + loggingTempIndex] == -1) {
							// one of the woords ended
								loggingTempIndex += completedWoords.Count; 
								logPostWoord.Clear();
							}
						}
					}
				}
			}
		}
				//::::::::::::::::::::::::::::::::::: simonLogging ::::::::bigchunk [END]

		while (boxes[inIndex] != -1)//Skip to next word,currentstate.
		{
			inIndex++;
		}
		inIndex++;
		finIndex = 0;
	}
}

function NULLFUNCTION() {
	//This function does nothing.
	return;
}

function NULLFUNCTION(boxes : List.<int>) {
	//This function does nothing.
	return;
}

function SetAdditionHintActive(Total : String,pos : Transform){
	
	killHintPos = myMainCamera.WorldToScreenPoint(pos.position);
	killHintString = Total;
	killHintOrder = false;
	
}

function HideGui() {
	hideGui = true;
}

function ShowGui() {
	hideGui = false;
}

function OnGUI () {
	if(Time.timeScale == 0 || hideGui){
		return;
	}
	//GUI.Box (Rect (200,50,DebugText.Length*10,20),DebugText,wrapText);

	GUI.skin = cogarcSkin;
	GUI.skin.box.fontSize = 50;
	guiBoxPosition = Rect(230,15, Screen.width - 640, 150);
	if( GUI.Button( Rect(0,70, 220, 60), "Surrender!" ) )
	{
		timerScript.scoreBonus(-levelCreator.Data.CorrectBonus); //penalty
		EndLevel();		
	}
	functionPointerHintGUI();
}

function OnAdditionTotalGUI () {
	OnPresetStringGUI();
}

function OnPresetStringGUI () {
		GUI.Box (guiBoxPosition,levelCreator.Data.LevelGoalText,wrapText);
}
function OnWoordsStringGUI () {
//		GUI.Box (guiBoxPosition,levelCreator.Data.LevelGoalText + " " + levelCreator.Data.WoordsSubject + ".",wrapText);
}
function OnAdditionGUI () {
	 //Display answer for task and number of cubes to be used.
 	if(levelCreator.Data.FinishState.Count > 0){
	 	var tempString : String;
	 	tempString =  "Use " + levelCreator.Data.CurrentNumberOfBoxesUsedForTask + " boxes to add up to the target value: " + levelCreator.Data.FinishState[0];
		GUI.Box (guiBoxPosition,tempString,wrapText);
		
		if(!killHintOrder) { //If "the order" to "kill" the hint has not been given, display the hint.
			GUI.Box(new Rect(killHintPos.x,Screen.height - killHintPos.y, 120, 25), "Your Total was " + killHintString,wrapText);
		}
	}
}

function OnCompositeGUI () {
	 //Display answer for task and number of cubes to be used.
	 if(levelCreator.Data.FinishState.Count > 0){
	 	var tempString : String;
	 	tempString =  "Use " + levelCreator.Data.CurrentNumberOfBoxesUsedForTask + " boxes to spell the target number: "
	 	 + levelCreator.Data.FinishState[0];
		GUI.Box (guiBoxPosition,tempString,wrapText);
	}
}

function OnGridGUI () {
	//Display hit and show complete-state for grid for set amount of time.
	//Only show while time is running and time has not run out or while time is running and you have infinete time .
	if((!levelCreator.Data.HintHasTimeLimit || killHintTimer > 0) && Time.timeScale > 0) {
		
		var x1 : int = 20;
		var y1 : int = 20;
		var width : int = Screen.width - 2 * x1;
		var height : int = Screen.height / 4; // this is the height of the goal-box- 
										//frame and also the
										//height of the grid-goal-visualizer.
		var margine : int = 5; //increasing this will make the grid-goal-visualizer smaller.
	
		GUI.Box (guiBoxPosition,"");
		if(levelCreator.Data.RuleEnum == ruleFunction.Grid) {
			var scaleX : int = (height-margine) / 3 - margine;
			var scaleY : int = scaleX;
			var i : int = 0;
			for(var c:int = 0; c < 3 ; c++) {
				var figy : int = y1 + (scaleY + margine) * c + margine;
				for(var q :int = 0; q < 3 ; q++) {
					var figx : int = x1 + (scaleX + margine) * q + margine;
					if(levelCreator.Data.FinishState[i] == 1) {
						DrawRectangleForGridHint(Rect(figx,figy,scaleX,scaleY), true);
					} else {
						DrawRectangleForGridHint(Rect(figx,figy,scaleX,scaleY), false);
					}
					i++;
				}
			}
		}
		figx +=  scaleX + margine * 2;
		if(levelCreator.Data.HintHasTimeLimit){
			GUI.Box (Rect (figx,y1,width - figx,height),"The figure will disappear in " + Mathf.RoundToInt(killHintTimer) + " seconds.",wrapText);
		} else 
		{
			GUI.Box (Rect (figx,y1,width - figx,height),"You have no time-limit.\n Just place the cubes as you see on the figure as fast as possible.",wrapText);
		}
	}
}

function GetCubesData () : Array {
	var tempArray : Array = new Array();
	for(var a : String in CubesData){
		tempArray.Push(a);
	}
	return tempArray;
}














//

