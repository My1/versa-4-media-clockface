//import players from "../players.js";

export class poweramp  {
    //fixed properties
    static myname="poweramp";
    static fancyname="Poweramp"; //can be whatever to look pretty
    static icontext="P"; //currently one letter to be shown next to the Battery Icon
    static cmd="Poweramp"; //8 letters
    //status data
    static title="";
    static artist="";
    static album="";
    static status=0; //1 for playing, anything else is considered not playing
    static rptmode;
    static rndmode;
    static updatestatus(infodata) {
        var infoarray=infodata.split(";;");
        this.title=infoarray[0];
        this.artist=infoarray[1];
        this.album=infoarray[2];
        this.status=infoarray[3];
    }
    constructor(playerobject) {
        //this doesnt work here
        poweramp.init(playerobject);
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


/*

if(players.plist.includes("Poweramp")) {
    console.log("How about no? (Poweramp)");
}
else {
    players.objects["poweramp"]=new poweramp();
}
*/
export default poweramp;
