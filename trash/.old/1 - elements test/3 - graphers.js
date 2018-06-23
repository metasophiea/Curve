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
            //SVGs
                {type:'grapherSVG', name:'grapherSVG', data:{
                    x:5, y:0, width:100, height:50,
                }},
                {type:'grapher_periodicWave', name:'grapher_periodicWave_SVG', data:{
                    x:5, y:55, width:100, height:50, graphType:'SVG'
                }},
                {type:'grapher_audioScope', name:'grapher_audioScope_SVG', data:{
                    x:5, y:110, width:100, height:50, graphType:'SVG'
                }},
                {type:'grapher_waveWorkspace', name:'grapher_waveWorkspace_SVG', data:{
                    x:5, y:165, width:100, height:50, graphType:'SVG'
                }},
            //Canvas
                {type:'grapherCanvas', name:'grapherCanvas', data:{
                    x:125, y:0, width:100, height:50,
                }},
                {type:'grapher_periodicWave', name:'grapher_periodicWave_canvas', data:{
                    x:125, y:55, width:100, height:50, graphType:'Canvas'
                }},
                {type:'grapher_audioScope', name:'grapher_audioScope_canvas', data:{
                    x:125, y:110, width:100, height:50, graphType:'Canvas'
                }},
                {type:'grapher_waveWorkspace', name:'grapher_waveWorkspace_canvas', data:{
                    x:125, y:165, width:100, height:50, graphType:'Canvas'
                }},
        ]
    };
    

    //main object
        var obj = __globals.utility.experimental.objectBuilder(objects.testObject,design);

    //setup
        design.grapherSVG.grapherSVG._test();
        design.grapher_waveWorkspace.grapher_waveWorkspace_SVG._test();
        design.grapher_audioScope.grapher_audioScope_SVG.start();
        design.grapherCanvas.grapherCanvas._test();
        design.grapher_waveWorkspace.grapher_waveWorkspace_canvas._test();
        design.grapher_audioScope.grapher_audioScope_canvas.start();

    return obj;
}


var testObject_1 = objects.testObject(50,50,true);
__globals.panes.middleground.append( testObject_1 );

__globals.utility.workspace.gotoPosition(-101.407, -107.362, 2.3409, 0);