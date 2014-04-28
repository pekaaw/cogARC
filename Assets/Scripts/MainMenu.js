#pragma strict

public var NameOfGames :String[];
public var ButtonsPerRow : int = 4;
public var MainMenuTitle : String = "Main Menu!";
public var LogoTexture : Texture;
public var LogoPoistion : Rect;
public var GuiSkin : GUISkin = null;
public var ButtonFontSize : int = 50;
private var gameSequence : GameSceneSequence;

private var icons : Texture2D[]; // = new Texture[9];
//private var icons = Resources.LoadAll.<Texture2D>("icons");


private var MainMenuRect : Rect;

function Start () {

	//icons = Resources.LoadAll.<Texture2D>("icons");

	// Create the icons array with the length of number of games
	// + 2 for name registration and exit button.
	icons = new Texture2D[NameOfGames.Length + 2];
	
	Debug.LogWarning("Icons lenght: " + icons.Length);

	// Make proper name and load icons
	for(var i = 0; i < NameOfGames.Length; i++){
		
		if(NameOfGames[i] == ""){
			NameOfGames[i] = "Unnamed";
		}
		
		// Load icon for the game.
		// The game icon should have the same name as the icon (without file extension)
		// If the game have no name, the unnamed icon will be displayed.
		icons[i] = Resources.Load("icons/" + NameOfGames[i]) as Texture2D;

		// If there is no icon for the game, the 'No Icon' icon will be displayed.
		if( icons[i] == null ) {
			icons[i] = Resources.Load("icons/No Icon") as Texture2D;
		}
		
	}
	
	// Load icon for name registration and exit button
	icons[i] = Resources.Load("icons/Your Name") as Texture2D;
	icons[i+1] = Resources.Load("icons/Exit") as Texture2D;
	
//	MainMenuRect = Rect((Screen.width/2) - 500,(Screen.height/2)- 200,
//		(Screen.width/2)+500,(Screen.height/2)+200);
	MainMenuRect = Rect((Screen.width * 1/6),(Screen.height * 1/4),
		(Screen.width * 2/3),(Screen.height * 1/2));
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
			GUILayout.FlexibleSpace();
			GUILayout.BeginHorizontal();
		}
		if(GUILayout.Button(icons[i])){
			gameSequence.AddAtEnd(i+1);
			Application.LoadLevel(gameSequence.GetNextLevel());
		}
		GUILayout.FlexibleSpace();
	}
	//GUILayout.EndHorizontal();
	//GUILayout.BeginHorizontal();
	if((i % ButtonsPerRow) == 0 && i > 0 ){
		GUILayout.EndHorizontal();
		GUILayout.BeginHorizontal();
	}
	
	if(GUILayout.Button(icons[i+0])){
	
		var tempArray : Array = new Array();

		for(var q = 1; q < NameOfGames.Length ; q++){
			tempArray.push(q);
		}
		gameSequence.AddMulti(tempArray.ToBuiltin(int));
		Application.LoadLevel(gameSequence.GetNextLevel());
	}
	GUILayout.FlexibleSpace();
	GUILayout.BeginVertical();
	if(GUILayout.Button(icons[i+2])){
		Application.Quit();
	}
	if(GUILayout.Button(icons[i+1])){
		var obj = new GameObject("Empty");
		obj = Instantiate(Resources.Load("Prefab/RegisterName"));
	}
	GUILayout.EndVertical();
	GUILayout.FlexibleSpace();
	GUILayout.EndHorizontal();
	GUILayout.EndArea();
	
	GUI.skin.button.fontSize = originalButtonFont;
}