#pragma strict
#pragma downcast
@CustomEditor (LevelCreator)
@CanEditMultipleObjects
class LevelCreatorInspector extends Editor{
	//General variables.
	var lvlCreator : LevelCreator;
	var lvlData : LevelData;
	//Variables for Tower
	var towerMinBox : int;
	//Variables for Grid
	//Variables for Human Readable
	//Variables for Pair
	//Variables for time and score
	var timeEstimate : int;
	var scorePerRight : int;
	//Cube design variables
	var designFoldOut : boolean = true;
	var designSameBoxColour : boolean = false;
	var designBoxSameColour : Color;
	var designSameTextColour : boolean = false;
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
	
	function OnEnable () {
		lvlCreator = target;
		
		if( (target as LevelCreator).Data == null ) {
			(target as LevelCreator).Data = ScriptableObject.CreateInstance("LevelData");
		}
		lvlData = (target as LevelCreator).Data;
		//lvlData = serializedObject.FindProperty("LevelDataInstance") as LevelData;
	}
	override function OnInspectorGUI () {
		serializedObject.Update();
	
		//DrawDefaultInspector();
		
		EditorGUILayout.HelpBox("Default over, custom nedenfor", MessageType.None);
		ChooseMainRule();
		
		ChooseDesign();
		
		lvlData.numberOfLevels = EditorGUILayout.IntField("Number of levles:",lvlData.numberOfLevels);
		timeEstimate = EditorGUILayout.IntField("Seconds per level:", timeEstimate);
		scorePerRight = EditorGUILayout.IntField("Score per right:", scorePerRight);
		
		if(GUI.changed){
			EditorUtility.SetDirty(target);
			//lvlData.serialize();
		}
		serializedObject.ApplyModifiedProperties ();
	}
	
	function ChooseMainRule() {
		lvlData.RuleEnum = EditorGUILayout.EnumPopup("Select rule:",lvlData.RuleEnum);
		
		if (lvlData.RuleEnum == ruleFunction.Grid){
			Grid();
		}else if(lvlData.RuleEnum == ruleFunction.Tower){
			Tower();
		}else if (lvlData.RuleEnum == ruleFunction.Pair){
			Pair();
		}else if (lvlData.RuleEnum == ruleFunction.HumanReadable){
			HumanReadable();
		}
	}
	
	function Tower () {
		EditorGUILayout.LabelField("Minimum number of cubes");
		towerMinBox = EditorGUILayout.IntSlider(towerMinBox, 2, 9);
		//Subrule
		lvlData.CurrentSubRule = EditorGUILayout.EnumPopup("Subrule:", lvlData.CurrentSubRule);
		ChoseSubRule();
	}
	
	function Grid () {
		//Min, max
		EditorGUILayout.LabelField("Please select wanted number of cubes.");
		lvlData.gridMinValue = EditorGUILayout.IntSlider("MIN:",lvlData.gridMinValue, 1, 9);
		lvlData.gridMaxValue = EditorGUILayout.IntSlider("MAX:",lvlData.gridMaxValue, lvlData.gridMinValue, 9);
		// wanted levles
		lvlData.numberOfLevels = EditorGUILayout.IntField("Number of levles:", lvlData.numberOfLevels);
		if(lvlData.numberOfLevels < 1) {
			lvlData.numberOfLevels = 1;
		}
	}
	
	function HumanReadable () {
		EditorGUILayout.HelpBox(humanReadableInfoBox, MessageType.None);
		lvlData.CurrentSubRule = EditorGUILayout.EnumPopup("Subrule:", lvlData.CurrentSubRule);
		
		ChoseSubRule();
	}
	
	function Pair () {
		EditorGUILayout.HelpBox(pairInfoBox, MessageType.None);
	}
	
	function ChoseSubRule () {
		switch(lvlData.CurrentSubRule){
		case subRule.Addition:
			Addition(); break;
		case subRule.CompositeNumbers:
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
		lvlData.DesignEnum = EditorGUILayout.EnumPopup("Select cube design:",lvlData.DesignEnum);
		
		designFoldOut = EditorGUILayout.Foldout(designFoldOut, "Design Elements");
		if(designFoldOut){
			switch(lvlData.DesignEnum){
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
		designSameBoxColour = EditorGUILayout.Toggle("Same colours?", designSameBoxColour);
		while(lvlData.CubeDesignsArray.length < 10){
				lvlData.CubeDesignsArray.Push(new BoxDesign());
		}
		if(designSameBoxColour){
			designBoxSameColour = EditorGUILayout.ColorField(designBoxSameColour);
			for(var box : BoxDesign in lvlData.CubeDesignsArray){
				box.BoxColor = designBoxSameColour;
			}
		}else {
			if(lvlData.RuleEnum != ruleFunction.Pair){
				for(var box : BoxDesign in lvlData.CubeDesignsArray){
					box.BoxColor = EditorGUILayout.ColorField(box.BoxColor);
				}
			}
			else{
				for(var q : int = 0; q < lvlData.CubeDesignsArray.length; q += 2){
					(lvlData.CubeDesignsArray[q] as BoxDesign).BoxColor = EditorGUILayout.ColorField(
						(lvlData.CubeDesignsArray[q]as BoxDesign).BoxColor);
					lvlData.CubeDesignsArray[q+1] = lvlData.CubeDesignsArray[q];
				}
			}
		}
	}
	
	function BoxImage () {
		while(lvlData.CubeDesignsArray.length < 10){
			lvlData.CubeDesignsArray.Push(new BoxDesign());
		}
		
		if(lvlData.RuleEnum != ruleFunction.Pair){
			for(var box : BoxDesign in lvlData.CubeDesignsArray){
				box.BoxImage = EditorGUILayout.ObjectField(box.BoxImage,Texture, true) as Texture;
			}
		}
		else{
			for(var c : int = 0; c < lvlData.CubeDesignsArray.length; c+=2){
				(lvlData.CubeDesignsArray[c] as BoxDesign).BoxImage = EditorGUILayout.ObjectField((lvlData.CubeDesignsArray[c] as BoxDesign).BoxImage,
				Texture, true) as Texture;
				(lvlData.CubeDesignsArray[c+1] as BoxDesign).BoxImage = (lvlData.CubeDesignsArray[c] as BoxDesign).BoxImage;
			}
			
		}
	}
	
	function BoxText () {
		while(lvlData.CubeDesignsArray.length < 10){
			lvlData.CubeDesignsArray.Push(new BoxDesign());
		}
		
		designSameTextColour = EditorGUILayout.Toggle("Same coloured text?", designSameTextColour);
		if(designSameTextColour){
			designTextSameColour = EditorGUILayout.ColorField(designTextSameColour);
			for(var box: BoxDesign in lvlData.CubeDesignsArray){
				box.TextColor = designTextSameColour;
			}
		}
		for(var box : BoxDesign in lvlData.CubeDesignsArray){
			box.BoxText = EditorGUILayout.TextField("Text:",box.BoxText);
			if(!designSameTextColour){
				box.TextColor = EditorGUILayout.ColorField("Colour:",box.TextColor);
			}
		}
	}
	function BoxTextAndCubeColour (){
		while(lvlData.CubeDesignsArray.length < 10){
			lvlData.CubeDesignsArray.Push(new BoxDesign());
		}
		
		designSameBoxColour = EditorGUILayout.Toggle("Same coloured boxes?",designSameBoxColour);
		designSameTextColour = EditorGUILayout.Toggle("Same text colour?",designSameTextColour);
		for(var box : BoxDesign in lvlData.CubeDesignsArray){
			box.BoxText = EditorGUILayout.TextField(box.BoxText);
			if(!designSameTextColour){
				box.TextColor = EditorGUILayout.ColorField("Text colour:",box.TextColor);
			}
			if(!designSameBoxColour){
				box.BoxColor = EditorGUILayout.ColorField("Cube colour.",box.BoxColor);
			}
		}
		if(designSameTextColour){
			designTextSameColour = EditorGUILayout.ColorField("Text colour",designTextSameColour);
			for(var box: BoxDesign in lvlData.CubeDesignsArray){
				box.TextColor = designTextSameColour;
			}
		}
		if(designSameBoxColour){
			//designBoxSameColour
			designBoxSameColour = (lvlData.CubeDesignsArray[0] as BoxDesign).BoxColor;
			designBoxSameColour = EditorGUILayout.ColorField("Cube colour:",designBoxSameColour);
			for(var box : BoxDesign in lvlData.CubeDesignsArray){
				box.BoxColor = designBoxSameColour;
			}
		}
	}
}
