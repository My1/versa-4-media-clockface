export function zeroPad(num, places) {
  var zero = places - num.toString().length + 1;
  return Array(+(zero > 0 && zero)).join("0") + num;
}
export function transmitcmd(broker,str) {
  broker.sendData(str);
  //sendfile(str);
}
