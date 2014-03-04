#pragma strict

class BoxDesignScript extends MonoBehaviour {

	public var cubeText : UnityEngine.TextMesh;

	function Start() {
		Instantiate(cubeText);
		cubeText.text = "Jakob sin!";
	}

}