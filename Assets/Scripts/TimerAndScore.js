#pragma strict

public var TimeScoreMultiplyer : float = 0.9f;
public var PlacementRectangle : Rect = Rect(Screen.width,20,95,50);
public var SizeFont : int = 20;

private var timer : float = 0.0f;
private var score : int;
private var scoreBonuses : int;
private var timerText : String;
public var GuiSkin : GUISkin = null;

function Start () {
	var lvlCre : LevelCreator = GameObject.Find("Scripts").GetComponent(LevelCreator);
	scoreBonuses = lvlCre.Data.CorrectBonus;
	timer = -(lvlCre.Data.TimeEstimate);
}

function Update () {
	timer += Time.deltaTime;
}

function OnGUI () {
	//Calculate score
	calculateScore();
	//Makes the text for the timer.
	makeTimerText();
	
	GUI.skin = GuiSkin;
	//Save original font size.
	var originalFontSize : int = GUI.skin.label.fontSize;
	
	GUI.skin.label.fontSize = SizeFont;
	
	GUILayout.BeginArea(PlacementRectangle);
	GUILayout.BeginVertical();
	
	GUILayout.Label("Score: " + score.ToString());
	GUILayout.Label("Timer: " + timerText);
	
	GUILayout.EndVertical();
	GUILayout.EndArea();
	GUI.skin.label.fontSize = originalFontSize;
}

function calculateScore() {
	score = 1000.0f - (timer * TimeScoreMultiplyer)*10.0f;
	score += scoreBonuses;
	if(score < 0){
		score = 0;
	}
}

function makeTimerText() {
	var min : int = timer / 60;
	var sec : int = timer % 60;
	var frac : int = (timer * 100) % 100;
 	timerText = String.Format ("{0:0}:{1:00}:{2:00}", min, sec, frac); 
}

function getScore(){
	return score;
}

function scoreBonus( Bonus : int) {
	scoreBonuses += Bonus;
}
