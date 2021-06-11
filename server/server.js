
const delay=require('delay');
var http = require("http");
var url = require('url');
var fs = require('fs');
var s2006_mqtt = require('./mqtt_example.js');
var AESCrypt = require('./aes_crypto.js');
var client=null;
var addr=null;
var filterMAC='';
var server = http.createServer(function(request, response) {
  //var data= Buffer.from(request).toString('binary');
  //console.log('Connection:  '+ data);
  //console.log(request.url);
  //console.log(request.method);
  //console.log(request.statusMessage);
  //console.log("Code:  " + request.statusCode);

  var myURL= new URL("http://localhost:8001"+request.url);
//  console.log(URL.method);
//  console.log(URL.host);
//  console.log(URL.hostname);
//  console.log(URL.href);
//  console.log(URL.port);
//  console.log(URL.statusMessage);
  var path =myURL.pathname;
  //var path = url.parse(request.url).pathname;
  console.log(__dirname + path);
  switch (path) {
    case '/':
      //console.log(path);
      response.writeHead(200, {'Content-Type': 'text/html'});
      response.write('Hello, World.');
      response.end();
      break;
      case '/client/socket.html':
       if (request.method==='GET') {
         addr = myURL.searchParams.get('addr');
         filterMAC=myURL.searchParams.get('mac');
         if (addr) {
          console.log('MQTT IP :' + addr);
          addr = "mqtt://"+addr;
          s2006_mqtt.client().end  ();
          client = null;
          client=s2006_mqtt.init(addr);
         }
         if (filterMAC) {
           console.log('MAC : '+filterMAC)
         }
        
         //console.log(JSON.stringify(myURL.query));
       }
      case '/client/socket.js':
      case '/client/sensor_draw.js':
      case '/client/main.css':
      fs.readFile(__dirname +"/../"+ path, function(error, data) {
        if (error){
          response.writeHead(404);
          response.write("opps this doesn't exist - 404");
        } else {
          response.writeHead(200, {"Content-Type": "text/html"});
          response.write(data, "utf8");
        }
        response.end();
      });
      break;
    default:
      response.writeHead(404);
      response.write("opps this doesn't exist - 404");
      response.end();
      break;
  }
});

const io = require('socket.io')();
io.attach(server,{
  pingInterval: 10000,
  pingTimeout: 5000,
  cookie: false
});
console.log("Server set listen 8001");
server.listen(8001);
console.log(addr);
//client = s2006_mqtt.init();
s2006_mqtt.init();
//client.on('connect', function() {
/*s2006_mqtt.client().on('connect', function() {
	console.log("MQTT connected...");
	client.subscribe('S2006/DeviceReportInformation');
});
s2006_mqtt.client().on('close',function() {
  console.log("Force close mqtt");
  client=s2006_mqtt.init(addr);
});
*/

io.on('connection',(socket) => {
	//console.log(socket.rooms);
	//console.log(socket.id);
//  client.on('message', function(topic, msg) {
  s2006_mqtt.client().on('message', function(topic, msg) {
  data = AESCrypt.decrypt(msg);
    json=JSON.parse(data);
    if (filterMAC) {
      //console.log(json.mac_address);
      //console.log(filterMAC);
      //console.log(Buffer.from(json.mac_address));
      //console.log(Buffer.from(filterMAC));
//      if  (Buffer.compare(Buffer.from(json.mac_address), Buffer.from(filterMAC))===0){
      if  (json.mac_address == filterMAC){
      console.log('======================= Get Sensor Data From MQTT '+filterMAC+'=========================' + data.length);
      socket.emit('message', {'message': data});
      //console.log(data);
      }
      else {
        console.log('====Wrong MAC filter type=====' + data.length);
      }
    }
    else {
      console.log("No define S2006 MAC==="+data );
    }
    //socket.emit('message', {'message': data});

  });
 
});
