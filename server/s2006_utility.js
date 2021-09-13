var fs = require('fs');

var s2006_utility={};
//hostname = process.env.HOST || '127.0.0.1';
//port = process.env.PORT || 8001;
function html_page(host, req_url, lsof) {//this is a Function declarations can be called before it is defined
    // Add link to root directory and parent directory if not already in root directory
    list = req_url == '/' ? [] : [`<a href="${host}">/</a>`,
    `<a href="${host}${encodeURI(req_url.slice(0,req_url.lastIndexOf('/')))}">..</a>`];
  
    templete = (host, req_url, file) => {// the above is a Function expressions cannot be called before it is defined
      return `<a href="${host}${encodeURI(req_url)}${req_url.slice(-1) == '/' ? '' : '/'}${encodeURI(file)}">${file}</a>`; }
    //console.log("TEMP:"+ templete);

    // Add all the links to the files and folder in requested directory
    lsof.forEach(file => {
//        console.log("Host:"+host);
        //console.log("URL:"+req_url);
        //console.log("file:"+file);

      list.push(templete(host, req_url, file));
    });
  //console.log(list);
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

s2006_utility.listFiles=function (path,res,port) {
    //console.log("UTIL:" +path);
    try {
        stats = fs.statSync(path);
  if (stats.isFile()) {
    buffer = fs.createReadStream(path);
    buffer.on('open', () => buffer.pipe(res));
  }

  if (stats.isDirectory()) {
    //Get list of files and folder in requested directory
    lsof = fs.readdirSync(path, {encoding:'utf8', withFileTypes:false});
    //console.log(lsof);
    // make an html page with the list of files and send to browser
    res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
    local = port; //"http://localhost:"+port;
    //console.log(local);
    res.end(html_page(local, path, lsof));
//    res.end(html_page("http://localhost:8001", path, lsof));
//    res.end(html_page(`http://${hostname}:${port}`, path, lsof));
  }
}
  catch(err){
    //res.writeHead(404);
    //res.end(err);
  console.error(err);
    //return;
  }
}

s2006_utility.getTime=function () {
    var d = Date.now();
    var dd = new Date(d);
    var dateStr=dd.getHours()+'_'+dd.getMinutes()+'_'+dd.getSeconds();
//    var dateStr=dd.getHours()+':'+dd.getMinutes()+':'+dd.getSeconds()+':'+dd.getMilliseconds();
    //var log_path='';
  //  var dateStr=dd.getFullYear()+'-'+dd.getMonth()+'-'+dd.getDate()+'_'+dd.getHours()+':'+dd.getMinutes()+':'+dd.getSeconds();
    //console.log(dateStr);
    return dateStr;    
}

s2006_utility.curTime=function () {
  var d = Date.now();
  var dd = new Date(d);
  //var dateStr=dd.getHours()+'_'+dd.getMinutes()+'_'+dd.getSeconds();
  var dateStr=dd.getHours()+':'+dd.getMinutes()+':'+dd.getSeconds();
  //var log_path='';
//  var dateStr=dd.getFullYear()+'-'+dd.getMonth()+'-'+dd.getDate()+'_'+dd.getHours()+':'+dd.getMinutes()+':'+dd.getSeconds();
  //console.log(dateStr);
  return dateStr;    
}

s2006_utility.getDate = function () {
    var d = Date.now();
    var dd = new Date(d);
    var dateStr=dd.getFullYear()+'-'+(dd.getMonth()+1)+'-'+dd.getDate();
    console.log(dateStr);
    return dateStr;
}

s2006_utility.createDir = function (path) {
    if (fs.existsSync(path)==false) {
        fs.mkdirSync(path);
        console.log(path + " Created");
    }
    else {
        console.log(path + " already exist!");
    }    
}


s2006_utility.checkIP= function (ip) {
    const exex = require('child_process').exec;
    exex(`ping -c 3 ${ip}`, (error, stdout, stderr)=>{
    if(error){
      console.log('ip is inactive: ' +ip);
      return false;
    }else{
      console.log('ip is active: '+ip);
      return true;
    }
    });
}
  
module.exports=s2006_utility;