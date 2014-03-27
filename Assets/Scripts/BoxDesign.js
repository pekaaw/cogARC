#pragma strict

class BoxDesign extends System.Object {

	public var BoxColor : UnityEngine.Color;
	public var BoxImage : UnityEngine.Texture;
	public var TextColor : UnityEngine.Color;
	public var BoxText : String;

	public function BoxDesign() {
		BoxColor = Color.gray;
		BoxColor.a = 1.0;
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

		if( this.BoxImage != null )
		{
			returnObject.Add( "ImageExist", "true" );
			returnObject.Add( "BoxImage", this.BoxImage.ToString() );
		}
		else
		{
			returnObject.Add( "ImageExist", "false" );
		}
		
		return returnObject;
	}
	
	public function FromJSONObject( jsonObject : Boomlagoon.JSON.JSONObject ) {
		var colorObject : Boomlagoon.JSON.JSONObject;
		var textColorObject : Boomlagoon.JSON.JSONObject;
		var text : String;
		var textureName : String;
		
		var tempValue : Boomlagoon.JSON.JSONValue;
		
		// Get colorObject as a JSONObject
		tempValue = jsonObject.GetValue("BoxColor");
		colorObject = Boomlagoon.JSON.JSONObject.Parse( tempValue.ToString() );

		// Get TextColorObject as a JSONObject
		tempValue = jsonObject.GetValue("TextColor");
		textColorObject = Boomlagoon.JSON.JSONObject.Parse( tempValue.ToString() );
		
		// Get BoxText
		text = jsonObject.GetValue("BoxText").Str;
		
		// Get BoxImage
		if( jsonObject.GetValue("ImageExist").Str == "true" )
		{
			// Get textureName
			textureName = jsonObject.GetString("BoxImage");
			
			// remove the last part of the word to get the name without type
			// example: 'circle_red (UnityEngine.Texture2D)' -> 'circle_red'
			var indexToLastWord : int = textureName.LastIndexOf(" ");
			if( indexToLastWord > -1 )
			{
				textureName = textureName.Remove( indexToLastWord );
			}
		}
		
		// Set the properties and load texture
		this.BoxColor = Color(
			float.Parse(colorObject.GetValue("r").Str),
			float.Parse(colorObject.GetValue("g").Str),
			float.Parse(colorObject.GetValue("b").Str),
			float.Parse(colorObject.GetValue("a").Str) );
		this.TextColor = Color(
			float.Parse(textColorObject.GetValue("r").Str),
			float.Parse(textColorObject.GetValue("g").Str),
			float.Parse(textColorObject.GetValue("b").Str),
			float.Parse(textColorObject.GetValue("a").Str) );
		this.BoxText = text;
		this.BoxImage = Resources.Load( "BoxDesign/" + textureName ) as Texture;
	}
}