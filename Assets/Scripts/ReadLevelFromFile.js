#pragma strict
import System.IO;
import System;

private var levelData : LevelData;

public function ReadFile (fileContent : String) : List.<String> {
	var splitOnThis : String[] = ["\n","\r"];
	var charSplitOnThis : char[] = ["\n"[0], ","[0], " "[0],"\r"[0]];
	var lines = fileContent.Split(splitOnThis,StringSplitOptions.RemoveEmptyEntries);
	var themeOfGame = lines[0].Substring((("Subject: ") as String).Length);
	//Return value to contain all return stuffs
	var ret : List.<String> = new List.<String>();
	
	levelData = gameObject.GetComponent(LevelCreator).Data;
	levelData.LevelGoalText = levelData.LevelGoalText + " " + themeOfGame + ".";

	
	for(line in lines){
	   	line.TrimEnd(charSplitOnThis);
	}
		    
	for (var c : int = 2; c < lines.Length; c += 0) {
	  	while(lines[c].StartsWith("--") || lines[c].Length == 0 || lines[c].StartsWith("Level ")
	  									|| lines[c].StartsWith("Letters")){
	   		c++;
	   	}
	    	
	   	var letters = lines[c].Split(charSplitOnThis,StringSplitOptions.RemoveEmptyEntries);
	   	
	   	c++;
	   	if(lines[c].StartsWith("Words")){
	   		c++;
	   	}
	   	var words = lines[c].Split(charSplitOnThis,StringSplitOptions.RemoveEmptyEntries);
	    c++;
	    
	    for(var z : int = 0; z < letters.Length; z++){
	    	ret.Add(letters[z]);
	    }
	    //Add -1 and number of words
	    ret.Add("-1");
	    ret.Add(""+words.Length);
	    ret.Add("-1");
	    
	    var indexOf : int;
	    var letter : String;
	   	for(var q : int = 0; q < words.Length; q++){
	    	for(var r : int = 0; r < words[q].Length; r++){
				indexOf = -1;
		    	for(var p : int = 0; p < letters.Length; p++){
		    		if(words[q][r] == letters[p]) {
		    			indexOf = p;
		    		}
		    	}
		    	if(indexOf != -1)
		   			ret.Add(words[q][r].ToString());
				}
			ret.Add("-1");
	   	}
	   	c++;
	}
	return ret;
}
