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
	
	function BoxDesignScript( font : String ) {
		BoxDesignScript();
		fontName = font;
	}
	
	public function setDesign( boxDesign : BoxDesign ) {
	
		// store design
		design = boxDesign;
		
		// Set color on box
		gameObject.renderer.material.color = design.BoxColor;
		
		// Set text on box (with color)
		cubeText.text = design.BoxText;
		cubeText.color = design.TextColor;
		
		// Create material from texture
		var boxMaterial : Material = new Material(Shader.Find("Transparent/Diffuse"));
		boxMaterial.SetTexture( "_MainTex", design.BoxImage );
		
		// Add Material (we cannot manipulate renderer.materials directly)
		var materials : Array = gameObject.renderer.materials;
		materials.Add( Resources.Load("BoxPair0", UnityEngine.Material ) );
		//materials.Add( boxMaterial );
		gameObject.renderer.materials = materials;

		setLocalScale();
	}

	function Awake() {
		// Create GameObject to put text on. Bind it to box.
		cubeHandle = new GameObject();
		cubeHandle.name = "TextMeshToBox";
		cubeHandle.transform.parent = gameObject.transform.parent;
		cubeHandle.transform.rotation = Quaternion.identity;
		cubeHandle.transform.Rotate( Vector3( 90, 0, 0 ) );
		cubeHandle.transform.localPosition = Vector3( 0.0, 0.01, 0.0 );
		
		// Add a MeshRenderer with font-material
		textRenderer = cubeHandle.AddComponent(MeshRenderer);
		textRenderer.material = Resources.Load(fontName, Material);
		
		// Add a TextMesh with text
		cubeText = cubeHandle.AddComponent(TextMesh);
		cubeText.font = Resources.Load(fontName, Font);
		cubeText.color = design.TextColor;
		cubeText.anchor = TextAnchor.MiddleCenter;
		cubeText.text = design.BoxText;
	}
	
	function Start() {

		{ // TEST
			var bDesign : BoxDesign;
			
			bDesign = new BoxDesign();

			setDesign( bDesign );
		} // TEST ended
	}
	
	private function setLocalScale() {
		
		var renderingSize : Vector3;
		var newScale : float;
		
		// Get size and calculate new scaling to get text to fit
		renderingSize = textRenderer.bounds.size;
		newScale = 1 / renderingSize.x;
		
		// Change scale of text so that it will fit onto the cube
		cubeText.transform.localScale = Vector2( newScale, newScale );
	}

}