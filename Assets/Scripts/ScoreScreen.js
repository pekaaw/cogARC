#pragma strict
#pragma downcast

public var NumberOfScores : int = 10;
public var ButtonFontSize : int = 50;
public var LabelFontSize : int = 50;

private var ScoreScreenVisible = false;
private var timerAndScore : TimerAndScore;
private var ScoreScreenRect : Rect;
private var score : int;
private var scoreArray : Array = new Array();
private var scoresLoaded = false;
private var GuiSkin : GUISkin = null;
private var GameName : String = "";
private var playerName : String = "";
private var LabelStyle : GUIStyle;
	
// Set a light colour on the text since the background is dark
LabelStyle = new GUIStyle();
LabelStyle.normal.textColor = Color.white;
LabelStyle.fontSize = LabelFontSize;

function Awake() {
	timerAndScore = gameObject.GetComponent(TimerAndScore);
	GuiSkin = Resources.Load("GUISkins/cogARC");
	this.GameName = gameObject.GetComponent(LevelCreator).Data.GameName;
	playerName = PlayerPrefs.GetString("UserName");
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
	
		// Put a box that will cause the background to be darkened.
		GUI.Box( Rect(0, 0, Screen.width, Screen.height), "" );
		
		if(scoresLoaded == false){
			fillScoreArray();
			scoresLoaded = true;
		}
		ScoreScreenRect = Rect(350,25,Screen.width - 700, Screen.height - 50);
		
		// Set the overall skin
		GUI.skin = GuiSkin;
		
		// Set skin for the label (white text and bigger fontsize)
		GUI.skin.label = LabelStyle;
		

		GUILayout.BeginArea(ScoreScreenRect);
		GUILayout.BeginVertical("box");
		//Calls another function to deal with all the GUI stuff.
		ScoreScreenGUILayout();
		GUILayout.EndVertical();
		GUILayout.EndArea();

		GUI.skin.label.fontSize = Screen.height / 25;

		// Reset the skin to default
		GUI.skin.label = null;
	}
}

function ScoreScreenGUILayout() {
	var originalAlignment = GUI.skin.label.alignment;
	//Anchor that text to the middle!
	GUI.skin.label.alignment = TextAnchor.MiddleCenter;
	
	GUILayout.Label("Top " + NumberOfScores + " for :");
	GUILayout.Label(GameName);
	for(var i = 0; i < scoreArray.length; i++){
		GUILayout.Label("Number "+(i+1) + ": " + scoreArray[i].ToString());
		GUILayout.FlexibleSpace();
	}
	GUILayout.Label("Score this game: " + score);
	GUILayout.FlexibleSpace();
	
	//GUILayout.BeginHorizontal();
	GUILayout.BeginVertical();
	GUILayout.FlexibleSpace();
	if(GUILayout.Button("Play again!")){
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
	GUI.skin.label.alignment = originalAlignment;
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
	for(var o : int = 0; o < scoreHolder.length; o++){
		scoreArray[o] = scoreHolder[o];
	}
}

//Toggles the visibility of the Score Screen
function toggleScreenVisibility(){
	ScoreScreenVisible = !ScoreScreenVisible;
}

//This saves the scores so it can be loaded later.
function RegistrerScore() {
	score = timerAndScore.getScore();
	
	//This is because Unity is silly and won't let me
	// add something to a int[] object.
	var tempScoreArray : Array;
	tempScoreArray = scoreArray;
	if(!tempScoreArray || tempScoreArray.length == 0){
		tempScoreArray = new Array();
	}
	tempScoreArray.push(score);
	tempScoreArray.sort();
	tempScoreArray.reverse();
	
	var tempIntArray = new int[tempScoreArray.length];
	for(var i:int = 0; i < tempScoreArray.length; i++){
		tempIntArray[i] = tempScoreArray[i];
	}
	
	if(PlayerPrefsX.SetIntArray(playerName + " " + GameName, tempIntArray)) {
		PlayerPrefs.Save();
		scoresLoaded = false;
	};
	fillScoreArray();
}
