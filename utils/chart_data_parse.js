var pA=[];
var pB=[];
var pAB=[];
var pAcolor=[];
var pBcolor=[];
var pABcolor=[];
var minD=[];
var logTime=[];
var minA=[];
var minB=[];
var vibrate=[];
const CELLA_ID=[1,2,3,9,10,11,12,13,17,18,19,20];
const CELLB_ID=[0,4,5,6,7,8,14,15,16,21,22,23,24];
const DATA_INTERVAL=1000;
function parsePressure(num, p) {
    switch(num) {
        case 4:
        case 5:
            pA.push(p);
            pB.push(-1);
            pAcolor.push('red');
            pBcolor.push('white');
            break;
        case 7:
            pA.push(p);
            pB.push(p);
            pAcolor.push('blue');
            pBcolor.push('blue');
            break;
        case 9:
        case 10:
            pA.push(-1);
            pB.push(p);
            pAcolor.push('white');
            pBcolor.push('green');
            break;
        case 3:
        case 6:
        case 11:
        case 12:
        case 0:
        case 1:
        case 2:
        case 8:
        default:
            pA.push(-1);
            pB.push(-1);
            pAcolor.push('white');
            pBcolor.push('white');
            break;
    }    
}

function ParserMin(data) {
    if (data.sensor_data== undefined) {
        minA.push(-1);
        minB.push(-1);
        vibrate.push(0);
    }
    else {
        let mina=255;
        let minida=255;
        let minb=255;
        let minidb=255;
        for (let id of CELLA_ID) {
            if (mina>data.sensor_data[id]) {
                mina=data.sensor_data[id];
                minida=id+1;
            }
        }
        minA.push(mina);
        for (let id of CELLB_ID) {
            if (minb>data.sensor_data[id]) {
                minb=data.sensor_data[id];
                minidb=id+1;
            }
        }
        minB.push(minb);
    }
    vibrate.push(  ((data.pva-data.nva)+(data.pvb-data.nvb))/10 );
}
function chartParse(ln,s) {
        for (i=0; i< ln.length-1; i++) {
            json=JSON.parse(ln[i]);
            logTime.push(json.time);
            parsePressure(json.rotor_num, json.pressure);
            ParserMin(json);
        }
        //console.log(logTime);
        //console.log(pA);
        //console.log(pB);
        //console.log(minA);
        //console.log(minB);
        //console.log(vibrate);
    }
    
function chartParseInterval(ln,s) {
//    for (i=0; i< ln.length-1; i++) {
    var stop=0;
    var start=0;
    pA=[];
    pB=[];
    pAB=[];
    pAcolor=[];
    pBcolor=[];
    pABcolor=[];
    minD=[];
    logTime=[];
    minA=[];
    minB=[];
    vibrate=[];
    
    if ((ln.length-1) < DATA_INTERVAL) {
        start=s;
        stop = ln.length-1;
    }
    else if ( (start+DATA_INTERVAL)>(ln.length-1)) {
        stop = ln.length-1;
        start=ln.length-1-DATA_INTERVAL;
    }
    else {
        start = s;
        stop = s+DATA_INTERVAL;
    }
//    for (i=start; i< ln.length-1; i++) {
    for (i=start; i< stop; i++) {
        json=JSON.parse(ln[i]);
        logTime.push(json.time);
        parsePressure(json.rotor_num, json.pressure);
        ParserMin(json);
    }
    //console.log(logTime);
    //console.log(pA);
    //console.log(pB);
    //console.log(minA);
    //console.log(minB);
    //console.log(vibrate);
}



function getVibrate() {
    return vibrate;
}
function getMinA() {
    return minA;
}
function getMinB() {
    return minB;
}
function getChartTime() {
    return logTime;
}
function getChartPressureA() {
    return pA;
}
function getChartPressureB() {
    return pB;
}
function getPaColor() {
    return pAcolor;
}
function getPbColor() {
    return pBcolor;
}