this.audio_file_player = function(x,y,a,setupConnect=true){
    var imageStoreURL_localPrefix = imageStoreURL+'audio_file_player/';

    var div = 6;
    var offset = 20/div;
    var measurements = { 
        file:{ width:1025, height:305 },
        design:{ width:16.75, height:4.75 },
    };
    measurements.drawing = { width: measurements.file.width/div, height: measurements.file.height/div };
    measurements.drawingUnit = {
        width: measurements.drawing.width/measurements.design.width,
        height: measurements.drawing.height/measurements.design.height,
    };

    var design = {
        name:'audio_file_player',
        x:x, y:y, angle:a,
        space:[
            { x:0,                                  y:0                                   },
            { x:measurements.drawing.width -offset, y:0                                   },
            { x:measurements.drawing.width -offset, y:measurements.drawing.height -offset },
            { x:0,                                  y:measurements.drawing.height -offset },
        ],
        elements:[
            {collection:'dynamic', type:'connectionNode_audio', name:'io_output_R', data:{ 
                x:0, y:15 + 15/2, width:5, height:15, angle:Math.PI, isAudioOutput:true, cableVersion:2, style:style.connectionNode.audio,
            }},
            {collection:'dynamic', type:'connectionNode_audio', name:'io_output_L', data:{ 
                x:0, y:32.5 + 15/2, width:5, height:15, angle:Math.PI, isAudioOutput:true, cableVersion:2, style:style.connectionNode.audio,
            }},
            {collection:'dynamic', type:'connectionNode_signal', name:'io_play', data:{ 
                x:12.5, y:measurements.drawing.height-3-1/3, width:5, height:10, angle:Math.PI/2, cableVersion:2, style:style.connectionNode.signal,
            }},
            {collection:'dynamic', type:'connectionNode_signal', name:'io_stop', data:{ 
                x:25, y:measurements.drawing.height-3-1/3, width:5, height:10, angle:Math.PI/2, cableVersion:2, style:style.connectionNode.signal,
            }},
            {collection:'dynamic', type:'connectionNode_signal', name:'io_singleOrInfini', data:{ 
                x:measurements.drawing.width-3-1/3, y:34, width:5, height:10, cableVersion:2, style:style.connectionNode.signal,
            }},
            {collection:'dynamic', type:'connectionNode_signal', name:'io_loop', data:{ 
                x:measurements.drawing.width-3-1/3, y:19, width:5, height:10, cableVersion:2, style:style.connectionNode.signal,
            }},
            {collection:'dynamic', type:'connectionNode_voltage', name:'io_playbackSpeed', data:{ 
                x:120, y:0, width:5, height:10, angle:-Math.PI/2, cableVersion:2, style:style.connectionNode.voltage,
            }},
            {collection:'dynamic', type:'connectionNode_voltage', name:'io_waveworkspace_startPosition', data:{ 
                x:10, y:0, width:5, height:10, angle:-Math.PI/2, cableVersion:2, style:style.connectionNode.voltage,
            }},
            {collection:'dynamic', type:'connectionNode_voltage', name:'io_waveworkspace_endPosition', data:{ 
                x:25, y:0, width:5, height:10, angle:-Math.PI/2, cableVersion:2, style:style.connectionNode.voltage,
            }},

            {collection:'basic', type:'image', name:'backing', data:{ 
                x:-offset/2, y:-offset/2, width:measurements.drawing.width, height:measurements.drawing.height, url:imageStoreURL_localPrefix+'guide.png'
            }},

            {collection:'control', type:'dial_colourWithIndent_continuous', name:'dial_playbackSpeed',data:{
                x:125, y:20, radius:67.5/6, startAngle:(3*Math.PI)/4, maxAngle:1.5*Math.PI, value:0.5, arcDistance:1.2, resetValue:0.5,
                style:{ handle:{r:0.46,g:0.98,b:0.82,a:1}, slot:{r:0,g:0,b:0,a:0}, needle:{r:1,g:1,b:1,a:1} },
            }},
            {collection:'display', type:'readout_sixteenSegmentDisplay_static', name:'time', data:{
                x:27.5+10/16, y:35+10/16, width:42.5 -10/8, height:10-10/8, count:8
            }},
            {collection:'display', type:'readout_sixteenSegmentDisplay_static', name:'trackNameReadout', data:{
                x:82.5 -10 +10/16, y:35+10/16, width:60*14/12 -10/8, height:10-10/8, count:14
            }},
            {collection:'control', type:'button_image', name:'button_play', data:{
                x:2.5, y:35, width:10, height:10, hoverable:false, 
                backingURL__up:imageStoreURL_localPrefix+'button_play_up.png',
                backingURL__press:imageStoreURL_localPrefix+'button_play_down.png',
            }},
            {collection:'control', type:'button_image', name:'button_stop', data:{
                x:15, y:35, width:10, height:10, hoverable:false, 
                backingURL__up:imageStoreURL_localPrefix+'button_stop_up.png',
                backingURL__press:imageStoreURL_localPrefix+'button_stop_down.png',
            }},
            {collection:'control', type:'button_image', name:'button_open', data:{
                x:145, y:2.5, width:12.5, height:12.5, hoverable:false, 
                backingURL__up:imageStoreURL_localPrefix+'button_file_up.png',
                backingURL__press:imageStoreURL_localPrefix+'button_file_down.png',
            }},
            {collection:'control', type:'checkbox_image', name:'checkbox_loop', data:{
                x:145, y:17.5, width:12.5, height:12.5,
                uncheckURL:imageStoreURL_localPrefix+'loop_off.png', 
                checkURL:imageStoreURL_localPrefix+'loop_on.png',
            }},
            {collection:'control', type:'checkbox_image', name:'checkbox_singleOrInfini', data:{
                x:145, y:32.5, width:12.5, height:12.5,
                uncheckURL:imageStoreURL_localPrefix+'single.png', 
                checkURL:imageStoreURL_localPrefix+'infini.png',
            }},
            {collection:'control', type:'grapher_waveWorkspace', name:'grapher_waveWorkspace', data:{
                x:5+10/16, y:2.5+10/16, width:102.5-10/8, height:30-10/8, style:{ background_lineThickness:0.1, backing:{r:0,g:0,b:0,a:1} }
            }},
            {collection:'display', type:'glowbox_rectangle',name:'fireLight',data:{ 
                x:2.5, y:2.5, width:2.5, height:30, style:{ glow:{r:0.99,g:0.94,b:0.72,a:1}, dim:{r:0.62,g:0.57,b:0.36,a:1} }
            }},
        ]
    };
    
    //main object
        var object = _canvas_.interface.unit.builder(design);
        
    //circuitry
        //fresh file load routine
            function loadProcess(data){
                object.elements.grapher_waveWorkspace.grapher_waveWorkspace.draw( object.player.waveformSegment() );                   
                object.elements.grapher_waveWorkspace.grapher_waveWorkspace.select(0);
                object.elements.grapher_waveWorkspace.grapher_waveWorkspace.area(-1,-1);
            
                object.elements.readout_sixteenSegmentDisplay_static.trackNameReadout.text(data.name);
                object.elements.readout_sixteenSegmentDisplay_static.trackNameReadout.print('smart');
            }
        
        //audio file player
            object.player = new _canvas_.interface.circuit.player(_canvas_.library.audio.context);

        //data refresh
            function refresh(){
                //check if there's a track at all
                    if( !object.player.isLoaded() ){return;}

                //time readout
                    var time = _canvas_.library.math.seconds2time( Math.round(object.player.currentTime()));

                    object.elements.readout_sixteenSegmentDisplay_static.time.text(
                        _canvas_.library.misc.padString(time.h,2,'0')+':'+
                        _canvas_.library.misc.padString(time.m,2,'0')+':'+
                        _canvas_.library.misc.padString(time.s,2,'0')
                    );
                    object.elements.readout_sixteenSegmentDisplay_static.time.print();

                //wave box
                    object.elements.grapher_waveWorkspace.grapher_waveWorkspace.select(object.player.progress(),false);
            }
            setInterval(refresh,1000/30);

    //wiring
        object.elements.dial_colourWithIndent_continuous.dial_playbackSpeed.onchange = function(data){ object.player.rate( 2*data ); };
        object.elements.grapher_waveWorkspace.grapher_waveWorkspace.onchange = function(needle,value){
            if(needle == 'lead'){ object.player.jumpTo(value); }
            else if(needle == 'selection_A' || needle == 'selection_B'){
                var temp = object.elements.grapher_waveWorkspace.grapher_waveWorkspace.area();
                if(temp.A < temp.B){ object.player.loop({start:temp.A,end:temp.B}); }
                else{ object.player.loop({start:temp.B,end:temp.A}); }
            }
        };
        object.elements.button_image.button_open.onpress = function(){ object.i.loadByFile(); };
        object.elements.button_image.button_play.onpress = function(){ object.i.fire(); };
        object.elements.button_image.button_stop.onpress = function(){ object.i.stop(); };
        object.elements.checkbox_image.checkbox_loop.onchange = function(val){ object.i.loop(val); };

        object.player.out_right().connect( object.elements.connectionNode_audio.io_output_R.in() );
        object.player.out_left().connect( object.elements.connectionNode_audio.io_output_L.in() );
        object.io.signal.io_play.onchange = function(val){
            var element = object.elements.button_image.button_play;
            if(val){ elememt.press(); }else{ element.release(); }
        };
        object.io.signal.io_stop.onchange = function(val){
            var element = object.elements.button_image.button_stop;
            if(val){ elememt.press(); }else{ element.release(); }
        };
        // object.io.signal.io_singleOrInfini.onchange = function(val){};
        var io_loop__toggle = false;
        object.io.signal.io_loop.onchange = function(val){ 
            if(val){ 
                io_loop__toggle = !io_loop__toggle;
                object.elements.checkbox_image.checkbox_loop.set(io_loop__toggle);
            }
        };
        object.io.voltage.io_playbackSpeed.onchange = function(val){
            object.elements.dial_colourWithIndent_continuous.dial_playbackSpeed.set(val);
        };
        var io_waveworkspace__positions = {s:0,e:0};
        object.io.voltage.io_waveworkspace_startPosition.onchange = function(val){ 
            io_waveworkspace__positions.s = val;
            object.elements.grapher_waveWorkspace.grapher_waveWorkspace.area(io_waveworkspace__positions.s,io_waveworkspace__positions.e);
        };
        object.io.voltage.io_waveworkspace_endPosition.onchange = function(val){ 
            io_waveworkspace__positions.e = val;
            object.elements.grapher_waveWorkspace.grapher_waveWorkspace.area(io_waveworkspace__positions.s,io_waveworkspace__positions.e);
        };

    //interface
        object.i = {
            loadRaw:function(data){ object.player.loadRaw(data,loadProcess); },
            loadByFile:function(){ object.player.load('file',loadProcess); },
            loadByURL:function(url){ object.player.load('url',loadProcess,url); },
            loop:function(onOff){ object.player.loop({active:onOff}); },
            fire:function(){ 
                object.player.start();

                //flash light
                    object.elements.glowbox_rectangle.fireLight.on();
                    setTimeout(object.elements.glowbox_rectangle.fireLight.off, 100);
            },
            stop:function(){ object.player.stop(); },
        };

    return object;
};



this.audio_file_player.metadata = {
    name:'Audio File Player',
    category:'synthesizers',
    helpURL:'/help/units/beta/audio_file_player/'
};