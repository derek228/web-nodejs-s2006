const s2006_mqtt = {};
var AESCrypt = require('./aes_crypto.js')
var mqtt = require('mqtt');
var client = null;
var deviceMAC=null;
var addr=null;
s2006_mqtt.init=function(ip) {
	
	var opt = { 
	port:1883,
	clientID: 'derekNB',
	username:'ZDlhN2E4MjgwNTY4',
	password:'NDg5YWQyYTAyYTg3ZGIyZGExMTgzNTc0'
	};
	
	console.log("mqtt intt ip :"+ip);
	if (ip) {
		console.log("MQTT Server Connect to =="+ip);
		client = mqtt.connect(ip, opt);
		addr = Buffer.from(ip);
	}
	else {
		console.log("Local MQTT Server ");
		client = mqtt.connect('mqtt://localhost', opt);
	}
	console.log('s2006 mqtt initialized');
	client.on('connect', function() {
		console.log("MQTT example connected..."+client);
		client.subscribe('S2006/DeviceReportInformation');
	});
	
	client.on('close',function() {
		if (client) {
			console.log("Force close mqtt"+client);
		}
		else {
			console.log("MQTT Client is NULL");
		}
		//client=s2006_mqtt.init(addr);
	  });
	
	
	//return client;
}

/*
s2006_mqtt.init=function(ip) {
	
	var opt = { 
	port:1883,
	clientID: 'derekNB'
	};
	
	client = mqtt.connect(ip, opt);
	//client = mqtt.connect('mqtt://192.168.0.102', opt);
	console.log('s2006 mqtt initialized(ip): '+ip);
	return client;
}
*/
s2006_mqtt.setMAC=function(mac) {
	console.log('Set Device MAC : '+mac);
	deviceMAC=Buffer.from(mac);
}
s2006_mqtt.client = function() {
	return client;
}
module.exports = s2006_mqtt;