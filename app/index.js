/*
 * Entry point for the watch app
 */
import * as document from "document";
import { vibration } from "haptics";
import * as messaging from "messaging";
import MessageBroker from '../common/message-broker';
import clock from "clock";
import { battery } from "power";
import { charger } from "power";


const broker = new MessageBroker('[FitBit]');

//messaging.peerSocket.send("lol hallo");

//*
document.getElementById("nextbutton").onclick = function() {
    vibration.start("bump");
    broker.sendData("Poweramp - Button - nextbutton");
}
document.getElementById("playbutton").onclick = function() {
    vibration.start("bump");
    broker.sendData("Poweramp - Button - playbutton");
}
document.getElementById("prevbutton").onclick = function() {
    vibration.start("bump");
    broker.sendData("Poweramp - Button - prevbutton");
}
//*/

//let demotext = document.getElementById("demotext");
//demotext.text = "Fitbit Rocks!";


messaging.peerSocket.onmessage = function(evt) {
    //console.log(`Message from Phone: ${evt.data}`);
    if(evt.data.indexOf("Poweramp - Info - ") != -1) {
        var infodata = evt.data.replace("Poweramp - Info - ","");
        var infoarray=infodata.split(";;");
        document.getElementById("title").text=infoarray[0];
        document.getElementById("artist").text=infoarray[1];
        document.getElementById("album").text=infoarray[2];
        if(infoarray[3]==1) {
            document.getElementById("playimage").href="icons/Pause.png";
        }
        else {
            document.getElementById("playimage").href="icons/Play.png";
        }
    }
}

/*
// status every 30sec
var refreshpastatus;
function startrefresher() {
    clearinterval (refreshpastatus);
    refreshpastatus=setInterval(() => {
    //messaging.peerSocket.send("Poweramp - Status");
        broker.sendData("Poweramp - Status");
    }, "10000");
}

function stoprefresher() {
    clearInterval(refreshpastatus);
}

*/
/*
setTimeout(() => {
  //messaging.peerSocket.send("Poweramp - Status");
    broker.sendData("Poweramp - Status");
}, "500");
//*/



clock.granularity = "seconds"; // seconds, minutes, or hours
clock.addEventListener("tick", update);


async function update() {
    //console.log(JSON.stringify(document.getElementById("battouter").style));
    let today=new Date();
    let hours=today.getHours();
    let minutes=today.getMinutes();
    let seconds=today.getSeconds();


    document.getElementById("time").text=monoDigits(hours)+":"+monoDigits(minutes);

    if(seconds%10==0) {
        //console.log("Seconds Mod 10:"+(seconds%10));
        broker.sendData("Poweramp - Status");
    }
    //*/

    var battlv=Math.floor(battery.chargeLevel);
    //var battlv=80; //fake battery for debug

    document.getElementById("batterypercent").text=battlv;

    if(battlv<50) {
        document.getElementById("battouter").sweepAngle=270*(battlv)*2/100;
        document.getElementById("battinner").sweepAngle=0;
    }
    else {
        document.getElementById("battinner").sweepAngle=240*(battlv-50)*2/100;
        document.getElementById("battouter").sweepAngle=270;
    }
//*
    if(charger.connected == true) {
        document.getElementById("battinner").style.fill="#00ff00";
        document.getElementById("battouter").style.fill="#00ff00";
        document.getElementById("batterypercent").style.fill="white";
    }
    else if(battlv>50) {
        document.getElementById("battinner").style.fill="#80c0ff";
        document.getElementById("battouter").style.fill="#4073bf";
        document.getElementById("batterypercent").style.fill="white";
    }
    else if(battlv>25) {
        document.getElementById("battouter").style.fill="#ffff00";
        document.getElementById("batterypercent").style.fill="white";
    }
    else if(battlv>10) {
        document.getElementById("battouter").style.fill="#e09000";
        document.getElementById("batterypercent").style.fill="white";
    }
    else {
        document.getElementById("battouter").style.fill="#ff0000";
        document.getElementById("batterypercent").style.fill="#ff0000";
    }
//*/
}

update();


// Convert a number to a special monospace number
function monoDigits(num, pad = true) {
  let monoNum = '';
  if (typeof num === 'number') {
    num |= 0;
    if (pad && num < 10) {
      monoNum = c0 + monoDigit(num);
    } else {
      while (num > 0) {
        monoNum = monoDigit(num % 10) + monoNum;
        num = (num / 10) | 0;
      }
    }
  } else {
    let text = num.toString();
    let textLen = text.length;
    for (let i = 0; i < textLen; i++) {
      monoNum += monoDigit(text.charAt(i));
    }
  }
  return monoNum;
}

const c0 = String.fromCharCode(0x10);
const c1 = String.fromCharCode(0x11);
const c2 = String.fromCharCode(0x12);
const c3 = String.fromCharCode(0x13);
const c4 = String.fromCharCode(0x14);
const c5 = String.fromCharCode(0x15);
const c6 = String.fromCharCode(0x16);
const c7 = String.fromCharCode(0x17);
const c8 = String.fromCharCode(0x18);
const c9 = String.fromCharCode(0x19);

function monoDigit(digit) {
  switch (digit) {
    case 0: return c0;
    case 1: return c1;
    case 2: return c2;
    case 3: return c3;
    case 4: return c4;
    case 5: return c5;
    case 6: return c6;
    case 7: return c7;
    case 8: return c8;
    case 9: return c9;
    case '0': return c0;
    case '1': return c1;
    case '2': return c2;
    case '3': return c3;
    case '4': return c4;
    case '5': return c5;
    case '6': return c6;
    case '7': return c7;
    case '8': return c8;
    case '9': return c9;
    default: return digit;
  }
}
