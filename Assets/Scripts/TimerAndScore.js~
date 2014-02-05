#pragma strict

public var TimeScoreMultiplyer : float = 0.9f;
public var PlacementRectangle : Rect = Rect(200,200,200,50);

private var timer : float = 0.0f;
private var score : int;
private var timerText : String;

function Update () {
	timer += Time.deltaTime;
}

function OnGUI () {
	//Calculate score
	calculateScore();
	//Makes the text for the timer.
	makeTimerText();
	
	GUI.skin.label.alignment = TextAnchor.UpperRight;
	GUILayout.BeginArea(PlacementRectangle);
	GUILayout.BeginVertical();
	
	GUILayout.Label("Score: " + score.ToString());
	GUILayout.Label("Timer: " + timerText);
	
	GUILayout.EndVertical();
	GUILayout.EndArea();
	GUI.skin.label.alignment = TextAnchor.MiddleLeft;
}

function calculateScore() {
	score = 1000 - (timer * TimeScoreMultiplyer)*10;
	if(score < 0){
		score = 0;
	}
}

function makeTimerText() {
	var min : int = timer / 60;
	var sec : int = timer % 60;
	var frac : int = (timer * 100) % 100;
 	timerText = String.Format ("{0:00}:{1:00}:{2:00}", min, sec, frac); 
}

function getScore(){
	return score;
}

