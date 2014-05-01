#pragma strict
#pragma downcast

public var NumberOfScores : int = 10;
public var ButtonFontSize : int = 50;
public var LabelFontSize : int = 50;


private var timerAndScore : TimerAndScore;
private var pauseScript : PauseScreenScript;
private var gameSequence : GameSceneSequence;
private var loggerScript : EventLogger;

private var ScoreScreenVisible = false;
private var ScoreScreenRect : Rect;
private var score : int;
private var scoreArray : Array = new Array();
private var scoresLoaded = false;
private var GuiSkin : GUISkin = null;
private var GameName : String = "";
private var playerName : String = "";
private var LabelStyle : GUIStyle;
	
function Awake() {
	loggerScript = gameObject.GetComponent(EventLogger);
	gameSequence = GameObject.Find("SceneSequence").GetComponent(GameSceneSequence);
	pauseScript = gameObject.GetComponent(PauseScreenScript);
	timerAndScore = gameObject.GetComponent(TimerAndScore);
	GuiSkin = Resources.Load("GUISkins/cogARC");
	this.GameName = gameObject.GetComponent(LevelCreator).Data.GameName;
	playerName = PlayerPrefs.GetString("UserName");
	
	// Set a light colour on the text since the background is dark
	LabelStyle = GUIStyle(GuiSkin.label);
	//LabelStyle.normal.textColor = Color.white;
	//LabelStyle.fontSize = LabelFontSize;

}

function Start () {
	//Gives the game a name if there is no name
	if (GameName == ""){
		GameName = "Unnamed";
	}
	if (GameObject.Find("SceneSequence").GetComponent(GameSceneSequence).IsMultyLeveled())
	{
		GameName = "Multy Game Combo";
	}	
}

function OnGUI() {
	//If it is active
	if(ScoreScreenVisible){

		LabelStyle.fontSize = Screen.height / 25;
	
		// Put a box that will cause the background to be darkened.
		GUI.Box( Rect(0, 0, Screen.width, Screen.height), "" );
		
		if(scoresLoaded == false){
			fillScoreArray();
			scoresLoaded = true;
		}
		ScoreScreenRect = Rect(350,25,Screen.width - 700, Screen.height - 50);
		
		// Set the overall skin
		GUI.skin = GuiSkin;
		
		GUILayout.BeginArea(ScoreScreenRect);
		GUILayout.BeginVertical("box");
		//Calls another function to deal with all the GUI stuff.
		ScoreScreenGUILayout();
		GUILayout.EndVertical();
		GUILayout.EndArea();
	}
}

function ScoreScreenGUILayout() {
//	var originalAlignment = GUI.skin.label.alignment;
	//Anchor that text to the middle!
//	LabelStyle.alignment = TextAnchor.MiddleCenter;
//	GUI.skin.label.alignment = TextAnchor.MiddleCenter;
	
	GUILayout.Label("Top " + NumberOfScores + " for :", LabelStyle);
	GUILayout.Label(GameName, LabelStyle);
	for(var i = 0; i < scoreArray.length; i++){
		GUILayout.Label("Number "+(i+1) + ": " + scoreArray[i].ToString(), LabelStyle);
		GUILayout.FlexibleSpace();
	}
	GUILayout.Label("Score this game: " + score, LabelStyle);
	GUILayout.FlexibleSpace();
	
	//GUILayout.BeginHorizontal();
	GUILayout.BeginVertical();
	GUILayout.FlexibleSpace();
	if(GUILayout.Button("Play again!")){
		gameSequence.ReplayLevelHotFix();
		Application.LoadLevel(Application.loadedLevel);
	}
	
	GUILayout.FlexibleSpace();
	if(GUILayout.Button("Main Menu")){
		//Return to scene 0
		Application.LoadLevel(0);
	}
	GUILayout.FlexibleSpace();

	GUILayout.EndVertical();

	//Resests the alignment of text to the usual Middle Left.
//	GUI.skin.label.alignment = originalAlignment;
}

//This function fills the score array with data.
function fillScoreArray() {
	//Temp array for scores to avoid stupid editor errors.
	var scoreHolder = new Array();
	//Load scores from player prefs file.
	scoreHolder = PlayerPrefsX.GetIntArray(playerName + " " + GameName);
	//Testing to make sure that we have the amount of scores needed.
	if(scoreHolder.length < NumberOfScores){
		for(var i = scoreHolder.length; i < NumberOfScores; i++){
			scoreHolder.Add(1);
			scoreHolder[i] = i * 10;
		}
	}
	scoreHolder.sort();
	//Gets the highest number at top.
	scoreHolder.reverse();
	
	if(scoreHolder.length > NumberOfScores){
		scoreHolder.length = NumberOfScores;
	}
	//Copies the scores into the array we use in the rest of the script.
	//I do this because MonoDevelop won't find scoreArray in the rest of
	// the script and is giving me a lot of problems.
	scoreArray = new Array();
	for(var o : int = 0; o < scoreHolder.length; o++){
		scoreArray.push(scoreHolder[o]);
	}
}

//Toggles the visibility of the Score Screen
function toggleScreenVisibility(){
	ScoreScreenVisible = !ScoreScreenVisible;
	if(ScoreScreenVisible){
		pauseScript.Hide();
	} else {
		pauseScript.Show();
	}
}

//This saves the scores so it can be loaded later.
function RegistrerScore() {
	score = timerAndScore.getScore();
	loggerScript.PostScore(score);
	
	//This is because Unity is silly and won't let me
	// add something to a int[] object.
	var tempScoreArray : Array = new Array();
	scoreArray = PlayerPrefsX.GetIntArray(playerName + " " + GameName);
	for(var tempObject : int in scoreArray) {
		tempScoreArray.push(tempObject);
	}
	
	tempScoreArray.push(score);
	tempScoreArray.sort();
	tempScoreArray.reverse();
	
	var tempIntArray = tempScoreArray.ToBuiltin(int);
	
	if(PlayerPrefsX.SetIntArray(playerName + " " + GameName, tempIntArray)) {
		PlayerPrefs.Save();
		scoresLoaded = false;
	};
	fillScoreArray();
}
