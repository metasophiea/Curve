objects.testAudioObject = function(x,y,debug=false){
    var style = {
        background:'fill:rgba(200,200,200,1)',
    };
    var design = {
        type: 'testAudioObject',
        x: x, y: y,
        base: {
            points:[{x:0,y:0},{x:220,y:0},{x:220,y:52.5},{x:0,y:52.5}], 
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

            {type:'slide_horizontal',name:'scrubber',data:{
                x:45, y:30, width: 170, height: 20,
                style:{handle:'fill:rgb(220,220,220);'}, 
                onchange:function(data){}, 
                onrelease:function(data){
                    obj.__audioFilePlayer.jumpTo_percentage(data);
                }
            }},

            {type:'button_rect',name:'play',data:{
                x:5, y: 30, width:10, height:20, 
                style:{
                    up:'fill:rgba(175,195,175,1)', hover:'fill:rgba(220,240,220,1)', 
                    down:'fill:rgba(150,170,150,1)', glow:'fill:rgba(220,220,220,1)'
                }, 
                onclick:function(){obj.__audioFilePlayer.play();}
            }},
            {type:'button_rect',name:'pause',data:{
                x:17.5, y: 30, width:10, height:20, 
                style:{
                    up:'fill:rgba(175,175,175,1)', hover:'fill:rgba(220,220,220,1)', 
                    down:'fill:rgba(150,150,150,1)', glow:'fill:rgba(220,200,220,1)'
                }, 
                onclick:function(){obj.__audioFilePlayer.pause();}
            }},
            {type:'button_rect',name:'stop',data:{
                x:30, y: 30, width:10, height:20, 
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
                    obj.__audioFilePlayer.load_file(function(data){
                        design.readout_sixteenSegmentDisplay.trackNameReadout.text(obj.__audioFilePlayer.title());
                        design.readout_sixteenSegmentDisplay.trackNameReadout.print('smart');
                    });
                }
            }},   


        ]
    };

    //main object
        var obj = __globals.utility.experimental.objectBuilder(objects.testAudioObject,design);

    //circuitry
        obj.__audioFilePlayer = new parts.audio.audioFilePlayer(__globals.audio.context);
        obj.__audioFilePlayer.out_right().connect( design.connectionNode_audio.outRight.in() );
        obj.__audioFilePlayer.out_left().connect( design.connectionNode_audio.outLeft.in() );
        setInterval(function(){
            //check if there's a track at all
                if( -1==obj.__audioFilePlayer.getCurrentTime() ){return;}

            //time readout
                var time = __globals.utility.math.seconds2time( Math.round(obj.__audioFilePlayer.getCurrentTime()));

                design.readout_sixteenSegmentDisplay.time.text(
                    __globals.utility.math.padString(time.h,2,'0')+':'+
                    __globals.utility.math.padString(time.m,2,'0')+':'+
                    __globals.utility.math.padString(time.s,2,'0')
                );
                design.readout_sixteenSegmentDisplay.time.print();

            //scrubber
                var progress = obj.__audioFilePlayer.getCurrentTime()/obj.__audioFilePlayer.duration();
                if( !isNaN(progress) ){
                    design.slide_horizontal.scrubber.set(progress,true);
                }
        },100);

    //setup
        design.readout_sixteenSegmentDisplay.trackNameReadout.text('    --');
        design.readout_sixteenSegmentDisplay.trackNameReadout.print('smart');

    return obj;
};