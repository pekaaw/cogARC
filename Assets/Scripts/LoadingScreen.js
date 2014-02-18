#pragma strict

public var cogarcSkin : GUISkin;

private var screenWidth : int;
private var screenHeight : int;

private var headlineBox 	: UnityEngine.Rect;
private var instructionBox 	: UnityEngine.Rect;
private var highscoreBox 	: UnityEngine.Rect;
private var startButtonBox 	: UnityEngine.Rect;


function Start () {

	cogarcSkin = null; //Resources.LoadAssetAtPath("Assets/Skins/cogARC.GUISkin", GUISkin);
	
	screenWidth = Screen.width;
	screenHeight = Screen.height;

	headlineBox 	= new Rect();
	instructionBox 	= new Rect();
	highscoreBox 	= new Rect();
	startButtonBox 	= new Rect();
	
	setBoxSizes();
}

var counter : int = 0;

function Update () {

	if(Input.GetKeyDown(KeyCode.Space))
	{
		if( cogarcSkin == null )
		{
			cogarcSkin = Resources.LoadAssetAtPath("Assets/Skins/cogARC.GUISkin", GUISkin);
		}
		else
		{
			cogarcSkin = null;
		}
	}

}

function OnGUI() {

	GUI.skin = cogarcSkin;

	// set screen size screen size has changed (example: orientation change)
	if( screenWidth != Screen.width  || screenWidth != Screen.width) 
	{
		screenWidth = Screen.width;
		screenHeight = Screen.height;
		setBoxSizes();
	}
	
	GUI.Label(
		headlineBox,
		"Game Name"
		);
		
	GUI.Box(
		instructionBox,
		"Hallo"
		);

	GUI.Box(
		highscoreBox,
		"Highscore"
		);
		
	if( GUI.Button( startButtonBox, "Start!" ) )
	{
		// onClick
		//UnityEngine.Object.Destroy(this);
		this.active = false;
		
		// ToDo: activate this level in some way here...
	}
}

function setBoxSizes() {
	headlineBox.x = screenWidth * 1/4;			// x = 25%
	headlineBox.y = screenHeight * 1/20;		// y = 5 %
	headlineBox.width = screenWidth * 1/2;		// width = 50%
	headlineBox.height = screenHeight * 15/100;	// height = 15%
	
	instructionBox.x = screenWidth * 1/15;		// x = 10/150
	instructionBox.y = screenHeight * 1/4;		// y = 25%
	instructionBox.width = screenWidth * 1/3;	// width = 1/3 of screen
	instructionBox.height = screenHeight * 1/2;	// heigh = 50%

	highscoreBox.x = screenWidth * 9/15;		// x = 3/5
	highscoreBox.y = screenHeight * 1/4;		// y = 25%
	highscoreBox.width = screenWidth * 1/3;		// width = 1/3 of screen
	highscoreBox.height = screenHeight * 1/2;	// height = 50%
	
	startButtonBox.x = screenWidth * 2/5;		// x = 2/5
	startButtonBox.y = screenHeight * 4/5;		// y = 80%;
	startButtonBox.width = screenWidth * 1/5;	// width = 1/5 of screen
	startButtonBox.height = screenHeight * 1/10;	// height = 10%
}