#pragma strict

private var SizeFont : int = 50;
private var timer : float = 0.0f;
private var score : int;
private var scoreBonuses : int;
private var timerText : String;
private var GuiSkin : GUISkin = null;
private var labelStyle : GUIStyle;
private var LabelTexture : Texture;
private var timeEstimate : float;
private var PlacementRectangle : Rect;
private var posNegative : int; // this is +1 or -1 depending on wether the time is counting up or down
private var gameSequence : GameSceneSequence;
private var hidden : boolean = false;

public var toggleTimerCountUp : boolean;
public var TimesUp : boolean = false;

function Start () {
	var lvlCre : LevelCreator = GameObject.Find("Scripts").GetComponent(LevelCreator);
	gameSequence = GameObject.Find("SceneSequence").GetComponent(GameSceneSequence);

//	PlacementRectangle = Rect(Screen.width-200,20,150,400);
//	PlacementRectangle = Rect(Screen.width * 2/3 - 20, 20, Screen.width * 1/3, Screen.height);

//	PlacementRectangle = Rect(Screen.width-450,20,445,400);

	GuiSkin = Resources.Load("GUISkins/cogARC");
	
	// Set labelTexture
	LabelTexture = Resources.Load("Backgrounds/black50") as Texture;
	
	// Calculate size for the score data
	var minWidth : float;
	var maxWidth : float;
	var lineWidth : float;
	var lineHeight : float;
	
	// Prepare the style
	labelStyle = GUIStyle(GuiSkin.label);
	labelStyle.fontSize = SizeFont;
	labelStyle.alignment = TextAnchor.UpperLeft;
	labelStyle.CalcMinMaxWidth(GUIContent("Timer: MM:MM:MM"), minWidth, maxWidth);
	labelStyle.normal.background = LabelTexture;
	
	// Calculate width and hight
	lineWidth = minWidth;
	lineHeight = labelStyle.CalcHeight(GUIContent("Timer: MM:MM:MM"), maxWidth);

	// Define placement
	PlacementRectangle = Rect( Screen.width - lineWidth, 0, lineWidth, lineHeight * 2);


	scoreBonuses = 0;
	scoreBonuses += gameSequence.GetScore();
	
	timeEstimate = lvlCre.Data.TimeEstimate * lvlCre.Data.numberOfLevels;
	
	if(lvlCre.Data.HasTimeLimit){
		timer = lvlCre.Data.TimeEstimate;
		posNegative = -1; // time will count downwards
	}
	else {
		timer = 0;
		posNegative = 1;
	}
}

function Update () {
	if(toggleTimerCountUp){
		timer += Time.deltaTime * posNegative;
	}
	if(timer < 0){
		timer = 0;
	}
	if(posNegative < 0 && timer == 0){
		TimesUp = true;
	}
}

function Hide(){
	hidden = true;
}

function Show() {
	hidden = false;
}

function ToggleTimerActive() {
	toggleTimerCountUp = !toggleTimerCountUp;
}
function CheckToggleTimerActive(): boolean {
	return toggleTimerCountUp;
}

function OnGUI () {
		
	//Calculate score
	calculateScore();
	//Makes the text for the timer.
	makeTimerText();
	
	GUI.skin = GuiSkin;
	
	// Prepare the style
	labelStyle = GUIStyle(GuiSkin.label);
	labelStyle.fontSize = SizeFont;
	labelStyle.alignment = TextAnchor.UpperLeft;
	labelStyle.normal.background = LabelTexture;

	// Create style to use on label
	//labelStyle = GUIStyle(GuiSkin.label);
	//labelStyle.fontSize = SizeFont;
	//labelStyle.alignment = TextAnchor.UpperLeft;
//	labelStyle.CalcMinMaxWidth(GUIContent("Timer: MM:MM:MM"), minWidth, maxWidth);
//	labelStyle.normal.background = Resources.Load("GUISkins/black50") as Texture;
//	
//	lineWidth = minWidth + ((maxWidth - minWidth)/2);
//	lineHeight = labelStyle.CalcHeight(GUIContent("Timer: MM:MM:MM"), maxWidth);
//
//	PlacementRectangle = Rect( Screen.width - lineWidth, 0, lineWidth, lineHeight * 2);
		
	//Debug.LogWarning("minWidth: " + minWidth + " maxWidth: " + maxWidth);
	
//	var minWidth : float;
//	var maxWidth : float;
//	GUIStyle.CalcMinMaxWidth(GUIContent("Timer: MM:MM:MM"), minWidth, maxWidth); 
	//CalcMinMaxWidth(content: GUIContent, minWidth: float, maxWidth: float)
	

	//Save original font size.
//	var originalFontSize : int = GUI.skin.label.fontSize;
	
//	GUI.skin.label.fontSize = SizeFont;
	
	//GUI.Box(PlacementRectangle, "");
	//GUILayout.BeginArea(PlacementRectangle);
	
	GUILayout.BeginArea(PlacementRectangle);
	GUILayout.Label("Score: " + score.ToString(), labelStyle);
	if(!hidden) {
		GUILayout.Label("Timer: " + timerText, labelStyle);
	}
	GUILayout.EndArea();
////	

//	GUILayout.BeginArea(Rect(0,0,Screen.width,Screen.height));
//	
//	GUILayout.BeginHorizontal(GUILayout.ExpandWidth(false));
//	GUILayout.FlexibleSpace();
//	GUILayout.BeginVertical(GUILayout.ExpandWidth(false));
//	GUILayout.Label("Score: " + score.ToString(), labelStyle);
//	if(!hidden) {
//		GUILayout.Label("Timer: " + timerText, labelStyle, GUILayout.ExpandWidth(false));
//	}
//	GUILayout.FlexibleSpace();
//	GUILayout.EndVertical();
//	GUILayout.Space(20);
//	GUILayout.EndHorizontal();
//
	
//	GUILayout.EndArea();
//
//	GUILayout.BeginVertical(GUILayout.ExpandWidth(false));
//	GUILayout.BeginHorizontal();
//	GUILayout.FlexibleSpace();
//	GUILayout.Button("Short Button", GUILayout.ExpandWidth(false));
//	GUILayout.EndHorizontal();
//	GUILayout.Space(20);
//	GUILayout.Button("Very very long Button", GUILayout.ExpandWidth(false));
//	GUILayout.EndVertical();
//
//	GUILayout.BeginVertical();
//	
//	GUILayout.Label("Score: " + score.ToString(), labelStyle, GUILayout.ExpandWidth(true));
//	if(!hidden) {
//		GUILayout.Label("Timer: " + timerText, labelStyle, GUILayout.ExpandWidth(true));
//	}
//	GUILayout.EndVertical();
	//GUILayout.EndArea();
//	GUI.skin.label.fontSize = originalFontSize;
}

function calculateScore() {
	score = TimeScore();
	score += scoreBonuses;
	if(score < 0){
		score = 0;
	}
}
function TimeScore():int {
	var ret : int;
	if(posNegative > 0){
		// timer counting upwards
		ret = Mathf.Lerp(00.0,100.0,((timeEstimate-timer)/timeEstimate));
	} else {
		// timer counting downwards
		ret = Mathf.Lerp(00.0,100.0,(timer / timeEstimate));
	}
	return ret;
}

function GetTimerText() : String {
	var min : int = timer / 60;
	var sec : int = timer % 60;
	var frac : int = (timer * 100) % 100;
 	return String.Format ("{0:0}:{1:00}:{2:00}", min, sec, frac); 
}

function makeTimerText() {
 	timerText = GetTimerText(); 
}

function getScore(){
	score = TimeScore() + scoreBonuses;
	return score;
}

function scoreBonus( Bonus : int) {
	scoreBonuses += Bonus;
}
