#pragma strict
#pragma downcast
@CustomEditor (LevelCreator)
class LevelCreatorInspector extends Editor{
	//General variables.
	var lvlCreator : LevelCreator;
	//Cube design variables
	var designFoldOut : boolean = true;
	var designSameBoxColour : boolean = false;
	var designSameTextColour : boolean = false;
	var designBoxSameColour : Color = Color.cyan;
	var designTextSameColour : Color = Color.blue;
	//Infobox strings
	var pairInfoBox : String = "Will compare the boxes as pairs.";
	var gridRandInfoBox : String = "Having this toggled will make the same levels after eachother, toggle it"
	+" off to make random sequences of levles.";
	var humanReadableInfoBox : String = "Will read the boxes as the player sees them";
	var additionInfoBox : String = "Calculates the numbers on the cubes."
		+" Move sliders to choose Min and Max amount of cubes.";
	var compositeNumbersInfoBox : String = "Allows the user to put cubes together to form a whole number.";
	var wholeLinerInfoBox : String = "Will read all cubes as the player sees them.";
	var anyWordInfoBox : String = "Used for creating words and wordcombinations with boxes.";
	var boxImageInfoBox : String = "Images used for the boxes must be located under Resources/BoxDesign.";
	
	function OnEnable () {
		lvlCreator = target;
		
		if( lvlCreator.Data == null ) {
			lvlCreator.Data = ScriptableObject.CreateInstance("LevelData");
		}
		else {
			lvlCreator.decodeDesignArray();
		}
		
		for(var q = lvlCreator.Data.CubeDesignsArray.Count; q < 10; q++){
			lvlCreator.Data.CubeDesignsArray.Add( new BoxDesign());
			//Debug.LogWarning(lvlCreator.Data.CubeDesignsArray.Count);
		}
	}
	
	override function OnInspectorGUI () {
		serializedObject.Update();
		GUI.changed = false;
		//DrawDefaultInspector();
		
		//EditorGUILayout.HelpBox("Default over, custom nedenfor", MessageType.None);
		EditorGUILayout.BeginVertical();
		
		lvlCreator.Data.numberOfLevels = EditorGUILayout.IntField("Number of levles:",lvlCreator.Data.numberOfLevels);
		lvlCreator.Data.TimeEstimate = EditorGUILayout.IntField("Seconds per level:", lvlCreator.Data.TimeEstimate);
		EditorGUILayout.BeginHorizontal();
		EditorGUILayout.LabelField("Score per correct task:");
		lvlCreator.Data.CorrectBonus = EditorGUILayout.IntField(lvlCreator.Data.CorrectBonus);
		EditorGUILayout.EndHorizontal();
		
		EditorGUILayout.LabelField("Task description:");
		lvlCreator.Data.LevelGoalText = 
			EditorGUILayout.TextArea(lvlCreator.Data.LevelGoalText, GUILayout.Height(30));
		
		ChooseMainRule();
		
		ChooseDesign();
		
		EditorGUILayout.EndVertical();
		
		if(GUI.changed){
			EditorUtility.SetDirty(target);
			serializedObject.Update();
			lvlCreator.encodeDesignArray();
			lvlCreator.decodeDesignArray();
		}
	}
	
	function ChooseMainRule() {
		lvlCreator.Data.RuleEnum = EditorGUILayout.EnumPopup("Select rule:",lvlCreator.Data.RuleEnum);
		
		//Array fun times
		if(lvlCreator.Data.RuleEnum == ruleFunction.Grid){
			while(lvlCreator.Data.CubeDesignsArray.Count > 2){
				lvlCreator.Data.CubeDesignsArray.RemoveAt(lvlCreator.Data.CubeDesignsArray.Count-1);
			}
		} else {
			while(lvlCreator.Data.CubeDesignsArray.Count < 10){
				lvlCreator.Data.CubeDesignsArray.Add( new BoxDesign());
			}
		}
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
		
		lvlCreator.Data.additionMinValue = EditorGUILayout.IntSlider("MIN:",lvlCreator.Data.additionMinValue, 1, 9);
		lvlCreator.Data.additionMaxValue = EditorGUILayout.IntSlider("MAX:",lvlCreator.Data.additionMaxValue, lvlCreator.Data.additionMinValue, 9);
	}
	
	function CompositeNumbers () {
		EditorGUILayout.HelpBox(compositeNumbersInfoBox, MessageType.None);
	}
	function WholeLiner () {
		EditorGUILayout.HelpBox(wholeLinerInfoBox, MessageType.None);
	}
	function AnyWord () {
		EditorGUILayout.HelpBox(anyWordInfoBox, MessageType.None);
		if(GUILayout.Button("Open file browser")){
			lvlCreator.Data.FileString = EditorUtility.OpenFilePanel("File with words:",Application.streamingAssetsPath,"txt");
			if(lvlCreator.Data.FileString.StartsWith(Application.streamingAssetsPath)){
				lvlCreator.Data.FileString = lvlCreator.Data.FileString.Substring(Application.streamingAssetsPath.Length+1);
			}
			else {
				lvlCreator.Data.FileString = "File must be in " + Application.streamingAssetsPath;
			}
			
		}
		EditorGUILayout.LabelField("Current text file is: " + lvlCreator.Data.FileString);
	}
	
	function ChooseDesign() {
		lvlCreator.Data.DesignEnum = EditorGUILayout.EnumPopup("Select cube design:",lvlCreator.Data.DesignEnum);
		
		designFoldOut = EditorGUILayout.Foldout(designFoldOut, "Design Elements");
		if(designFoldOut){
			switch(lvlCreator.Data.DesignEnum){
				case CubeDesignEnum.TextAndCubeColour:
					BoxTextAndCubeColour(); break;
				case CubeDesignEnum.ColouredBox:
					BoxesColoured(); break;
				case CubeDesignEnum.BoxImage:
					BoxImage(); break;
			}
		}
	}
	
	function BoxesColoured () {
		if(lvlCreator.Data.DesignEnum != CubeDesignEnum.ColouredBox){
			return;
		}
		
		designSameBoxColour = EditorGUILayout.ToggleLeft("Same colours?", designSameBoxColour);
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
		if(lvlCreator.Data.DesignEnum != CubeDesignEnum.BoxImage){
			return;
		}
		
		EditorGUILayout.HelpBox(boxImageInfoBox, MessageType.None);
		if(lvlCreator.Data.RuleEnum != ruleFunction.Pair){
			for(var box : BoxDesign in lvlCreator.Data.CubeDesignsArray){
				box.BoxImage = EditorGUILayout.ObjectField(box.BoxImage,Texture, true) as Texture;
				box.BoxColor = EditorGUILayout.ColorField("Cube colour.",box.BoxColor);
			}
		}
		else{
			for(var c : int = 0; c < lvlCreator.Data.CubeDesignsArray.Count; c+=2){
				(lvlCreator.Data.CubeDesignsArray[c] as BoxDesign).BoxImage = EditorGUILayout.ObjectField((lvlCreator.Data.CubeDesignsArray[c] as BoxDesign).BoxImage,
					Texture, false) as Texture;
				(lvlCreator.Data.CubeDesignsArray[c] as BoxDesign).BoxColor = 
					EditorGUILayout.ColorField("Cube colour.",(lvlCreator.Data.CubeDesignsArray[c] as BoxDesign).BoxColor);
					
				(lvlCreator.Data.CubeDesignsArray[c+1] as BoxDesign).BoxImage = (lvlCreator.Data.CubeDesignsArray[c] as BoxDesign).BoxImage;
				(lvlCreator.Data.CubeDesignsArray[c+1] as BoxDesign).BoxColor = (lvlCreator.Data.CubeDesignsArray[c] as BoxDesign).BoxColor;
			}
		}
	}
	
	function BoxText () {
		designSameTextColour = EditorGUILayout.ToggleLeft("Same coloured text?", designSameTextColour);
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
		if(lvlCreator.Data.DesignEnum != CubeDesignEnum.TextAndCubeColour){
			return;
		}
		designSameBoxColour = EditorGUILayout.ToggleLeft("Same coloured boxes?",designSameBoxColour);
		designSameTextColour = EditorGUILayout.ToggleLeft("Same text colour?",designSameTextColour);
		
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
		EditorGUILayout.Space();
		
		for(var box : BoxDesign in lvlCreator.Data.CubeDesignsArray){
			box.BoxText = EditorGUILayout.TextField("Text:",box.BoxText);
			if(!designSameTextColour){
				box.TextColor = EditorGUILayout.ColorField("Text colour:",box.TextColor);
			}
			if(!designSameBoxColour){
				box.BoxColor = EditorGUILayout.ColorField("Cube colour.",box.BoxColor);
			}
			EditorGUILayout.Space();
		}
		
	}
}
