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

	public function ToJSONObject() : Boomlagoon.JSON.JSONObject {
		var returnObject : Boomlagoon.JSON.JSONObject = new Boomlagoon.JSON.JSONObject();
		
		// save color
		var colorObject : Boomlagoon.JSON.JSONObject = new Boomlagoon.JSON.JSONObject();
		colorObject.Add( "r", this.BoxColor.r.ToString() );
		colorObject.Add( "g", this.BoxColor.g.ToString() );
		colorObject.Add( "b", this.BoxColor.b.ToString() );
		colorObject.Add( "a", this.BoxColor.a.ToString() );
		returnObject.Add( "BoxColor", colorObject );
		
		// if texture, save it
		if( this.BoxImage ) {
			returnObject.Add( "BoxImage", this.BoxImage.ToString() );
		}
		
		// save TextColor
		var textColorObject : Boomlagoon.JSON.JSONObject = new Boomlagoon.JSON.JSONObject();
		textColorObject.Add( "r", this.TextColor.r.ToString() );
		textColorObject.Add( "g", this.TextColor.g.ToString() );
		textColorObject.Add( "b", this.TextColor.b.ToString() );
		textColorObject.Add( "a", this.TextColor.a.ToString() );
		returnObject.Add( "TextColor", textColorObject );
		
		//save BoxText		
		returnObject.Add( "BoxText", this.BoxText );


//		returnObject.Add( "BoxImage", this.BoxImage.ToString() );
//		returnObject.Add( "TextColor", this.TextColor.ToString() );
//		returnObject.Add( "BoxText", this.BoxText.ToString() );
		
		return returnObject;
	}
	
	public function FromJSONObject( jsonObject : Boomlagoon.JSON.JSONObject ) {
		
	}
}