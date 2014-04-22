#pragma strict
import System.IO;
import System;

public function ReadFile (fileContent : String) : List.<String> {
	var splitOnThis : String[] = ["\n","\r"];
	var charSplitOnThis : char[] = ["\n"[0], ","[0], " "[0],"\r"[0]];
	
	/*if(!File.Exists(Application.streamingAssetsPath + "/" + fileName)){
		return;
	}
	var sr = new StreamReader(Application.streamingAssetsPath + "/" + fileName);
	var fileContents = sr.ReadToEnd();
	sr.Close();
	 */	
	var lines = fileContent.Split(splitOnThis,StringSplitOptions.RemoveEmptyEntries);
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
		   			ret.Add(words[q][p].ToString());
			    	//if(words[q].IndexOf(letters[p]), p){
			    	//	ret.Add(p.ToString());
			  		//}
				}
			ret.Add("-1");
	   	}
	   	c++;
	}
	return ret;
}

