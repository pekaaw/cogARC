#pragma strict
#pragma downcast

public var ScoreScreenVisible = false;
public var GameName : String = "";
public var NumberOfScores : int = 10;
public var GuiSkin : GUISkin = null;
public var ButtonFontSize : int = 50;
public var LabelFontSize : int = 50;
var timerAndScore : TimerAndScore;

private var ScoreScreenRect : Rect;
private var score : int;
private var scoreArray : int[];
private var scoresLoaded = false;

function Awake() {
	timerAndScore = gameObject.GetComponent(TimerAndScore);

}


function Start () {
	//Gives the game a name if there is no name
	if (GameName == ""){
		GameName = "Unnamed";
	}
	ScoreScreenRect = Rect((Screen.width/2) - 720/2,15,720, 1000);	
}

function OnGUI() {
	//If it is active
	if(ScoreScreenVisible){
	
		if(scoresLoaded == false){
			fillScoreArray();
			scoresLoaded = true;
		}
		
		GUI.skin = GuiSkin;
		var originalButtonSize = GUI.skin.button.fontSize;
		var originalLabelSize = GUI.skin.label.fontSize;
		GUI.skin.button.fontSize = ButtonFontSize;
		GUI.skin.label.fontSize = LabelFontSize;
		
		GUILayout.BeginArea(ScoreScreenRect);
		GUILayout.BeginVertical("box");
		//Calls another function to deal with all the GUI stuff.
		ScoreScreenGUILayout();
		GUILayout.EndVertical();
		GUILayout.EndArea();
		GUI.skin.label.fontSize = originalLabelSize;
		GUI.skin.button.fontSize = originalButtonSize;
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
	GUILayout.BeginHorizontal();
	GUILayout.FlexibleSpace();
	if(GUILayout.Button("Play again!")){
		//Do something
	}
	GUILayout.FlexibleSpace();
	if(GUILayout.Button("Main Menu")){
		//Return to scene 0
		Application.LoadLevel(0);
	}GUILayout.FlexibleSpace();
	//if(GUILayout.Button("Next Game")){
	//	//Yeah!
	//}
	
	GUILayout.EndHorizontal();

	//Resests the alignment of text to the usual Middle Left.
	GUI.skin.label.alignment = originalAlignment;
}

//This function fills the score array with data.
function fillScoreArray() {
	//Temp array for scores to avoid stupid editor errors.
	var scoreHolder = new Array();
	
	//Load scores from player prefs file.
	scoreHolder = PlayerPrefsX.GetIntArray(GameName);
	
	scoreHolder.sort();
	//Gets the highest number at top.
	scoreHolder.reverse();
	
	//Testing to make sure that we have the amount of scores needed.
	if(scoreHolder.length < NumberOfScores){
		for(var i = scoreHolder.length; i < NumberOfScores; i++){
			scoreHolder.Add(i);
			scoreHolder[i] = i;
		}
	}
		
	if(scoreHolder.length > NumberOfScores){
		scoreHolder.length = NumberOfScores;
	}
	//Copies the scores into the array we use in the rest of the script.
	//I do this because MonoDevelop won't find scoreArray in the rest of
	// the script and is giving me a lot of problems.
	scoreArray = scoreHolder;
}

//Toggles the visibility of the Score Screen
function toggleScreenVisibility(){
	ScoreScreenVisible = !ScoreScreenVisible;
}

//This is run on quit
//This saves the scores so it can be loaded later.
function OnApplicationQuit() {
	var score : int;
	score = timerAndScore.getScore();
	
	//This is because Unity is silly and won't let me
	// add something to a int[] object.
	var tempScoreArray : Array;
	tempScoreArray = scoreArray;
	if(tempScoreArray.length == 0){
		return;
	}
	tempScoreArray.push(score);
	
	var tempIntArray = new int[tempScoreArray.length];
	for(var i:int = 0; i < tempScoreArray.length; i++){
		tempIntArray[i] = tempScoreArray[i];
		Debug.Log(i);
	}
	
	var succes = PlayerPrefsX.SetIntArray(GameName, tempIntArray);
	if(succes == false){
		Debug.Log("Didn't save!");
	}
}

