#pragma strict

class BoxDesignScript extends MonoBehaviour {

	public var design : BoxDesign;
	public var fontName : String;

	private var cubeHandle : GameObject;
	private var cubeText : UnityEngine.TextMesh;
	private var textRenderer : UnityEngine.MeshRenderer;
	private var isInitialized : boolean = false; 

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
		if(!isInitialized){
			setMeUp();
		
		}
	
	
		design = boxDesign;
		
		// Find a shader with transparency
		var useShader : UnityEngine.Shader;
		var shaderCounter : int = 0;
		while( useShader == null )
		{
			switch( shaderCounter )
			{
				case 0:
					// Transparent/Diffused is found in Resources/Alpha-Diffuse.shader
					useShader = Shader.Find("Transparent/Diffuse");
					//Debug.LogWarning("Using shader: Transparent/Diffuse");
					break;
				case 1:
					useShader = Shader.Find("Transparent/VertexLit");
					//Debug.LogWarning("Using shader: Transparent/VertexLit");
					break;
				case 2:
					useShader = Shader.Find("Transparent/Bumped Diffuse");
					//Debug.LogWarning("Using shader: Transparent/Diffuse");
					break;
				case 3:
					useShader = Shader.Find("Transparent/Bumped Specular");
					//Debug.LogWarning("Using shader: Transparent/Diffuse");
					break;
				case 4:
					useShader = Shader.Find("Transparent/Parallax Diffuse");
					//Debug.LogWarning("Using shader: Transparent/Diffuse");
					break;
				default:
					useShader = Shader.Find("Diffuse");
					//Debug.LogWarning("Using default shader: Diffuse");
					break;
			}
			
			if( shaderCounter >= 10 )
			{
				Debug.LogError("Shader not found.");
				return;
			}
			
			shaderCounter++;
		}
		
		// Set the shader that we found
		gameObject.renderer.material.shader = useShader;
		
		
		// Set color on box
		if( designType == CubeDesignEnum.ColouredBox ||
				designType == CubeDesignEnum.TextAndCubeColour ) {
			
			// Set color from design to gameObject
			gameObject.renderer.material.color = design.BoxColor;
		}
		
		// Set text on box
		if( !design.BoxText.Empty ) {
			if( designType == CubeDesignEnum.TextAndCubeColour ) {
					
				cubeText.text = design.BoxText;

				// Scale text to fit on cube
				setLocalScale();
		
				// Set color on text
				cubeText.color = design.TextColor;
			}
		}
		
		// If we have a texture we want on the cube
		if( designType == CubeDesignEnum.BoxImage ) {
			if( design.BoxImage != null) {
								
				// Set color on box
				gameObject.renderer.material.color = design.BoxColor;
				
				var texMaterial : UnityEngine.Material = new Material(useShader);				
				var matArray : Array = gameObject.renderer.materials;
				
				texMaterial.SetTexture( "_MainTex", design.BoxImage );
				if(matArray.Count < 1) //if it only has default diffuse 
				{
					matArray.Add(texMaterial);
				} else {
					matArray[1] = texMaterial;
				}
				gameObject.renderer.materials = matArray;
				
				// Set material from texture
				//gameObject.renderer.material.SetTexture( "_MainTex", design.BoxImage );
				
			}
		}
	}

	function Awake() {
		if(!isInitialized){
			setMeUp();
		
		}
	}
	
	function Start() {

	}
	
	private function setLocalScale() {
		
		var renderingSize : Vector3;
		var newScale : float;
		var scaleX : float;
		var scaleY : float;
		
		// Get size and calculate new scaling to get text to fit
		renderingSize = textRenderer.bounds.size;
		scaleX = 1 / renderingSize.x;
		scaleY = 1 / renderingSize.y;
		
		// Scale should not be more than 2 and
		// never ever more than 5.
		if( scaleX > 5 )
		{
			scaleX = 1;
		}
		if( scaleY > 5 )
		{
			scaleY = 1;
		}
		
		newScale = Mathf.Min(scaleX, scaleY) * 0.7;
		
		// Change scale of text so that it will fit onto the cube
		cubeText.transform.localScale = Vector2( newScale, newScale );
	}
	private function setMeUp(){
		// Create GameObject to put text on. Bind it to box.
		cubeHandle = new GameObject();
		cubeHandle.name = "TextMeshToBox";
		cubeHandle.transform.parent = gameObject.transform;
		cubeHandle.transform.rotation = Quaternion.identity;
		cubeHandle.transform.Rotate( Vector3( 90, 0, 0 ) );
		// 0.51 to translate text from middle of cube to outside and avoid clipping
		cubeHandle.transform.localPosition = Vector3( 0.0, 0.51, 0.0 );
		
		// Add a MeshRenderer with font-material
		textRenderer = cubeHandle.AddComponent(MeshRenderer);
		textRenderer.material = Resources.Load(fontName, Material);
		
		// Add a TextMesh with text
		cubeText = cubeHandle.AddComponent(TextMesh);
		cubeText.font = Resources.Load(fontName, Font);
		//cubeText.color = design.TextColor;
		cubeText.anchor = TextAnchor.MiddleCenter;
		//cubeText.text = design.BoxText;
		
		isInitialized = true;
	}

}
