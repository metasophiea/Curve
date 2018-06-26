objects.testAudiobject = function(x,y,debug=false){
    var style = {
        background:'fill:rgba(200,200,200,1)',

        text:'fill:rgba(0,0,0,1); font-size:3px; font-family:Courier New; pointer-events: none;',

        handle:'fill:rgba(220,220,220,1)', slot:'fill:rgba(50,50,50,1)',
        needle:'fill:rgba(250,150,250,1)', outerArc:'fill:none; stroke:rgb(150,150,150); stroke-width:1;',

        grapher:{
            middleground:'stroke:rgba(0,0,255,1); stroke-width:0.5; stroke-linecap:round;', 
            background:'stroke:rgba(0,0,100,1); stroke-width:0.25;',
            backgroundText:'fill:rgba(0,0,100,1); font-size:3; font-family:Helvetica;',
            backing:'fill:rgba(50,50,50,1)'
        },
    };
    var design = {
        type: 'testAudiobject',
        x: x, y: y,
        base: {
            points:[{x:0,y:0},{x:220,y:0},{x:220,y:110},{x:0,y:110}], 
            style:style.background
        },
        elements:[
            {type:'connectionNode_audio', name:'outRight', data: {
                type: 1, x: -10, y: 5, width: 10, height: 20
            }},
            {type:'connectionNode_audio', name:'outLeft', data: {
                type: 1, x: -10, y: 27.5, width: 10, height: 20
            }},
            {type:'readout_sixteenSegmentDisplay', name:'trackNameReadout', data:{
                x: 30, y: 5, angle:0, width:100, height:20, count:10, 
                style:{background:'fill:rgb(0,0,0)', glow:'fill:rgb(200,200,200)',dim:'fill:rgb(20,20,20)'}
            }},
            {type:'readout_sixteenSegmentDisplay', name:'time', data:{
                x: 135, y: 5, angle:0, width:80, height:20, count:8, 
                style:{background:'fill:rgb(0,0,0)', glow:'fill:rgb(200,200,200)',dim:'fill:rgb(20,20,20)'}
            }},
           
            {type:'slide',name:'scrubber',data:{
                x:30, y:50, width: 20, height: 165, angle:-Math.PI/2, handleHeight:0.05,
                style:{handle:'fill:rgb(220,220,220);'}, 
                onchange:function(data){}, 
                onrelease:function(data){ obj.__audioFilePlayer.jumpTo_percent(data); }
            }},

            {type:'dial_continuous',name:'rate',data:{
                x:207.5, y:41.25, r: 7, startAngle: (3*Math.PI)/4, maxAngle: 1.5*Math.PI, arcDistance: 1.35, 
                style:{handle:style.handle, slot:style.slot, needle:style.needle, outerArc:style.outerArc},
                onchange:function(data){ obj.__audioFilePlayer.rate( 2*data ); },
            }},

            {type:'button_rect',name:'play',data:{
                x:5, y: 30, width:10, height:20, 
                style:{
                    up:'fill:rgba(175,195,175,1)', hover:'fill:rgba(220,240,220,1)', 
                    down:'fill:rgba(150,170,150,1)', glow:'fill:rgba(220,220,220,1)'
                }, 
                onclick:function(){obj.__audioFilePlayer.play();}
            }},
            {type:'button_rect',name:'stop',data:{
                x:15, y: 30, width:10, height:20, 
                style:{
                    up:'fill:rgba(195,175,175,1)', hover:'fill:rgba(240,220,220,1)', 
                    down:'fill:rgba(170,150,150,1)', glow:'fill:rgba(240,200,220,1)'
                }, 
                onclick:function(){obj.__audioFilePlayer.stop();}
            }},
            {type:'button_rect', name:'loadFile', data: {
                x:5, y: 5, width:20, height:20,
                style:{
                    up:'fill:rgba(175,175,175,1)', hover:'fill:rgba(220,220,220,1)', 
                    down:'fill:rgba(150,150,150,1)', glow:'fill:rgba(220,200,220,1)'
                },
                onclick: function(){
                    obj.__audioFilePlayer.load('file',function(data){
                        design.readout_sixteenSegmentDisplay.trackNameReadout.text(data.name);
                        design.readout_sixteenSegmentDisplay.trackNameReadout.print('smart');
                        design.grapher_waveWorkspace.grapher_waveWorkspace.draw( obj.__audioFilePlayer.waveformSegment() );
                        design.grapher_waveWorkspace.grapher_waveWorkspace.select(0);
                        design.grapher_waveWorkspace.grapher_waveWorkspace.area(-1,-1);
                    });
                }
            }},

            {type:'grapher_waveWorkspace', name:'grapher_waveWorkspace', data:{
                x:5, y:55, width:210, height:50,
                selectionAreaToggle:function(bool){ obj.__audioFilePlayer.loop(bool); },
                onchange:function(needle,value){
                    if(needle == 'lead'){ obj.__audioFilePlayer.jumpTo_percent(value); }
                    else if(needle == 'selection_A' || needle == 'selection_B'){
                        var temp = design.grapher_waveWorkspace.grapher_waveWorkspace.area();
                        if(temp.A < temp.B){ obj.__audioFilePlayer.loopBounds({start:temp.A,end:temp.B}); }
                        else{ obj.__audioFilePlayer.loopBounds({start:temp.B,end:temp.A}); }
                    }
                },
            }},
        ]
    };

    //main object
        var obj = __globals.utility.experimental.objectBuilder(objects.testAudiobject,design);

    //circuitry
        //audioFilePlayer
            obj.__audioFilePlayer = new parts.audio.audioFilePlayer(__globals.audio.context);
            obj.__audioFilePlayer.out_right().connect( design.connectionNode_audio.outRight.in() );
            obj.__audioFilePlayer.out_left().connect( design.connectionNode_audio.outLeft.in() );

        //constantly gather information from the audioFilePlayer, and push this info to the display elements
            setInterval(function(){
                //check if there's a track at all
                    if( obj.__audioFilePlayer.currentTime() == -1 ){return;}

                //time readout
                    var time = __globals.utility.math.seconds2time( Math.round(obj.__audioFilePlayer.currentTime()));

                    design.readout_sixteenSegmentDisplay.time.text(
                        __globals.utility.math.padString(time.h,2,'0')+':'+
                        __globals.utility.math.padString(time.m,2,'0')+':'+
                        __globals.utility.math.padString(time.s,2,'0')
                    );
                    design.readout_sixteenSegmentDisplay.time.print();

                //progress
                    var progress = obj.__audioFilePlayer.currentTime()/obj.__audioFilePlayer.duration();
                    if( !isNaN(progress) ){
                        design.slide.scrubber.set(progress,false);
                        design.grapher_waveWorkspace.grapher_waveWorkspace.select(progress);
                    }
            },100);

    //setup
        design.dial_continuous.rate.set(0.5);
        design.grapher_waveWorkspace.grapher_waveWorkspace.foregroundLineThickness(1);
        design.grapher_waveWorkspace.grapher_waveWorkspace.drawBackground();

    return obj;
};