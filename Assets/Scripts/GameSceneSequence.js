#pragma strict
private var sequence : List.<int> = new List.<int>();	
private var currentGameIndex :int = -1;												

function Awake() {
	GameObject.DontDestroyOnLoad (transform.gameObject);
	sequence.Add(0); // return to mainmenu

}
function Start () {

}

function Update () {

}
function ClearSequence(){
	sequence.Clear();
	currentGameIndex = -1;	
}
function GetNextLevel():int {
	currentGameIndex++;
	if(currentGameIndex >= sequence.Count) {
		Application.Quit();
	}
	return sequence[currentGameIndex];
}

function AddMulti(arr : int[]){
	for( var i: int = 0 ; i < arr.Length; i++){
		AddAtEnd(arr[i]);
	}
}

function AddAtEnd(newGuy : int){
	if(sequence.Count == 0) {
		sequence.Add(0); // return to mainmenu
	}
	sequence.Insert(sequence.Count-1,newGuy);

}