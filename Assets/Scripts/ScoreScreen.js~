#pragma strict
#pragma downcast

public var ScoreScreenVisible = false;
public var GameName : String = "";
public var TimeScoreMultiplier : float = 0.9f;
public var NumberOfScores : int = 10;
public var ScoreScreenRect = Rect(200,200,310,250);
public var testFunction : function();

private var startTime : int;
private var endTime : int;
private var score : double;
private var scoreArray : int[];
private var scoresLoaded = false;

function Start () {
	//Gives the game a name if there is no name
	if (GameName == ""){
		GameName = "Unnamed";
	}
	//Sets start time so it can be used to calculate score.
	startTime = Time.time;
	endTime = startTime;
}

function OnGUI() {
	//If it is active
	if(ScoreScreenVisible){
	
		if(scoresLoaded == false){
			fillScoreArray();
			scoresLoaded = true;
		}
		
		GUILayout.BeginArea(ScoreScreenRect);
		GUILayout.BeginVertical("box");
		//Calls another function to deal with all the GUI stuff.
		ScoreScreenGUILayout();
		GUILayout.EndVertical();
		GUILayout.EndArea();	
	}
}

function ScoreScreenGUILayout() {
	//Write a neat function that will show scores and shit here!
	// YEAH! Layout and shit
	//Anchor that text to the middle!
	GUI.skin.label.alignment = TextAnchor.MiddleCenter;   
	
	GUILayout.Label("Top ten scores for " + GameName);
	for(var i = 0; i < scoreArray.length; i++){
		GUILayout.Label("Number "+(i+1) + ": " + scoreArray[i].ToString());
	}
	//Resests the alignment of text to the usual Middle Left.
	GUI.skin.label.alignment = TextAnchor.MiddleLeft;
	
	GUILayout.BeginHorizontal();
	//SOME FUCKIN BUTTONS
	if(GUILayout.Button("Play again!")){
		//Do something
	}
	if(GUILayout.Button("Main Menu")){
		//Return to scene 0
		Application.LoadLevel(0);
	}
	if(GUILayout.Button("Reset")){
		//Yeah!
		
	}
	
	GUILayout.EndHorizontal();
}

//This function fills the score array with data.
function fillScoreArray() {
	//Temp array for scores to avoid stupid editor errors.
	var scoreHolder = new Array();
	
	//Load scores from player prefs file.
	scoreHolder = PlayerPrefsX.GetIntArray(GameName);
	
	//Testing to make sure that we have the amount of scores needed.
	if(scoreHolder.length < NumberOfScores){
		for(var i = scoreHolder.length; i < NumberOfScores; i++){
			Debug.Log(scoreHolder.toString());
			scoreHolder.Add(i);
			scoreHolder[i] = i;
			scoreHolder.toString();
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
	scoreArray = scoreHolder;
}

//Calculates the score
function calculateScore() {
	endTime = Time.time;
	endTime = endTime - startTime;
	//Might have to change this calculation.
	score = endTime * TimeScoreMultiplier;
	score = endTime;
}

//Toggles the visibility of the Score Screen
function toggleScreenVisibility(){
	ScoreScreenVisible = !ScoreScreenVisible;
}

//This is run on quit
//This saves the scores so it can be loaded later.
function OnApplicationQuit() {
	calculateScore();
	
	//This is because Unity is silly and won't let me
	// add something to a int[] object.
	var tempScoreArray = new Array();
	tempScoreArray = scoreArray;
	tempScoreArray.push(score);
	var tempIntArray = new int[tempScoreArray.length];
	for(var i:int = 0; i < tempScoreArray.length; i++){
		tempIntArray[i] = tempScoreArray[i];
	}
	
	var succes = PlayerPrefsX.SetIntArray(GameName, tempIntArray);
	if(succes == false){
		Debug.Log("Didn't save!");
	}
}

