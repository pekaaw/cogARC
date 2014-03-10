//Class to handles all enums!
class enums extends MonoBehaviour {
	public enum ruleFunction { Grid, Pair, Tower, HumanReadable};
	public enum subRule {Addition,compositeNumbers,WholeLiner,AnyWord};

	public enum CubeDesignEnum {ColouredBox,BoxImage, Text, TextAndCubeColour};
}
class LevelData extends ScriptableObject {

	//public var CubeDesignArray : Array = new Array();
	
	public var TestNumber : int = 0;

	// TODO: outputTextC4 should be removed. It is a debug feature
	var outputTextC4 : UnityEngine.TextMesh;

	private var pauseScript : PauseScreenScript;
	private var ruleScript : Rule;

	public var NextLevel : int;
	public var RuleEnum : ruleFunction;

	// Data from this level
	//static public var LevelDataInstance : LevelData;

	private var functionPointerCreator : Function;
	private var functionPointerSubCreator : Function;
	private var functionPointerPreCreator : Function;

	public var CurrentSubRule : subRule;

	public var CubeDesignsArray : Array = new Array();
	public var DesignEnum : CubeDesignEnum;

	private var unsortedCubes : Array; //cubes with tag "Player" found on stage used to set material/text.
	private var sortedCubes : Array = new Array();
	//var unsortedCubesIDs : Array = new Array(); //the cubes Ids to be added to the FinishState.
	var numberOfCubes : int = 10;

	//what the solution looks like for games except "Woords" with needs multiple solutions at once.
	var FinishState : List.<int> = new List.<int>(); 
													


	var numberOfLevels:int = 9;
	private var currentLevel: int = 0; // last level is one less than number of levels, starts at 0

	public var gridMinValue : int;
	public var gridMaxValue : int;
	final private var colorsUsedForGrid : int = 2;

}