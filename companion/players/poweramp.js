export class poweramp  {
    //fixed properties
    static myname="poweramp";
    static fancyname="Poweramp"; //can be whatever to look pretty
    static icontext="P"; //currently one letter to be shown next to the Battery Icon
    static cmd="Poweramp"; //8 letters
    static url="pa";
    constructor(playerobject) {
        //this doesnt work here
        poweramp.init(playerobject);
    }
    static init(playerobject) {
        console.log(`Importing...` + this.myname);
        if(playerobject.plist.indexOf(this.myname)>-1) {
            console.log("How about no? "+ this.myname );
            return;
        }
        playerobject.objects[this.myname]=this;
        playerobject.cmdnames[this.cmd]=this.myname;
        console.log("Player for "+ this.cmd + ": " +playerobject.cmdnames[this.cmd]);
        playerobject.plist.push(this.myname);
        console.log("Player List after importing this: "+playerobject.plist);
    }
}

export default poweramp;
