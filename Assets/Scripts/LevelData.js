#pragma strict

class LevelData extends ScriptableObject {

	public var GameName : String;

	public var NextLevel : int;
	public var RuleEnum : ruleFunction;
	public var HasTimeLimit : boolean;

	public var CurrentSubRule : subRule;

	public var CubeDesignsArray = new ArrayList();
	public var DesignEnum : CubeDesignEnum;

	public var GridMinValue : int;
	public var GridMaxValue : int;
	public var HintHasTimeLimit : boolean;
	public var GridHintMinValue : int;
	public var GridHintMaxValue : int;
	public var CurrentGridHintValue : int;

	public var MinNumberOfBoxesUsedForTask : int;
	public var MaxNumberOfBoxesUsedForTask : int;
	public var CurrentNumberOfBoxesUsedForTask : int;

	
	//what the solution looks like for games except "Woords" with needs multiple solutions at once.
	public var FinishState : List.<int> = new List.<int>();													

	public var numberOfLevels : int = 9;

	final public var numberOfCubes : int = 10; //NB! :should no longer be changed when using grid rules: NB!
	
	public var SaveDesignString : String;
	
	public var GoalString : String[];
	
	public var FileString : String;
	public var FileStringContent : String;
	
	public var TimeEstimate : int;
	public var CorrectBonus : int;
	
	public var LevelGoalText : String;
}
