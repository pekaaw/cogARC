#pragma strict

@CustomEditor (LevelCreator)
class LevelCreatorInspector extends Editor{
	
	var curRule : ruleFunction;
	
	//Variables for Tower
	
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
		
		
	}
	function Tower () {
		
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
		gridRandomSeed = EditorGUILayout.IntSlider("Random seed:", gridRandomSeed, 0, int.MaxValue);
		EditorGUILayout.EndToggleGroup();
	}
	
	function HumanReadable () {
	
	}
	
	function Pair () {
		
	}
	
}