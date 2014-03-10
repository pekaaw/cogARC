#pragma strict

//##%¤¤%## this thing should be in the camera so that its always the right way up ##%¤¤%##\\



private var GameObjectArraySorted :GameObject[] = new GameObject[9];
 
function Start () {
	
}

function Update () {

}

function setColors(FinishState : List.<int>) {

var GameObjectArray :GameObject[] = GameObject.FindGameObjectsWithTag("GridGoalQuadsTag");
	for(var tempGameObject : GameObject in GameObjectArray) {
		var tempInt : int;
		var tempString : String = tempGameObject.name[4] + ""; ///!!!!!!!!!!!!!!!!DO NOT CHANGE THE NAMES OF THE QUADS IN GRIDGOAL;DO NOT REMOVE THEIR TAGS;!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! 
		tempInt = (parseInt(tempString)-1);
		GameObjectArraySorted[tempInt] = tempGameObject;
	}
	
	for(var q : int = 0; q < GameObjectArraySorted.length; q++) {
		if(FinishState[q] == 1) {
			GameObjectArraySorted[q].renderer.material.color = Color.blue;
		} else {
			GameObjectArraySorted[q].renderer.material.color = Color.yellow;
		}
	}
}
