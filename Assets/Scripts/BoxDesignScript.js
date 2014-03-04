#pragma strict

class BoxDesignScript extends MonoBehaviour {

	private var cubeHandle : GameObject;
	
	public var cubeText : UnityEngine.TextMesh;
	
	public var textRenderer : UnityEngine.MeshRenderer;
	//public var cubeRenderer : UnityEngine.Renderer;
	//public var cubeText2 : TextMesh = null;

	function Start() {
		// Create GameObject to put text on. Bind it to box.
		cubeHandle = new GameObject();
		cubeHandle.name = "GameObject from BoxDesignScript";
		cubeHandle.transform.parent = gameObject.transform.parent;
		cubeHandle.transform.Rotate( 90, 0, 0 );
		cubeHandle.transform.position = Vector3(0.0, 0.01, 0.0 );
		
		// Add a MeshRenderer with textshader
		textRenderer = cubeHandle.AddComponent(MeshRenderer);
		textRenderer.material.shader = Shader.Find("GUI/Text Shader");
		textRenderer.material = Resources.Load("Assets/Gudea-Regular.ttf");
		
		// Add a TextMesh with text
		cubeText = cubeHandle.AddComponent(TextMesh);
		cubeText.anchor = TextAnchor.MiddleCenter;
		cubeText.text = "Heiaa!";
		
		
		// Calculate new scale for text
		var renderingSize : Vector3;
		var newScale : float;
		renderingSize = textRenderer.bounds.size;
		newScale = 1 / renderingSize.x;
		
		// Change scale of text so that it will fit onto the cube
		cubeText.transform.localScale = Vector2(newScale, newScale); //textSize; // Vector2(1, 0);

		//cubeText.text = "Jakob sin!";
	}

}