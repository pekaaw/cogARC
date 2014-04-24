#pragma strict

public var stringInstruction : String = "What's your name?";
public var stringToEdit : String = "Enter here";
public var stringSubmit : String = "Submit";
public var boxContentWidthFactor : int = 8;

private var storedName : String;
private var screenWidth : int;
private var screenHeight : int;

public static var boxStyle : GUIStyle;
public static var inputStyle : GUIStyle;
public static var buttonStyle : GUIStyle;

private var textFieldStyle : GUIStyle;

private var mainMenu : GameObject;

function Start () {
	//Debug.Log("Start RegisterName.js");
	
	// Get stored username and if empty, put default string there
	storedName = PlayerPrefs.GetString("UserName", stringToEdit);
	if( storedName == "" )
	{
		storedName = stringToEdit;
	}

	// Create a style for the box
	boxStyle = new UnityEngine.GUIStyle();
	boxStyle.normal.textColor = Color.white;
	boxStyle.fontSize = 50;
	boxStyle.alignment = UnityEngine.TextAnchor.MiddleCenter;
	boxStyle.clipping = UnityEngine.TextClipping.Clip;
	
	inputStyle = null;
	textFieldStyle = null;
	
	mainMenu = GameObject.Find("Main Menu");
	mainMenu.SetActive(false);
}

function OnGUI () {
	// Create more style if not set
	if(textFieldStyle == null)
	{
		textFieldStyle = new UnityEngine.GUIStyle(GUI.skin.textField);
		textFieldStyle.fontSize = boxStyle.fontSize;
		textFieldStyle.alignment = UnityEngine.TextAnchor.MiddleCenter;
		textFieldStyle.stretchWidth = true;
		
		inputStyle = textFieldStyle;
	}
	
	buttonStyle = new UnityEngine.GUIStyle("button");
	
	// Get screen size to scale the box properly
	screenWidth = Screen.width;
	screenHeight = Screen.height;
	
	// How big will the box be? *works best between the 5-15 range
	boxContentWidthFactor = Mathf.Max( boxContentWidthFactor, 5);
	boxContentWidthFactor = Mathf.Min( boxContentWidthFactor, 15);

	// Calculate offsets to place things at correct place
	var offsetWidth = screenWidth / boxContentWidthFactor;
	var offsetHeight = screenHeight / 4;

	// Create box for putting content into
	var boxRect : UnityEngine.Rect;
	boxRect = new Rect( 
		offsetWidth, 
		offsetHeight, 
		(screenWidth - 2 * offsetWidth), 
		2 * offsetHeight);

	GUI.Box(boxRect, "");
	
	// Calculate how much place the content should take
	var boxRectContentWidth = 8 * offsetWidth * 0.9;
	var boxRectContentHeight = 2 * offsetHeight * 0.9;
	
	// Create a label that will work as the headline / instruction
	GUI.Label( 
		new Rect( 
			boxRect.center.x - (boxRectContentWidth / 2),
			boxRect.center.y - (boxRectContentHeight * 7 / 16),
			boxRectContentWidth,
			(boxRectContentHeight / 4) ),
		stringInstruction,
		boxStyle );
	 
	// Create an inputfield to put the name
	var textFieldRect : UnityEngine.Rect;
	textFieldRect = new Rect(
		boxRect.center.x - (boxRect.width * 0.9 / 2),
		boxRect.center.y - (boxRectContentHeight / 8),
		boxRect.width * 0.9,
		(boxRectContentHeight / 4) );
	
	// Get the text in the inputfield (Yes, happens on every updatecall)
	storedName = GUI.TextField(textFieldRect, storedName, inputStyle);
	
	// create the rectangle that will work as the submitbutton
	var submitButtonRect = new Rect(
		boxRect.xMax - (boxRect.width * 0.05) - (boxRectContentWidth * 0.3),
		boxRect.center.y + (boxRectContentHeight * 7 / 16) - (boxRectContentHeight / 4),
		boxRectContentWidth * 0.3,
		(boxRectContentHeight / 4) );
		
	// Create a submitbutton and decern what will be done if clicked
	if (GUI.Button( submitButtonRect, stringSubmit, inputStyle ) ) //buttonStyle );
	{
		// store username in player preferances
		PlayerPrefs.SetString("UserName", storedName);
		
		//Find main menu and activate
		if(mainMenu)
			mainMenu.SetActive(true);
		// Remove this script and what it's gui
		UnityEngine.Object.Destroy(this);
		
		// Load mainscreen
		//Application.LoadLevel( 0 );
		
	}
}
