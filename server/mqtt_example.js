var mqtt = require('mqtt');
module.exports=function() {
	client=null;
	//deviceMac=null;
	this.init=function(ip,mac,cb) {
		//deviceMac=mac;
		console.log("New MQTT IP : ", ip)
		if (client != null) {
			console.log("MQTT Init: ", client.options.host);
			if (ip == client.options.host) {
				console.log("Already connect to MQTT : ", ip);
				return;
			}
			if (client!=null) {
				console.log("Close MQTT:"+client.options.host+"..... Start Connect to MQTT :"+ip);
				client=client.end(true);
			}
		}
		let opt={
			port:1883,
			clientID: mac,
			username:'ZDlhN2E4MjgwNTY4',
			password:'NDg5YWQyYTAyYTg3ZGIyZGExMTgzNTc0'
		}
		if (ip) {
			ip = "mqtt://"+ip;
			console.log("MQTT Init IP : ", ip);
			client = mqtt.connect(ip,opt);
		}
		else {
			console.log("MQTT server in localhost");
			client = mqtt.connect('mqtt://localhost', opt);
		}
		console.log("MQTT initialize done...");

		client.on('connect', function() {
			console.log("MQTT connected...:" , client);
			client.subscribe('S2006/DeviceReportInformation');
		});
		
		client.on('close',function() {
			if (client) {
				console.log("Force close mqtt: ", client.nexdID);
			}
			else {
				console.log("MQTT Client is NULL");
			}
		  });
		  client.on('message', function(topic, msg,pkg) {
			  console.log("mqtt client: ", client.options.clientID);
			  //console.log("Force close mqtt: ", client.nextId);
			  //console.log("Package: ", pkg);
			  var d = Date.now();
			  var dd = new Date(d);
			  var dateStr=dd.getHours()+'_'+dd.getMinutes()+'_'+dd.getSeconds();
			  console.log(dateStr);
			  cb(msg);
			});
	}
}
/*
const s2006_mqtt = {};
var AESCrypt = require('./aes_crypto.js')
var mqtt = require('mqtt');
var client = null;
var deviceMAC=null;
var addr=null;
s2006_mqtt.init=function(ip, cb ) {
	
	var opt = { 
	port:1883,
	clientID: 'derekNB',
	username:'ZDlhN2E4MjgwNTY4',
	password:'NDg5YWQyYTAyYTg3ZGIyZGExMTgzNTc0'
	};
	
	console.log("mqtt intt ip :"+ip);
	if (ip) {
		console.log("MQTT Server Connect to == "+ip);
		client = mqtt.connect(ip, opt);
		s2006_mqtt.client=client;
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
	  client.on('message', function(topic, msg) {
		  console.log("mqtt: ", msg);
		  cb(msg);
		/*data = AESCrypt.decrypt(msg);
		  json=JSON.parse(data);
		  json.time=util.getTime();
		  //console.log(json);
		  if (filterMAC) {
			if  (json.mac_address == filterMAC){
			  sf.parser(json);
			  console.log('======================= Get Sensor Data From MQTT '+filterMAC+'=========================' + json.time);
			  socket.emit('message', {'message': data});
			  log.write(JSON.stringify(json),log.filename);
			  //log_to_file(JSON.stringify(json));
			}
			else {
			  console.log('Device MAC:' +json.mac_address+ ' ( != )  ' +'Filter MAC'+  filterMAC+ '  == Data Length ==  ' + data.length);
			}
		  }
		  else {
			console.log("No define S2006 MAC==="+data );
		  }
		  //socket.emit('message', {'message': data});
		});
	
	
	//return client;
}
*/
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

s2006_mqtt.setMAC=function(mac) {
	console.log('Set Device MAC : '+mac);
	deviceMAC=Buffer.from(mac);
}
//s2006_mqtt.client = client;
/*s2006_mqtt.client = function() {
	return client;
}
*/
//module.exports = s2006_mqtt;