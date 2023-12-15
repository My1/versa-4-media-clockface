export class applemusic  {
    //fixed properties
    static myname="applemusic";
    static fancyname="Apple Music";
    static icontext="A";
    static cmd="AAPLMusc"; //8 chars
    static url="am";
    constructor(playerobject) {
        //this doesnt seem to work here
        applemusic.init(playerobject);
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

export default applemusic;
