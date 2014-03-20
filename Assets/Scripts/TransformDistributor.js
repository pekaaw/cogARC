#pragma strict


function Start () {

}

function Update () {

}

function GetMarker(ID : int) : GameObject {


	var markers : Array = gameObject.GetComponentsInChildren(IDScript);
 

	for (var child : IDScript in markers)
	{
	 	if(child.GetComponent(IDScript).ID == ID)
   		{
   			return child.gameObject;
   		}

	}
	return null;

}