﻿#pragma strict
private var functionPointer : Function = NULLFUNCTION;
private var functionPointerSubRule : Function = NULLFUNCTION;
private var functionPointerHintGUI : Function = NULLFUNCTION;
//Enum defined in LevelCreator.js
//private enum ruleFunction {Tower, Row, Grid, HumanReadable, Calculus};

private var levelCreator : LevelCreator;

private	var outputTextC : UnityEngine.TextMesh;
private	var outputTextC2 : UnityEngine.TextMesh;
private	var outputTextC3 : UnityEngine.TextMesh;
private var DebugText : String = "Arne";

private var isTextAnswer : boolean; 

private static var historyHasChangedFromBefore : boolean = true; // if the boxes has been moved since last test()
private static var historyGameState1 : int[];
private static var historyGameState2 : int[]; //these are check against eachother to stabilize the inputdata
private static var historyGameState3 : int[]; //tests are only done when all 3 are the same

private static var colorColored : Color;
private static var colorUncolored : Color;

private static var killHintOrder : boolean = true;// hint is displayed while this is false;
private static var killHintTimer : float;// hint is displayed when this is greater than 0 or -1;
private static var killHintString : String;
private static var killHintPos : Vector3;
private static var myMainCamera : Camera;

private var boxPositions : Transform[];

public var CubesData : Array;		//local copy of the data contained in the 

function Awake() {
	myMainCamera = GameObject.Find("ARCamera 1").camera;
	levelCreator = gameObject.GetComponent(LevelCreator);
	var tempArr : Array = GameObject.FindGameObjectsWithTag("Player");
	boxPositions =  new Transform[levelCreator.Data.numberOfCubes];
	for(var cube :GameObject in tempArr) {
		boxPositions[cube.GetComponent(BoxCollisionScript).MyIdNumber] = cube.transform;
	}
	
	
	
	
}
function Start() {
	if(levelCreator.Data.CubeDesignsArray && levelCreator.Data.RuleEnum == ruleFunction.Grid) {
		colorColored = (levelCreator.Data.CubeDesignsArray[0] as BoxDesign).BoxColor;
		colorUncolored = (levelCreator.Data.CubeDesignsArray[1] as BoxDesign).BoxColor;
	}

}

function Update () {
	if( !gameObject.GetComponent(TimerAndScore).TimesUp) 
	{
		var currentState : String = ""; 
		for(var d : int  = 0 ; d < levelCreator.Data.FinishState.Count ; d++) {
			currentState += levelCreator.Data.FinishState[d] + " ";
		}
		killHintTimer -=  Time.deltaTime; // only used for certain games but i don't want branching
	}								// hint is displayed when this is greater than 0;
	else 
	{
		gameObject.GetComponent(TimerAndScore).ResetTimeAndAddAsBonus();
		gameObject.GetComponent(TimerAndScore).ToggleTimerActive();
		levelCreator.LoadLevel();
	}
// outputTextC.text = currentState;
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

function OnGUI () {
	GUI.Box (Rect (200,50,DebugText.Length*10,20),DebugText);
	functionPointerHintGUI();
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
				break;
			default : functionPointerSubRule = NULLFUNCTION;//this function does nothing
		}
	}
}

//Task Completion Tests

public function Test (boxes : List.<int>){
	//boxes contains the id numbers of the boxes
	//This code block test to make sure that you get the same input three times
	//	before it let you advance
	if(gameObject.GetComponent(TimerAndScore).CheckToggleTimerActive()) {
		if(levelCreator.Data.FinishState.Count > 0 && !gameObject.GetComponent(TimerAndScore).TimesUp){
	
			historyGameState3 = historyGameState2;
			historyGameState2 = historyGameState1;
			historyGameState1 = boxes.ToArray();
		
			if(!historyGameState3 || historyGameState3.length != historyGameState1.Length || historyGameState3.length != historyGameState2.length) {
				historyHasChangedFromBefore = true;
				return;
			}
			
			for(var c:int = 0 ; c < historyGameState1.length ; c ++) {
				if(historyGameState1[c] != historyGameState2[c] || historyGameState2[c] != historyGameState3[c]) {
					Debug.Log("Unexpected CHANGE in HISTORY");
					historyHasChangedFromBefore = true;
					killHintOrder = true;// hides the hint when addition rule

					return;
				}
			}
			if (!historyHasChangedFromBefore){
				return;
			}
			historyHasChangedFromBefore = false;

			//Checking of history is done here
		 
			functionPointer(boxes); //This is the testing
		}
		else // finishState is empty
		{		//congrats, save score, load next level
			gameObject.GetComponent(TimerAndScore).ResetTimeAndAddAsBonus();
			gameObject.GetComponent(TimerAndScore).ToggleTimerActive();
			yield WaitForSeconds (1);
			
			levelCreator.LoadLevel();
		}
	}
	
}

private function PairTester (boxes : List.<int>) {
	var q : int = 0;
	while(q+1 < historyGameState1.length){ 
		
		for(var r : int = 0; r < levelCreator.Data.FinishState.Count; r+=3){
			if((historyGameState1[q] == levelCreator.Data.FinishState[r] && historyGameState1[q + 1] == levelCreator.Data.FinishState[r + 1]) ||
				(historyGameState1[q + 1] == levelCreator.Data.FinishState[r] && historyGameState1[q] == levelCreator.Data.FinishState[r + 1])) 
			{
				if(q + 2 > historyGameState1.length && historyGameState1[q+2] != -1) {
					Debug.Log("UNexpected Third Part OF a PaiR");
					return;
				}
				//pair found
				//light flares at the cubes with IDs levelCreator.Data.FinishState[r] and levelCreator.Data.FinishState[r+1]

				ShowCorrectMarker(boxPositions[levelCreator.Data.FinishState[r]]);
				ShowCorrectMarker(boxPositions[levelCreator.Data.FinishState[r+1]]);
				Debug.Log("SUCCESS GOAL MET!!!!!!!!!!!!");
				gameObject.GetComponent(TimerAndScore).scoreBonus(levelCreator.Data.CorrectBonus);
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
			gameObject.GetComponent(TimerAndScore).scoreBonus(-levelCreator.Data.CorrectBonus); // give negative bonus
			return;
		}
	}
	levelCreator.Data.FinishState.Clear();
	
	for (var box : Transform in boxPositions){
		ShowCorrectMarker(box); //on all the boxes used
	}
	gameObject.GetComponent(TimerAndScore).scoreBonus(levelCreator.Data.CorrectBonus);
	Debug.Log("SUCCESS GOAL MET!!!!!!!!!!!!");
}

private function HumanReadableTester (boxes : List.<int>) {
	functionPointerSubRule(boxes);
}


private function compositeNumbersTester(boxes : List.<int>){
	var c : int = 0;
	var answer : int = 0;
	var tempIntCaster : int = 0;
	while(c < boxes.Count && c < levelCreator.Data.FinishState.Count - 1)
	{
		tempIntCaster *= 10;
		tempIntCaster += parseInt(CubesData[boxes[c]] as String);
		c++;
	}
	if(tempIntCaster == levelCreator.Data.FinishState[0]) {
			Debug.Log("SUCCESS GOAL MET!!!!!!!!!!!!");
			for(var pk : int = 0 ; pk < c ; pk++){
				ShowCorrectMarker(boxPositions[boxes[pk]]); //on all the boxes used
				gameObject.GetComponent(TimerAndScore).scoreBonus(levelCreator.Data.CorrectBonus);

			}
			levelCreator.Data.FinishState.Clear();
			return;
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
		if(letterCount == levelCreator.Data.CurrentNumberOfBoxesUsedForTask) {
			SetAdditionHintActive(answer + "", boxPositions[boxes[(c - levelCreator.Data.CurrentNumberOfBoxesUsedForTask)]]);
		
			if(answer == levelCreator.Data.FinishState[0]) {
				for(var pk : int = 0 ; pk < levelCreator.Data.CurrentNumberOfBoxesUsedForTask ; pk++){
					ShowCorrectMarker(boxPositions[boxes[(c - pk-1)]]); //on all the boxes used
				}
				gameObject.GetComponent(TimerAndScore).scoreBonus(levelCreator.Data.CorrectBonus);		
				Debug.Log("SUCCESS GOAL MET!!!!!!!!!!!!");
				levelCreator.Data.FinishState.Clear();

				return;
			} else { // else give a penalty
				gameObject.GetComponent(TimerAndScore).scoreBonus(-levelCreator.Data.CorrectBonus);		

			
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
	levelCreator.Data.FinishState.Clear();
	gameObject.GetComponent(TimerAndScore).scoreBonus(levelCreator.Data.CorrectBonus);

	Debug.Log("SUCCESS GOAL MET!!!!!!!!!!!!");
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
	
	DebugText = "";
	
	for(var boxDebug : int in levelCreator.Data.FinishState) {
		if(boxDebug != -1)
			DebugText += CubesData[boxDebug] + " ";
		else {
			DebugText += ", ";
		}
	}
	
	while(inIndex < boxes.Count)
	{
		while(finIndex < levelCreator.Data.FinishState.Count)
		{
			var wordFound:boolean = false;
			if(CubesData[boxes[inIndex]] == CubesData[levelCreator.Data.FinishState[finIndex]]){// finds a possible start of this word
				var tempInIndex:int = inIndex;
				var tempFinIndex:int = finIndex;
				// while boxes follows the pattern of this word
				while(tempInIndex < boxes.Count 
				&& tempFinIndex < levelCreator.Data.FinishState.Count 
				&& CubesData[boxes[tempInIndex]] + "" == CubesData[levelCreator.Data.FinishState[tempFinIndex]] + "" 
				) {
					
					
					tempInIndex ++;
					tempFinIndex ++;
					if(levelCreator.Data.FinishState[tempFinIndex] == -1 && boxes[tempInIndex] == -1) // if a -1 is found for both at the same time we will have a correct word
					{
						wordFound = true;
						Debug.Log("SUCCESS GOAL MET!!!!!!!!!!!!");
						// this should actually work for words, we could just make a really loooooooooooooooong finishstate and I am gonna keep on rambelling for  a while to annoy Daniel, because i know he really hates these long comments and then i am gonna add a really important message at the very end. and here it is, do not, ever, ever, ever run this algorithm without at the end having a -1
						while (tempFinIndex < levelCreator.Data.FinishState.Count && levelCreator.Data.FinishState[tempFinIndex] == -1)
						{
							levelCreator.Data.FinishState.RemoveAt(tempFinIndex); // delete the -1 after the word and additional -1's after the word, this last part will mostly be skipped
						}
						while ((tempFinIndex - 1) < levelCreator.Data.FinishState.Count && tempFinIndex > 0 && levelCreator.Data.FinishState[tempFinIndex-1] != -1) 
						{
							tempFinIndex--;
							gameObject.GetComponent(TimerAndScore).scoreBonus(levelCreator.Data.CorrectBonus);

							ShowCorrectMarker(boxPositions[levelCreator.Data.FinishState[tempFinIndex]]); //on all the boxes used
							levelCreator.Data.FinishState.RemoveAt(tempFinIndex); // remove the word it self, here we can count points for letters
							
						}
						return; // because I don't want to check if you have more than one word correct in the same frame.
					} else { 
						if(levelCreator.Data.FinishState[tempFinIndex] == -1 || boxes[tempInIndex] == -1) //else did one of the words end?
						{
							//if so skip both to the next word
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
		while (boxes[inIndex] != -1)//skip to next word,currentstate
		{
			inIndex++;
		}
		inIndex++;
		finIndex = 0;
	}
}
			

		
		/*
		::::::::I WANT TO KEEP THIS UNTIL I KNOW THIS NEW THING WORKS
		while(CubesData[boxes[i]] == CubesData[levelCreator.Data.FinishState[c]] && boxes[i] != -1) {
			c++;
			i++;
			if(levelCreator.Data.FinishState[c] == -1 && boxes[i] == -1 && c > 1) {
				Debug.Log("SUCCESS GOAL MET!!!!!!!!!!!!");
				// ToDo: possibly, instead of Clear() we might just remove this word so 
				// that we can have more than one word in the solution. this should actually work for words, we could just make a really loooooooooooooooong finishstate and I am gonna keep on rambelling for  a while to annoy Daniel, because i know he really hates these long comments and then i am gonna add a really important message at the very end.
				
				for(var w: int = 0; w < c ; w++) {
					
				}
				
				levelCreator.Data.FinishState.Clear();
				return;
			}
		}
		i++;
	}
	*/

function NULLFUNCTION() {
	//this function does nothing
	return;
}

function NULLFUNCTION(boxes : List.<int>) {
	//this function does nothing
	return;
}


function SetAdditionHintActive(Total : String,pos : Transform){
	
	killHintPos = myMainCamera.WorldToScreenPoint(pos.position);
	killHintString = Total;
	killHintOrder = false;
	
}

function OnAdditionTotalGUI (TargetString) {
	OnPresetStringGUI();
	
}

function OnPresetStringGUI () {
// just show the text written in the inspector

}

function OnAdditionGUI () {
 //display answer for task and number of cubes to be used.
 if(levelCreator.Data.FinishState.Count > 0){
 		var x1 : int = 20;
		var y1 : int = 20;
		var width : int = Screen.width - 2 * x1;
		var height : int = Screen.height / 4;
	 	var tempString : String;
	 	tempString =  "Use " + levelCreator.Data.CurrentNumberOfBoxesUsedForTask + " boxes to add up to the target value: " + levelCreator.Data.FinishState[0];
		GUI.Box (Rect (x1,y1,width,height),tempString);
		
		if(!killHintOrder) { // if "the order" to "kill" the hint has not been given, display the hint.
			GUI.Box(new Rect(killHintPos.x,Screen.height - killHintPos.y, 120, 25), "Your Total was " + killHintString);
			
			
			//TODO::
		}
	}
}

function OnCompositeGUI () {
 //display answer for task and number of cubes to be used.
 if(levelCreator.Data.FinishState.Count > 0){
 		var x1 : int = 20;
		var y1 : int = 20;
		var width : int = Screen.width - 2 * x1;
		var height : int = Screen.height / 4;
	 	var tempString : String;
	 	tempString =  "Use " + levelCreator.Data.CurrentNumberOfBoxesUsedForTask + " boxes to spell the target number: " + levelCreator.Data.FinishState[0] + ". Sorry about the 6's and 9's you better try both... ";
		GUI.Box (Rect (x1,y1,width,height),tempString);
	}
}

function OnGridGUI () {
// display hit and show complete-state for grid for set amount of time
	if((!levelCreator.Data.HintHasTimeLimit || killHintTimer > 0) && Time.timeScale > 0) 
	{// only show while time is running and time has not run out or while time is running and you have infinete time 
																						
		var x1 : int = 20;
		var y1 : int = 20;
		var width : int = Screen.width - 2 * x1;
		var height : int = Screen.height / 4; // this is the height of the goal-box- 
										//frame and also the
										//height of the grid-goal-visualizer.
		var margine : int = 5; //increasing this will make the grid-goal-visualizer smaller.
		var textureA : Texture = Resources.Load("coloredtitle") as Texture; // images used for the grid-goal-visualizer
		var textureB : Texture = Resources.Load("uncoloredtitle") as Texture;
	
		GUI.Box (Rect (x1,y1,width,height),"");
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
			GUI.Box (Rect (figx,y1,width - figx,height),"The figure will disappear in " + Mathf.RoundToInt(killHintTimer) + " seconds.");
		} else 
		{
			GUI.Box (Rect (figx,y1,width - figx,height),"You have no time-limit.\n Just place the cubes as you see on the figure as fast as possible.");
		}
	}
}

