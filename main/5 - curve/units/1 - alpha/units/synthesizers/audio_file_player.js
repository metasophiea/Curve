this.audio_file_player = function(x,y,angle){
    //style data
        var unitStyle = new function(){
            //image store location URL
                this.imageStoreURL_localPrefix = imageStoreURL+'audio_file_player/';

            //calculation of measurements
                var div = 6;
                var measurement = { 
                    file: { width:1025, height:305 },
                    design: { width:16.75, height:4.75 },
                };

                this.offset = 20/div;
                this.drawingValue = { 
                    width: measurement.file.width/div, 
                    height: measurement.file.height/div
                };

            //styling values
                this.dial_playbackSpeed = { handle:{r:0.46,g:0.98,b:0.82,a:1}, slot:{r:0,g:0,b:0,a:0}, needle:{r:1,g:1,b:1,a:1} };
                this.grapher_waveWorkspace = { background_lineThickness:0.1, backing:{r:0,g:0,b:0,a:1} };
                this.fireLight = { glow:{r:0.99,g:0.94,b:0.72,a:1}, dim:{r:0.62,g:0.57,b:0.36,a:1} };
        };

    //main object creation
        var object = _canvas_.interface.unit.builder({
            name:'audio_file_player',
            x:x, y:y, angle:angle,
            space:[
                { x:0,                                              y:0                                               },
                { x:unitStyle.drawingValue.width -unitStyle.offset, y:0                                               },
                { x:unitStyle.drawingValue.width -unitStyle.offset, y:unitStyle.drawingValue.height -unitStyle.offset },
                { x:0,                                              y:unitStyle.drawingValue.height -unitStyle.offset },
            ],
            elements:[
                {collection:'dynamic', type:'connectionNode_audio', name:'io_output_R', data:{ 
                    x:0, y:15 + 15/2, width:5, height:15, angle:Math.PI, isAudioOutput:true, cableVersion:2, style:style.connectionNode.audio,
                }},
                {collection:'dynamic', type:'connectionNode_audio', name:'io_output_L', data:{ 
                    x:0, y:32.5 + 15/2, width:5, height:15, angle:Math.PI, isAudioOutput:true, cableVersion:2, style:style.connectionNode.audio,
                }},
                {collection:'dynamic', type:'connectionNode_signal', name:'io_play', data:{ 
                    x:12.5, y:unitStyle.drawingValue.height-3-1/3, width:5, height:10, angle:Math.PI/2, cableVersion:2, style:style.connectionNode.signal,
                }},
                {collection:'dynamic', type:'connectionNode_signal', name:'io_stop', data:{ 
                    x:25, y:unitStyle.drawingValue.height-3-1/3, width:5, height:10, angle:Math.PI/2, cableVersion:2, style:style.connectionNode.signal,
                }},
                {collection:'dynamic', type:'connectionNode_signal', name:'io_singleOrInfini', data:{ 
                    x:unitStyle.drawingValue.width-3-1/3, y:34, width:5, height:10, cableVersion:2, style:style.connectionNode.signal,
                }},
                {collection:'dynamic', type:'connectionNode_signal', name:'io_loop', data:{ 
                    x:unitStyle.drawingValue.width-3-1/3, y:19, width:5, height:10, cableVersion:2, style:style.connectionNode.signal,
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
                    x:-unitStyle.offset/2, y:-unitStyle.offset/2, width:unitStyle.drawingValue.width, height:unitStyle.drawingValue.height, url:unitStyle.imageStoreURL_localPrefix+'backing.png'
                }},

                {collection:'control', type:'dial_colourWithIndent_continuous', name:'dial_playbackSpeed',data:{
                    x:125, y:20, radius:67.5/6, startAngle:(3*Math.PI)/4, maxAngle:1.5*Math.PI, value:0.5, arcDistance:1.2, resetValue:0.5, style:unitStyle.dial_playbackSpeed,
                }},
                {collection:'display', type:'readout_sixteenSegmentDisplay_static', name:'time', data:{
                    x:27.5+10/16, y:35+10/16, width:42.5 -10/8, height:10-10/8, count:8
                }},
                {collection:'display', type:'readout_sixteenSegmentDisplay_static', name:'trackNameReadout', data:{
                    x:82.5 -10 +10/16, y:35+10/16, width:60*14/12 -10/8, height:10-10/8, count:14
                }},
                {collection:'control', type:'button_image', name:'button_play', data:{
                    x:2.5, y:35, width:10, height:10, hoverable:false, 
                    backingURL__up:unitStyle.imageStoreURL_localPrefix+'button_play_up.png',
                    backingURL__press:unitStyle.imageStoreURL_localPrefix+'button_play_down.png',
                }},
                {collection:'control', type:'button_image', name:'button_stop', data:{
                    x:15, y:35, width:10, height:10, hoverable:false, 
                    backingURL__up:unitStyle.imageStoreURL_localPrefix+'button_stop_up.png',
                    backingURL__press:unitStyle.imageStoreURL_localPrefix+'button_stop_down.png',
                }},
                {collection:'control', type:'button_image', name:'button_open', data:{
                    x:145, y:2.5, width:12.5, height:12.5, hoverable:false, 
                    backingURL__up:unitStyle.imageStoreURL_localPrefix+'button_file_up.png',
                    backingURL__press:unitStyle.imageStoreURL_localPrefix+'button_file_down.png',
                }},
                {collection:'control', type:'checkbox_image', name:'checkbox_loop', data:{
                    x:145, y:17.5, width:12.5, height:12.5,
                    uncheckURL:unitStyle.imageStoreURL_localPrefix+'loop_off.png', 
                    checkURL:unitStyle.imageStoreURL_localPrefix+'loop_on.png',
                }},
                {collection:'control', type:'checkbox_image', name:'checkbox_singleOrInfini', data:{
                    x:145, y:32.5, width:12.5, height:12.5,
                    uncheckURL:unitStyle.imageStoreURL_localPrefix+'single.png', 
                    checkURL:unitStyle.imageStoreURL_localPrefix+'infini.png',
                }},
                {collection:'control', type:'grapher_waveWorkspace', name:'grapher_waveWorkspace', data:{
                    x:5+10/16, y:2.5+10/16, width:102.5-10/6, height:30-10/8, style:unitStyle.grapher_waveWorkspace,
                }},
                {collection:'display', type:'glowbox_rectangle',name:'fireLight',data:{ 
                    x:2.5, y:2.5, width:2.5, height:30, style:unitStyle.fireLight,
                }},
            ]
        });
    
    //circuitry
        var playerCircuit = new _canvas_.interface.circuit.player2(_canvas_.library.audio.context);
        
        function loadProcess(data){
            object.elements.grapher_waveWorkspace.grapher_waveWorkspace.draw( playerCircuit.waveformSegment() );
        
            object.elements.readout_sixteenSegmentDisplay_static.trackNameReadout.text(data.name);
            object.elements.readout_sixteenSegmentDisplay_static.trackNameReadout.print('smart');
        }
        function refresh(){
            //check if there's a track at all
                if( !playerCircuit.isLoaded() ){return;}

            //time readout
                if(playerCircuit.concurrentPlayCountLimit() == 1){
                    var tmp = playerCircuit.currentTime(0);
                    if(tmp == -1){tmp = 0;}
                    var time = _canvas_.library.math.seconds2time( Math.round(tmp));

                    object.elements.readout_sixteenSegmentDisplay_static.time.text(
                        _canvas_.library.misc.padString(time.h,2,'0')+':'+
                        _canvas_.library.misc.padString(time.m,2,'0')+':'+
                        _canvas_.library.misc.padString(time.s,2,'0')
                    );
                    object.elements.readout_sixteenSegmentDisplay_static.time.print();
                }else{
                    object.elements.readout_sixteenSegmentDisplay_static.time.text(
                        _canvas_.library.misc.padString(playerCircuit.currentTime().length,8,' ')
                    );
                    object.elements.readout_sixteenSegmentDisplay_static.time.print();
                }
            
            //waveport
                var progressList = playerCircuit.progress();
                var needleList = object.elements.grapher_waveWorkspace.grapher_waveWorkspace.list();

                //adjust needles to match player
                    progressList.forEach((needlePosition,index) => {
                        object.elements.grapher_waveWorkspace.grapher_waveWorkspace.select(index,needlePosition,false);
                    });

                //remove unneeded needles
                    while(Object.keys(needleList).length > progressList.length){
                        object.elements.grapher_waveWorkspace.grapher_waveWorkspace.select((Object.keys(needleList).length-1),-1,false);
                        var needleList = object.elements.grapher_waveWorkspace.grapher_waveWorkspace.list();
                    }
        }
        setInterval(refresh,1000/30);

    //wiring
        //hid
            object.elements.button_image.button_open.onpress = function(){ playerCircuit.load('file',loadProcess); };
            object.elements.button_image.button_play.onpress = function(){
                if(object.i.concurrentPlayCountLimit() == 1 && playerCircuit.currentTime().length > 0){ playerCircuit.resume(); }
                else{ playerCircuit.start(); }

                //flash light
                    object.elements.glowbox_rectangle.fireLight.on();
                    setTimeout(object.elements.glowbox_rectangle.fireLight.off, 100);
            };
            object.elements.button_image.button_stop.onpress = function(){ playerCircuit.stop(); };
            object.elements.dial_colourWithIndent_continuous.dial_playbackSpeed.onchange = function(data){ playerCircuit.rate( 2*data ); };
            object.elements.checkbox_image.checkbox_loop.onchange = function(bool){ return playerCircuit.loop(bool); };
            object.elements.checkbox_image.checkbox_singleOrInfini.onchange = function(value){ return playerCircuit.concurrentPlayCountLimit(value); };
            object.elements.grapher_waveWorkspace.grapher_waveWorkspace.onchange = function(needle,value){
                if( !isNaN(parseInt(needle)) ){
                    if( playerCircuit.progress(needle) == -1 ){
                        playerCircuit.createPlayhead(value);
                    }else{
                        playerCircuit.jumpTo(needle,value);
                    }
                }

                var area = object.elements.grapher_waveWorkspace.grapher_waveWorkspace.area();
                if(needle == 'selection_A'){ area.A = value; }
                if(needle == 'selection_B'){ area.B = value; }

                object.elements.grapher_waveWorkspace.grapher_waveWorkspace.area(area.A,area.B,false);
                if(!object.elements.grapher_waveWorkspace.grapher_waveWorkspace.areaIsActive()){ area.A = 0; area.B = 1; }
                if(area.A > area.B){ var tmp = area.A; area.A = area.B; area.B = tmp; } //keepin' things straight
                return playerCircuit.area(area.A,area.B);
            };
        //io
            playerCircuit.out_right().connect( object.elements.connectionNode_audio.io_output_R.in() );
            playerCircuit.out_left().connect( object.elements.connectionNode_audio.io_output_L.in() );
            object.io.signal.io_play.onchange = function(value){
                var part = object.elements.button_image.button_play;
                value ? part.press() : part.release();
            };
            object.io.signal.io_stop.onchange = function(value){
                var part = object.elements.button_image.button_stop;
                value ? part.press() : part.release();
            };
            object.io.signal.io_singleOrInfini.onchange = function(value){
                if(!value){return;}
                var part = object.elements.checkbox_image.checkbox_singleOrInfini;
                part.set(!part.get());
            };
            object.io.signal.io_loop.onchange = function(value){
                if(!value){return;}
                var part = object.elements.checkbox_image.checkbox_loop;
                part.set(!part.get());
            };
            object.io.voltage.io_playbackSpeed.onchange = function(value){
                object.elements.dial_colourWithIndent_continuous.dial_playbackSpeed.set(value);
            };
            object.io.voltage.io_waveworkspace_startPosition.onchange = function(value){
                var current = object.elements.grapher_waveWorkspace.grapher_waveWorkspace.area().B;
                if(current == undefined){current = 1;}
                object.elements.grapher_waveWorkspace.grapher_waveWorkspace.area(value,current);
            };
            object.io.voltage.io_waveworkspace_endPosition.onchange = function(value){
                var current = object.elements.grapher_waveWorkspace.grapher_waveWorkspace.area().A;
                if(current == undefined){current = 0;}
                object.elements.grapher_waveWorkspace.grapher_waveWorkspace.area(current,value);
            };

    //interface
        object.i = {
            loadRaw:function(data){ playerCircuit.loadRaw(data,loadProcess); },
            loadByFile:function(){ playerCircuit.load('file',loadProcess); },
            loadByURL:function(url){ playerCircuit.load('url',loadProcess,url); },
            fire:function(){
                if(playerCircuit.concurrentPlayCountLimit() == 1 && playerCircuit.currentTime().length > 0){ playerCircuit.resume(); }
                else{ playerCircuit.start(); }

                //flash light
                    object.elements.glowbox_rectangle.fireLight.on();
                    setTimeout(object.elements.glowbox_rectangle.fireLight.off, 100);
            },
            pause:function(){ playerCircuit.pause(); },
            resume:function(){ playerCircuit.resume(); },
            stop:function(){ playerCircuit.stop(); },
            area:function(start,end){ return object.elements.grapher_waveWorkspace.grapher_waveWorkspace.area(start,end); },
            looping:function(bool){
                if(bool == undefined){ return object.elements.checkbox_image.checkbox_loop.get(); }
                object.elements.checkbox_image.checkbox_loop.set(bool);
            },
            rate:function(value){
                if(value == undefined){ return object.elements.dial_colourWithIndent_continuous.dial_playbackSpeed.get(); }
                object.elements.dial_colourWithIndent_continuous.dial_playbackSpeed.set(value);
            },
            jumpTo:function(needle,position){ playerCircuit.jumpTo(needle,position); },
            concurrentPlayCountLimit:function(value){ return playerCircuit.concurrentPlayCountLimit(value); },
        };

    //import/export
        object.exportData = function(){
            return{
                track: playerCircuit.unloadRaw(),
                rate: object.elements.dial_colourWithIndent_continuous.dial_playbackSpeed.get(),
                loopActive: object.elements.checkbox_image.checkbox_loop.get(), 
                selectedArea: object.elements.grapher_waveWorkspace.grapher_waveWorkspace.area(),
                singleOrInfini: object.elements.checkbox_image.checkbox_singleOrInfini.get(),
            };
        };
        object.importData = function(data){
            object.i.loadRaw(data.track);
            object.elements.dial_colourWithIndent_continuous.dial_playbackSpeed.set(data.rate);
            object.elements.checkbox_image.checkbox_loop.set(data.loopActive);
            object.elements.grapher_waveWorkspace.grapher_waveWorkspace.area(data.selectedArea.A,data.selectedArea.B);
            object.elements.checkbox_image.checkbox_singleOrInfini.set(data.singleOrInfini);
        };

    return object;
};
this.audio_file_player.metadata = {
    name:'Audio File Player',
    category:'synthesizers',
    helpURL:'/help/units/beta/audio_file_player/'
};
