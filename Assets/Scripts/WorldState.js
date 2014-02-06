#pragma strict

var fusionLock : System.Threading.Mutex = new System.Threading.Mutex(true);
var NUMBER_OF_SIDES : int = 6;
var NUMBER_OF_CUBES : int  = 10;
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
var ChainsOfMemories : Array = new Array(); // -1 must be at the end and between separated chains




 
function Start () {
}

function Update () {
var outputTextGO : UnityEngine.GameObject = gameObject.FindGameObjectWithTag("OutputOnScreen");
	var outputTextC : UnityEngine.TextMesh = outputTextGO.GetComponent(UnityEngine.TextMesh); 
	if(!outputTextC) {return;}
	var currentState : String = ""; 
	
	for(var i : int  = 0 ; i < WorldState.length ; i++) {
		currentState += WorldState[i] + " ";
		if(!((i+1)%NUMBER_OF_SIDES))
		{
			currentState += "\n";
		}
	}
	
	
	for(var c : int  = 0 ; c < ChainsOfMemories.length ; c++) {
		currentState += ChainsOfMemories[c] + " ";
	}
	
	
	outputTextC.text = currentState;
	ClearData();
}

function SetData(idNumber: int,otherIdNumber: int, sideHit : int) : void {
	if(WorldState[idNumber * NUMBER_OF_SIDES + sideHit] < 0) {
			WorldState[idNumber * NUMBER_OF_SIDES + sideHit] = otherIdNumber;
			if(sideHit > 1) {
				if (sideHit == 4 || sideHit ==2) {
					AddToChain(idNumber, otherIdNumber, false);
				}
				AddToChain(idNumber, otherIdNumber, true);
			}
		}
	else {
	// :::::TO DO:::: 	
	// odd case : more than one collition on this side, do something smart!
	}
}

function RemoveConnection(idNumber : int,otherIdNumber : int) : void{
	for (var i : int = 0; i < NUMBER_OF_SIDES ; i ++) {
		if (WorldState[idNumber * NUMBER_OF_SIDES + i] == otherIdNumber) {
			WorldState[idNumber * NUMBER_OF_SIDES + i] = -1;
		}
	}
}

function ClearData() : void {
	for ( var i : int  = 0 ; i < WorldState.length ; i++) {
				WorldState[i] = -1;
	}
	ChainsOfMemories.Clear();
	//ChainsOfMemories.Add(-1);

}

function AddToChain(idNumber : int, otherIdNumber : int, leftOfOther : boolean) : void { // me?(leftof(other))
	var index : int = -1;
	var indexOther : int = -1;
	
	if(ChainsOfMemories.length < 1) {
		
	
	
	}
	for (var i : int = 0 ; i < ChainsOfMemories.length ; i++) {
		if(ChainsOfMemories[i] == idNumber) {
			index = i;
			
		}
		if(ChainsOfMemories[i] == otherIdNumber) {
			indexOther = i;
			
		}
	}
	if(Mathf.Abs(index - indexOther) == 1 && index != -1 && indexOther != -1) {
		return; //these have already been connected , the difference is 1 and both are set.
	}
	
	if(index == -1) {
		//the index is not in the list so add new
		if(indexOther == -1) {
			//add new pair at the end
			if(leftOfOther) {
				addPairAtEnd(ChainsOfMemories,idNumber,otherIdNumber);
			} else {
				addPairAtEnd(ChainsOfMemories,otherIdNumber,idNumber);
			}
		} else {
			//connect new to 'other'. 'other' should already be part of a chain.
			if(leftOfOther) {
				insertAtIndex(ChainsOfMemories,idNumber,indexOther);
			} else {
				insertAtIndex(ChainsOfMemories,idNumber,indexOther+1);
			}
		}
	} else {
	//the one you are trying to connect is already connected to something else
	
	
	if ( indexOther == -1) {
		if(leftOfOther) {
			insertAtIndex(ChainsOfMemories,indexOther,idNumber+1);
		} else {
			insertAtIndex(ChainsOfMemories,indexOther,idNumber);
		}
	} else {
	
		//brutal block fusing time!!!!!!!!!!1
		
		
		if(leftOfOther) {
			fuseBlock(ChainsOfMemories, indexOther, index + 1);
		} else {
			fuseBlock(ChainsOfMemories, indexOther, index);
		}
		
		
		}
	
	}
	
}




//:::::::::::::::::::. Utility Functions::::::::::::::::::::::::::::::::
/*function addAtEnd(arr:Array,first : int) {
//for adding the new number to the right end of the very last block
// only use in this very specific case
	arr.Add(first);
	swap(arr,arr.length-1,arr.length-2);
}*/

function addPairAtEnd(arr:Array,first : int, second : int) {
// when neither are in any blocks from before add both
   arr.Add(first);
   arr.Add(second);
   arr.Add(-1);
}

function insertAtIndex(arr:Array, newNumber : int, index : int) {
// inserts 'newNumber' at index 'index' in 'arr'
   var itterator : int = arr.length;
   arr.Add(newNumber);
   
	while (itterator > index) {
		swap(arr,itterator,itterator-1);
		itterator --;
	}
	
}



// DONE!!!!!...............I THINK

function fuseBlock(arr:Array, startBlockIndex : int, targetIndex : int) {
//fuse a block at the startingblockindex with another at the targetIndex by moving it.
	fusionLock.Close();
	while (startBlockIndex != 0 && arr[startBlockIndex - 1] != -1) {
	// this while loop is a startblockindex fix, should not run once if fuseblock function was called correctly
	// NB! fix for targetIndex is not possible
	//  
	
	
		startBlockIndex --;
	}

	var nextTarget: int = arr[startBlockIndex];
	
	if(targetIndex > startBlockIndex) {   

		
	
		while(nextTarget != -1) {
		// the target index is ajusted in this forloop to use the
		// same targets for left and right of the block regardles
		// of wether the current block is higher or lower in the array;
			for (var i : int = startBlockIndex ; i < targetIndex-1; i++) {
				swap(arr,i,i+1);
			}
			nextTarget = arr[startBlockIndex];
		}
		arr.splice(startBlockIndex,1); //remove the extra -1 separator
		//http://stackoverflow.com/questions/638381/fastest-way-to-delete-one-entry-from-the-middle-of-array
		
	}
	else {
		
		while ( ChainsOfMemories[startBlockIndex + 1] != -1) {
			startBlockIndex ++;
		}
		
		
		while(nextTarget != -1) {
			for (var j : int = startBlockIndex ; j > targetIndex; j--) {
				swap(arr,j,j-1);
			}
			nextTarget = arr[startBlockIndex];
		} 
		arr.splice(startBlockIndex,1); //remove the extra -1 separator

	}
	fusionLock.ReleaseMutex();
}


function swap(arr:Array, i : int, j : int) {
    var temp:int = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
}