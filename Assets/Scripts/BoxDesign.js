#pragma strict

class BoxDesign extends MonoBehaviour {

	public var BoxColor : UnityEngine.Color = Color.gray;
	public var BoxImage : UnityEngine.Texture;
	public var TextColor : UnityEngine.Color = Color.white;
	public var BoxText : String = "";

	public function BoxDesign( boxDesign : BoxDesign ) {
		BoxColor = boxDesign.BoxColor;
		BoxImage = boxDesign.BoxImage;
		TextColor = boxDesign.TextColor;
		BoxText = boxDesign.BoxText;
	}

}