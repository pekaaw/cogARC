#pragma strict
import System.IO;
import System;

var lvlCreator : LevelCreator;

function Start () {
	readFile();
}

function readFile () {
	var fileName = lvlCreator.Data.FileString;
	var splitOnThis : String[] = [","," "];
	
	if(File.Exists(Application.streamingAssetsPath + "/" + fileName)){
		var sr = new StreamReader(Application.streamingAssetsPath + "/" + fileName);
	    var fileContents = sr.ReadToEnd();
	    sr.Close();
	 	
	    var lines = fileContents.Split("\n"[0]);
	    
	    //Les in starten av fila
	    var themeOfGame = lines[0].Substring((("Subject: ") as String).Length);
	    Debug.Log(themeOfGame);
	    
	    for (var c : int = 4; c < lines.Length;) {
	    	var letters = lines[c+3].Split(splitOnThis,StringSplitOptions.RemoveEmptyEntries);
	    	Debug.Log(letters);
	    	
	    	var words = lines[c+5].Split(splitOnThis,StringSplitOptions.RemoveEmptyEntries);
	    	
	    	for(var q : int = 0; q < words.Length; q++){
	    		//Debug.LogWarning("Before: " + words[q]);
	    		for(var l : int = 0; l < words[q].Length; l++){
		    		for(var p : int = 0; p < letters.Length; p++){
		    			if(words[q][l] == letters[p]){
		    				words[q] = words[q].Replace(words[q][l],System.Convert.ToChar(p));
		    				Debug.LogWarning(words[q]);
		    			}
		    		}
	    		}
	    		Debug.LogWarning("After: " + words[q]);
    		}
    		c += 9;
		}
		var ret : List.<String> = new List.<String>();
		for(letter in letters){
			ret.Add(letter);
		}
		for(var k : int = 0; k < words.Length; k++){
			ret.Add(words[k]);
			ret.Add("-1");
		}
		Debug.LogWarning(ret);
		return ret;
	}
}
