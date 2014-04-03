#pragma strict

public var PauseScreenLogo : Texture;
public var PauseLogoPosition : Rect;
public var ButtonFontSize : int = 50;

private var PauseScreenRect = Rect(Screen.width/2 - 300,500,300,200);
private var GuiSkin : GUISkin = null;
private var Pause = false;

function Awake(){
	Pause = false;
	GuiSkin = Resources.Load("GUISkins/cogARC");
}

function OnGUI () {
	
	if(Pause == true) {
	
		GUI.skin = GuiSkin;
		
		var originalAlignment = GUI.skin.button.alignment;
		GUI.skin.button.alignment = TextAnchor.MiddleCenter;
		if(PauseScreenLogo != null){
			GUI.DrawTexture(PauseLogoPosition,PauseScreenLogo,ScaleMode.ScaleToFit,true);
		}
	
		GUILayout.BeginArea(PauseScreenRect);
		GUILayout.BeginVertical();
		GUILayout.FlexibleSpace();
		//GEts us buttons in a row
		GUILayout.BeginHorizontal();
		if(GUILayout.Button("RESUME")){
			togglePauseScreen();
		}
		GUILayout.FlexibleSpace();
		if(GUILayout.Button("RESTART")){
			//Reloads the level
			Application.LoadLevel(Application.loadedLevel);
		}
		//Ends our row of two buttons
		GUILayout.EndHorizontal();
		
		GUILayout.FlexibleSpace();
		if(GUILayout.Button("Main Menu")){
			Application.LoadLevel(0);
		}
		GUILayout.FlexibleSpace();
		
		GUILayout.EndVertical();
		GUILayout.EndArea();
		GUI.skin.button.alignment = originalAlignment;
	}
	else {
		var originalButtonSize = GUI.skin.button.fontSize;
		GUI.skin.button.fontSize = ButtonFontSize;
		if(GUILayout.Button("Pause")){
			togglePauseScreen();
		}
		GUI.skin.button.fontSize = originalButtonSize;
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