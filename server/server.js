
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

  var myURL= new URL("http://localhost:8001"+request.url);
  var path =myURL.pathname;
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
         mac=myURL.searchParams.get('mac');
         if (addr) {
          console.log('MQTT IP :' + addr);
          addr = "mqtt://"+addr;
          s2006_mqtt.client().end  ();
          client = null;
          client=s2006_mqtt.init(addr);
         }
         if (mac) {
          filterMAC=mac;
           console.log('MAC : '+filterMAC)
         }
        
         //console.log(JSON.stringify(myURL.query));
       }
      case '/client/socket.js':
      case '/client/sensor_draw.js':
      case '/client/main.css':
      case '/client/bye.mp3':
      case '/client/hello.mp3':
      case '/client/falling.mp3':
    
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
s2006_mqtt.init();

io.on('connection',(socket) => {
  s2006_mqtt.client().on('message', function(topic, msg) {
  data = AESCrypt.decrypt(msg);
    json=JSON.parse(data);
    if (filterMAC) {
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
