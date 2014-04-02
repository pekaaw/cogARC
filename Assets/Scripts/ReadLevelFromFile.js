#pragma strict
import System.IO;
import System;

var lvlCreator : LevelCreator;

function Start () {
	readFile();
}

function readFile () : List.<String> {
	var fileName = lvlCreator.Data.FileString;
	var splitOnThis : String[] = ["\n","\r"];
	var charSplitOnThis : char[] = ["\n"[0], ","[0], " "[0],"\r"[0]];
	
	if(!File.Exists(Application.streamingAssetsPath + "/" + fileName)){
		return;
	}
	var sr = new StreamReader(Application.streamingAssetsPath + "/" + fileName);
	var fileContents = sr.ReadToEnd();
	sr.Close();
	 	
	var lines = fileContents.Split(splitOnThis,StringSplitOptions.RemoveEmptyEntries);
	for(line in lines){
	   	line.TrimEnd(charSplitOnThis);
	}
	var themeOfGame = lines[0].Substring((("Subject: ") as String).Length);
	Debug.Log(themeOfGame);
	//Return value to contain all return stuffs
	var ret : List.<String> = new List.<String>();
	    
	for (var c : int = 2; c < lines.Length; c += 0) {
	  	while(lines[c].StartsWith("--") || lines[c].Length == 0 || lines[c].StartsWith("Level ")
	  									|| lines[c].StartsWith("Letters")){
	   		c++;
	   	}
	    	
	   	var letters = lines[c].Split(charSplitOnThis,StringSplitOptions.RemoveEmptyEntries);
	   	Debug.LogWarning(lines[c]);
	   	c++;
	   	if(lines[c].StartsWith("Words")){
	   		c++;
	   	}
	   	var words = lines[c].Split(charSplitOnThis,StringSplitOptions.RemoveEmptyEntries);
	    c++;
	    for(var z : int = 0; z < letters.Length; z++){
	    	ret.Add(letters[z]);
	    }
	   	for(var q : int = 0; q < words.Length; q++){
	   		//ret.Add(words[q]);
	   		//ret.Add(words[q].Length.ToString());
	   		ret.Add("-1");
	    	
	    	for(var p : int = 0; p < letters.Length; p++){
		    	if(words[q].Contains(letters[p])){
		    		ret.Add(p.ToString());
		  		}
			}
	   	}
	   	c++;
	}
	return ret;
}

