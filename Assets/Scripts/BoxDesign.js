#pragma strict

class BoxDesign extends System.Object {

	public var BoxColor : UnityEngine.Color;
	public var BoxImage : UnityEngine.Texture;
	public var TextColor : UnityEngine.Color;
	public var BoxText : String;

	public function BoxDesign() {
		BoxColor = Color.yellow;
		TextColor = Color.white;
		BoxText = "";
	}

	public function BoxDesign( boxDesign : BoxDesign ) {
		BoxColor = boxDesign.BoxColor;
		BoxImage = boxDesign.BoxImage;
		TextColor = boxDesign.TextColor;
		BoxText = boxDesign.BoxText;
	}
}