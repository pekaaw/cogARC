#pragma strict
private var gameSequence : GameSceneSequence;
private var timerScript : TimerAndScore;
private var lastLoggedWord : String = "";	
private var events: List.<String> = new List.<String>();

function Awake(){
	timerScript = gameObject.GetComponent(TimerAndScore);
}

function Start () {

}

function Update () {

}

function EqualsLastLoggedWord( cubes : List.<int>, cubesData: Array) : boolean {
	var tempString : String = "";
	var bool : boolean = false;
	for(var box : int in cubes) {
		if(box != -1) {
			tempString += cubesData[box]; 
		}
	}
	bool = (lastLoggedWord == tempString);
	lastLoggedWord = tempString;
	return bool;

}


function LogEvent(cubes : List.<int>, cubesData : Array , boxPositions : Transform[]){
	var gameId : int = gameSequence.GetCurrentGameId();
	var currentScore : int = timerScript.getScore();
	var currentTime : String = timerScript.GetTimerText();
	var answer : String = "";
	var positions : String = ", pos : ";
	
	for(var box : int in cubes){
		answer += cubesData[box];
		positions += boxPositions[box].ToString + " , ";
	}
	
	
	//boxPositions[cubes[i]].position.ToString() //contains the coordinates of the cube
	//CubesData[cubes[i]]; //Returns the string or letter contained in the cube
	events.Add(gameId + " " + currentScore + " " + currentTime + " " + answer + " " + positions); //do not use lastLoggedWord if this function is used for other than wooords use CubesData[cubes[i]]
	
	
}

function SendEvents(){
	


}