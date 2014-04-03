#pragma strict

public var NameOfGames :String[];
public var ButtonsPerRow : int = 4;
public var MainMenuTitle : String = "Main Menu!";
public var LogoTexture : Texture;
public var LogoPoistion : Rect;
public var GuiSkin : GUISkin = null;
public var ButtonFontSize : int = 50;

private var MainMenuRect = Rect(200,200,200,200);

function Start () {
	for(var i = 0; i < NameOfGames.Length; i++){
		if(NameOfGames[i] == ""){
			NameOfGames[i] = "Unnamed";
		}
	}
	MainMenuRect = Rect(25,25,Screen.width-50, Screen.height-50);
}

function OnGUI () {
	
	GUI.skin = GuiSkin;
	//Vars for original sizes
	var originalButtonFont : int = GUI.skin.button.fontSize;
	
	GUI.skin.button.fontSize = ButtonFontSize;
	
	if(LogoTexture != null){
		GUI.DrawTexture(LogoPoistion,LogoTexture,ScaleMode.ScaleToFit,true);
	}else{
		GUI.skin.label.alignment = TextAnchor.MiddleCenter; 
		GUILayout.Label(MainMenuTitle);
		GUI.skin.label.alignment = TextAnchor.MiddleLeft;
	}
	
	GUILayout.BeginArea(MainMenuRect);
	GUILayout.BeginHorizontal();
	
	for(var i = 0; i < NameOfGames.Length; i++){
		if((i % ButtonsPerRow) == 0 && i > 0 ){
			GUILayout.EndHorizontal();
			GUILayout.BeginHorizontal();
		}
		if(GUILayout.Button(NameOfGames[i])){
			Application.LoadLevel(i+1);
		}
		GUILayout.FlexibleSpace();
	}
	GUILayout.EndHorizontal();
	GUILayout.EndArea();
	
	GUI.skin.button.fontSize = originalButtonFont;
}