#pragma strict

class BoxDesignScript extends MonoBehaviour {

	private var cubeHandle : GameObject;
	
	public var cubeText : UnityEngine.TextMesh;
	
	public var textRenderer : UnityEngine.MeshRenderer;
	//public var cubeRenderer : UnityEngine.Renderer;
	//public var cubeText2 : TextMesh = null;

	function Start() {
		cubeHandle = new GameObject();
		cubeHandle.name = "GameObject from BoxDesignScript";
		cubeHandle.transform.parent = gameObject.transform.parent;
		cubeHandle.transform.Rotate( 90, 0, 0 );
		//cubeHandle.transform.Translate( 0, 0.01, 0 );
		cubeHandle.transform.position = Vector3(0.0, 0.01, 0.0 );
		
		textRenderer = cubeHandle.AddComponent(MeshRenderer);
		textRenderer.material = new Material( Shader.Find("GUI/Text Shader"));
		
		cubeText = cubeHandle.AddComponent(TextMesh);
		cubeText.anchor = TextAnchor.MiddleCenter;
		cubeText.text = "Heiaa!";
		
		var renderingSize : Vector3;
		var newScale : float;
		
		renderingSize = textRenderer.bounds.size;
		newScale = 1 / renderingSize.x;
		
		cubeText.transform.localScale = Vector2(newScale, newScale); //textSize; // Vector2(1, 0);

		
//		var textSize : Vector3;
//		var textSizeFactor : float;
//		var textSizeNewY : float;
//		var textSizeNew : Vector2;
//		
//		var cubeSize : Vector3;
//		
//		textSize = textRenderer.bounds.size;
//		
//		textSizeFactor = 1 / textSize.x;
//		textSizeNewY = textSizeFactor;
//		
//		textSizeNew = Vector2( textSizeFactor, textSizeNewY );
//		
//		//var renderBounds : Bounds;
//		//renderBounds = textRenderer.bounds;
//		
//		Debug.Log("textSizeFactor: " + textSizeFactor );
//		Debug.Log("textSize.y = " + textSize.y );
//		
//		cubeSize = gameObject.transform.lossyScale;
//		Debug.Log("cubeSize> X: " + cubeSize.x + ", Y: " + cubeSize.y + ", Z: " + cubeSize.z);
		
//		textSize = cubeText.transform.localScale;
//
//		textSizeFactor = 1 / textSize.x;
//		textSizeY = textSize.y * textSizeFactor;
//		
//		textSize = Vector2( 1, textSizeNewY );
//		
//		
//		cubeText.transform.localScale = textSizeNew; //textSize; // Vector2(1, 0);
		
		//cubeHandle = gameObject;
		
		
		//Instantiate(cubeHandle, gameObject.transform.position, Quaternion.identity);
		
		//cubeHandle.transform.parent.transform = gameObject.transform;
		Debug.Log("KNYTT TIL " + cubeHandle.transform.parent);
		
		//cubeText = cubeHandle.AddComponent(TextMesh);
		//Debug.Log("er attached to " + gameObject.name);
		//textRenderer = gameObject.AddComponent(MeshRenderer);
		//cubeHandle = gameObject.AddComponent(GameObject);
		
		
		//cubeText2 = new TextMesh(); //GameObject(TextMesh);
		//cubeText2.text = "Heia!";
		//Instantiate(cubeText2);
		//Instantiate(cubeText);
		//Instantiate(cubeRenderer);
		
		//cubeText = cubeText2.AddComponent(TextMesh);
		
		// cubeText2.AddComponent(cubeText);
		
		//cubeText.text = "Jakob sin!";
	}

}