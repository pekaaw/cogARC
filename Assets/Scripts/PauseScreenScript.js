#pragma strict

public var PauseScreenLogo : Texture;
public var PauseLogoPosition : Rect;
public var ButtonFontSize : int = 50;

private var hidden : boolean = false;
private var PauseScreenRect = Rect(Screen.width/2 - 150,500,300,200);
private var GuiSkin : GUISkin = null;
private var Pause = false;
private var CubeContainer : GameObject;

function Awake(){
	Pause = false;
	GuiSkin = Resources.Load("GUISkins/cogARC");
}

function OnGUI () {
	if(!hidden){	
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
		
			if(GUILayout.Button("RESUME")){
				togglePauseScreen();
			}
			/* "this button ("Restart") gave us illogical problems with unity/vuforia.
			type: "could not initialize trackers"
			the one in the scorescreen that does the exact same thing, 
			calling "Application.LoadLevel(Application.loadedLevel);", works ok
			we have no idea why these errors happens, so we chose to remove this button "
			
			
			we later found that it could work after all, either because we set Time.timeScale to 0  
			or because we disabled the cubes. reenabling these fixed the problem but its still illogical
			*/
			
			
			
			
			GUILayout.FlexibleSpace();
			if(GUILayout.Button("RESTART")){
				togglePauseScreen();
				//Reloads the level
				Application.LoadLevel(Application.loadedLevel);
			}
		
			GUILayout.FlexibleSpace();
			if(GUILayout.Button("Main Menu")){
				togglePauseScreen();
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
}	
function Hide(){
	hidden = true;
}

function Show() {
	hidden = false;
}

function togglePauseScreen() {
	Pause = !Pause;
	if(Pause == true){
		Time.timeScale = 0;
		CubeContainer = GameObject.Find("CubeContainer");
		if(!CubeContainer.transform.childCount){
			CubeContainer = GameObject.Find("FrameMarkerContainer");
		}
		
		CubeContainer.SetActive(false);

	}
	else {
		if(!CubeContainer.transform.childCount){
			CubeContainer = GameObject.Find("FrameMarkerContainer");
		}
		Time.timeScale = 1;
		CubeContainer.SetActive(true);

	}
}
