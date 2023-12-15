import { inbox, outbox } from "file-transfer";

class ab {

  static ab2str(buf) {
    return String.fromCharCode.apply(null, new Uint16Array(buf));
  }

  static str2ab(str) {
    var buf = new ArrayBuffer(str.length*2); // 2 bytes for each char
    var bufView = new Uint16Array(buf);
    for (var i=0, strLen=str.length; i<strLen; i++) {
      bufView[i] = str.charCodeAt(i);
    }
    return buf;
  }
}

export default ab;
