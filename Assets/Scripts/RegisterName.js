#pragma strict

public var stringInstruction : String = "What's your name?";
public var stringToEdit : String = "Enter here";
public var stringSubmit : String = "Submit";

private var dpi : float;

private var screenWidth : int;
private var screenHeight : int;

public var boxStyle : GUIStyle;
public var inputStyle : GUIStyle;
public var buttonStyle : GUIStyle;

private var textFieldStyle : GUIStyle;

function Start () {
	Debug.Log("Start RegisterName.js");

	boxStyle = new UnityEngine.GUIStyle();
	boxStyle.normal.textColor = Color.white;
	boxStyle.fontSize = 50;
	boxStyle.alignment = UnityEngine.TextAnchor.MiddleCenter;
	boxStyle.clipping = UnityEngine.TextClipping.Clip;
	
	inputStyle = null;
	textFieldStyle = null;
	
	//inputStyle = new UnityEngine.GUIStyle(GUI.skin.textField);//GUI.skin.textField);
	//inputStyle.GUIStyle = GUI.skin.textField;
	//inputStyle.fontSize = boxStyle.fontSize * 0.7;
}

function Update () {

}

function OnGUI () {
	if(textFieldStyle == null)
	{
		textFieldStyle = new UnityEngine.GUIStyle(GUI.skin.textField);
		textFieldStyle.fontSize = boxStyle.fontSize;
		textFieldStyle.alignment = UnityEngine.TextAnchor.MiddleCenter;
		textFieldStyle.stretchWidth = true;
		
		inputStyle = textFieldStyle;
	}
	
	buttonStyle = new UnityEngine.GUIStyle("button");
	
	dpi = Screen.dpi;
	screenWidth = Screen.width;
	screenHeight = Screen.height;
	
	var boxContentWidthFactor = 8;

	var offsetWidth = screenWidth / boxContentWidthFactor;
	var offsetHeight = screenHeight / 4;

	var boxRect : UnityEngine.Rect;
	boxRect = new Rect( 
		offsetWidth, 
		offsetHeight, 
		(screenWidth - 2 * offsetWidth), 
		2 * offsetHeight);

	GUI.Box(boxRect, "");
	
	var boxRectContentWidth = 8 * offsetWidth * 0.9;
	var boxRectContentHeight = 2 * offsetHeight * 0.9;
	
	GUI.Label( 
		new Rect( 
			boxRect.center.x - (boxRectContentWidth / 2),
			boxRect.center.y - (boxRectContentHeight * 7 / 16),
			boxRectContentWidth,
			(boxRectContentHeight / 4) ),
//			boxRect.center.x - (boxRectContentWidth / 2),
//			boxRect.center.y - (boxRectContentHeight * / 2),
//			boxRectContentWidth,
//			(boxRectContentHeight / 4) ),
		stringInstruction,
		boxStyle );
	 
	var textFieldRect : UnityEngine.Rect;
	textFieldRect = new Rect(
//		boxRect.center.x - (boxRect.width * 0.9 / 2),
//		boxRect.center.y - (boxRect.height * 0.3 / 2),
//		boxRect.width * 0.9,
//		(boxRectContentHeight / 4) );
		boxRect.center.x - (boxRect.width * 0.9 / 2),
		boxRect.center.y - (boxRectContentHeight / 8),
		boxRect.width * 0.9,
		(boxRectContentHeight / 4) );
	
	//GUI.skin.textField.fontSize = 25;
	
	stringToEdit = GUI.TextField(textFieldRect, stringToEdit, inputStyle);
	//GUI.Label( new Rect(10, 35, 200, 200), stringToEdit, boxStyle);
	
	var submitButtonRect = new Rect(
//		boxRect.xMax - (boxRect.width * 0.05) -  (boxRect.width / boxContentWidthFactor),
		boxRect.xMax - (boxRect.width * 0.05) - (boxRectContentWidth * 0.3),
		//1 boxRect.center.y + (boxRect.height * 0.3 / 2),
		//2 boxRect.y + (boxRectContentHeight * 0.9) - (boxRectContentHeight / 4),
		boxRect.center.y + (boxRectContentHeight * 7 / 16) - (boxRectContentHeight / 4),
//		boxRect.width / boxContentWidthFactor,
		boxRectContentWidth * 0.3,
		(boxRectContentHeight / 4) );
		
	GUI.Button( submitButtonRect, stringSubmit, inputStyle ); //buttonStyle );
	
//	if(GUI.Button(Rect(10, 75, 100, 100), "Show dpi"))
//	{
//		print("Width: " + Screen.width.ToString() );// dpi.ToString() );
//		Debug.Log("dpi: " + Screen.dpi.ToString() );
//	}	
}