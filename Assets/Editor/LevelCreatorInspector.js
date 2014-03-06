#pragma strict
#pragma downcast
@CustomEditor (LevelCreator)
class LevelCreatorInspector extends Editor{
	//General variables.
	var lvlCreator : LevelCreator;
	//Variables for Tower
	var towerMinBox : int;
	//Variables for Grid
	//var gridRandomSeed : int;
	//var gridShowRand : boolean = false;
	//Variables for Human Readable
	//Variables for Pair
	//Cube design variables
	var designFoldOut : boolean = false;
	var designSameBoxColour : boolean = true;
	var designBoxSameColour : Color;
	var designSameTextColour : boolean = true;
	var designTextSameColour : Color;
	//Infobox strings
	var pairInfoBox : String = "Will compare the boxes as pairs.";
	var gridRandInfoBox : String = "Having this toggled will make the same levels after eachother, toggle it"
	+" off to make random sequences of levles.";
	var humanReadableInfoBox : String = "Will read the boxes as the player sees them";
	var additionInfoBox : String = "Calculates the numbers on the cubes.";
	var compositeNumbersInfoBox : String = "Allows the user to put cubes together to form a whole number.";
	var wholeLinerInfoBox : String = "Will read all cubes as the player sees them.";
	var anyWordInfoBox : String = "Used for creating words and wordcombinations with boxes.";
	
	
	override function OnInspectorGUI () {
		DrawDefaultInspector();
		
		lvlCreator = target as LevelCreator;
		EditorGUILayout.HelpBox("Default over, custom nedenfor", MessageType.None);
		ChooseMainRule();
		
		ChooseDesign();
	}
	
	function ChooseMainRule() {
		lvlCreator.RuleEnum = EditorGUILayout.EnumPopup("Select rule:",lvlCreator.RuleEnum);
		
		if (lvlCreator.RuleEnum == ruleFunction.Grid){
			Grid();
		}else if(lvlCreator.RuleEnum == ruleFunction.Tower){
			Tower();
		}else if (lvlCreator.RuleEnum == ruleFunction.Pair){
			Pair();
		}else if (lvlCreator.RuleEnum == ruleFunction.HumanReadable){
			HumanReadable();
		}
	}
	
	function Tower () {
		EditorGUILayout.LabelField("Minimum number of cubes");
		towerMinBox = EditorGUILayout.IntSlider(towerMinBox, 2, 9);
		//Subrule
		lvlCreator.CurrentSubRule = EditorGUILayout.EnumPopup("Subrule:", lvlCreator.CurrentSubRule);
		ChoseSubRule();
	}
	
	function Grid () {
		//Min, max
		EditorGUILayout.LabelField("Please select wanted number of cubes.");
		lvlCreator.gridMinValue = EditorGUILayout.IntSlider("MIN:",lvlCreator.gridMinValue, 1, 9);
		lvlCreator.gridMaxValue = EditorGUILayout.IntSlider("MAX:",lvlCreator.gridMaxValue, lvlCreator.gridMinValue, 9);
		// wanted levles
		lvlCreator.numberOfLevels = EditorGUILayout.IntField("Number of levles:", lvlCreator.numberOfLevels);
		if(lvlCreator.numberOfLevels < 1) {
			lvlCreator.numberOfLevels = 1;
		}
		//Random seed
		/*gridShowRand = EditorGUILayout.BeginToggleGroup("Don't make random levels?", gridShowRand);
		if(gridShowRand){
			gridRandomSeed = EditorGUILayout.IntSlider("Random seed:", gridRandomSeed, 1, int.MaxValue);
			EditorGUILayout.HelpBox(gridRandInfoBox ,MessageType.Info);
		}
		EditorGUILayout.EndToggleGroup();
		*/
	}
	
	function HumanReadable () {
		EditorGUILayout.HelpBox(humanReadableInfoBox, MessageType.None);
		lvlCreator.CurrentSubRule = EditorGUILayout.EnumPopup("Subrule:", lvlCreator.CurrentSubRule);
		
		ChoseSubRule();
	}
	
	function Pair () {
		EditorGUILayout.HelpBox(pairInfoBox, MessageType.None);
	}
	
	function ChoseSubRule () {
		switch(lvlCreator.CurrentSubRule){
		case subRule.Addition:
			Addition(); break;
		case subRule.compositeNumbers:
			CompositeNumbers(); break;
		case subRule.WholeLiner:
			WholeLiner(); break;
		case subRule.AnyWord:
			AnyWord(); break;
		}
	}
	
	function Addition () {
		EditorGUILayout.HelpBox(additionInfoBox, MessageType.None);
	}
	
	function CompositeNumbers () {
		EditorGUILayout.HelpBox(compositeNumbersInfoBox, MessageType.None);
	}
	function WholeLiner () {
		EditorGUILayout.HelpBox(wholeLinerInfoBox, MessageType.None);
	}
	function AnyWord () {
		EditorGUILayout.HelpBox(anyWordInfoBox, MessageType.None);
	}
	
	function ChooseDesign() {
		lvlCreator.DesignEnum = EditorGUILayout.EnumPopup("Select cube design:",lvlCreator.DesignEnum);
		
		designFoldOut = EditorGUILayout.Foldout(designFoldOut, "Design Elements");
		if(designFoldOut){
			switch(lvlCreator.DesignEnum){
				case CubeDesignEnum.ColouredBox:
					BoxesColoured(); break;
				case CubeDesignEnum.BoxImage:
					BoxImage(); break;
				case CubeDesignEnum.Text:
					BoxText(); break;
				case CubeDesignEnum.TextAndCubeColour:
					BoxTextAndCubeColour(); break;
				default:
					BoxText(); break;
			}
		}
	}
	
	function BoxesColoured () {
		//Same colour? Different?
		designSameBoxColour = EditorGUILayout.Toggle("Same colours?", designSameBoxColour);
		if(designSameBoxColour){
			//designBoxSameColour
			designBoxSameColour = EditorGUILayout.ColorField(designBoxSameColour);
			for(var box : BoxDesign in lvlCreator.CubeDesignsArray){
				box.BoxColor = designBoxSameColour;
			}
		}else {
			while(lvlCreator.CubeDesignsArray.length < 10)
				lvlCreator.CubeDesignsArray.Push(new BoxDesign());
				
			for(var box : BoxDesign in lvlCreator.CubeDesignsArray){
				box.BoxColor = EditorGUILayout.ColorField(box.BoxColor);
			}
		}
	}
	
	function BoxImage () {
		while(lvlCreator.CubeDesignsArray.length < 10){
			lvlCreator.CubeDesignsArray.Push(new BoxDesign());
		}
		if(lvlCreator.RuleEnum != ruleFunction.Pair){
			for(var box : BoxDesign in lvlCreator.CubeDesignsArray){
				box.BoxImage = EditorGUILayout.ObjectField(box.BoxImage,Texture, true) as Texture;
			}
		}
		else{
			for(var c : int = 0; c < lvlCreator.CubeDesignsArray.length; c+=2){
				(lvlCreator.CubeDesignsArray[c] as BoxDesign).BoxImage = EditorGUILayout.ObjectField((lvlCreator.CubeDesignsArray[c] as BoxDesign).BoxImage,
				Texture, true) as Texture;
				(lvlCreator.CubeDesignsArray[c+1] as BoxDesign).BoxImage = (lvlCreator.CubeDesignsArray[c] as BoxDesign).BoxImage;
			}
			
		}
	}
	
	function BoxText () {
		while(lvlCreator.CubeDesignsArray.length < 10){
			lvlCreator.CubeDesignsArray.Push(new BoxDesign());
		}
		
		designSameTextColour = EditorGUILayout.Toggle("Same coloured text?", designSameTextColour);
		if(designSameTextColour){
			//designTextSameColour
			designTextSameColour = EditorGUILayout.ColorField(designTextSameColour);
			for(var box: BoxDesign in lvlCreator.CubeDesignsArray){
				box.TextColor = designTextSameColour;
			}
		}
		for(var box : BoxDesign in lvlCreator.CubeDesignsArray){
			box.BoxText = EditorGUILayout.TextField("Text:",box.BoxText);
			if(!designSameTextColour){
				box.TextColor = EditorGUILayout.ColorField("Colour:",box.TextColor);
			}
		}
	}
	function BoxTextAndCubeColour (){
		while(lvlCreator.CubeDesignsArray.length < 10){
			lvlCreator.CubeDesignsArray.Push(new BoxDesign());
		}
	//designSameBoxColour, designTextSameColour
		designSameBoxColour = EditorGUILayout.Toggle("Same coloured boxes?",designSameBoxColour);
		designSameTextColour = EditorGUILayout.Toggle("Same text colour?",designSameTextColour);
		for(var box : BoxDesign in lvlCreator.CubeDesignsArray){
			box.BoxText = EditorGUILayout.TextField(box.BoxText);
			if(!designSameTextColour){
				box.TextColor = EditorGUILayout.ColorField("Text colour:",box.TextColor);
			}
			if(!designSameBoxColour){
				box.BoxColor = EditorGUILayout.ColorField("Cube colour.",box.BoxColor);
			}
		}
		if(designSameTextColour){
			//designTextSameColour
			designTextSameColour = EditorGUILayout.ColorField("Text colour",designTextSameColour);
			for(var box: BoxDesign in lvlCreator.CubeDesignsArray){
				box.TextColor = designTextSameColour;
			}
		}
		if(designSameBoxColour){
			//designBoxSameColour
			designBoxSameColour = EditorGUILayout.ColorField("Cube colour:",designBoxSameColour);
			for(var box : BoxDesign in lvlCreator.CubeDesignsArray){
				box.BoxColor = designBoxSameColour;
			}
		}
	}
}
