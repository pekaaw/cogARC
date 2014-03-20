#pragma strict

@CustomEditor (NewGameCreator)
class NewGameCreatorInspector extends Editor{
	private var myself : NewGameCreator;
	
	function OnEnable () {
		myself = target as NewGameCreator;
	}
	function OnInspectorGUI () {
		if(GUILayout.Button("Add all needed to create a new game!")) {
			var obj = new GameObject("Empty");
			obj.AddComponent(LevelCreator);
			obj.AddComponent(Rule);
			obj.AddComponent(WorldState);
			obj.AddComponent(PauseScreenScript);
			obj.AddComponent(TimerAndScore);
			obj.AddComponent(LoadingScreen);
			obj.AddComponent(ScoreScreen);
			obj.name = "Scripts";
			
			
			Instantiate(Resources.Load("Prefab/ARCamera"));
			Instantiate(Resources.Load("Prefab/FrameMarkerContainer"));
			Instantiate(Resources.Load("Prefab/PauseScreen"));
			
			var sel = Selection.activeGameObject;
			DestroyImmediate(sel);
		}
	}
}