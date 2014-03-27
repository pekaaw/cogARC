#pragma strict

class BoxDesignScript extends MonoBehaviour {

	public var design : BoxDesign;
	public var fontName : String;

	private var cubeHandle : GameObject;
	private var cubeText : UnityEngine.TextMesh;
	private var textRenderer : UnityEngine.MeshRenderer;

	function BoxDesignScript() {
		design = new BoxDesign();
		design.BoxText = "Box";
		fontName = "Gudea-Bold";
	}
	
	function BoxDesignScript( font : String ) {
		BoxDesignScript();
		fontName = font;
	}
	
	public function setDesign( boxDesign : BoxDesign, designType : CubeDesignEnum ) {
	
		design = boxDesign;
		
		// This we could not use because on the transparent shader is not availible at Android atm
		//gameObject.renderer.material.shader = Shader.Find("Transparent/Diffuse");
		
		// Set color on box
		if( designType == CubeDesignEnum.ColouredBox ||
				designType == CubeDesignEnum.TextAndCubeColour ) {
			
			// Set color from design to gameObject
			gameObject.renderer.material.color = design.BoxColor;
		}
		
		// Set text on box
		if( !design.BoxText.Empty ) {
			/*if( (designType == CubeDesignEnum.Text || 
					designType == CubeDesignEnum.TextAndCubeColour) ) {
					
				cubeText.text = design.BoxText;

				// Scale text to fit on cube
				setLocalScale();
		
				// Set color on text
				cubeText.color = design.TextColor;
			}*/
		}
		
		// If we have a texture we want on the cube
		if( designType == CubeDesignEnum.BoxImage ) {
			if( design.BoxImage != null) {
				// Set material from texture
				gameObject.renderer.material.SetTexture( "_MainTex", design.BoxImage );
			}
		}
	}

	function Awake() {
		// Create GameObject to put text on. Bind it to box.
		cubeHandle = new GameObject();
		cubeHandle.name = "TextMeshToBox";
		cubeHandle.transform.parent = gameObject.transform;
		cubeHandle.transform.rotation = Quaternion.identity;
		cubeHandle.transform.Rotate( Vector3( 90, 0, 0 ) );
		cubeHandle.transform.localPosition = Vector3( 0.0, 0.01, 0.0 );
		
		// Add a MeshRenderer with font-material
		textRenderer = cubeHandle.AddComponent(MeshRenderer);
		textRenderer.material = Resources.Load(fontName, Material);
		
		// Add a TextMesh with text
		cubeText = cubeHandle.AddComponent(TextMesh);
		cubeText.font = Resources.Load(fontName, Font);
		//cubeText.color = design.TextColor;
		cubeText.anchor = TextAnchor.MiddleCenter;
		//cubeText.text = design.BoxText;
		
	}
	
	function Start() {

	}
	
	private function setLocalScale() {
		
		var renderingSize : Vector3;
		var newScale : float;
		
		// Get size and calculate new scaling to get text to fit
		renderingSize = textRenderer.bounds.size;
		newScale = 1 / renderingSize.x;
		
		if( newScale == Mathf.Infinity ) {
			newScale = 1;
		}
		
		// Change scale of text so that it will fit onto the cube
		cubeText.transform.localScale = Vector2( newScale, newScale );
	}

}