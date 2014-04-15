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
public var toggleTimerCountUp : boolean;
public var TimesUp : boolean = false;


function Start () {
	var lvlCre : LevelCreator = GameObject.Find("Scripts").GetComponent(LevelCreator);
	scoreBonuses = lvlCre.Data.CorrectBonus;
	timeEstimate = lvlCre.Data.TimeEstimate * lvlCre.Data.numberOfLevels;
	GuiSkin = Resources.Load("GUISkins/cogARC");
	if(lvlCre.Data.HasTimeLimit){
		timer = timeEstimate;
		posNegative = -1;
	}
	else {
		posNegative = 1;
	}
}

function Update () {
	if(toggleTimerCountUp){
		timer += Time.deltaTime * posNegative;
	}
	if(timer < 0){
		TimesUp = true;
		timer = 0;
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
	if(posNegative > 0){
		// timer counting upwards
		score = Mathf.Lerp(00.0,100.0,((timeEstimate-timer)/timeEstimate));
	} else {
		// timer counting downwards
		score = Mathf.Lerp(00.0,100.0,(timer / timeEstimate));
	}
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
