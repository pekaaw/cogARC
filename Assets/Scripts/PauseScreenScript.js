#pragma strict

public var pause = false;
public var PauseScreenRect = Rect(200,200,200,200);

function OnGUI () {
	
	if(pause == true) {
		GUILayout.BeginArea(PauseScreenRect);
		GUILayout.BeginVertical();
		
		GUILayout.Label("PAUSE SCREEN");
		GUILayout.FlexibleSpace();
		
		if(GUILayout.Button("RESUME")){
			togglePauseScreen();
		}
		GUILayout.FlexibleSpace();
		
		if(GUILayout.Button("Main Menu")){
			Application.LoadLevel(0);
		}
		
		GUILayout.EndVertical();
		GUILayout.EndArea();
	}

}

function togglePauseScreen() {
	pause = !pause;
}