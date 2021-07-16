
const delay=require('delay');
var http = require("http");
var url = require('url');
var fs = require('fs');
var s2006_mqtt = require('./mqtt_example.js');
var AESCrypt = require('./aes_crypto.js');

// global variable
var client=null;
var addr=null;
var filterMAC='';
var file_title='';
var start_log = 0;
var log_dir='logs/';
var filename = GetFileName()+".log";


function GetLogTime() {
  var d = Date.now();
  var dd = new Date(d);
  var dateStr=dd.getHours()+':'+dd.getMinutes()+':'+dd.getSeconds();
  var log_path='';
//  var dateStr=dd.getFullYear()+'-'+dd.getMonth()+'-'+dd.getDate()+'_'+dd.getHours()+':'+dd.getMinutes()+':'+dd.getSeconds();
  //console.log(dateStr);
  return dateStr;
}

function GetFileName() {
  var d = Date.now();
  var dd = new Date(d);
  var dateStr=dd.getFullYear()+'-'+(dd.getMonth()+1)+'-'+dd.getDate()+'_'+dd.getHours()+':'+dd.getMinutes()+':'+dd.getSeconds();
  console.log(dateStr);
  return dateStr;
}

function html_page(host, req_url, lsof) {//this is a Function declarations can be called before it is defined
  // Add link to root directory and parent directory if not already in root directory
  list = req_url == '/' ? [] : [`<a href="${host}">/</a>`,
  `<a href="${host}${encodeURI(req_url.slice(0,req_url.lastIndexOf('/')))}">..</a>`];

  templete = (host, req_url, file) => {// the above is a Function expressions cannot be called before it is defined
    return `<a href="${host}${encodeURI(req_url)}${req_url.slice(-1) == '/' ? '' : '/'}${encodeURI(file)}">${file}</a>`; }

  // Add all the links to the files and folder in requested directory
  lsof.forEach(file => {
    list.push(templete(host, req_url, file));
  });

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta http-equiv="content-type" content="text/html" charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Directory of ${req_url}</title>
</head>
<body>
<h2>Directory of ${req_url}</h2>
${list.join('<br/>\n')}
</body>
</html>`
}

function CheckIP(ip) {
  const exex = require('child_process').exec;
  exex(`ping -c 3 ${ip}`, (error, stdout, stderr)=>{
  if(error){
    console.log('ip is inactive.');
    return false;
  }else{
    console.log('ip is active.');
    return true;
  }
  });
}

var server = http.createServer(function(request, response) {

  var myURL= new URL("http://localhost:8001"+request.url);
  var path =myURL.pathname;
  console.log(__dirname + path);
  switch (path) {
    case '/':
      stats = fs.statSync(path);
      if (stats.isFile()) {
        buffer = fs.createReadStream(path);
        buffer.on('open', () => buffer.pipe(res));
      }
  
      if (stats.isDirectory()) {
        //Get list of files and folder in requested directory
        lsof = fs.readdirSync(path, {encoding:'utf8', withFileTypes:false});
    console.log(lsof);
        // make an html page with the list of files and send to browser
        res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
        res.end(html_page(`http://${hostname}:${port}`, req_url, lsof));
      }
  
      //console.log(path);
      //response.writeHead(200, {'Content-Type': 'text/html'});
      //response.write('Hello, World.');
      //response.end();
      break;
      case '/client/socket.html':
       if (request.method==='GET') {
         addr = myURL.searchParams.get('addr');
         mac=myURL.searchParams.get('mac');
         file_title=myURL.searchParams.get('file');
         if (addr) {
           if (CheckIP(addr)==true){
          console.log('MQTT IP :' + addr);
          addr = "mqtt://"+addr;
          s2006_mqtt.client().end  ();
          client = null;
          client=s2006_mqtt.init(addr);
           }
         }
         if (mac) {
           if (mac.length===17) {
            filterMAC=mac;
            console.log('MAC : '+filterMAC+" length="+mac.length);
           }
           else {
             console.log("[ERROR]: Wrong MAC address format");
           }
         }
         if (file_title) {
           console.log(log_dir);
           start_log=1;
           log_path = log_dir  + file_title+'/';//+"_"+GetFileName()+".log";
           console.log(log_path);
           if (fs.existsSync(log_path)==false) {
            fs.mkdirSync(log_path);
           }
           else {
             console.log(log_path + " already exist!");
           }
           filename = log_path+GetFileName()+".log";
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
    json.time=GetLogTime();
    //console.log(json);

    if (filterMAC) {
      if  (json.mac_address == filterMAC){
        //console.log('======================= Get Sensor Data From MQTT '+filterMAC+'=========================' + data.length);
        socket.emit('message', {'message': data});
        log_to_file(JSON.stringify(json));
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
    fs.appendFileSync(filename,data);
    fs.close(fd);
  })
}
