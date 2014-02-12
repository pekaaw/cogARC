#pragma strict

public var RightMark : GameObject;
public var WrongMark : GameObject;
public var RightMarkColor : Color;
public var WrongMarkColor : Color;

function Start () {
	if(RightMarkColor != null){
		RightMark.renderer.material.color = RightMarkColor;	
	}else{
		RightMark.renderer.material.color = Color.green;
		RightMarkColor = Color.green;
	}
	if(WrongMarkColor != null){
		WrongMark.renderer.material.color = WrongMarkColor;	
	}else{
		WrongMark.renderer.material.color = Color.red;
		WrongMarkColor = Color.red;
	}
	
	RightMark.SetActive(false);
	WrongMark.SetActive(false);
}

function Update () {
	RightMark.renderer.material.color = RightMarkColor;
	WrongMark.renderer.material.color = WrongMarkColor;
}

function toggleRightMark (placement : Vector3){
	RightMark.SetActive(!RightMark.activeSelf);
	if(RightMark.activeSelf){
		RightMark.transform.position = placement;
	}
}

function toggleWrongMark (placement : Vector3){
	WrongMark.SetActive(!WrongMark.activeSelf);
	if(WrongMark.activeSelf) {
		WrongMark.transform.position = placement;
	}
}