#pragma strict
//other scripts used by this script
var getGodOfCreation : LevelCreator;
var getRules : Rule;


private var Rule : ruleFunction; // the current rule effects how the gamestate is set up


var outputTextC : UnityEngine.TextMesh; //debug output on mobile devices



var GameState : List.<int> = new List.<int>(); // GameState formated based on the ruleset currently in use.
												//this is sendt to the rulescript to see if the goal(s) has been met.


//:::::option 1 ::::: List of chains
var chainsOfCubesTemp : int[]; 

//:::::option 2 ::::: square grid
final var GRID_ROW_SIZE : int = 3; // these two should be the same for reliability, but they don't have to be
final var GRID_COLUMN_SIZE : int = 3;
final var GRID_SIZE : int = GRID_ROW_SIZE * GRID_COLUMN_SIZE; //do not change this
var WorldState : int[];
final var NUMBER_OF_SIDES : int = 6;// used in WorldState ; 2 means up and down ; 4 means horizontal sides; 6 means all sides
									// world state has to contain exactly (NUMBER_OF_CUBES * NUMBER_OF_SIDES) ints. these ints should 
									// all be -1. 
									// 	-but this is handled in the function 'Start()' below 
final var NUMBER_OF_CUBES : int  = 10;


function Start() {
	Rule = getGodOfCreation.Rule;



	// prepare a temp array for making chains in GameState
	var arr : Array = new Array(); 
	for ( var c : int = 0 ; c < (NUMBER_OF_CUBES * 2) ; c++) {
 		arr.Push(0);
	}
 	chainsOfCubesTemp = arr.ToBuiltin(int);
	// prepare a WorldState for making grids and checking used connections in GameState
	arr = new Array(); 
	for ( var cw : int = 0 ; cw < (NUMBER_OF_CUBES * NUMBER_OF_SIDES) ; cw++) {
	 		arr.Push(-1);
 	}
 	WorldState = arr.ToBuiltin(int);
 

}

function Update () {
	if (Rule == ruleFunction.Grid) {
		if(!MakeGrid()){ // <- if grid rules make grid here. the others are made on events from onTrigger
						 // but the grid has to be made in two passes. first registrer events in the worldstate matrix
						 // and then make an A x B grid out of that here.
			ClearData(); // If makegrid fails Clear data and return, for strict on complete only;
			return;
		}
	}				
		var currentState : String = ""; 

	/*
	for(var i : int  = 0 ; i < WorldState.length ; i++) {
		currentState += WorldState[i] + " ";
		if(!((i+1)%NUMBER_OF_SIDES))
		{
			currentState += "\n";
		}
	}
	
*/
	var olden : int[] = GameState.ToArray();
	for(var d : int  = 0 ; d < olden.length ; d++) {
		currentState += olden[d] + " ";
		/*if(!((d+1)%GRID_ROW_SIZE)) {
			currentState += "\n";

		}*/
	}
		outputTextC.text = currentState;
		
		getRules.Test(GameState);
		// <- call rulefunction before ClearData. ALWAYS CALL ClearData BEFORE CHANGING THE RULES!!!!!!!!!!!
	ClearData(); // <- importent the rest is for debug.
}

function SetDataWorldState(idNumber: int,otherIdNumber: int, sideHit : int) : void {
var targetIndex : int = idNumber * NUMBER_OF_SIDES + sideHit;// - NUMBER_OF_SIDES;
	if(WorldState[targetIndex] < 0) 
	{
		WorldState[targetIndex] = otherIdNumber;
	}
	else {
	// :::::TO DO .... or maybe not :::: 	
	// odd case : more than one collition on this side, do something smart!
	return;
	}
}

function SetDataChain(idNumber: int,otherIdNumber: int, sideHit : int) : void {
	if(sideHit > 1) 
	{
		if (sideHit == Sides.LEFT || sideHit == Sides.FRONT || sideHit == Sides.TOP) { //front or left
			AddToChain(idNumber, otherIdNumber, true);
		} else {							//back or right
			AddToChain(idNumber, otherIdNumber, false);
		}
	}

}

function SetDataChainNonOverwrite(idNumber: int,otherIdNumber: int, sideHit : int) : void {
var targetIndexInWorldState : int = idNumber * NUMBER_OF_SIDES + sideHit;// - NUMBER_OF_SIDES;
	if(WorldState[targetIndexInWorldState] < 0) 
	{
		WorldState[targetIndexInWorldState] = otherIdNumber;
		SetDataChain(idNumber,otherIdNumber, sideHit);
	}
	else {
	// :::::TO DO NOTHING:::: 	
	// odd case : more than one collition on this side, do something smart!
	return;
	}
}

function ClearData() : void {
	for ( var i : int  = 0 ; i < WorldState.length ; i++) {
		WorldState[i] = -1;
	}
	GameState.Clear();
}

function AddToChain(idNumber : int, otherIdNumber : int, leftOfOther : boolean) : void { // 'this'(leftof('other')?)
	var index : int;
	var indexOther : int;
	//NOTE ::::::: this function is made for making chains of data
	// it doesn't handle duplicated cubeIds or more than 1 connection on each of 2 out of the 6 sides on each of the cubes.
	//if more than one cube is colliding with the left side of a cube one will overwrite the other and it's
	//possible that paradoxical connections occurs. even though reality can handle 3d doesn't mean it will look nice when
	//squeezed in to a 1d array

	index = GameState.IndexOf(idNumber); // finds the index of 'this' and 'other' in the list
												//returns -1 is not found
	indexOther = GameState.IndexOf(otherIdNumber);

	
	if(Mathf.Abs(index - indexOther) == 1 && index != -1 && indexOther != -1) {
		return; //these have already been connected : the difference in index is 1 and both are in the list.
	}

	if(index == -1) {
		//the index is not in the list so add new
		if(indexOther == -1) {
			//add new pair at the end
			if(leftOfOther) {

				addPairAtEnd(idNumber,otherIdNumber);

			} else {

				addPairAtEnd(otherIdNumber,idNumber);
			}
		} else {
			//connect new to 'other'. 'other' should already be part of a chain.
			if(leftOfOther) {

				insertAtIndex(indexOther,idNumber);
			} else {

				insertAtIndex(indexOther+1,idNumber);
			}
			
		}
	} else {
	
	//the one you are trying to connect to something is already connected to something else
		if ( indexOther == -1) {
		// this one you are trying to connect it to doesn't exist so we can just add 'other' next to 'this' on the correct side
			if(leftOfOther) {

				insertAtIndex(index+1,otherIdNumber);
			} else {

				insertAtIndex(index,otherIdNumber);
			}
		} else {

			//brutal block fusing time!!!!!!!!!!1
			// move one block of items to be connected to 'other' on it's left or right side
			if(leftOfOther) {

				fuseBlock(index, indexOther );
			} else {

				fuseBlock( index, indexOther + 1);
			}
		}
	}
}

//:::::::::::::::::::. Utility Functions::::::::::::::::::::::::::::::::

function addPairAtEnd(first : int, second : int) {
// when neither are in any blocks from before add both
   GameState.Add(first);
   GameState.Add(second);
   GameState.Add(-1);

}

function insertAtIndex( index : int, newNumber : int) {
// inserts 'newNumber' at index 'index' in ' GameState ' pushing the one in and those after one index up;
	try {
  		 GameState.Insert(index, newNumber);
	}
	catch (err) {
		Debug.Log(err); // PLEASE DO NOT CLUSTER-F___ THE ALGORITHM! This algorithm is for words / one dimensional connections of cubes only. 
	}
}
// DONE!!!!!...............I THINK

function fuseBlock( startBlockIndex : int, targetIndex : int) {
// startBlockIndex should be the first index in 'the block to move' to targetIndex but this function will change
// this variable to find the start so any index in the block will do. the targetIndex however will need to be accurate.
// if it's a collision with 'other' from 'other's left side the targetIndex should be the same as 'other's index in the list
// if it's from the other side the targetIndex should be  'other's index + 1;

	var count : int = 0;
	while (startBlockIndex > 0 &&  GameState [startBlockIndex-1] != -1){
	//sets the starting point for the block to actually be the first in the block
	
		startBlockIndex--;
	}

	while ( GameState[(startBlockIndex + count)] != -1) {
		//counts how many needs to be moved
		count ++;
	}
	//copies the block to a temp-workspace-int[]
	 GameState.CopyTo(startBlockIndex,chainsOfCubesTemp,0,count); //index,targetarray,targetindex,itemcount
	// removes the block and the extra -1 separator
	 GameState.RemoveRange(startBlockIndex,count+1);	
	if(targetIndex > startBlockIndex) {
		// since the block has been removed the targetIndex will need to be 
		//ajusted if the block was of a lower index than the target
		targetIndex -= count+1; 
	}

var c : int  =  count - 1;
	while ( c >= 0) {
		// reinsert one by one from the temp-workspace-int[] in opposite order to the targetIndex 

        insertAtIndex(targetIndex,chainsOfCubesTemp[c]);
        c--;
    }

}











//GRRIIIIDDDDDDDDDAYO
// sides ::::	 0  : left , 1  = back , 2 = right , 3 = front

function MakeGrid( ): boolean {
	var entryPoint : int = -1;
	var cursorX : int;
	var cursorY : int;
	for(var c : int = 0 ; c < WorldState.Length ; c+= NUMBER_OF_SIDES) { 
		if(WorldState[c+Sides.RIGHT] == -1 && WorldState[c+Sides.BACK] == -1) {
				if(WorldState[c+Sides.LEFT] != -1 && WorldState[c+Sides.FRONT] != -1) {
				entryPoint = c;
			}
		}
	}
	cursorX = entryPoint;
	cursorY = entryPoint;
 
	if(cursorX == -1) {
  		return false; //can't find entry point in the world matrix this is not possible , stupid
	}

	for (var y : int  = 0 ; y < GRID_COLUMN_SIZE ; y++){

		for (var x : int  = 0 ; x < GRID_ROW_SIZE ; x++){
			GameState.Add(cursorX/NUMBER_OF_SIDES);

			if(x < (GRID_ROW_SIZE - 1) && WorldState[cursorX+Sides.LEFT] != -1) {
				cursorX = WorldState[cursorX+Sides.LEFT] * NUMBER_OF_SIDES;
			} else if (x != GRID_ROW_SIZE-1){
				return false;
			}
		}
		if(WorldState[cursorY+Sides.FRONT] != -1) {
			cursorY = WorldState[cursorY+Sides.FRONT] * NUMBER_OF_SIDES;
			cursorX = cursorY;
		} else { return false; }
	}
	
	if(GameState.Count != GRID_SIZE) {
		return false; //there was something in the GameState before we started
	} else {
		//check victory conditions or sumting
	 return true;
	}
}
