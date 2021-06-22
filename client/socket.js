var patient_status=0;

function socket_load() {
	var socket = io.connect();
	console.log("Socket connected.");
	socket.on('message', function(data){
		//console.log(data.message);
		mqtt=JSON.parse(data.message);
		/* // show sensor data
		var msg=document.getElementById("message");
		msg.innerText=mqtt.sensor_data;
		*/
		if (mqtt.status === -2) {
			if (mqtt.failure_code=== 0) {
				power_failure_show(mqtt);
			}
		}
		else {
			normal_show(mqtt);
		}
	});
	socket.on("disconnect", (reason) => {
		console.log("Disconnec socket");
	  });
}

function power_failure_show(data) {
	power_failure(1);
}
function normal_show(data) {
	var pathname = window.location.pathname;
	console.log(pathname);

	if (mqtt.status !==3) {
		sensorUpdate_color(mqtt.sensor_data);
		sensorUpdate(mqtt.sensor_data);
//		if (patient_status!== mqtt.status) {
		if (patient_status=== 3) {
			var pathname = window.location.pathname;
			console.log(pathname);
			patient_status=mqtt.status;
			playSound("hello");
		}
	}
	else {
		if (patient_status!== mqtt.status) {
			var pathname = window.location.pathname;
			console.log(pathname);
			patient_status=mqtt.status;
			playSound("bye");
		}
		map_create();
		sensorUpdate(mqtt.sensor_data);
	}
	upright(mqtt.sensor_data[26]);
	falling(mqtt.falling_risk);
	power_failure(0);	
	position(mqtt.status);
	envelopment(mqtt.envelopment_rate);
	mattress(mqtt.mattress_id);
	reposition(mqtt.reposition_time);
	VibrateData(mqtt.pva,mqtt.nva,mqtt.pvb,mqtt.nvb,mqtt.rotor_num );
	PowerBoardData(mqtt.pressure,mqtt.pump, mqtt.rotor_num);
	ShowMode(mqtt.mode);
}
function playSound(type) {
	console.log(type);
	if (type=="hello") {
		const audio = document.getElementById("hello");
		//audio.currentTime=0;
		audio.muted=false;
		//audio.src=path;
		audio.play();
	}
	else {
		console.log(document.getElementById('bye').src);
		const audio = document.getElementById("bye");
		//audio.src=path;
		//audio.currentTime=0;
		audio.muted=false;
		audio.play();
	}
}
var timerStart=0;
var timeStop=0;
function startTimer() {
	timerStart=Date.now();
	console.log("Timer start"+timerStart);

}

function stopTimer() {
	timerStop=Date.now();
	console.log("Timer stop : "+timerStop);
	delta=(timerStop-timerStart)/1000;
	console.log(delta);
	var ctx = document.getElementById("time");
	ctx.innerHTML=delta+" Seconds";
}