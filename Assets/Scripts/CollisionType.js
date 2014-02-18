#pragma strict

private var functionPointer : Function;
//Enum defined in LevelCreator.js
//private enum ruleFunction {Tower, Row, Grid, HumanReadable, Calculus};

function Start () {
	
	var ruleType : ruleFunction;
	
	switch(ruleType) {
	case ruleFunction.Tower:
		functionPointer = Tower;
		break;
	case ruleFunction.Row:
		functionPointer = Row;
		break;
	case ruleFunction.Grid:
		functionPointer = Grid;
		break;
	case ruleFunction.HumanReadable: 
		functionPointer = HumanReadable;
		break;
	case ruleFunction.Calculus:
		functionPointer = Calculus;
		break;
	}
}

function Update () {

}

public function Test (boxes : List.<int>){
	functionPointer(boxes);
}

private function Tower (boxes : List.<int>) {
	Debug.Log("Tower");
}

private function Row (boxes : List.<int>) {
	Debug.Log("Row");
}

private function Grid (boxes : List.<int>) {
	Debug.Log("Grid");
}

private function HumanReadable (boxes : List.<int>) {
	Debug.Log("Human Readable");
}

private function Calculus (boxes : List.<int>) {
	Debug.Log("Calculus method");
}
