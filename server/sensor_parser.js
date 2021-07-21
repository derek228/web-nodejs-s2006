const log= new require('./log.js');
const device_log=new log();
const CELL16_ID=[17,18,19,20];
const CELL17_ID=[21,22,23,24];
const CELLA_ID=[1,2,3,9,10,11,12,13,17,18,19,20];
const CELLB_ID=[0,4,5,6,7,8,14,15,16,21,22,23,24];
var SensorFormat={};
SensorFormat.pa="";
SensorFormat.Amin="";
SensorFormat.Aminid="";
SensorFormat.cell16_min="";
SensorFormat.pb="";
SensorFormat.Bmin="";
SensorFormat.Bminid="";
SensorFormat.cell17_min="";

SensorFormat.pva="";
SensorFormat.pvb="";
SensorFormat.nva="";
SensorFormat.nvb="";

SensorFormat.rotor_num="";
SensorFormat.pump="";
SensorFormat.upright="";
SensorFormat.position="";
SensorFormat.reposition="";
SensorFormat.envelope="";
SensorFormat.alarm="";
SensorFormat.mode="";
SensorFormat.falling="";
SensorFormat.mode_step="";
SensorFormat.target_p="";

const DynamicModeStepStr=["Wait_Patient","Find_Min_Distance","Start_Find_Pressure_A","Inflate_A","Keep_A","Start_Find_Pressure_B","Inflate_B","Keep_B","Exit"];
const StaticcModeStepStr=["Wait_Patient","Find_Min_Distance","Inflate_To_Pressure","Inflate_To_Height","Re_Deflate"];
const InitialModeStepStr=["Inflate_A","Inflate_AB","Retry","Check_Distance","Deflate"]

SensorFormat.init=function (mac) {
    //var name = mac.replace(':','');
    //console.log(name);
    device_log.init(mac);
    console.log("Device Log created...");
}
SensorFormat.msg=function() {
    msg = SensorFormat.Amin
}
function ParserMin(sd) {
    let minA=255;
    let Aminid=255;
    let minB=255;
    let Bminid=255;
    for (let id of CELLA_ID) {
        if (minA>sd[id]) {
            minA=sd[id];
            Aminid=id+1;
        }
    }
    SensorFormat.Amin=minA+" ";
    SensorFormat.Aminid=Aminid+" ";
    minA=255;
    Aminid=255;
    for (let id of CELL16_ID) {
        if (minA>sd[id]) {
            minA=sd[id];
            Aminid=id+1;
        }
    }
    SensorFormat.cell16_min=minA+" ";
    for (let id of CELLB_ID) {
        if (minB>sd[id]) {
            minB=sd[id];
            Bminid=id+1;
        }

    }
    SensorFormat.Bmin=minB+" ";
    SensorFormat.Bminid=Bminid+" ";
    minB=255;
    Bminid=255;
    for (let id of CELL17_ID) {
        if (minB>sd[id]) {
            minB=sd[id];
            Bminid=id+1;
        }
    }
    SensorFormat.cell17_min=minB+" ";
}
SensorFormat.parser=function(data) {
    ParserMin(data.sensor_data);
    // mode string
    if (data.rotor_num==15) {
        SensorFormat.mode="ROTOR_VALVE_BUSY "
    }
    else {
        switch (data.mode)	{
            case 0:
                SensorFormat.mode="Power Off ";
                break;
            case 1:
                SensorFormat.mode="Initialize_";
                SensorFormat.mode+=InitialModeStepStr[data.mode_step]+" ";
                break;
            case 2:
                SensorFormat.mode="Ready ";
                break;
            case 3:
                SensorFormat.mode="Patient_On ";
                break;
            case 4:
                SensorFormat.mode="Dynamic_";
                SensorFormat.mode+=DynamicModeStepStr[data.mode_step];
                if (data.target_p !==0) {
                    SensorFormat.mode+="_"+data.target_p+" ";
                }
                // To Do, sub mode description
                break;
            case 5:
                SensorFormat.mode="Static ";
                SensorFormat.mode+=InitialModeStepStr[data.mode_step]+" ";
                // To Do, sub mode description
                break;
            case 6:
                SensorFormat.mode="Max_Inflate ";
                break;
            case 7:
                SensorFormat.mode="Transport ";
                break;
            case 8:
                SensorFormat.mode="DBE ";
                break;
            default:
                SensorFormat.mode="Unknow ";
                break;
        }       
    }
    // pressure string
    switch(data.rotor_num) {
        case 0:
            SensorFormat.pa="255 ";
            SensorFormat.pb="255 "
            break;
        case 1:
            SensorFormat.pa="255 ";
            SensorFormat.pb="255 ";
            break;
        case 2:
            SensorFormat.pa="255 ";
            SensorFormat.pb="255 ";
            break;
        case 4:
            SensorFormat.pa=data.pressure +" ";
            SensorFormat.pb="255 ";
            break;
        case 5:
            SensorFormat.pa=data.pressure+" ";
            SensorFormat.pb="255 ";
            break;
        case 7:
            SensorFormat.pa=data.pressure+" ";
            SensorFormat.pb=data.pressure+" ";
            break;
        case 8:
            SensorFormat.pa="255 ";
            SensorFormat.pb="255 ";
            break;
        case 9:
            SensorFormat.pa="255 ";
            SensorFormat.pb=data.pressure+" ";
            break;
        case 10:
            SensorFormat.pa="255 ";
            SensorFormat.pb=data.pressure+" ";
            break;
        case 3:
        case 6:
        case 11:
        case 12:
        default:
            SensorFormat.pa="255 ";
            SensorFormat.pb="255 ";
            break;
    }


    //rotor string
    SensorFormat.rotor_num=data.rotor_num +" ";

    SensorFormat.pva=data.pva+" ";
    SensorFormat.pvb=data.pvb+" ";
    SensorFormat.nva=data.nva+" ";
    SensorFormat.nvb=data.nvb+" ";
    if (data.pump===0) {
        SensorFormat.pump="Off ";
    }
    else {
        SensorFormat.pump="On ";
    }
    SensorFormat.upright=data.sensor_data[26]+" ";


	switch (data.status) {
		case 0: //flat
            SensorFormat.position="FLAT ";
    		break;
		case 1: // side
    		SensorFormat.position="SIDE ";
		    break;
		case 2: // sit
    		SensorFormat.position="SIT ";
		    break;
		case 3: // empty
		    SensorFormat.position="EMPTY ";
		    break;
		default:
			break;
	}	

    SensorFormat.reposition=data.reposition_time+" ";
    SensorFormat.envelope=data.envelopment_rate+" ";
    SensorFormat.falling=data.falling_risk+" ";
    if (data.failure_code===0) {
        fail_str = "None ";
    }
    else {
        if (f & power_failure) {
            fail_str+="Power, "
        }
        if (f & rotor_failure) {
            fail_str+="Rotor Valve, "
        }
        if (f & low_pressure_failure) {
            fail_str+="Low Pressure, "
        }
        if (f & high_pressure_failure) {
            fail_str+="High Pressure, "
        }
        if (f & sensor_failure) {
            fail_str+="Sensor, "
        }
        if (f & bottoming_failure) {
            fail_str+="Bottoming, "
        }
        fail_str+="Failure "
    }
    SensorFormat.alarm=fail_str;

    msg = data.time+" " +  SensorFormat.pa+SensorFormat.Amin+SensorFormat.Aminid+SensorFormat.cell16_min+
    SensorFormat.pb+SensorFormat.Bmin+SensorFormat.Bminid+SensorFormat.cell17_min+
    SensorFormat.pva+SensorFormat.pvb+SensorFormat.nva+SensorFormat.nvb+
    SensorFormat.rotor_num+SensorFormat.pump+SensorFormat.upright+SensorFormat.position+
    SensorFormat.reposition+SensorFormat.envelope+SensorFormat.alarm+SensorFormat.mode+data.falling_risk;
   //console.log(msg);
    //console.log("device_log file :"+device_log.filename);
    device_log.write(msg,device_log.filename);
}

module.exports=SensorFormat;
