
const delay=require('delay');
var http = require("http");
var url = require('url');
var fs = require('fs');
var s2006_mqtt = require('./mqtt_example.js');
var AESCrypt = require('./aes_crypto.js');
var client=null;
var addr=null;
var filterMAC='';
var file_title='';
var start_log = 0;
function GetLogTime() {
  var d = Date.now();
  var dd = new Date(d);
  var dateStr=dd.getHours()+':'+dd.getMinutes()+':'+dd.getSeconds();
//  var dateStr=dd.getFullYear()+'-'+dd.getMonth()+'-'+dd.getDate()+'_'+dd.getHours()+':'+dd.getMinutes()+':'+dd.getSeconds();
  //console.log(dateStr);
  return dateStr;
}

function GetFileName() {
  var d = Date.now();
  var dd = new Date(d);
  var dateStr=dd.getFullYear()+'-'+dd.getMonth()+1+'-'+dd.getDate()+'_'+dd.getHours()+':'+dd.getMinutes()+':'+dd.getSeconds();
  console.log(dateStr);
  return dateStr;
}

//var date=Date.now();
//var date = new Date(date);
var filename = GetFileName()+".log";
/*//date.getFullYear()+'-'+date.getMonth()+'-'+date.getDate()+'-'+date.getHours()+'-'+date.getMinutes()+'-'+date.getSeconds();//+Date().getFullMonth()+Date().getDate()+Date().getHour();
fs.open(filename, 'a+', function(err,fd) {
  if (err) {
    console.log("Fail to Create Log file: "+filename);
    return console.error(err);
  }
  console.log("Log File :"+filename+".log Created success!");
  })
  */
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
         file_title=myURL.searchParams.get('file');
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
         if (file_title) {
           start_log=1;
           filename = file_title+"_"+GetFileName()+".log";
           console.log("Log File Name : "+ filename);
         }
         else {
           console.log("No file name title define");
           //filename=GetFileName()+".log";
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
    //json.time=GetLogTime();
    //console.log(json);
    //transfor2csv(json);

    if (filterMAC) {
      if  (json.mac_address == filterMAC){
      //console.log('======================= Get Sensor Data From MQTT '+filterMAC+'=========================' + data.length);
      socket.emit('message', {'message': data});
      //fs.appendFileSync(filename+".log",data);
      //fs.writeFileSync(filename+".log",data);
      log_to_file(json);
      //console.log(GetLogTime() + ":  "+data);
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

function log_to_file(data) {
  if (start_log === 0) {
    console.log(data);
    return;
  }
 fs.open(filename,'a+', function(err,fd) {
    if (err) {
      console.log("Fail to Create Log file: "+filename);
      return console.error(err);
    }
    //console.log("Log File :"+filename+".log Created success!");
    var msg=GetLogTime()+', ';
    msg=msg+data.status+', ';
    if (data.status !== -2) {
      msg=msg+data.envelopment_rate+', ';
      msg=msg+data.falling_risk+', ';
      msg=msg+data.reposition_time;
      for (i=0;i<27;i++) {
        msg = msg+', '
        msg=msg+data.sensor_data[i];
      }
    }
    msg=msg+'\n';
    //console.log(msg);
    fs.appendFileSync(filename,msg);
//    fs.appendFileSync(filename,data);
/*
    fs.writeFile(fd,data,  function(err) {
      if (err) {
        console.error(err);
      }
    })
    */
    fs.close(fd);
  })
}
/*
const  {Parser}  = require('json2csv');

function transfor2csv(d) {
  const fields = ['time', 'status', 'envelopment_rate'];
  const opts = { fields };
  try {
    const parser = new Parser(opts);
    const csv = parser.parse(d);
    console.log(csv);
  } catch (err) {
    console.error(err);
  }
}
*/
