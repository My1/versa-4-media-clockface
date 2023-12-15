export class applemusic  {
    //fixed properties
    static myname="applemusic";
    static fancyname="Apple Music";
    static icontext="A";
    static cmd="AAPLMusc"; //8 chars
    static artist="";
    static title="";
    static album="";
    static status=0; //1 for playing, anything else is considered not playing
    static rptmode;
    static rndmode;
    static updatestatus(infodata) {
        var infoarray=infodata.split(";;");
        this.title=infoarray[0];
        this.artist=infoarray[1];
        this.album=infoarray[2];
        switch(infoarray[3]) {
            case "playing":
                this.status=1;
                break;
            case "paused":
            case "stopped":
                this.status=0;
                break;
            case "none":
            case "unknown":
            case "error":
                this.status=-1;
                break;
        }
    }
    constructor(playerobject) {
        //this doesnt seem to work here
        applemusic.init(playerobject);
    }
    static init(playerobject) {
        console.log(`Importing...` + this.myname);
        console.log(playerobject.active);
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

//players.objects["applemusic"]=new applemusic();

export default applemusic;
