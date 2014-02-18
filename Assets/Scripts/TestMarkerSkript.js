#pragma strict
public var combo : CorrectCombo;
function OnGUI() {
	//GUILayout.BeginArea();
	GUI.skin.button.fontSize = 50;
	if(GUILayout.Button("Right")){
		combo.toggleRightMark(Vector3(Random.Range(10.0F, 300.0F), Random.Range(1.0f,10.0f),50));
	}
	if(GUILayout.Button("Wrong")){
		combo.toggleWrongMark(Vector3(Random.Range(10.0F, 300.0F), Random.Range(1.0f,10.0f), 50));
	}
}