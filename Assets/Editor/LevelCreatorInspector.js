#pragma strict

@CustomEditor (LevelCreator)
class LevelCreatorInspector extends Editor{
	
	var curRule : ruleFunction;
	var curSubRule : subRule;
	var lvlCreator : LevelCreator;
	//Variables for Tower
	var towerMinBox : int;
	//Variables for Grid
	var gridMinValue : int = 1;
	var gridMaxValue : int = 9;
	var gridCurrValue : int = 4;
	var gridWantedLevles : int = 5;
	var gridRandomSeed : int;
	var gridShowRand : boolean = false;
	//Variables for Human Readable
	
	//Variables for Pair
	override function OnInspectorGUI () {
		DrawDefaultInspector();
		
		curRule = EditorGUILayout.EnumPopup("Select rule:",curRule);// as System.Enum;
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
		// wanted levles
		gridWantedLevles = EditorGUILayout.IntField("Number of levles:", gridWantedLevles);
		//Random seed
		gridShowRand = EditorGUILayout.BeginToggleGroup("Make random levels?", gridShowRand);
		gridRandomSeed = EditorGUILayout.IntSlider("Random seed:", gridRandomSeed, 1, int.MaxValue);
		if(gridShowRand){
			//Send data to LevelCreator
		} else {
			//send data to LevelCreator with 0 for rand.
		}
		EditorGUILayout.EndToggleGroup();
	}
	
	function HumanReadable () {
		curSubRule = EditorGUILayout.EnumPopup("Subrule:", curSubRule);
		
		ChoseSubRule();
	}
	
	function Pair () {
		
	}
	//Sub rules
	//Addition,CompositeNumbers,WholeLiner,AnyWord
	
	function ChoseSubRule () {
		switch(curSubRule){
		case subRule.Addition:
			Addition();
			break;
		case subRule.CompositeNumbers:
			CompositeNumbers();
			break;
		case subRule.WholeLiner:
			WholeLiner();
			break;
			case subRule.AnyWord:
			Anyword();
			break;
		}
	}
	function Addition () {
		
	}
	
	function CompositeNumbers () {
		
	}
	function WholeLiner () {
		
	}
	function AnyWord () {
		
	}
	
}