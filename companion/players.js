
// ############################   COMPANION     ##########################

import poweramp from "./players/poweramp.js";
import applemusic from "./players/applemusic.js";

class players {
    //this list has the name of the jsfile/class of each player
    static plist=new Array();

    // for easier processing all player command Names will be 8 letters (set in their respective class);
    //cmdnames is an inverse-lookup for player by cmdname
    static cmdnames=new Array();
    static active=""; //active player via plist name
    static objects=[];
}

if(players.active==="") {
    console.log("Importing players...");
    new poweramp(players);
    new applemusic(players);
    console.log("All Players: " + players.plist);
    console.log(players.objects["poweramp"].url);
}

export default players;
