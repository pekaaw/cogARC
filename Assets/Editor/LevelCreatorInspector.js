#pragma strict

@CustomEditor (LevelCreator)
class LevelCreatorInspector extends Editor{
	//General variables.
	var lvlCreator : LevelCreator;
	var curRule : ruleFunction;
	var curSubRule : subRule;
	var boxInfo : Array = new Array();
	
	//Variables for Tower
	var towerMinBox : int;
	//Variables for Grid
	var gridMinValue : int = 1;
	var gridRandomSeed : int;
	var gridShowRand : boolean = false;
	//Variables for the boxes
	var boxLook : BoxDesign[];
	//Variables for Human Readable
	//Variables for Pair
	//Infobox strings
	var gridRandInfoBox : String = "Turning this off will make the same sett of leveles " 
			+"over and over. Good for testing.";
	var humanReadableInfoBox : String = "Will read the boxes as the player sees them";
	var additionInfoBox : String = "Calculates the numbers on the cubes.";
	var compositeNumbersInfoBox : String = "Allows the user to put cubes together.";
	var wholeLinerInfoBox : String = "Will read all cubes as a human.";
	var anyWordInfoBox : String = "Used for creating words.";
	//Cube design variables
	enum CubeDesignEnum {ColouredBox,BoxImage, Text};
	var DesignEnum : CubeDesignEnum;
	var designFoldOut : boolean = false;
	var designSameBoxColour : boolean = true;
	var designBoxSameColour : Color;
	var designDifferentBoxColour : Color[];
	var designSameTextColour : boolean = true;
	var designTextSameColour : Color;
	var designTextDifferentColour : Color[];
	var designTextString : String[];
	
	override function OnInspectorGUI () {
		DrawDefaultInspector();
		
		lvlCreator = target as LevelCreator;
		curRule = EditorGUILayout.EnumPopup("Select rule:",curRule);
		lvlCreator.RuleEnum = curRule;
		
		ChooseMainRule();
		
		ChooseDesign();
	}
	
	function ChooseMainRule() {
		if (curRule == ruleFunction.Grid){
			Grid();
		}
		else if(curRule == ruleFunction.Tower){
			Tower();
		} 
		else if (curRule == ruleFunction.Pair){
			Pair();
		}
		else if (curRule == ruleFunction.HumanReadable){
			HumanReadable();
		}
	}
	
	function Tower () {
		EditorGUILayout.LabelField("Minimum number of cubes");
		towerMinBox = EditorGUILayout.IntSlider(towerMinBox, 1, 9);
		//Subrule
		curSubRule = EditorGUILayout.EnumPopup("Subrule:", curSubRule);
		ChoseSubRule();
	}
	
	function Grid () {
		//Min, max
		EditorGUILayout.LabelField("Please select wanted number of cubes.");
		lvlCreator.gridMinValue = EditorGUILayout.IntSlider("MIN:",lvlCreator.gridMinValue, gridMinValue, 9);
		lvlCreator.gridMaxValue = EditorGUILayout.IntSlider("MAX:",lvlCreator.gridMaxValue, lvlCreator.gridMinValue, 9);
		// wanted levles
		lvlCreator.numberOfLevels = EditorGUILayout.IntField("Number of levles:", lvlCreator.numberOfLevels);
		//Random seed
		gridShowRand = EditorGUILayout.BeginToggleGroup("Make random levels?", gridShowRand);
		if(gridShowRand){
			gridRandomSeed = EditorGUILayout.IntSlider("Random seed:", gridRandomSeed, 1, int.MaxValue);
			EditorGUILayout.HelpBox(gridRandInfoBox ,MessageType.Info);
			//Send data to LevelCreator
		} else {
			//send data to LevelCreator with 0 for rand.
		}
		EditorGUILayout.EndToggleGroup();
		
	}
	
	function HumanReadable () {
		EditorGUILayout.HelpBox(humanReadableInfoBox, MessageType.Info);
		curSubRule = EditorGUILayout.EnumPopup("Subrule:", curSubRule);
		
		ChoseSubRule();
	}
	
	function Pair () {
	
	}
	
	function ChoseSubRule () {
		//lvlCreator.subRule = curSubRule;
		
		switch(curSubRule){
		case subRule.Addition:
			Addition();
			break;
		case subRule.compositeNumbers:
			CompositeNumbers();
			break;
		case subRule.WholeLiner:
			WholeLiner();
			break;
			case subRule.AnyWord:
			AnyWord();
			break;
		}
	}
	
	function Addition () {
		EditorGUILayout.HelpBox(additionInfoBox, MessageType.Info);
	}
	
	function CompositeNumbers () {
		EditorGUILayout.HelpBox(compositeNumbersInfoBox, MessageType.Info);
	}
	function WholeLiner () {
		EditorGUILayout.HelpBox(wholeLinerInfoBox, MessageType.Info);
	}
	function AnyWord () {
		EditorGUILayout.HelpBox(anyWordInfoBox, MessageType.Info);
	}
	
	function ChooseDesign() {
		DesignEnum = EditorGUILayout.EnumPopup("Select rule:",DesignEnum);
		
		designFoldOut = EditorGUILayout.Foldout(designFoldOut, "Design Elements");
		if(designFoldOut){
			switch(DesignEnum){
				case CubeDesignEnum.ColouredBox:
					BoxesColoured();
					break;
				case CubeDesignEnum.BoxImage:
					BoxImage();
					break;
				case CubeDesignEnum.Text:
					BoxText();
					break;
				default:
					BoxText();
					break;
				}
			}
	}
	
	function BoxesColoured () {
		//Same colour? Different?
		designSameBoxColour = EditorGUILayout.Toggle("Same colours?", designSameBoxColour);
		if(designSameBoxColour){
			//designBoxSameColour
			designBoxSameColour = EditorGUILayout.ColorField(designBoxSameColour);
		}
		else {
//			EditorGUILayout.PropertyField(source[0].BoxColor);
			while(boxInfo.length < 10)
				boxInfo.Push(new BoxDesign());
				
			for(var box : BoxDesign in boxInfo ){
				box.BoxColor = EditorGUILayout.ColorField(box.BoxColor);
			}
		}
	}
	
	function BoxImage () {
		//Collect images
		while(boxInfo.length < 10){
			boxInfo.Push(new BoxDesign());
		}
		for(var box : BoxDesign in boxInfo){
			box.BoxImage = EditorGUILayout.ObjectField(box.BoxImage,Texture, true);
		}
	}
	
	function BoxText () {
		//Same colour? Different?
		designSameTextColour = EditorGUILayout.Toggle("Same colours?", designSameTextColour);
		if(designSameTextColour){
			//designTextSameColour
			designTextSameColour = EditorGUILayout.ColorField(designTextSameColour);
		}
		else {
		
		}
	}
}
