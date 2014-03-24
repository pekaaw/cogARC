#pragma strict
#pragma downcast
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
			
			obj = Instantiate(Resources.Load("Prefab/ARCamera 1"));
			obj.name = "ARCamera 1";
			obj = Instantiate(Resources.Load("Prefab/FrameMarkerContainer"));
			obj.AddComponent("TransformDistributor");
			obj.name = "FrameMarkerContainer";
			obj = Instantiate(Resources.Load("Prefab/CubeContainer"));
			obj.name = "CubeContainer";
			obj = Instantiate(Resources.Load("Prefab/PauseScreen"));
			obj.name = "PauseScreen";
			obj = Instantiate(Resources.Load("Prefab/RealworldaxisVisualizer"));
			obj.name = "RealworldaxisVisualizer";
			
			var sel = Selection.activeGameObject;
			DestroyImmediate(sel);
		}
	}
}