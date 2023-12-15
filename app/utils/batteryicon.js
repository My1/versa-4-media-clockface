import * as document from "document";
import { battery } from "power";
import { charger } from "power";

class batteryicon  {
    static update(msg) {
        //console.log("I update the battery");

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
            document.getElementById("batterypercenpowerampt").style.fill="white";
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
    }
}

export default batteryicon;
