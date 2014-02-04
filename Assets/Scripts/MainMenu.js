#pragma strict

public var MainMenuRect = Rect(200,200,200,200);
public var NameOfGames :String[];
public var ButtonsPerRow : int = 4;
public var MainMenuTitle : String = "Main Menu!";
public var LogoTexture : Texture;
public var LogoPoistion : Rect;

function Start () {
	for(var i = 0; i < NameOfGames.Length; i++){
		if(NameOfGames[i] == ""){
			NameOfGames[i] = "Unnamed";
		}
	}
}

function OnGUI () {
	
	
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
}