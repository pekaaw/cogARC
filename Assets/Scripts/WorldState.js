#pragma strict
final var NUMBER_OF_SIDES : int = 6;
final var NUMBER_OF_CUBES : int  = 10;
var WorldState : int[] = [	-1,-1,-1,-1,-1,-1,
							-1,-1,-1,-1,-1,-1,
							-1,-1,-1,-1,-1,-1,
							-1,-1,-1,-1,-1,-1,
							-1,-1,-1,-1,-1,-1,
							-1,-1,-1,-1,-1,-1,
							-1,-1,-1,-1,-1,-1,
							-1,-1,-1,-1,-1,-1,
							-1,-1,-1,-1,-1,-1,
							-1,-1,-1,-1,-1,-1
							];
var outputTextC : UnityEngine.TextMesh;
var chainsOfCubes : List.<int> = new List.<int>();	
var chainsOfCubesTemp : int[]; 
//var ChainsOfMemories : Array = new Array(); // -1 must be at the end and between separated chains

function Start () {
 var arr : Array = new Array();
 
 for ( var c : int = 0 ; c < 20 ; c++) {
 	arr.Push(0);
 }
 	chainsOfCubesTemp = arr.ToBuiltin(int);
 

}

function Update () {
	
	/*
	for(var i : int  = 0 ; i < WorldState.length ; i++) {
		currentState += WorldState[i] + " ";
		if(!((i+1)%NUMBER_OF_SIDES))
		{
			currentState += "\n";
		}
	}
	
*/

	var currentState : String = ""; 

	var olden : int[] = chainsOfCubes.ToArray();
	for(var d : int  = 0 ; d < olden.length ; d++) {
		currentState += olden[d] + " ";
	}
		outputTextC.text = currentState;
	ClearData();
}

function SetData(idNumber: int,otherIdNumber: int, sideHit : int) : void {
	if(WorldState[idNumber * NUMBER_OF_SIDES + sideHit] < 0) {
			WorldState[idNumber * NUMBER_OF_SIDES + sideHit] = otherIdNumber;
			if(sideHit > 1) {
			Debug.Log(sideHit + " " + idNumber + otherIdNumber + " ARAGAKI-NI");
				if (sideHit == 3 || sideHit == 5) { //front or left
					AddToChain(idNumber, otherIdNumber, true);
				} else {							//back or right
					AddToChain(idNumber, otherIdNumber, false);
				}
			}
		}
	else {
	// :::::TO DO:::: 	
	// odd case : more than one collition on this side, do something smart!
	return;
	}
}

function ClearData() : void {
	for ( var i : int  = 0 ; i < WorldState.length ; i++) {
				WorldState[i] = -1;
	}
	chainsOfCubes.Clear();
}

function AddToChain(idNumber : int, otherIdNumber : int, leftOfOther : boolean) : void { // 'this'(leftof('other')?)
	var index : int;
	var indexOther : int;
	//NOTE ::::::: this function is made for making chains of data
	// it doesn't handle duplicated cubeIds or more than 1 connection on each of 2 out of the 6 sides on each of the cubes.
	//if more than one cube is colliding with the left side of a cube one will overwrite the other and it's
	//possible that paradoxical connections occurs. even though reality can handle 3d doesn't mean it will look nice when
	//squeezed in to a 1d array

	index = chainsOfCubes.IndexOf(idNumber); // finds the index of 'this' and 'other' in the list
												//returns -1 is not found
	indexOther = chainsOfCubes.IndexOf(otherIdNumber);

	
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
   chainsOfCubes.Add(first);
   chainsOfCubes.Add(second);
   chainsOfCubes.Add(-1);

}

function insertAtIndex( index : int, newNumber : int) {
// inserts 'newNumber' at index 'index' in 'chainsOfCubes' pushing the one in and those after one index up;
   chainsOfCubes.Insert(index, newNumber);

}

// DONE!!!!!...............I THINK

function fuseBlock( startBlockIndex : int, targetIndex : int) {
// startBlockIndex should be the first index in the block to move to target but this function will change
// this variable to find the start so any index in the block will do. the targetIndex however will need to be accurate.
// if it's a collision with 'other' from 'other's left side the targetIndex should be the same as 'other's index in the list
// if it's from the other side the targetIndex should be  'other's index + 1;

	var count : int = 0;
	while (startBlockIndex > 0 && chainsOfCubes[startBlockIndex-1] != -1){
	//sets the starting point for the block to actually be the first in the block
	
		startBlockIndex--;
	}

	while (chainsOfCubes[(startBlockIndex + count)] != -1) {
		//counts how many needs to be moved
		count ++;
	}
	//copies the block to a temp-workspace-int[]
	chainsOfCubes.CopyTo(startBlockIndex,chainsOfCubesTemp,0,count); //index,targetarray,targetindex,itemcount
	// removes the block and the extra -1 separator
	chainsOfCubes.RemoveRange(startBlockIndex,count+1);	
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
