/*
 * Entry point for the watch app
 */
import * as document from "document";
import * as messaging from "messaging";
import MessageBroker from '../common/message-broker';
import inbox from "file-transfer";
import clock from "clock";
import batteryicon from './utils/batteryicon';
import mononums from './utils/mononums';
import players from './utils/players';
import "./utils/filehandler.js";
import * as utils from "../common/utils";
import { display } from "display";

const broker = new MessageBroker('[FitBit]');

//*
//set up the buttons
document.getElementById("prevbutton").onclick = function() {
    players.sendcmd(broker,"prev");
}
document.getElementById("playbutton").onclick = function() {
    players.sendcmd(broker,"play");
}
document.getElementById("nextbutton").onclick = function() {
    players.sendcmd(broker,"next");
}
document.getElementById("changeplayer").onclick = function() {
    players.changeplayer();
}
//*/

//*
messaging.peerSocket.onmessage = function(evt) {
    //console.log(`Message from Phone: ${evt.data}`);
    //info Responses are always formatted "???????? - Info - Title;;Artist;;Album;;status" with the 8 questionmarks being the respecting individualplayer.cmd
    parsemessage (evt.data);
}
//*/
//general purpose incoming messageparser
function parsemessage(msg) {
  if(msg.substring(8,18) === " - Info - ") {
    //console.log(players.cmdnames);
    var updatecmd=msg.substring(0,8);
    //classes of individualplayer.cmd can be looked up by players.cmdnames (which is the first 8 characters of the incoming Message)
    console.log("Update: "+updatecmd+ " " +players.cmdnames[updatecmd]);
    players.objects[`${players.cmdnames[updatecmd]}`].updatestatus(msg.substring(18));
  }
}


clock.granularity = "seconds"; // seconds, minutes, or hours
clock.addEventListener("tick", update);
display.addEventListener("change", () => {
   if (display.on) {
     utils.transmitcmd(broker,"Poweramp - Status")
   }
});

function update() {
    let today=new Date();
    let hours=today.getHours();
    let minutes=today.getMinutes();
    let seconds=today.getSeconds();
    document.getElementById("time").text=mononums.monoDigits(hours)+":"+mononums.monoDigits(minutes);


    //console.log (players.plist);

    document.getElementById("title").text=players.objects[players.active].title;
    document.getElementById("artist").text=players.objects[players.active].artist;
    document.getElementById("album").text=players.objects[players.active].album;
    if(players.objects[players.active].status==1) {
        document.getElementById("playimage").href="icons/Pause.png";
    }
    else {
        document.getElementById("playimage").href="icons/Play.png";
    }

    //update the battery icon
    batteryicon.update();
    /*
    if(seconds%10==0) {
        //console.log("Seconds Mod 10:"+(seconds%10));
        //transmitcmd("Poweramp - Status");
    }
    //*/

}

update();


