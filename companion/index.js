/*
 * Entry point for the companion app
 */

import * as messaging from "messaging";
import MessageBroker from '../common/message-broker';

console.log("Companion code started");
// Listen for the onmessage event

const broker = new MessageBroker('[Companion]');

messaging.peerSocket.onmessage = function(evt) {
    //console.log(`Speaking between device and companion: ${evt.data}`);
    /*
    if(evt.data == "Poweramp - Next") {
        taskerpacmd("NEXT");
    }*/

    switch (evt.data) {
        case 'Poweramp - Button - nextbutton':
            taskerpacmd("NEXT");
            break;
        case 'Poweramp - Button - playbutton':
            taskerpacmd("TOGGLE_PLAY_PAUSE");
            break;
        case 'Poweramp - Button - prevbutton':
            taskerpacmd("PREVIOUS");
            break;
        case 'Poweramp - Status':
            taskerpastatus();
            break;
    }
}


async function taskerpacmd(param) {
    let fetchInit = {method: 'POST', body: param}
    fetch("http://127.0.0.1:5580/pa/cmd",fetchInit).then(function(response) {
    if (response.ok) {
      response.text().then(text => pwastatusresp(text))
    } else {
      response.text().then(text => console.log(`Server response: not OK (${text})`))
    }
  })
  .catch(function(err) {
    console.log(`fetch error (${err}).`)
  })
}

function pwastatusresp(somecontent) {
    //console.log(`Status response: OK (${somecontent})`);
    broker.sendData("Poweramp - Info - "+somecontent);
}

async function taskerpastatus() {
    let fetchInit = {method: 'GET'}
    fetch("http://127.0.0.1:5580/pa/status",fetchInit).then(function(response) {
    if (response.ok) {
      response.text().then(text => pwastatusresp(text))
    } else {
      response.text().then(text => console.log(`Server response: not OK (${text})`))
    }
  })
  .catch(function(err) {
    console.log(`fetch error (${err}).`)
  })

}
