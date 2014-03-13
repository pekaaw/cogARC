#pragma strict
#pragma downcast
@CustomEditor (LevelCreator)
class LevelCreatorInspector extends Editor{
	//General variables.
	var lvlCreator : LevelCreator;
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
	var designSameTextColour : boolean = false;
	var designBoxSameColour : Color;
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
		
		if( lvlCreator.Data == null ) {
			lvlCreator.Data = ScriptableObject.CreateInstance("LevelData");
		}
		
		for(var q = lvlCreator.Data.CubeDesignsArray.Count; q < 10; q++){
			lvlCreator.Data.CubeDesignsArray.Add( new BoxDesign());
			Debug.LogWarning(lvlCreator.Data.CubeDesignsArray.Count);
		}
	}
	
	override function OnInspectorGUI () {
		serializedObject.Update();
		GUI.changed = false;
		//DrawDefaultInspector();
		
		//EditorGUILayout.HelpBox("Default over, custom nedenfor", MessageType.None);
		EditorGUILayout.BeginVertical();
		ChooseMainRule();
		
		ChooseDesign();
		
		lvlCreator.Data.numberOfLevels = EditorGUILayout.IntField("Number of levles:",lvlCreator.Data.numberOfLevels);
		//timeEstimate = EditorGUILayout.IntField("Seconds per level:", timeEstimate);
		//scorePerRight = EditorGUILayout.IntField("Score per right:", scorePerRight);
		
		if(GUI.changed){
			EditorUtility.SetDirty(target);
			serializedObject.Update();
		}
		
		EditorGUILayout.EndVertical();
	}
	
	function ChooseMainRule() {
		lvlCreator.Data.RuleEnum = EditorGUILayout.EnumPopup("Select rule:",lvlCreator.Data.RuleEnum);
		
		if (lvlCreator.Data.RuleEnum == ruleFunction.Grid){
			Grid();
		}else if(lvlCreator.Data.RuleEnum == ruleFunction.Tower){
			Tower();
		}else if (lvlCreator.Data.RuleEnum == ruleFunction.Pair){
			Pair();
		}else if (lvlCreator.Data.RuleEnum == ruleFunction.HumanReadable){
			HumanReadable();
		}
	}
	
	function Tower () {
		EditorGUILayout.LabelField("Minimum number of cubes");
		towerMinBox = EditorGUILayout.IntSlider(towerMinBox, 2, 9);
		//Subrule
		lvlCreator.Data.CurrentSubRule = EditorGUILayout.EnumPopup("Subrule:", lvlCreator.Data.CurrentSubRule);
		ChoseSubRule();
	}
	
	function Grid () {
		//Min, max
		EditorGUILayout.LabelField("Please select wanted number of cubes.");
		lvlCreator.Data.gridMinValue = EditorGUILayout.IntSlider("MIN:",lvlCreator.Data.gridMinValue, 1, 9);
		lvlCreator.Data.gridMaxValue = EditorGUILayout.IntSlider("MAX:",lvlCreator.Data.gridMaxValue, lvlCreator.Data.gridMinValue, 9);
		// wanted levles
		lvlCreator.Data.numberOfLevels = EditorGUILayout.IntField("Number of levles:", lvlCreator.Data.numberOfLevels);
		if(lvlCreator.Data.numberOfLevels < 1) {
			lvlCreator.Data.numberOfLevels = 1;
		}
	}
	
	function HumanReadable () {
		EditorGUILayout.HelpBox(humanReadableInfoBox, MessageType.None);
		lvlCreator.Data.CurrentSubRule = EditorGUILayout.EnumPopup("Subrule:", lvlCreator.Data.CurrentSubRule);
		
		ChoseSubRule();
	}
	
	function Pair () {
		EditorGUILayout.HelpBox(pairInfoBox, MessageType.None);
	}
	
	function ChoseSubRule () {
		switch(lvlCreator.Data.CurrentSubRule){
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
		lvlCreator.Data.DesignEnum = EditorGUILayout.EnumPopup("Select cube design:",lvlCreator.Data.DesignEnum);
		
		designFoldOut = EditorGUILayout.Foldout(designFoldOut, "Design Elements");
		if(designFoldOut){
			switch(lvlCreator.Data.DesignEnum){
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
		/*while(lvlCreator.Data.CubeDesignsArray.Count < 10){
				lvlCreator.Data.CubeDesignsArray.Push(new BoxDesign());
		}*/
		if(designSameBoxColour){
			designBoxSameColour = EditorGUILayout.ColorField(designBoxSameColour);
			for(var box : BoxDesign in lvlCreator.Data.CubeDesignsArray){
				box.BoxColor = designBoxSameColour;
			}
		}else {
			if(lvlCreator.Data.RuleEnum != ruleFunction.Pair){
				for(var box : BoxDesign in lvlCreator.Data.CubeDesignsArray){
					box.BoxColor = EditorGUILayout.ColorField(box.BoxColor);
				}
			}
			else{
				for(var q : int = 0; q < lvlCreator.Data.CubeDesignsArray.Count; q += 2){
					(lvlCreator.Data.CubeDesignsArray[q] as BoxDesign).BoxColor = EditorGUILayout.ColorField(
						(lvlCreator.Data.CubeDesignsArray[q]as BoxDesign).BoxColor);
					lvlCreator.Data.CubeDesignsArray[q+1] = lvlCreator.Data.CubeDesignsArray[q];
				}
			}
		}
	}
	
	function BoxImage () {
		/*while(lvlCreator.Data.CubeDesignsArray.Count < 10){
			lvlCreator.Data.CubeDesignsArray.Push(new BoxDesign());
		}*/
		
		if(lvlCreator.Data.RuleEnum != ruleFunction.Pair){
			for(var box : BoxDesign in lvlCreator.Data.CubeDesignsArray){
				box.BoxImage = EditorGUILayout.ObjectField(box.BoxImage,Texture, true) as Texture;
			}
		}
		else{
			for(var c : int = 0; c < lvlCreator.Data.CubeDesignsArray.Count; c+=2){
				(lvlCreator.Data.CubeDesignsArray[c] as BoxDesign).BoxImage = EditorGUILayout.ObjectField((lvlCreator.Data.CubeDesignsArray[c] as BoxDesign).BoxImage,
				Texture, true) as Texture;
				(lvlCreator.Data.CubeDesignsArray[c+1] as BoxDesign).BoxImage = (lvlCreator.Data.CubeDesignsArray[c] as BoxDesign).BoxImage;
			}
			
		}
	}
	
	function BoxText () {
		/*while(lvlCreator.Data.CubeDesignsArray.Count < 10){
			lvlCreator.Data.CubeDesignsArray.Push(new BoxDesign());
		}*/
		
		designSameTextColour = EditorGUILayout.Toggle("Same coloured text?", designSameTextColour);
		if(designSameTextColour){
			designTextSameColour = EditorGUILayout.ColorField(designTextSameColour);
			for(var box: BoxDesign in lvlCreator.Data.CubeDesignsArray){
				box.TextColor = designTextSameColour;
			}
		}
		for(var box : BoxDesign in lvlCreator.Data.CubeDesignsArray){
			box.BoxText = EditorGUILayout.TextField("Text:",box.BoxText);
			if(!designSameTextColour){
				box.TextColor = EditorGUILayout.ColorField("Colour:",box.TextColor);
			}
		}
	}
	function BoxTextAndCubeColour (){
		/*while(lvlCreator.Data.CubeDesignsArray.Count < 10){
			lvlCreator.Data.CubeDesignsArray.Push(new BoxDesign());
		}*/
		
		designSameBoxColour = EditorGUILayout.Toggle("Same coloured boxes?",designSameBoxColour);
		designSameTextColour = EditorGUILayout.Toggle("Same text colour?",designSameTextColour);
		for(var box : BoxDesign in lvlCreator.Data.CubeDesignsArray){
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
			for(var box: BoxDesign in lvlCreator.Data.CubeDesignsArray){
				box.TextColor = designTextSameColour;
			}
		}
		if(designSameBoxColour){
			//designBoxSameColour
			designBoxSameColour = (lvlCreator.Data.CubeDesignsArray[0] as BoxDesign).BoxColor;
			designBoxSameColour = EditorGUILayout.ColorField("Cube colour:",designBoxSameColour);
			for(var box : BoxDesign in lvlCreator.Data.CubeDesignsArray){
				box.BoxColor = designBoxSameColour;
			}
		}
	}
}
