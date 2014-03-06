﻿#pragma strict

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
	
		// store design
		//design = new BoxDesign(); //boxDesign;
		design = boxDesign;
		//design.BoxText = "TestingTesting";
		
		Debug.Log("setDesign is running");
		
		//Debug.Log( "boxDesign: " );
		//Debug.Log( design.BoxText );
		//if( !boxDesign ) {
		//	Debug.Log("boxDesign er null!");
		//}
		
		// Set color on box
		if( designType == CubeDesignEnum.ColouredBox ||
				designType == CubeDesignEnum.TextAndCubeColour ) {
			
			gameObject.renderer.material.color = design.BoxColor;
		}
		
		// Set text on box
		if( !design.BoxText.Empty ) {
			if( (designType == CubeDesignEnum.Text || 
					designType == CubeDesignEnum.TextAndCubeColour) ) {
					
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
				// Create material from texture
				var boxMaterial : Material = new Material(Shader.Find("Transparent/Diffuse"));
				boxMaterial.SetTexture( "_MainTex", design.BoxImage );
				
				// Add Material (we cannot manipulate renderer.materials directly)
				var materials : Array = gameObject.renderer.materials;
				//materials.Add( Resources.Load("BoxPair0", UnityEngine.Material ) );
				materials.Add( boxMaterial );
				gameObject.renderer.materials = materials;
			}
		}
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
		//cubeText.color = design.TextColor;
		cubeText.anchor = TextAnchor.MiddleCenter;
		//cubeText.text = design.BoxText;
		
		Debug.Log("awake is running");
	}
	
	function Start() {

		{ // TEST
//			var bDesign : BoxDesign;
//			
//			bDesign = new BoxDesign();
//
//			setDesign( bDesign, BoxDesignEnum.Image );
		} // TEST ended
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