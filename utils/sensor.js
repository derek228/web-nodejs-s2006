const color_amber='#F08000'
const color_yellow='#F0F000'
const color_green='#20F000'
const color_blue='#0090F0'
const canvas_width = 200;//400;
const canvas_height = 300;//600;
const mapW=150;//300;//+map_boundary*2;
const mapH=250;//500;//+map_boundary*2;
const map_boundary = 25;//50;//(canvas_width-mapW)/2;
const idW = 30;//60;//50;
const idH = 25;//50;

const sensor_pos = [2/5, 1,
			1/5, 9/10, 2/5, 9/10, 3/5, 9/10,
		4/5,8/10, 3/5,8/10, 2/5, 8/10, 1/5, 8/10, 0, 8/10,
		0, 7/10, 1/5, 7/10, 2/5, 7/10, 3/5, 7/10, 4/5, 7/10,
			3/5,6/10, 2/5,6/10, 1/5,6/10,
		0, 3/10, 1/5,3/10, 3/5,3/10, 4/5, 3/10,
		4/5,2/10, 3/5, 2/10, 1/5, 2/10, 0, 2/10,
			2/5, 1/10];

const sensor_mux01=[ 0, 0,26, 0, 0];
const sensor_mux02=[25,24, 0,23,22];
const sensor_mux03=[18,19, 0,20,21];
const sensor_mux04=[ 0, 0, 0, 0, 0];
const sensor_mux05=[ 0, 0, 0, 0, 0];
const sensor_mux06=[ 0,17,16,15, 0];
const sensor_mux07=[10,11,12,13,14];
const sensor_mux08=[ 9, 8, 7, 6, 5];
const sensor_mux09=[ 0, 2, 3, 4, 0];
const sensor_mux10=[ 0, 0, 1, 0, 0];

const sensor_mux =[	sensor_mux01,sensor_mux02,sensor_mux03,sensor_mux04,
	sensor_mux05,sensor_mux06,sensor_mux07,sensor_mux08,sensor_mux09,sensor_mux10];

var sensor_dist_map01=[ 0, 0,26, 0, 0];
var sensor_dist_map02=[25,24, 0,23,22];
var sensor_dist_map03=[18,19, 0,20,21];
var sensor_dist_map04=[ 0, 0, 0, 0, 0];
var sensor_dist_map05=[ 0, 0, 0, 0, 0];
var sensor_dist_map06=[ 0,17,16,15, 0];
var sensor_dist_map07=[10,11,12,13,14];
var sensor_dist_map08=[ 9, 8, 7, 6, 5];
var sensor_dist_map09=[ 0, 2, 3, 4, 0];
var sensor_dist_map10=[ 0, 0, 1, 0, 0];
	
var sensor_dist_map =[	sensor_dist_map01,sensor_dist_map02,sensor_dist_map03,sensor_dist_map04,
	sensor_dist_map05,sensor_dist_map06,sensor_dist_map07,sensor_dist_map08,sensor_dist_map09,sensor_dist_map10];
	
function remap(sensor) {
	var cnt=0;
	var sum=0;
	for (i=0;i<10;i++) { // create real sensor
		for (j=0;j<5;j++) {
			if (sensor_mux[i][j]!==0) {
				sensor_dist_map[i][j]=sensor[sensor_mux[i][j]-1];
			}
		}
	}
	for (i=1;i<10;i++) { // create visual sensor
		for(j=0;j<5;j++) {
			if (sensor_mux[i][j]===0) { // up and flat
				if (sensor_mux[i-1][j]!==0) { // up
					sum=sum+sensor_dist_map[i-1][j];//sensor[[sensor_mux[i-1][j]-1]];
					cnt=cnt+1;
				}
				if (j>0) { // left
					if (sensor_mux[i][j-1]!==0) { // left
						sum=sum+sensor_dist_map[i][j-1];//sensor[sensor_mux[i][j-1]-1];
						cnt=cnt+1;
					}
				}
				if (j<4) { // right
					if (sensor_mux[i][j+1]!==0) { // right
						sum=sum+sensor_dist_map[i][j+1];//sensor[sensor_mux[i][j+1]-1];
						cnt=cnt+1;
					}
				}
				if (i<9) { // down
					if (sensor_mux[i+1][j]!==0) { // left
						sum=sum+sensor_dist_map[i+1][j];//sensor[sensor_mux[i+1][j]-1];
						cnt=cnt+1;
					}
				}
				//console.log("("+i+","+j+")="+sum/cnt)
				sensor_dist_map[i][j]=sum/cnt;
				sum=0;
				cnt=0;
			}
		}
	}
}


function map_create() {
	var ctx = document.getElementById("map").getContext('2d');
	ctx.fillStyle="black";
	ctx.strokeRect(0, 0, canvas_width, canvas_height);
	ctx.fillRect(0,0,canvas_width,canvas_height);
}

function createMap() {
	var sensor = [70,65,60,65,70,70,70,70,70,75,75,75,75,75,80,80,80,81,81,81,81,82,82,82,82,90];
	var ctx = document.getElementById("map").getContext('2d');
	var w=0;
	var h=0;
	for (i=0;i<26;i++) {
		w = mapW*sensor_pos[i*2] + map_boundary;
		h = mapH*sensor_pos[i*2+1] + map_boundary;
		console.log('w='+w+"  h="+h);
		ctx.font = "20px Times New Roman";
//		ctx.font = "40px Times New Roman";
		ctx.fillStyle = getColor(sensor[i]);//"white";
		ctx.fillText(sensor[i], w, h);
	}
}
function getColor(dist) {
	if (dist>=110) 
		return 'black';
	else if (dist>=85)
		return "#8a591a";//color_amber;
	else if (dist>=75)
		return "#b0a425";//color_yellow;
	else if (dist>=65)
		return "#186330";//color_green;
	else if (dist>=45)
		return "#294891";//color_blue;
	else if (dist >=30)
		return 'red';
	else
		return 'black';
}
function sensorUpdate(sensor) {
	var ctx = document.getElementById("map").getContext('2d');
	var w=0;
	var h=0;
	for (i=0;i<26;i++) {
//		ctx.font = "36px Times New Roman";
		ctx.font = "18px Times New Roman";
		ctx.fillStyle =  'white';//getColor(sensor[i]);
		w = mapW*sensor_pos[i*2] + map_boundary;
		h = mapH*sensor_pos[i*2+1] + map_boundary;
		//console.log('w='+w+"  h="+h);
		ctx.fillText(sensor[i], w, h);
		
	}
}
function sensorUpdate_color(sensor) {
	remap(sensor);
	var ctx = document.getElementById("map").getContext('2d');
	ctx.fillStyle="black";
	ctx.strokeRect(0, 0, canvas_width, canvas_height);
	ctx.fillRect(0,0,canvas_width,canvas_height);
	var w=0;
	var h=0;
	//var lingrad = ctx.createLinearGradient(0,0,0,0);
	for (i=0;i<10;i++) {
		for (j=0;j<5;j++) {
			start_color = getColor(sensor_dist_map[i][j]);
			if (start_color !== "black") {
				h=idH*i+map_boundary;
				w=idW*j+map_boundary;
				lingrad = ctx.createLinearGradient(w,h,w+idW,h+idH);
				lingrad.addColorStop(0, start_color);
				if (j<4) {
					stop_color = getColor(sensor_dist_map[i][j+1]);
					if (stop_color === 'black') {
						lingrad.addColorStop(1, getColor(sensor_dist_map[i][j]));
					}
					else {
						lingrad.addColorStop(1, getColor(sensor_dist_map[i][j+1]));
					}
				}
				else {
					lingrad.addColorStop(1, getColor(sensor_dist_map[i][j]));
				}
				ctx.fillStyle = lingrad;
				ctx.fillRect(w,h,idW,idH);
			}
		}
	}
}
function position(val) {
	var ctx = document.getElementById("position");
	switch (val) {
		case 0: //flat
		ctx.innerHTML="FLAT";
		ctx.style.backgroundColor="green";
		break;
		case 1: // side
		ctx.innerHTML="SIDE";
		ctx.style.backgroundColor=" #BA4A00";
		break;
		case 2: // sit
		ctx.innerHTML="SIT";
		ctx.style.backgroundColor="#3498DB";
		break;
		case 3: // empty
		ctx.innerHTML="EMPTY";
		ctx.style.backgroundColor="gray";
		break;
		default:
			console.log("unkonw position value"+val);
			break;
	}	
}
function envelopment(val) {
	var ctx = document.getElementById("envelop");
	ctx.innerHTML=val;
	//ctx.style.backgroundColor="black";
}
function upright(val) {
	var ctx = document.getElementById("upright");
	ctx.innerHTML=val+"&deg";
	//ctx.style.backgroundColor="black";
}
function power_failure(failure) {
	var ctx = document.getElementById("power");
	if (failure) {
		ctx.innerHTML="Failure";
		ctx.style.backgroundColor="red";
	}
	else {
		ctx.innerHTML="On";
		ctx.style.backgroundColor="#1D8348"; // Green
	}
}
var fallcnt=0;
function falling(val) {
	var ctx = document.getElementById("falling");
	ctx.innerHTML=val;//str;
	if (val >=50) {
		if (fallcnt===0) {
			fallcnt = fallcnt+1;
		const audio = document.getElementById("fall");
		audio.currentTime=0;
		audio.muted=false;
		//audio.src=path;
		audio.play();
		}
		else {
			fallcnt=fallcnt+1;
			if (fallcnt>=6) {
				fallcnt=0;
			}
		}
		ctx.style.backgroundColor='red';
	}
	else {
		fallcnt = 0;
		ctx.style.backgroundColor='#21618C'; // blue
	}
}
function mattress(id) {
	var ctx = document.getElementById("mattress");

	switch(id) {
		case 0:
			ctx.innerHTML="FIT 82x200";
			break;
		case 1:
			ctx.innerHTML="FIT 90x200";
			break;
		case 2:
			ctx.innerHTML="FIT 107x200";
			break;
		case 4:
			ctx.innerHTML="Entril Lux 82x200";
			break;
		case 5:
			ctx.innerHTML="Entril Lux 82x200";
			break;
		case 6:
			ctx.innerHTML="Entril Lux 82x200";
			break;
		case 8:
			ctx.innerHTML="Dual Plus 82x200";
			break;
		case 9:
			ctx.innerHTML="Dual Plus 82x200";
			break;
		case 10:
			ctx.innerHTML="Dual Plus 82x200";
			break;
		default :
			ctx.innerHTML="UNKNOW";
			break;
	}
}

function reposition(val) {
	var ctx = document.getElementById("reposition");
	ctx.innerHTML=val;
	if (val >=2) {
		ctx.style.backgroundColor='red';
	}
	else {
		ctx.style.backgroundColor='green';
	}
}

function GetInflateColor(s) {
	if (s=="Init") {
		return "white";
	}
	else if (s=="In") {
		return color_blue;
	}
	else if (s=="Out") {
		return color_amber;
	}
	else {
		return "#1D8348";//color_green;
	}

}
// Extend debug message 
function VibrateData(pva,nva,pvb,nvb, rotor_num) {
	if (pva===undefined) {
		var ctx = document.getElementById("pva");
		ctx.innerHTML="X";
		//ctx.style.backgroundColor='white';
	
		var ctx = document.getElementById("nva");
		ctx.innerHTML="X";
		//ctx.style.backgroundColor='white';
	
		var ctx = document.getElementById("pvb");
		ctx.innerHTML="X";
		//ctx.style.backgroundColor='white';
	
		var ctx = document.getElementById("nvb");
		ctx.innerHTML="X";
		//ctx.style.backgroundColor='white';
			//console.log("No vibrate data");
			var ctx = document.getElementById("ina");
			ctx.innerHTML="X";
			//ctx.style.backgroundColor='white';
			var ctx = document.getElementById("inb");
			ctx.innerHTML="X";
			//ctx.style.backgroundColor='white';
					return;
	}
	var ctx = document.getElementById("pva");
	ctx.innerHTML=pva;

	var ctx = document.getElementById("nva");
	ctx.innerHTML=nva;

	var ctx = document.getElementById("pvb");
	ctx.innerHTML=pvb;

	var ctx = document.getElementById("nvb");
	ctx.innerHTML=nvb;
// rotor valve number
var ina="Keep";
var inb="Keep";
switch(rotor_num) {
	case 0:
		ina="Out";
		inb="Out"
		break;
	case 1:
		ina="Init";
		inb="Init";
		break;
	case 2:
		ina="Keep";
		inb="Out";
		break;
	case 4:
		ina="In"
		inb="Keep"
		break;
	case 5:
		ina="In"
		inb="Out"
		break;
	case 7:
		ina="In"
		inb="In"
		break;
	case 8:
		ina="Keep"
		inb="Keep"
		break;
	case 9:
		ina="Out"
		inb="In"
		break;
	case 10:
		ina="Keep"
		inb="In"
		break;
	case 3:
	case 6:
	case 11:
	case 12:
	default:
		ina="X";
		inb="X";
		break;
}
var ctx = document.getElementById("ina");
ctx.innerHTML=ina;
ctx.style.backgroundColor=GetInflateColor(ina);
var ctx = document.getElementById("inb");
ctx.innerHTML=inb;
ctx.style.backgroundColor=GetInflateColor(inb);

}
function PowerBoardData(pressure, pump, rotor_num) {
// pressure
if (pressure === undefined) {
	var ctx = document.getElementById("pressure");
	ctx.innerHTML="X";
	//ctx.style.backgroundColor="black"
	var ctx = document.getElementById("rotor_num");
	ctx.innerHTML="X";
	//ctx.style.backgroundColor="black"

	var ctx = document.getElementById("pump");
	ctx.innerHTML="X";
	//ctx.style.backgroundColor="black"

	//console.log("No power board data");
	return;
}
var ctx = document.getElementById("pressure");
ctx.innerHTML=pressure;

// rotor valve number
var ctx = document.getElementById("rotor_num");
if (rotor_num >14) {
	ctx.style.backgroundColor="red"
	ctx.innerHTML="Busy";
}
else {
	ctx.style.backgroundColor="white"
	ctx.innerHTML=rotor_num;
}

// pump
var ctx = document.getElementById("pump");
if (pump==0) {
	ctx.innerHTML="Off";
	ctx.style.backgroundColor="gray";
}
else {
	ctx.innerHTML="On";
	ctx.style.backgroundColor="green";
}

}
function ShowMode(mode,step,p) {
	const DynamicModeStepStr=["Wait_Patient","Find_Min_Distance","Start_Find_Pressure_A","Inflate_A","Keep_A","Start_Find_Pressure_B","Inflate_B","Keep_B","Exit"];
	const StaticModeStepStr=["Wait_Patient","Find_Min_Distance","Inflate_To_Pressure","Inflate_To_Height","Re_Deflate"];
	const InitialModeStepStr=["Inflate_A","Inflate_AB","Retry","Check_Distance","Deflate"]
	
	var ctx = document.getElementById("mode");
	if (mode ===undefined) {
		ctx.innerHTML="X";
		//ctx.style.backgroundColor="black"
			//console.log("No Operation mode data");
		return;
	}
	switch (mode)	{
		case 0:
			ctx.innerHTML="Power Off";
			break;
		case 1:
			ctx.innerHTML="Initialize_"+InitialModeStepStr[step];
			break;
		case 2:
			ctx.innerHTML="Ready";
			break;
		case 3:
			ctx.innerHTML="Patient On";
			break;
		case 4:
			ctx.innerHTML="Dynamic_"+DynamicModeStepStr[step]+"_"+p;
			break;
		case 5:
			ctx.innerHTML="Static_"+StaticModeStepStr[step];
			break;
		case 6:
			ctx.innerHTML="Max";
			break;
		case 7:
			ctx.innerHTML="Transport";
			break;
		case 8:
			ctx.innerHTML="DBE";
			break;
		default:
			ctx.innerHTML="Unknow";
			break;
	}
}
//function show_failure(num) {
function show_failure(f) {
	var power_failure=0x1;
	var rotor_failure=0x02;
	var low_pressure_failure=0x03;
	var high_pressure_failure=0x04;
	var sensor_failure=0x5;
	var bottoming_failure=0x6;
	var fail_str='';
	var fail_pwr=0;
	if (f.length===0) {
		var ctx = document.getElementById("failure");
		ctx.innerHTML='None';
		ctx.style.backgroundColor='green';
	}
	else {
		for(let i=0;i<f.lentgh;i++) {
			if (f[i] === power_failure) {
				fail_str+="Power, "
				fail_pwr=1;
			}
			else if (f[i] === rotor_failure) {
				fail_str+="Rotor Valve, "
			}
			else if (f[i] === low_pressure_failure) {
				fail_str+="Low Pressure, "
			}
			else if (f[i] === high_pressure_failure) {
				fail_str+="High Pressure, "
			}
			else if (f[i] === sensor_failure) {
				fail_str+="Sensor, "
			}
			else if (f[i] === bottoming_failure) {
				fail_str+="Bottoming, "
			}
		}
		var ctx = document.getElementById("failure");
		ctx.innerHTML=fail_str;
		ctx.style.backgroundColor='red';
	
	}
	return fail_pwr;
}
function showTime(t) {
	var ctx = document.getElementById("curtime");
	ctx.innerHTML=t;
}


