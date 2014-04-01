#pragma strict

public var longlivety : float = 5.0;
function Start () {
	
}

function Update () {
	longlivety -= Time.deltaTime;
	
	if(longlivety > 0){
		//show thing
	}
	else{
		Destroy(gameObject);
	}
}