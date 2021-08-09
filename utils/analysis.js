
var lines="";
var line = 0;
var pressure;
var time;
document.getElementById('file').onchange = function(){
    var file = this.files[0];
    line=0;
    lines="";
    var reader = new FileReader();
    reader.onload = function(progressEvent){
      //console.log(this.result);
      lines = this.result.split('\n');
      console.log("Load file done, Total Data = "+lines.length);
      mqtt=JSON.parse(lines[line])
      show_failure(mqtt.failure_code);
      if (mqtt.failure_code & 0x01) {
        console.log("Power Failure");
      }
      else {
        normal_show(mqtt);
      }
    
      console.log("Data Parse");
      chartParse(lines,0);
      console.log("Show Chart");
      drawPressure();
    };
    reader.readAsText(file);
    console.log("Start Read file :"+file);
  };

function ShowNext() {
  if (line<(lines.length-1)) {
    line++;
  }
  else {
    return;
  }
  chartParseInterval(lines,line);
  drawPressure();
//console.log(line+": "+lines[line]);
  mqtt=JSON.parse(lines[line])
  show_failure(mqtt.failure_code);
  if (mqtt.failure_code & 0x01) {
    console.log("Power Failure");
  }
  else {
    normal_show(mqtt);
    //var tmpd=mqtt.sensor_data.splice(0,mqtt.sensor_data.length-2);
    //console.log(Math.min(...tmpd));
    //console.log(tmpd);
    //console.log(mqtt.sensor_data);
    //console.log(mqtt.sensor_data.length);
    //console.log(mqtt.sensor_data.splice(25,2));
    //console.log(Math.min(...mqtt.sensor_data.splice(25,2)));
  }  
//  console.log(line+":\n"+json.time);
}

function ShowPrevious (){
  if (line>0) {
    line--;
  }
  else {
    return;
  }
  chartParseInterval(lines,line);
  drawPressure();
  //console.log(line+": "+lines[line]);
  mqtt=JSON.parse(lines[line])
  show_failure(mqtt.failure_code);
  if (mqtt.failure_code & 0x01) {
    console.log("Power Failure");
  }
  else {
    normal_show(mqtt);
  }
}

function SetTime() {
  ctime=document.getElementById("cusTime").value;
  console.log(ctime);
  if (ctime == undefined) {
    alert("Input time string...");
    return;
  }
  for (i=0;i<lines.length;i++) {
    jsonLine=JSON.parse(lines[i]);
    if (jsonLine.time == ctime) {
      line=i;
      break;
    }
  }
  if (i==lines.length) {
    alert("Can't find the time");
  }
  else {
    console.log(line+": "+lines[line]);
    chartParseInterval(lines,line);
    drawPressure();
    mqtt=JSON.parse(lines[line])
    show_failure(mqtt.failure_code);
    if (mqtt.failure_code & 0x01) {
      console.log("Power Failure");
    }
    else {
      normal_show(mqtt);
    }
  }
}
function ShowPressure() {

}
function normal_show(data) {
	//var pathname = window.location.pathname;
	//console.log(pathname);

	if (mqtt.status !==3) {
		sensorUpdate_color(mqtt.sensor_data);
		sensorUpdate(mqtt.sensor_data);
	}
	else {
		map_create();
		sensorUpdate(mqtt.sensor_data);
	}
	upright(mqtt.sensor_data[26]);
	falling(mqtt.falling_risk);
	position(mqtt.status);
	envelopment(mqtt.envelopment_rate);
	mattress(mqtt.mattress_id);
	reposition(mqtt.reposition_time);
	VibrateData(mqtt.pva,mqtt.nva,mqtt.pvb,mqtt.nvb,mqtt.rotor_num );
	PowerBoardData(mqtt.pressure,mqtt.pump, mqtt.rotor_num);
	ShowMode(mqtt.mode,mqtt.mode_step, mqtt.target_p);
  showTime(mqtt.time);
}
