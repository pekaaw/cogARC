#pragma strict

public var Pause = false;
public var PauseScreenRect = Rect(200,200,200,200);
public var PauseScreenLogo : Texture;
public var PauseLogoPosition : Rect;

function OnGUI () {
	
	if(Pause == true) {
		if(PauseScreenLogo != null){
			GUI.DrawTexture(PauseLogoPosition,PauseScreenLogo,ScaleMode.ScaleToFit,true);
		}
	
		GUILayout.BeginArea(PauseScreenRect);
		GUILayout.BeginVertical();
		
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
	else {
		if(GUILayout.Button("Pause")){
			togglePauseScreen();
		}
	}
}

function togglePauseScreen() {
	Pause = !Pause;
	if(Pause == true){
		Time.timeScale = 0;
	}
	else {
		Time.timeScale = 1;
	}
}