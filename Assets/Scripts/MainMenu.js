#pragma strict

public var NameOfGames :String[];
public var ButtonsPerRow : int = 4;
public var MainMenuTitle : String = "Main Menu!";
public var LogoTexture : Texture;
public var LogoPoistion : Rect;
public var GuiSkin : GUISkin = null;
public var ButtonFontSize : int = 50;
private var gameSequence : GameSceneSequence;

private var MainMenuRect : Rect;

function Start () {
	for(var i = 0; i < NameOfGames.Length; i++){
		if(NameOfGames[i] == ""){
			NameOfGames[i] = "Unnamed";
		}
	}
	MainMenuRect = Rect((Screen.width/2) - 500,(Screen.height/2)- 200,
		(Screen.width/2)+500,(Screen.height/2)+200);
	gameSequence = GameObject.Find("SceneSequence").GetComponent(GameSceneSequence);
	gameSequence.ClearSequence();
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
	var i : int;
	for(i = 0; i < NameOfGames.Length - 1; i++){
		if((i % ButtonsPerRow) == 0 && i > 0 ){
			GUILayout.EndHorizontal();
			GUILayout.BeginHorizontal();
		}
		if(GUILayout.Button(NameOfGames[i])){
			gameSequence.AddAtEnd(i+1);
			Application.LoadLevel(gameSequence.GetNextLevel());
		}
		GUILayout.FlexibleSpace();
	}
	GUILayout.EndHorizontal();
	GUILayout.BeginHorizontal();
	if(GUILayout.Button(NameOfGames[i+0])){
	
		var tempArray : Array = new Array();

		for(var q = 1; q < NameOfGames.Length ; q++){
			tempArray.push(q);
		}
		gameSequence.AddMulti(tempArray.ToBuiltin(int));
		Application.LoadLevel(gameSequence.GetNextLevel());
	}
	GUILayout.FlexibleSpace();
	if(GUILayout.Button("Quit")){
		Application.Quit();
	}
	if(GUILayout.Button("Name")){
		var obj = new GameObject("Empty");
		obj = Instantiate(Resources.Load("Prefab/RegisterName"));
	}
	GUILayout.FlexibleSpace();
	GUILayout.EndHorizontal();
	GUILayout.EndArea();
	
	GUI.skin.button.fontSize = originalButtonFont;
}