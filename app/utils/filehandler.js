import * as fs from "fs";
import { inbox,outbox } from "file-transfer";
import ab from '../../common/ab';

export function stringToBytes(val) {
    const result = [];
    for (let i = 0; i < val.length; i++) {
        result.push(val.charCodeAt(i));
    }
    return result;
}

export function sendfile (strdata) {
  //filename in msec for uniqueness and time awareness
  let today=new Date();
  let year = zeroPad(today.getUTCFullYear(),4);
  let month = zeroPad((today.getUTCMonth()+1),2);
  let day = zeroPad(today.getUTCDate(),2);
  let hour = zeroPad(today.getUTCHours(),2);
  let min = zeroPad(today.getUTCMinutes(),2);
  let sec = zeroPad(today.getUTCSeconds(),2);
  let msec = zeroPad(today.getUTCMilliseconds(),3);
  let timestamp=`${year}-${month}-${day}T${hour}_${min}_${sec}.${msec}Z`;
  let filename=`${timestamp}.txt`;
  //encode to arraybuffer
  console.log("outgoing: "+stringToBytes(strdata));
  let data=ab.str2ab(strdata);
  console.log("outgoing bytearray: "+data);
  outbox.enqueue(filename, data)
    .then((ft) => {
      console.log(`Transfer of ${ft.name} successfully queued.`);
      var filelogger = setInterval(function () {
        console.log(ft.readyState);
        if(ft.readyState === "transferred") {
          clearInterval(filelogger);
        }
      }, 1000);
    })
    .catch((error) => {
      console.log(`Failed to queue ${filename}: ${error}`);
    })
}


//process inbox

export function processAllFiles() {
  let fileName;
  while (fileName = inbox.nextFile()) {
    // process each file
    var utcstamp = fileName.replace(/_/g,":").replace(".txt","");
    console.log(utcstamp);
    var ftime = new Date(utcstamp).getTime();
    var today = new Date().getTime();
    if(ftime>=(today-60000)) {
      console.log("Received:", fileName);
      let data=ab.ab2str(fs.readFileSync(fileName));
      parsemessage(data);
    }
    else {
      console.log(`too old: ${ftime} ; now: ${today}`);
    }
    fs.unlinkSync(fileName);
  }
}

console.log("Adding File Handler on watch");
inbox.addEventListener("newfile", processAllFiles);
processAllFiles();
