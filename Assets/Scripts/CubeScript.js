#pragma strict

//public static var mainScript : MonoBehaviour;
public static var cubeCounter : int = 0;
private var myNumber : int;
function Start () {
//	var a : GameObject = GameObject.Find("ARCamera");
//	if(a){
//		mainScript = a.GetComponent(CGameScript);
//	}
	
	Debug.Log("SUCC-A-ESS!");
	myNumber = cubeCounter;
	cubeCounter += 1;
}

function Update () {

}


function OnTriggerEnter(collision : Collider) {
	Debug.Log("Object Collition with.");
	this.renderer.material.color = Color.green;
	
	Debug.Log("PIKACHUUUUUUU: " + (UnityEngine.GameObject.FindGameObjectWithTag("MainCamera").GetComponent("CGameScript").name));//PostStatusToGameState(myNumber,true);
	//FindO("ARCamera").GetComponent("CGameScript").PostStatusToGameState(myNumber,true);

}
/*function OnCollisionExit(collision : Collision) {
	Debug.Log("Object no longer colliding with.");
	this.renderer.material.color = Color.red;
	scriptContainer.PostStatusToGameState(myNumber,false);
}*/
function OnTriggerStay(collision : Collider) {
	Debug.Log("Object still colliding with.");
	this.renderer.material.color = Color.blue;
}
