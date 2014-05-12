#pragma strict
private var gameSequence : GameSceneSequence;
private var timerScript : TimerAndScore;
private var lastLoggedWord : String = "";	
private var events: List.<String> = new List.<String>();
private var userName : String;

function Awake(){
	timerScript = gameObject.GetComponent(TimerAndScore);
	gameSequence = GameObject.Find("SceneSequence").GetComponent(GameSceneSequence);

	userName = PlayerPrefs.GetString("UserName","NullReferenceName");
	for(var letter : int = 0 ; letter < userName.Length ; letter++) {
		if(userName[letter] == " "){
			    userName = userName.Substring (0, letter) + "+" + userName.Substring (letter + 1);
		}
	} 
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


function PostScore(currentScore : int) {
	var gameId : int = gameSequence.GetCurrentGameId();
	var currentTime : String = timerScript.GetTimerText();
	var url : String;
	url = ("http://gtl.hig.no/logScore.php?GameID=42&User=" + userName + "&Score=" + currentScore + "&miniID=" + gameId);
	
	for(var letter : int = 0 ; letter < url.Length ; letter++) {
		if(url[letter] == " "){
			    url = url.Substring (0, letter) + "+" + url.Substring (letter + 1);
		}
	} 
	
	Post(url);

}

function Post(url:String) {
	var www : WWW = new WWW (url);
   	yield www; 
   	if(www.error) {
   	    Debug.LogWarning("There was an error posting the data: " + www.error);
   	}
}

function LogEvent(cubes : List.<int>, cubesData : Array ,currentLevel : int, eventType : int) {
	//eventTypes: 1 - correct , 2 - wrong
	var gameId : int = gameSequence.GetCurrentGameId();
	var currentScore : int = timerScript.getScore();
	var currentTime : String = timerScript.GetTimerText();
	var answer : String = "";
	var str : String = "";
	for(var i : int = 0; i < cubes.Count; i++){
		if(cubesData[cubes[i]] != ""){
			answer += cubesData[cubes[i]];
		}
	}
	str = "http://gtl.hig.no/logEvent.php?GameID=42&User=" + userName +
	 "&Score=" + currentScore +
	 "&miniID=" + gameId +
	 "&Level=" + currentLevel +
	 "&EventType=" + eventType +
	 "&EventData=" + answer  + "time:" + currentTime;
	 
	for(var letter : int = 0 ; letter < str.Length ; letter++) {
		if(str[letter] == " "){
			    str = str.Substring (0, letter) + "+" + str.Substring (letter + 1);
		}
	} 
	
	events.Add(str);

}


/* You can use this function to copy and paste in to the other one 
 the information you want;

 for box positions pass: 
 private var boxPositions : Transform[];
 to the function from Rule.

 

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
*/
function SendEvents(){
	var url:String;
	for(var str:String in events) {
		url = str;
  		Post(url);
	}
	events.Clear();
}