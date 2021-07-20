
const delay=require('delay');
var http = require("http");
var url = require('url');
var fs = require('fs');
var s2006_mqtt = require('./mqtt_example.js');
var AESCrypt = require('./aes_crypto.js');
var util=require('./s2006_utility');
var lg=require('./log.js');
var log=new lg();
var sf=require('./sensor_parser.js');
// global variable
var client=null;
var addr=null;
var filterMAC='';
var file_title='';
var custom_port=8001;
//function custom_port_parser() {
	if (process.argv.length>2) {
		custom_port=Number(process.argv[2]);
		console.log(typeof custom_port, custom_port);
	}
	else
	{
		console.log("Use Default Port "+custom_port);
	}	
//}

var server = http.createServer(function(request, response) {
  var hostname='http://localhost:'+custom_port+request.url;
  var myURL= new URL(hostname);
  //var myURL= new URL("http://localhost:8003"+request.url);
  var path =myURL.pathname;
  console.log("REQUEST"+request.url);
  console.log(__dirname + path);
  switch (path) {
    case '/':
      util.listFiles(ftpURL, response,custom_port) ;
      //console.log(path);
      //response.writeHead(200, {'Content-Type': 'text/html'});
      //response.write('Hello, World.');
      //response.end();
      break;
      case '/favicon.ico':
      response.writeHead(200, {'Content-Type': 'text/html'});
      response.write('Hello, World.');
      response.end();
      break;

      case '/client/socket.html':
       if (request.method==='GET') {
         addr = myURL.searchParams.get('addr');
         mac=myURL.searchParams.get('mac');
         file_title=myURL.searchParams.get('file');
         if (addr) {
          if (util.checkIP(addr)==true){
            addr = "mqtt://"+addr;
            s2006_mqtt.client().end  ();
            client = null;
            client=s2006_mqtt.init(addr);
           }
           else {
             console.log(addr + ' Not exist');
           }
         }

         if (mac) {
           if (mac.length===17) {
            filterMAC=mac;
            console.log('MAC : '+filterMAC+" length="+mac.length);
            sf.init(mac);
           }
           else {
             console.log("[ERROR]: Wrong MAC address format");
           }
         }

         if (file_title) {
           log.init(file_title);
         }
         else {
           console.log("No file name title define");
         }
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
      util.listFiles(path, response,custom_port) ;
//      response.writeHead(404);
//      response.write("opps this doesn't exist - 404");
//      response.end();
      break;
  }
});

const io = require('socket.io')();
io.attach(server,{
  pingInterval: 10000,
  pingTimeout: 5000,
  cookie: false
});
console.log("Server set listen "+custom_port);
server.listen(custom_port);
console.log(addr);
s2006_mqtt.init();

io.on('connection',(socket) => {
  s2006_mqtt.client().on('message', function(topic, msg) {
  data = AESCrypt.decrypt(msg);
    json=JSON.parse(data);
    json.time=util.getTime();
    //console.log(json);
    sf.parser(json);
    if (filterMAC) {
      if  (json.mac_address == filterMAC){
        //console.log('======================= Get Sensor Data From MQTT '+filterMAC+'=========================' + data.length);
        socket.emit('message', {'message': data});
        log.write(JSON.stringify(json),log.filename);
        //log_to_file(JSON.stringify(json));
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
