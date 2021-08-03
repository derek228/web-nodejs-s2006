var lable_time=getChartTime();
var chartPA=getChartPressureA();
var chartPB=getChartPressureB();
var PaColor=getPaColor();
var PbColor=getPbColor();
var chartMinA=getMinA();
var chartMinB=getMinB();
var chartVibrate=getVibrate();
/*
var ctx = document.getElementById( "chartP" );
var chartP= new Chart(ctx, {
    type: "line", //bar", 
    data: {
        labels: lable_time, 
        datasets: [{
            label: "Pressure A (mmHg)", 
            data: chartPA, // [ 12, 19, 3 ], 
            backgroundColor: 'red',//PaColor,// [ "#00FF00" ],
            borderColor:'red',
            showLine:false,
            //borderWidth:3,
            pointRadius:2,
        },{
            label: "Pressure B (mmHg)", 
            data: chartPB, // [ 12, 19, 3 ]
            backgroundColor: 'blue', //PbColor, // [ "#FF0000"],
            borderColor:'blue',
            showLine:false,
            //borderWidth:6,
            pointRadius:4,
        },{
            label: "Min A (mm)", 
            data: chartMinA, // [ 12, 19, 3 ]
            backgroundColor: 'green', //PbColor, // [ "#FF0000"],
            borderColor:'green',
            showLine:false,
            //borderWidth:6,
            pointRadius:4,
        },{
            label: "Min B (mm)", 
            data: chartMinB, // [ 12, 19, 3 ]
            backgroundColor: 'pink', //PbColor, // [ "#FF0000"],
            borderColor:'pink',
            showLine:false,
            //borderWidth:6,
            pointRadius:4,
        },{
            label: "Vibrate (cm)", 
            data: chartVibrate, // [ 12, 19, 3 ]
            backgroundColor: 'black', //PbColor, // [ "#FF0000"],
            borderColor:'black',
            showLine:false,
            //borderWidth:6,
            pointRadius:4,
        }
        ],
    }
    });

function drawUpdate() {
    console.log(lable_time);
    chartP.data.labels=lable_time;
    chartP.data.datasets[0].data=chartPA;
    chartP.data.datasets[0].data=chartPB;
    chartP.data.datasets[0].data=chartMinA;
    chartP.data.datasets[0].data=chartMinB;
    chartP.data.datasets[0].data=chartVibrate;
    chartP.update();
}
*/
function drawPressure(l) {
    lable_time=getChartTime();
    chartPA=getChartPressureA();
    chartPB=getChartPressureB();
    PaColor=getPaColor();
    PbColor=getPbColor();
    chartMinA=getMinA();
    chartMinB=getMinB();
    chartVibrate=getVibrate();
    //drawUpdate();
    //    console.log(lable_time);
//    console.log(chartPA);
//    console.log(chartPB);
var ctx = document.getElementById( "chartP" );

    chartP = new Chart(ctx, {
        type: "line", //bar", 
        data: {
            labels: lable_time, 
            datasets: [{
                label: "Pressure A (mmHg)", 
                data: chartPA, // [ 12, 19, 3 ], 
                backgroundColor: 'red',//PaColor,// [ "#00FF00" ],
                borderColor:'red',
                showLine:false,
                //borderWidth:3,
                pointRadius:2,
            },{
                label: "Pressure B (mmHg)", 
                data: chartPB, // [ 12, 19, 3 ]
                backgroundColor: 'blue', //PbColor, // [ "#FF0000"],
                borderColor:'blue',
                showLine:false,
                //borderWidth:6,
                pointRadius:4,
            },{
                label: "Min A (mm)", 
                data: chartMinA, // [ 12, 19, 3 ]
                backgroundColor: 'green', //PbColor, // [ "#FF0000"],
                borderColor:'green',
                showLine:false,
                //borderWidth:6,
                pointRadius:4,
            },{
                label: "Min B (mm)", 
                data: chartMinB, // [ 12, 19, 3 ]
                backgroundColor: 'pink', //PbColor, // [ "#FF0000"],
                borderColor:'pink',
                showLine:false,
                //borderWidth:6,
                pointRadius:4,
            },{
                label: "Vibrate (cm)", 
                data: chartVibrate, // [ 12, 19, 3 ]
                backgroundColor: 'black', //PbColor, // [ "#FF0000"],
                borderColor:'black',
                showLine:false,
                //borderWidth:6,
                pointRadius:4,
            }
            ],
        }
        });
}

