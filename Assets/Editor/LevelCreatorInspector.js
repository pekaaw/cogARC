#pragma strict

@CustomEditor (LevelCreator)
class LevelCreatorInspector extends Editor{
	
	var curRule : ruleFunction;
	
	//Variables for Tower
	
	//Variables for Grid
	var gridMinValue : int = 1;
	var gridMaxValue : int = 9;
	var gridCurrValue : int = 4;
	var gridWantedValue : int = 9;
	//Variables for Human Readable
	
	//Variables for Pair
	override function OnInspectorGUI () {
		DrawDefaultInspector();
		
		curRule = EditorGUILayout.EnumPopup("Select rule:",curRule);// as System.Enum;
		if (curRule == ruleFunction.Grid){
			Grid();
		}
		
		
	}
	//Tower, Grid, HumanReadable, Pai
	function Tower () {
		
	}
	
	function Grid () {
		//Min, max, antall
		EditorGUILayout.LabelField("Minimum number of colored squares:");
		gridCurrValue = EditorGUILayout.IntSlider(gridCurrValue, gridMinValue, 9);
		EditorGUILayout.LabelField("Maximum number of colored squares:");
		gridWantedValue = EditorGUILayout.IntSlider(gridWantedValue, gridCurrValue, 9);
	}
	
	function HumanReadable () {
	
	}
	
	function Pair () {
		
	}
	
}