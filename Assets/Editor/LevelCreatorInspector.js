#pragma strict
#pragma downcast
@CustomEditor (LevelCreator)
class LevelCreatorInspector extends Editor{
	//General variables.
	var lvlCreator : LevelCreator;
	var curRule : ruleFunction;
	var curSubRule : subRule;
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
	var gridRandInfoBox : String = "Having this toggled will make the same levels after eachother, toggle it"
	+" off to make random sequences of levles.";
	var humanReadableInfoBox : String = "Will read the boxes as the player sees them";
	var additionInfoBox : String = "Calculates the numbers on the cubes.";
	var compositeNumbersInfoBox : String = "Allows the user to put cubes together to form a whole number.";
	var wholeLinerInfoBox : String = "Will read all cubes as the player sees them.";
	var anyWordInfoBox : String = "Used for creating words and wordcombinations with boxes.";
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
	var designDifferentBoxInfo : Array = new Array();
	var designSameBoxInfo : Array = new Array();
	
	override function OnInspectorGUI () {
		DrawDefaultInspector();
		
		lvlCreator = target as LevelCreator;
		
		ChooseMainRule();
		
		ChooseDesign();
	}
	
	function ChooseMainRule() {
		curRule = EditorGUILayout.EnumPopup("Select rule:",curRule);
		lvlCreator.RuleEnum = curRule;
		
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
		towerMinBox = EditorGUILayout.IntSlider(towerMinBox, 2, 9);
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
		if(lvlCreator.numberOfLevels < 1) {
			lvlCreator.numberOfLevels = 1;
		}
		//Random seed
		gridShowRand = EditorGUILayout.BeginToggleGroup("Don't make random levels?", gridShowRand);
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
		DesignEnum = EditorGUILayout.EnumPopup("Select design of cubes:",DesignEnum);
		
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
			for(var box : BoxDesign in designDifferentBoxInfo){
				box.BoxColor = designBoxSameColour;
			}
		}
		else {
//			EditorGUILayout.PropertyField(source[0].BoxColor);
			while(designDifferentBoxInfo.length < 10)
				designDifferentBoxInfo.Push(new BoxDesign());
				
			for(var box : BoxDesign in designDifferentBoxInfo){
				box.BoxColor = EditorGUILayout.ColorField(box.BoxColor);
			}
		}
	}
	
	function BoxImage () {
		//Collect images
		while(designDifferentBoxInfo.length < 10){
			designDifferentBoxInfo.Push(new BoxDesign());
		}
		if(curRule != ruleFunction.Pair){
			for(var box : BoxDesign in designDifferentBoxInfo){
				box.BoxImage = EditorGUILayout.ObjectField(box.BoxImage,Texture, true) as Texture;
			}
		}
		else{
			for(var c : int = 0; c < designDifferentBoxInfo.length; c+=2){
				(designDifferentBoxInfo[c] as BoxDesign).BoxImage = EditorGUILayout.ObjectField((designDifferentBoxInfo[c] as BoxDesign).BoxImage,
				Texture, true) as Texture;
				(designDifferentBoxInfo[c+1] as BoxDesign).BoxImage = (designDifferentBoxInfo[c] as BoxDesign).BoxImage;
			}
			
		}
	}
	
	function BoxText () {
		while(designDifferentBoxInfo.length < 10){
			designDifferentBoxInfo.Push(new BoxDesign());
		}
		
		designSameTextColour = EditorGUILayout.Toggle("Same coloured text?", designSameTextColour);
		if(designSameTextColour){
			//designTextSameColour
			designTextSameColour = EditorGUILayout.ColorField(designTextSameColour);
			for(var box: BoxDesign in designDifferentBoxInfo){
				box.TextColor = designTextSameColour;
			}
		}
		for(var box : BoxDesign in designDifferentBoxInfo){
			box.BoxText = EditorGUILayout.TextField("Text:",box.BoxText);
			if(!designSameTextColour){
				box.TextColor = EditorGUILayout.ColorField("Colour:",box.TextColor);
			}
		}
	}
}
