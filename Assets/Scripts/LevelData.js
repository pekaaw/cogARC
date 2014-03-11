#pragma strict

class LevelData extends ScriptableObject {

	// TODO: outputTextC4 should be removed. It is a debug feature
	var outputTextC4 : UnityEngine.TextMesh;

	public var NextLevel : int;
	public var RuleEnum : ruleFunction;

	public var CurrentSubRule : subRule;

	public var CubeDesignsArray : Array = new Array();
	public var DesignEnum : CubeDesignEnum;

	public var gridMinValue : int;
	public var gridMaxValue : int;

}