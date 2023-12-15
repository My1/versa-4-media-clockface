import * as document from "document";
import { vibration } from "haptics";
import poweramp from "./players/poweramp.js";
import applemusic from "./players/applemusic.js";
import * as utils from "../../common/utils";

class players {
    //this list has the name of the jsfile/class of each player
    static plist=new Array();

    // for easier processing all player command Names will be 8 letters (set in their respective class);
    //cmdnames is an inverse-lookup for player by cmdname
    static cmdnames=new Array();
    static active=""; //active player via plist name
    static objects=[];
    static sendcmd(broker,command) {
        switch(command) {
            case "prev":
                utils.transmitcmd(broker,`${this.objects[players.active]["cmd"]} - Button - prevbutton`);
                vibration.start("bump");
                break;
            case "play":
                utils.transmitcmd(broker,`${this.objects[players.active]["cmd"]} - Button - playbutton`);
                vibration.start("bump");
                break;
            case "next":
                utils.transmitcmd(broker,`${this.objects[players.active]["cmd"]} - Button - nextbutton`);
                vibration.start("bump");
                break;
        }
    }

    static changeplayer() {
        var activeindex=this.plist.indexOf(this.active);
        //if we reached the end, return to start
        if(activeindex >= this.plist.length - 1) {
            this.active=this.plist[0];
        }
        //otherwise just go to next
        else {
            this.active=this.plist[activeindex+1];
        }
        document.getElementById("activeplayer").text=this.objects[this.active].icontext;
        document.getElementById("title").text=this.objects[this.active].title;
        document.getElementById("artist").text=this.objects[this.active].artist;
        document.getElementById("album").text=this.objects[this.active].album;
        if(this.objects[this.active].status==1) {
            document.getElementById("playimage").href="icons/Pause.png";
        }
        else {
            document.getElementById("playimage").href="icons/Play.png";
        }
    }
}

if(players.active==="") {
    console.log("Importing players...");
    new poweramp(players);
    new applemusic(players);
    players.active=players.plist[0];
    document.getElementById("activeplayer").text=players.objects[players.active].icontext;
    console.log("All Players: " + players.plist);
    console.log("active player: " + players.active);

}

export default players;
