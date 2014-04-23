#pragma strict

private var SizeFont : int = 50;
private var timer : float = 0.0f;
private var score : int;
private var scoreBonuses : int;
private var timerText : String;
private var GuiSkin : GUISkin = null;
private var timeEstimate : float;
private var PlacementRectangle : Rect = Rect(Screen.width-450,20,445,400);
private var posNegative : int; // this is +1 or -1 depending on wether the time is counting up or down
private var gameSequence : GameSceneSequence;
public var toggleTimerCountUp : boolean;
public var TimesUp : boolean = false;


function Start () {
	var lvlCre : LevelCreator = GameObject.Find("Scripts").GetComponent(LevelCreator);
	gameSequence = GameObject.Find("SceneSequence").GetComponent(GameSceneSequence);

	scoreBonuses = 0;//lvlCre.Data.CorrectBonus;
	scoreBonuses += gameSequence.GetScore();
	timeEstimate = lvlCre.Data.TimeEstimate * lvlCre.Data.numberOfLevels;
	GuiSkin = Resources.Load("GUISkins/cogARC");
	if(lvlCre.Data.HasTimeLimit){
		timer = lvlCre.Data.TimeEstimate;
		posNegative = -1; // time will count downwards
	}
	else {
		timer = 0;
		posNegative = 1;
	}
}
/*
function ResetTimeAndAddAsBonus(){
	var lvlCre : LevelCreator = GameObject.Find("Scripts").GetComponent(LevelCreator);
	if (timer > 0){
		scoreBonuses += TimeScore();
	}
	
	timeEstimate = lvlCre.Data.TimeEstimate;
	if(posNegative < 0) {
		timer = timeEstimate;
	} else {
		timer = 0;
	}
	TimesUp = false;
}*/

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

function makeTimerText() {
	var min : int = timer / 60;
	var sec : int = timer % 60;
	var frac : int = (timer * 100) % 100;
 	timerText = String.Format ("{0:0}:{1:00}:{2:00}", min, sec, frac); 
}

function getScore(){
	score = TimeScore() + scoreBonuses;
	return score;
}

function scoreBonus( Bonus : int) {
	scoreBonuses += Bonus;
}
