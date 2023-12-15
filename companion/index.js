/*
 * Entry point for the companion app
 */

import * as messaging from "messaging";
import MessageBroker from '../common/message-broker';
import { inbox,outbox } from "file-transfer";
import ab from '../common/ab';
import { settingsStorage } from "settings";
import * as utils from "../common/utils";
import players from "./players"

var httpkey

console.log("Companion code started");


//*

// Listen for the onmessage event

const broker = new MessageBroker('[Companion]');
messaging.peerSocket.onmessage = function(evt) {
    //console.log(`Speaking between device and companion: ${evt.data}`);
  if(evt.data.substring(8,20) === " - Button - ") {
    var playercmd=evt.data.substring(0,8);
    switch (evt.data.substring(20)) {
        case 'nextbutton':
            taskerpacmd(playercmd,"NEXT");
            break;
        case 'playbutton':
            taskerpacmd(playercmd,"TOGGLE_PLAY_PAUSE");
            break;
        case 'prevbutton':
            taskerpacmd(playercmd,"PREVIOUS");
            break;
        case 'Status':
            taskerpastatus();
            break;
    }
  }
}
//*/

async function taskerpacmd(playercmd,param) {
    var player=players.cmdnames[playercmd];
    let fetchInit = {method: 'POST', body: param, headers:{key: httpkey}};
    console.log(`http://127.0.0.1:5580/${players.objects[player]["url"]}/cmd`);
    fetch(`http://127.0.0.1:5580/${players.objects[player]["url"]}/cmd`,fetchInit).then(function(response) {
    if (response.ok) {
      response.text().then(text => statusresp(player,text))
    } else {
      response.text().then(text => console.log(`Server response: not OK (${text})`))
    }
  })
  .catch(function(err) {
    console.log(`fetch error (${err}).`)
  })
}


//get status info from Tasker
async function taskerpastatus() {
    console.log("updating Status...");
    let fetchInit = {method: 'GET'};
    let fetchUrl = "http://127.0.0.1:5580/{player}/status";


    players.plist.forEach(async (singleplayer) => {
        console.log(`Updating Status for ${singleplayer}`)
        fetch(fetchUrl.replace(/{player}/g,players.objects[singleplayer]["url"]),fetchInit).then(function(response) {
        if (response.ok) {
          response.text().then(text => statusresp(singleplayer,text))
        } else {
          response.text().then(text => console.log(`Server response: not OK (${text})`))
        }
    })
    .catch(function(err) {
      console.log(`fetch error (${err}).`)
    });

  })


}

//Actually send Info out to watch
function statusresp(playername,somecontent) {
    console.log(`Status response: OK (${players.objects[playername].cmd}  -  ${somecontent})`);
    broker.sendData(players.objects[playername].cmd+" - Info - "+somecontent);
    //sendfile("Poweramp - Info - "+somecontent);
}

function sendfile (strdata) {
  //timestamp filename down to msec to make sure filenames are unique and timed
  let today=new Date();
  let year = utils.zeroPad(today.getUTCFullYear(),4);
  let month = utils.zeroPad((today.getUTCMonth()+1),2);
  let day = utils.zeroPad(today.getUTCDate(),2);
  let hour = utils.zeroPad(today.getUTCHours(),2);
  let min = utils.zeroPad(today.getUTCMinutes(),2);
  let sec = utils.zeroPad(today.getUTCSeconds(),2);
  let msec = utils.zeroPad(today.getUTCMilliseconds(),3);
  let timestamp=`${year}-${month}-${day}T${hour}_${min}_${sec}.${msec}Z`;
  let filename=`${timestamp}.txt`;

  //convert to array buffer
  let data=ab.str2ab(strdata);

  outbox.enqueue(filename, data)
    .then((ft) => {
      console.log(`Transfer of ${ft.name} successfully queued.`);
    })
    .catch((error) => {
      console.log(`Failed to queue ${filename}: ${error}`);
    })
}

function stringToBytes(val) {
    const result = [];
    for (let i = 0; i < val.length; i++) {
        result.push(val.charCodeAt(i));
    }
    return result;
}


// Process the inbox queue for files, and read their contents as text
async function processAllFilesComp() {
  console.log("pulling files...");
  let file;
  while ((file = await inbox.pop())) {
    console.log(`Incoming: ${file.name}`);
    var utcstamp = file.name.replace(/_/g,":").replace(".txt","");
    console.log(utcstamp);
    var ftime = new Date(utcstamp).getTime();
    var today = new Date().getTime();
    if(ftime<today-60000) {
      console.log(`too old. ${ftime} ; now: ${today}`)
      //ignore files after 60 seconds
      continue;
    }
    const payload = ab.ab2str(await file.arrayBuffer());
    console.log(`File name: ${file.name} file contents: "${payload}"`);
    switch (payload) {
      case 'Poweramp - Button - nextbutton':
          console.log("next");
          taskerpacmd("NEXT");
          break;
      case 'Poweramp - Button - playbutton':
        console.log("play");
          taskerpacmd("TOGGLE_PLAY_PAUSE");
          break;
      case 'Poweramp - Button - prevbutton':
        console.log("prev");
          taskerpacmd("PREVIOUS");
          break;
      case 'Poweramp - Status':
          taskerpastatus();
          break;
    }
  }
}



function setkey(evt) {
  const defaultkey="AXAwFDaivNYkpUiKn36FN7RbjmbY79iH";
  var value = settingsStorage.getItem("httpkey");
  try {
    httpkey = JSON.parse(value).name;
  }
  catch(ex) {
    httpkey = value;
  }

  console.log (`Tasker Key: "${httpkey}"`);
  if(httpkey===null || httpkey==="") {
    console.log("no key. setting default...");
    settingsStorage.setItem("httpkey", defaultkey);
    httpkey=defaultkey;
  }
}

//set Key before anything else.
setkey(null);


// Process new files as they are received
inbox.addEventListener("newfile", processAllFilesComp);

// Also process any files that arrived when the companion wasn’t running
processAllFilesComp();

//sendfile("hello");
taskerpastatus();

inbox.addEventListener("newfile", processAllFilesComp);
settingsStorage.onchange = setkey;
