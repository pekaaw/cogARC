﻿#pragma strict

private var cogarcSkin : GUISkin;
private var isActive : boolean;
private var screenWidth : int;
private var screenHeight : int;
private var headlineBox 	: UnityEngine.Rect;
private var instructionBox 	: UnityEngine.Rect;
private var highscoreBox 	: UnityEngine.Rect;
private var startButtonBox 	: UnityEngine.Rect;
private var gameTitle : String;
private var gameHint : String;
private var gameLevels : int;
private var currentGameLevel : int;
private var CubeContainer : GameObject;
private var counter : int = 0;
private var wrapText : GUIStyle;
private var highScoreScores : Array;
private var timerScript : TimerAndScore;
private var pauseScript : PauseScreenScript;
private var ruleScript : Rule;
private var scoresLoaded : boolean;

function Awake() {
	cogarcSkin = Resources.Load("GUISkins/cogARC");
	wrapText = new GUIStyle();
	wrapText.wordWrap = true;
	wrapText.fontSize = 45;
	wrapText.normal.textColor = Color.white;
	timerScript = gameObject.GetComponent(TimerAndScore);
	//Load scores from player prefs file.
	
	loadScores();
	//highScoreScores = PlayerPrefsX.GetIntArray(userName + gameTitle);
	pauseScript = gameObject.GetComponent(PauseScreenScript);
	ruleScript = gameObject.GetComponent(Rule);
}

function Start () {
	screenWidth = Screen.width;
	screenHeight = Screen.height;
	setBoxSizes();
	scoresLoaded = false;
}


function Activate(header : String, hint : String, numberOfLevels : int, currentLevel : int) {
	
	CubeContainer = GameObject.Find("CubeContainer");
	if(!CubeContainer.transform.childCount){
		CubeContainer = GameObject.Find("FrameMarkerContainer");
	}
	gameTitle  = header;
	gameHint = hint;
	gameLevels  = numberOfLevels;
	currentGameLevel = currentLevel;
	pauseScript.Hide();
	timerScript.Hide();
	StopTime();
	isActive = true;
}  

function StopTime() {
	Time.timeScale = 0;
	CubeContainer.SetActive(false);
	if(timerScript.CheckToggleTimerActive())
	{
		timerScript.ToggleTimerActive();
	}
}
function StartTime() {
	Time.timeScale = 1;
	CubeContainer.SetActive(true);
	if(!timerScript.CheckToggleTimerActive())
	{
		timerScript.ToggleTimerActive();
	}
}

function OnGUI() {
	if(isActive) {
		GUI.skin = cogarcSkin;
		GUI.skin.label.fontSize = 70;
		GUI.skin.label.normal.textColor = Color.white;
		
		// Darken the background by putting in a box that cover the screen behind
		GUI.Box( Rect(0, 0, Screen.width, Screen.height ), "" );
		
		//Set screen size screen size has changed (example: orientation change).
		if( screenWidth != Screen.width  || screenWidth != Screen.width) {
			screenWidth = Screen.width;
			screenHeight = Screen.height;
			setBoxSizes();
		}
	
		GUI.Label(
			headlineBox,
			gameTitle + " (" + currentGameLevel + " / " + gameLevels + ")"
			);
			
		GUI.Box(
			instructionBox,
			gameHint,wrapText
			);
			
		highScore();
			
		if( GUI.Button( startButtonBox, "Start!" ) )
		{
			pauseScript.Show();
			timerScript.Show();
			ruleScript.ShowGui();
			isActive = false;
			StartTime();
		}
	}
}

function setBoxSizes() {
	headlineBox.x = screenWidth * 1/4;			// x = 25%
	headlineBox.y = screenHeight * 1/20;		// y = 5 %
	headlineBox.width = screenWidth * 1/2;		// width = 50%
	headlineBox.height = screenHeight * 30/100;	// height = 15%
	
	instructionBox.x = screenWidth * 1/15;		// x = 10/150
	instructionBox.y = screenHeight * 1/4;		// y = 25%
	instructionBox.width = screenWidth * 1/3;	// width = 1/3 of screen
	instructionBox.height = screenHeight * 1/2;	// heigh = 50%

	highscoreBox.x = screenWidth * 9/15;		// x = 3/5
	highscoreBox.y = screenHeight * 1/4;		// y = 25%
	highscoreBox.width = screenWidth * 1/3;		// width = 1/3 of screen
	highscoreBox.height = screenHeight * 2/3;	// height = 50%
	
	startButtonBox.x = screenWidth * 2/5;		// x = 2/5
	startButtonBox.y = screenHeight * 4/5;		// y = 80%;
	startButtonBox.width = screenWidth * 1/5;	// width = 1/5 of screen
	startButtonBox.height = screenHeight * 1/10;	// height = 10%
}

function highScore() {

	GUILayout.BeginArea(highscoreBox);
	
	var originalAlignment = GUI.skin.label.alignment;
	var originalLabelFontSize = GUI.skin.label.fontSize;
	//Anchor that text to the middle!
	GUI.skin.label.alignment = TextAnchor.MiddleCenter;   
	
	GUI.skin.label.fontSize = (highscoreBox.height / 20);
	
	//Testing to make sure that we have the amount of scores needed.
	if(!scoresLoaded){
		loadScores();
		scoresLoaded = true;
	}
	
	
	GUILayout.Label("Highscores:");
	for(var i = 0; i < highScoreScores.length; i++){
		GUILayout.Label("Number "+(i+1) + ": " + highScoreScores[i].ToString());
		GUILayout.FlexibleSpace();
	}
	//Resests the alignment of text to the usual Middle Left.
	GUI.skin.label.alignment = originalAlignment;
	GUILayout.EndArea();
}

private function loadScores() {
	var scoreHolder = new Array();
	var playerName : String = PlayerPrefs.GetString("UserName");
	scoreHolder = PlayerPrefsX.GetIntArray(playerName + " " + gameTitle);
	//Testing to make sure that we have the amount of scores needed.
	if(scoreHolder.length < 10){
		for(var i = scoreHolder.length; i < 10; i++){
			scoreHolder.Add(1);
			scoreHolder[i] = i * 10;
		}
	}
	scoreHolder.sort();
	//Gets the highest number at top.
	scoreHolder.reverse();
	
	Debug.LogWarning(scoreHolder);
	if(scoreHolder.length > 10){
		scoreHolder.length = 10;
	}
	
	highScoreScores = new Array();
	for( var q : int = 0; q < scoreHolder.length; q++){
		highScoreScores.Push(scoreHolder[q]);
	}
}
