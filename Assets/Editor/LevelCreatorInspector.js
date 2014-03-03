#pragma strict

@CustomEditor (LevelCreator)
class LevelCreatorInspector extends Editor{

	var lvlCreator : LevelCreator;
	var curRule : ruleFunction;
	var curSubRule : subRule;
	var source : Object;
	var testCubes : BoxDesign[];
//	var test : List.<BoxDesign> = new List.<BoxDesign>();
	
	//Variables for Tower
	var towerMinBox : int;
	//Variables for Grid
	var gridMinValue : int = 1;
	var gridMaxValue : int = 9;
	var gridCurrValue : int = 4;
	var gridWantedLevles : int = 5;
	var gridRandomSeed : int;
	var gridShowRand : boolean = false;
	//Variables for the boxes
	var boxLook : BoxDesign;
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
	
	
	override function OnInspectorGUI () {
		DrawDefaultInspector();
		
		lvlCreator = target as LevelCreator;
		curRule = EditorGUILayout.EnumPopup("Select rule:",curRule);
		lvlCreator.RuleEnum = curRule;
		
		ChooseMainRule();
		
		source= EditorGUILayout.ObjectField("Test,",source, Texture,false);
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
		gridCurrValue = EditorGUILayout.IntSlider("MIN:",gridCurrValue, gridMinValue, 9);
		gridMaxValue = EditorGUILayout.IntSlider("MAX:",gridMaxValue, gridCurrValue, 9);
		lvlCreator.gridMinValue = gridCurrValue;
		lvlCreator.gridMaxValue = gridMaxValue;
		// wanted levles
		gridWantedLevles = EditorGUILayout.IntField("Number of levles:", gridWantedLevles);
		lvlCreator.numberOfLevels = gridWantedLevles;
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
}
