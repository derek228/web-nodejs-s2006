const color_amber='#F08000'
const color_yellow='#F0F000'
const color_green='#20F000'
const color_blue='#0090F0'
const canvas_width = 400;
const canvas_height = 600;
const mapW=300;//+map_boundary*2;
const mapH=500;//+map_boundary*2;
const map_boundary = 50;//(canvas_width-mapW)/2;
const idW = 60;//50;
const idH = 50;

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
	//console.log(sensor_pos);
	//createMap();
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
		//ctx.fillStyle=getColor(sensor[i]);
		//ctx.strokeRect(w, h, idW, idH);
		//ctx.fillRect(w, h, idW, idH);
		ctx.font = "48px Times New Roman";
		//ctx.translate(w, h);
		ctx.fillStyle = getColor(sensor[i]);//"white";
		//ctx.strokeText(sensor[i], w, h);
		ctx.fillText(sensor[i], w, h);
	}
}
function getColor(dist) {
	if (dist>=110) 
		return 'black';
	else if (dist>=85)
		return color_amber;
	else if (dist>=75)
		return color_yellow;
	else if (dist>=65)
		return color_green;
	else if (dist>=45)
		return color_blue;
	else if (dist >=30)
		return 'red';
	else
		return 'black';
}
function sensorUpdate(sensor) {
	//console.log(sensor_mux[0][2]);
	//console.log(sensor_dist_map[9][2]);
	//remap(sensor);
	//console.log(sensor_dist_map);
	var ctx = document.getElementById("map").getContext('2d');
	//ctx.fillStyle="black";
	//ctx.strokeRect(0, 0, canvas_width, canvas_height);
	//ctx.fillRect(0,0,canvas_width,canvas_height);
	var w=0;
	var h=0;
	for (i=0;i<26;i++) {
		ctx.font = "36px Times New Roman";
		ctx.fillStyle =  'white';//getColor(sensor[i]);
		w = mapW*sensor_pos[i*2] + map_boundary;
		h = mapH*sensor_pos[i*2+1] + map_boundary;
		//console.log('w='+w+"  h="+h);
		ctx.fillText(sensor[i], w, h);
		
	}
}
function sensorUpdate_color(sensor) {
	//create_map();
	remap(sensor);
	var ctx = document.getElementById("map").getContext('2d');
	ctx.fillStyle="black";
	ctx.strokeRect(0, 0, canvas_width, canvas_height);
	ctx.fillRect(0,0,canvas_width,canvas_height);
	var w=0;
	var h=0;
	var lingrad = ctx.createLinearGradient(0,0,0,0);
//	for (i=0;i<10;i++) {
//		for (j=0;j<5;j++) {
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
function upright(val) {
	var ctx = document.getElementById("map").getContext('2d');
	ctx.fillStyle="white";
	//ctx.strokeRect(400, 100, 200, 50);
	ctx.fillRect(400,100,200,50);
	ctx.font = "48px Times New Roman";
	ctx.fillStyle =  'black';//getColor(sensor[i]);
	ctx.fillText("Angle:", 400, 150);
	ctx.fillText(val, 550, 150);
	//console.log("show upright");
}
function power_failure(failure) {
	var ctx = document.getElementById("map").getContext('2d');
	if (failure) {
		ctx.fillStyle="red";
	}
	else {
		ctx.fillStyle="green";
	}
	//
	ctx.fillRect(400,0,50,50);
	ctx.font = "48px Times New Roman";
	ctx.fillStyle =  'black';//getColor(sensor[i]);
	ctx.fillText("Power", 450, 50);
	//console.log("show power faliure")
}
function falling(val) {
	var ctx = document.getElementById("map").getContext('2d');
	ctx.fillStyle="white";
	ctx.fillRect(400,200,200,50);
	if (val>=50) {
		ctx.fillStyle="red";
	}
	else {
		ctx.fillStyle="green";
	}
	ctx.fillRect(400,200,50,50);
	ctx.font = "48px Times New Roman";
	ctx.fillStyle =  'black';//getColor(sensor[i]);
	ctx.fillText(val, 450, 250);
	//console.log("show falling");	
}