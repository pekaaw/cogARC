#pragma strict

class BoxDesignScript extends MonoBehaviour {

	public var design : BoxDesign;
	public var fontName : String;

	private var cubeHandle : GameObject;
	private var cubeText : UnityEngine.TextMesh;
	private var textRenderer : UnityEngine.MeshRenderer;
	//private var fontName : String;

	function BoxDesignScript() {
		design = new BoxDesign();
		design.BoxText = "Box";
		fontName = "Gudea-Bold";
	}
	
	function BoxDesignScript( boxDesign : BoxDesign ) {
		BoxDesignScript();
		design = boxDesign;
	}
	
	function BoxDesignScript( font : String ) {
		BoxDesignScript();
		fontName = font;
	}
	
	function BoxDesignScript( boxDesign : BoxDesign, font : String ) {
		design = boxDesign;
		fontName = font;
	}
	
	public function setDesign( boxDesign : BoxDesign ) {
		// TODO: change TextMesh according to boxDesign
	}

	public function setupBoxDesign() {
		Awake();
	}
	
	function Awake() {
		cubeHandle = new GameObject();
	}
	
	function Start() {
		// TODO: Setup for TextMesh
		
		// Create GameObject to put text on. Bind it to box.
		cubeHandle = new GameObject();
		cubeHandle.name = "GameObject from BoxDesignScript";
		cubeHandle.transform.parent = gameObject.transform.parent;
		cubeHandle.transform.rotation = Quaternion.identity;
		cubeHandle.transform.Rotate( Vector3( 90, 0, 0) );
		//cubeHandle.transform.rotation = Quaternion( 90, 0, 0, 0 ); //  Rotate( 90, 0, 0 );
		//cubeHandle.transform.localRotation = Quaternion( 90, 0, 0, 0 );
		cubeHandle.transform.localPosition = Vector3( 0.0, 0.01, 0.0 );
		//cubeHandle.transform.position = Vector3( 0.0, 0.01, 0.0 );
		
		// Add a MeshRenderer with textshader
		textRenderer = cubeHandle.AddComponent(MeshRenderer);
		//textRenderer.material.shader = Shader.Find("GUI/Text Shader");
		textRenderer.material = Resources.Load(fontName, Material);
		
		// Add a TextMesh with text
		cubeText = cubeHandle.AddComponent(TextMesh);
		cubeText.font = Resources.Load(fontName, Font);
		cubeText.color = design.TextColor;
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