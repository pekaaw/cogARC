#pragma strict
private var gameSequence : GameSceneSequence;
private var timerScript : TimerAndScore;
private var lastLoggedWord : String = "";	
private var events: List.<String> = new List.<String>();
private var userName : String;

function Awake(){
	timerScript = gameObject.GetComponent(TimerAndScore);
	gameSequence = GameObject.Find("SceneSequence").GetComponent(GameSceneSequence);

	userName = PlayerPrefs.GetString("UserName");

}

function Start () {

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


function PostScore() {
	var gameId : int = gameSequence.GetCurrentGameId();
	var currentScore : int = timerScript.getScore();
	var currentTime : String = timerScript.GetTimerText();
	var url : String;
	url = ("http://gtl.hig.no/logScore.php?User=" + userName + "&Score=" + currentScore + "&miniID=" + gameId);
	Post(url);

}

function Post(url:String) {
	var www : WWW = new WWW (url);
   	yield www; 
   	if(www.error) {
   	    Debug.LogWarning("There was an error posting the data: " + www.error);
   	}
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
	//events.Add(gameId + " " + userName +  " " + currentScore + " " + currentTime + " " + answer + " " + positions); //do not use lastLoggedWord if this function is used for other than wooords use CubesData[cubes[i]]
	
	events.Add("&User=" + userName + "&Score=" + currentScore + "&miniID=" + gameId);
	
}

function SendEvents(){
	var url:String;
	for(var str:String in events) {
		url = "http://gtl.hig.no/logScore.php?GameID=42&User=Simon&Score=60&miniID=3" + "gameId=42&data=" + str;

  		Post(url);

	}
}