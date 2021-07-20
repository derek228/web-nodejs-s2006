var patient_status=0;
var failure_flag=0;

function socket_load() {
	var socket = io.connect();
	console.log("Socket connected.");
	socket.on('message', function(data){
		mqtt=JSON.parse(data.message);
		/* // show sensor data
		var msg=document.getElementById("message");
		msg.innerText=mqtt.sensor_data;
		*/
		show_failure(mqtt.failure_code);
		if (mqtt.failure_code & 0x01) {
			console.log("Power Failure");
		}
		else {
			normal_show(mqtt);
		}
		/*
		if (mqtt.failure_code !== 0) {
			var failure_str='';
			if (mqtt.failure_code&power_failure) {
				failure_str+='power_failure, ';
			}
			if 
			else {
				failure_flag=2;
				show_failure(mqtt.failure_code);
			}
		}
		else {
			normal_show(mqtt);
		}
		*/
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
	//power_failure(0);	
	position(mqtt.status);
	envelopment(mqtt.envelopment_rate);
	mattress(mqtt.mattress_id);
	reposition(mqtt.reposition_time);
	VibrateData(mqtt.pva,mqtt.nva,mqtt.pvb,mqtt.nvb,mqtt.rotor_num );
	PowerBoardData(mqtt.pressure,mqtt.pump, mqtt.rotor_num);
	ShowMode(mqtt.mode);
	show_current_time();
	/*
	if (failure_flag) {
		failure_flag=failure_flag-1;
	}
	else {
		show_failure(0);
	}
	*/
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
	if (timerStart !== 0) {
		timeStop=Date.now();
		delta = (timeStop-timerStart)/1000;
		var ctx = document.getElementById("time");
		ctx.innerHTML=delta+" Seconds";
		timerStart = 0;
		var ctx = document.getElementById("start");
		ctx.innerHTML="Start";
		ctx.style.backgroundColor="#4CAF50";
	}	
	else {
		timerStart = Date.now();
		var ctx = document.getElementById("time");
		ctx.innerHTML="0.000 Seconds";
		var ctx = document.getElementById("start");
		ctx.innerHTML="Stop";
		ctx.style.backgroundColor="#8a591a";
	}
	//var ctx = document.getElementById("time");
	//ctx.innerHTML="0.000 Seconds";
	//timerStart=Date.now();
//	console.log("Timer start"+timerStart);

}
