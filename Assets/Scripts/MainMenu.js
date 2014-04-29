#pragma strict

public var NameOfGames :String[];
public var ButtonsPerRow : int = 4;
public var MainMenuTitle : String = "Main Menu!";
public var LogoTexture : Texture;
public var LogoPoistion : Rect;
public var GuiSkin : GUISkin = null;
public var ButtonFontSize : int = 50;
private var iconFolder : String;
private var MainMenuRect : Rect;
private var icons : Texture2D[]; // = new Texture[9];
private var gameSequence : GameSceneSequence;

function Start () {

	// Calculate the dimensions of the menu bounding box
	MainMenuRect = Rect(
			(Screen.width * 1/6),
			(Screen.height * 1/4),
			(Screen.width * 2/3),
			(Screen.height * 1/2) );
			
	// Select size of images according to menu size on screen
	var buttonSpace : float = MainMenuRect.width / ButtonsPerRow;
	var logWidth : float = Mathf.Log( buttonSpace, 2) ;
	var lastPow : int = Mathf.Floor(logWidth);
	var powNumber : int = Mathf.Pow(2, lastPow);
	
	// Set the path of the icon folder.
	iconFolder = "icons/" + powNumber.ToString() + "/";
	
	// Test if it is possible to load textures. 'No Icon' is choosen as test image.
	// If the test fails, the 128px folder is choosen as default.
	var testTexture : Texture2D = Resources.Load(iconFolder + "No Icon") as Texture2D;
	if( testTexture == null ) {
		iconFolder = "icons/128/";	// DEFAULT VALUE
	}

	// Create the icons array with the length of number of games
	// + 2 for name registration and exit button.
	icons = new Texture2D[NameOfGames.Length + 2];
	
	// Make proper name and load icons
	for(var i = 0; i < NameOfGames.Length; i++){
		
		if(NameOfGames[i] == ""){
			NameOfGames[i] = "Unnamed";
		}
		
		// Load icon for the game.
		// The game icon should have the same name as the icon (without file extension)
		// If the game have no name, the unnamed icon will be displayed.
		icons[i] = Resources.Load(iconFolder + NameOfGames[i]) as Texture2D;

		// If there is no icon for the game, the 'No Icon' icon will be displayed.
		if( icons[i] == null ) {
			icons[i] = Resources.Load(iconFolder + "No Icon") as Texture2D;
		}
		
	}
	
	// Load icon for name registration and exit button
	icons[i] = Resources.Load(iconFolder + "Your Name") as Texture2D;
	icons[i+1] = Resources.Load(iconFolder + "Exit") as Texture2D;
	
	gameSequence = GameObject.Find("SceneSequence").GetComponent(GameSceneSequence);
	gameSequence.ClearSequence();

}

function OnGUI () {
	
	// Get skin for looks
	GUI.skin = GuiSkin;
	
	//Vars for original sizes
	var originalButtonFont : int = GUI.skin.button.fontSize;
	
	// Set fontsize on buttons
	GUI.skin.button.fontSize = ButtonFontSize;
	
	// Draw logo or show the app name as text
	if(LogoTexture != null){
		GUI.DrawTexture(LogoPoistion,LogoTexture,ScaleMode.ScaleToFit,true);
	}
	else{
		GUI.skin.label.alignment = TextAnchor.MiddleCenter; 
		GUILayout.Label(MainMenuTitle);
		GUI.skin.label.alignment = TextAnchor.MiddleLeft;
	}
	
	// Draw the Main Menu
	GUILayout.BeginArea(MainMenuRect);
	GUILayout.BeginHorizontal();
	var i : int;
	
	// Display icons for each game
	for(i = 0; i < NameOfGames.Length - 1; i++){
		
		// Add Button with icon. If clicked, load the level
		if( GUILayout.Button(icons[i]) ){
			gameSequence.AddAtEnd(i+1);
			Application.LoadLevel(gameSequence.GetNextLevel());
		}
		
		// Start a new line when a row is full
		if((i % ButtonsPerRow) == ButtonsPerRow -1 && i > 0 ){
			GUILayout.EndHorizontal();
			GUILayout.BeginHorizontal();
		}
		else {
			// Add space between buttons
			GUILayout.FlexibleSpace();
		}
	}

	// In case the row is full when we start printing the extra buttons
	if((i % ButtonsPerRow) == ButtonsPerRow -1){
		GUILayout.EndHorizontal();
		GUILayout.BeginHorizontal();
	}
	
	// The "Play All" games button
	if(GUILayout.Button(icons[i+0])){
	
		var tempArray : Array = new Array();

		for(var q = 1; q < NameOfGames.Length ; q++){
			tempArray.push(q);
		}
		gameSequence.AddMulti(tempArray.ToBuiltin(int));
		Application.LoadLevel(gameSequence.GetNextLevel());
	}

	// In case the row is full
	if((i % ButtonsPerRow) == ButtonsPerRow -1){
		GUILayout.EndHorizontal();
		GUILayout.BeginHorizontal();
	}
	else {
		GUILayout.FlexibleSpace();
	}
	
	GUILayout.BeginVertical();
	// The Exit button
	if(GUILayout.Button(icons[i+2])){
		Application.Quit();
	}
	
	// The Register Name button
	if(GUILayout.Button(icons[i+1])){
		var obj = new GameObject("Empty");
		obj = Instantiate(Resources.Load("Prefab/RegisterName"));
	}
	GUILayout.EndVertical();
	GUILayout.EndHorizontal();
	
	// End of Main Menu
	GUILayout.EndArea();
	
	// Put back original fontsize on buttons
	GUI.skin.button.fontSize = originalButtonFont;
}