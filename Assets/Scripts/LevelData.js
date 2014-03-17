#pragma strict

class LevelData extends ScriptableObject {

	// TODO: outputTextC4 should be removed. It is a debug feature
	//var outputTextC4 : UnityEngine.TextMesh;
	public var GameName : String;
	public var GameHint : String;

	public var NextLevel : int;
	public var RuleEnum : ruleFunction;

	public var CurrentSubRule : subRule;

	public var CubeDesignsArray = new ArrayList();
	public var DesignEnum : CubeDesignEnum;

	public var gridMinValue : int;
	public var gridMaxValue : int;

	//what the solution looks like for games except "Woords" with needs multiple solutions at once.
	public var FinishState : List.<int> = new List.<int>();													

	public var numberOfLevels : int = 9;

	public var numberOfCubes : int = 10; //NB! :should no longer be changed when using grid rules: NB!
	
	public var SaveDesignString : String;
	public var SaveDesign : Boomlagoon.JSON.JSONObject;
}