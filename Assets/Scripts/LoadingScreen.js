#pragma strict

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
//private var wrapText : GUIStyle;
//private var centerText : GUIStyle;

private var headlineStyle : GUIStyle;
private var instructionStyle : GUIStyle;
private var scoreStyle : GUIStyle;
private var highscoreStyle : GUIStyle;

private var highScoreScores : Array;
private var timerScript : TimerAndScore;
private var pauseScript : PauseScreenScript;
private var ruleScript : Rule;
private var scoresLoaded : boolean;

function Awake() {
	cogarcSkin = Resources.Load("GUISkins/cogARC");
	
	headlineStyle = GUIStyle(cogarcSkin.label);
	headlineStyle.fontSize = 70;
	headlineStyle.alignment = TextAnchor.MiddleCenter;
	
	instructionStyle = GUIStyle(cogarcSkin.label);
	instructionStyle.wordWrap = true;
	instructionStyle.fontSize = 45;
	
	highscoreStyle = GUIStyle(cogarcSkin.label);
	highscoreStyle.alignment = TextAnchor.MiddleCenter;

//	wrapText = new GUIStyle();
//	wrapText.wordWrap = true;
//	wrapText.fontSize = 45;
//	wrapText.normal.textColor = Color.white;
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

	// Reload skin
	cogarcSkin = Resources.Load("GUISkins/cogARC");

	gameTitle = header;
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
		//cogarcSkin.label.normal.textColor = Color.white; // hack to get right color
		GUI.skin = cogarcSkin;
		//GUI.skin.label.fontSize = 70;

		// Darken the background by putting in a box that cover the screen behind
		GUI.Box( Rect(0, 0, Screen.width, Screen.height ), "" );
		
		//Set screen size screen size has changed (example: orientation change).
		if( screenWidth != Screen.width  || screenWidth != Screen.width) {
			screenWidth = Screen.width;
			screenHeight = Screen.height;
			setBoxSizes();
		}

		// Print headline
		GUI.Label(
			headlineBox,
			gameTitle + " (" + currentGameLevel + " / " + gameLevels + ")",
			headlineStyle
			);
		
		// Print instructions
		GUI.Box(
			instructionBox,
			gameHint,
			instructionStyle
			);
		
		// Print highscore
		highScore();

		// Button to start game
		if( GUI.Button( startButtonBox, "Start!" ) )
		{
			pauseScript.Show();
			timerScript.Show();
			ruleScript.ShowGui();
			isActive = false;
			StartTime();
		}

		// Give a button to go back to main menu
		if( GUILayout.Button("Main Menu") ) {
			Application.LoadLevel(0);
		}
	}
}

function setBoxSizes() {
	headlineBox.x = 0;							// x = 0%
	headlineBox.y = screenHeight * 1/20;		// y = 5 %
	headlineBox.width = screenWidth;			// width = 100%
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
	
	// Set fontSize according to availible space
	highscoreStyle.fontSize = (highscoreBox.height / 20);
	
	//Testing to make sure that we have the amount of scores needed.
	if(!scoresLoaded){
		loadScores();
		scoresLoaded = true;
	}
	
	// Print the Highscores for this level
	GUILayout.Label("Highscores:");
	for(var i = 0; i < highScoreScores.length; i++){
		GUILayout.Label("Number "+(i+1) + ": " + highScoreScores[i].ToString(), highscoreStyle);
		GUILayout.FlexibleSpace();
	}

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
