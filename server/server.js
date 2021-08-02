
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
var server_log_en=1;
var ftpHost='';
/*
var net = require('net');
var socket = net.createConnection(80, 'www.google.com');
socket.on('connect', function() {
  console.log(socket.address().address);
  socket.end();
});
*/
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
  //console.log("request.url: "+request.url);
  var hostname='http://localhost:'+custom_port+request.url;
  var myURL= new URL(hostname);
  //console.log(myURL+" === "+hostname);
  //console.log("host: "+myURL.host);
  //console.log("hostname: "+myURL.hostname);
  //console.log("href:"+myURL.href);
  //var myURL= new URL("http://localhost:8003"+request.url);
  var path =myURL.pathname;
  //console.log("REQUEST:"+request.url);
  //console.log("DIR+PATH:"+__dirname + path);
  var ftpPath=__dirname+'/..'+path;
  //console.log("FTP : "+ftpPath);
  switch (path) {
    case '/':
      //console.log("root"+ftpPath);

      //console.log(path);
      if (ftpHost!=='') {
      util.listFiles(ftpPath, response,ftpHost) ;
      }
      //util.listFiles(ftpPath, response,"http://localshot:8001") ;
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
          //if (util.checkIP(addr)==true){
            addr = "mqtt://"+addr;
            s2006_mqtt.client().end  ();
            console.log("Connect To New MQTT IP: "+addr);
            client = null;
            client=s2006_mqtt.init(addr);
           //}
           //else {
             //console.log(addr + ' Not exist');
           //}
         }

         if (mac) {
           if (mac.length===17) {
            filterMAC=mac;
            console.log('MAC : '+filterMAC+" length="+mac.length);
            if (server_log_en===1){
              sf.init(mac);
            }
           }
           else {
             console.log("[ERROR]: Wrong MAC address format");
           }
         }

         if (file_title) {
           if (server_log_en === 1) {
            log.init(file_title);
           }
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
      console.log("DEFAULT: "+path);
      util.listFiles(path, response,ftpHost) ;
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
  //console.log(socket.address().address);
  //console.log(socket.handshake.headers.host);
  ftpHost="http://"+socket.handshake.headers.host;
  console.log(ftpHost);
  s2006_mqtt.client().on('message', function(topic, msg) {
  data = AESCrypt.decrypt(msg);
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
});
