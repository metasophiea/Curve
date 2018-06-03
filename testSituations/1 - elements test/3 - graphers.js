{{include:grapher_waveWorkspace.js}}

objects.testObject = function(x,y,debug=false){
    var style = {
        background: 'fill:rgba(200,200,200,1); stroke:none;',

        grapher:{
            middleground:'stroke:rgba(0,255,0,1); stroke-width:0.5; stroke-linecap:round;', 
            background:'rgba(0,100,0,1)',
            backgroundText:'fill:rgba(0,100,0,1); font-size:3; font-family:Helvetica;',
            backing:'rgba(50,50,50,1)'
        },
    };

    var design = {
        type: 'testObject',
        x: x, y: y,
        base: {
            points:[{x:0,y:0},{x:100,y:0},{x:100,y:100},{x:0,y:100}], 
            style:style.background
        },
        elements:[

            // {type:'grapherSVG', name:'grapherSVG', data:{
            //     x:5, y:0, width:100, height:50,
            // }},
            // {type:'grapher_periodicWave', name:'grapher_periodicWave', data:{
            //     x:5, y:55, width:100, height:50,
            // }},
            // {type:'grapherCanvas', name:'grapherCanvas', data:{
            //     x:125, y:0, width:100, height:50,
            // }},
            // {type:'grapher_audioScope', name:'grapher_audioScope', data:{
            //     x:125, y:110, width:100, height:50,
            // }},

            {type:'grapher_waveWorkspace', name:'grapher_waveWorkspace', data:{
                x:125, y:55, width:100, height:50,
            }},

        ]
    };


    //main object
        var obj = __globals.utility.experimental.objectBuilder(objects.testObject,design);

    //setup
        // design.grapherCanvas.grapherCanvas._test();
        // design.grapherSVG.grapherSVG._test();
        design.grapher_waveWorkspace.grapher_waveWorkspace._test();
        // design.grapher_audioScope.grapher_audioScope.start();

    return obj;
}


var testObject_1 = objects.testObject(50,50,true);
__globals.panes.middleground.append( testObject_1 );

__globals.utility.workspace.gotoPosition(-1126.52, -666.166, 6.63325, 0);