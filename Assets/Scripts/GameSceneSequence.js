﻿#pragma strict
private var sequence : List.<int> = new List.<int>();	
private var currentGameIndex :int = -1;		
private var score : int = 0;										

function Awake() {
	GameObject.DontDestroyOnLoad (transform.gameObject);
	sequence.Add(0); //Return to mainmenu.

}
function GetCurrentGameId() :int {
	if(IsMultyLeveled ()){
		return 999;
	} else {
		return sequence[currentGameIndex];
	}
}

function IsMultyLeveled ():boolean {
	return (sequence.Count > 2);
}

function ClearSequence(){
	sequence.Clear();
	currentGameIndex = -1;
	score = 0;	
}

function SaveScore(a : int) {
	score = a;
}

function GetScore() : int {
	return score;
}

function IsThereMoreLevels(): boolean {
	var ret : boolean = (currentGameIndex < sequence.Count-2);
	return ret;
}

function ReplayLevelHotFix() {
	currentGameIndex --;
}

function GetNextLevel():int {
	currentGameIndex++;
	if(currentGameIndex >= sequence.Count) {
		Application.Quit(); // fatal error
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
