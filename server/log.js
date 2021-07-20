const fs = require('fs');
const util=require('./s2006_utility');
//log = {};
log_dir='logs/';
module.exports=function(){
    this.start = 0;
    this.filename="";
    this.write=function(data, filename) {
        //console.log(this.filename);
        if (this.start === 0) {
          console.log(data);
          return;
        }
        if (filename == undefined) {
            console.log("No log file name defined...");
            return;
        }
        //filename = this.filename;
        fs.open(filename,'a+', function(err,fd) {
          if (err) {
            console.log("Fail to Create Log file: "+filename);
            return console.error(err);
          }
          //console.log(filename);
          //console.log("DATA:"+data);
          data +='\n';
          fs.appendFileSync(filename,data);
          fs.close(fd);
        })
    }

    this.init = function  (title) {
        console.log(log_dir);
        this.start=1;
        var dirname = log_dir  + title+'/';
        console.log(dirname);
        util.createDir(dirname);
        this.filename = dirname+util.getDate()+'_'+util.getTime()+".log";
        console.log("Log File Name : "+ this.filename);
    }

}
