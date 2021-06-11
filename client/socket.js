function socket_load() {
	var socket = io.connect();
	console.log("Socket connected.");
	socket.on('message', function(data){
		console.log(data.message);
		mqtt=JSON.parse(data.message);
		var msg=document.getElementById("message");
		msg.innerText=mqtt.sensor_data;
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
	if (mqtt.status !==3) {
		sensorUpdate_color(mqtt.sensor_data);
		sensorUpdate(mqtt.sensor_data);
	}
	else {
		map_create();
	}
	upright(mqtt.sensor_data[26]);
	falling(mqtt.falling_risk);
	power_failure(0);	
	position(mqtt.status);
	envelopment(mqtt.envelopment_rate);
	mattress(mqtt.mattress_id);
	reposition(mqtt.reposition_time);
}
