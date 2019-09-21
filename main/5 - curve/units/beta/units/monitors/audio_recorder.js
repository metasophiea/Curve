this.audio_recorder = function(x,y,a,setupConnect=true){
    var imageStoreURL_localPrefix = imageStoreURL+'audio_recorder/';

    var div = 6;
    var offset = 20/div;
    var measurements = { 
        file:{ width:590, height:260 },
        design:{ width:9.5, height:4 },
    };
    measurements.drawing = { width: measurements.file.width/div, height: measurements.file.height/div };
    measurements.drawingUnit = {
        width: measurements.drawing.width/measurements.design.width,
        height: measurements.drawing.height/measurements.design.height,
    };

    var design = {
        name:'audio_recorder',
        x:x, y:y, angle:a,
        space:[
            { x:0,                                  y:0                                   },
            { x:measurements.drawing.width -offset, y:0                                   },
            { x:measurements.drawing.width -offset, y:measurements.drawing.height -offset },
            { x:0,                                  y:measurements.drawing.height -offset },
        ],
        elements:[
            {collection:'dynamic', type:'connectionNode_audio', name:'io_input_R', data:{ 
                x:measurements.drawing.width-3-1/3, y:-2.5 + 15/2, width:5, height:15, cableVersion:2, style:style.connectionNode.audio,
            }},
            {collection:'dynamic', type:'connectionNode_audio', name:'io_input_L', data:{ 
                x:measurements.drawing.width-3-1/3, y:15 + 15/2, width:5, height:15, cableVersion:2, style:style.connectionNode.audio,
            }},

            {collection:'basic', type:'image', name:'backing', data:{ 
                x:-offset/2, y:-offset/2, width:measurements.drawing.width, height:measurements.drawing.height, url:imageStoreURL_localPrefix+'backing.png'
            }},
            {collection:'display', type:'glowbox_image', name:'light_empty', data:{
                x:5, y:4.15, height:10, width:19.5,
                glowURL:imageStoreURL_localPrefix+'light_empty_active.png',
                dimURL:imageStoreURL_localPrefix+'light_empty.png',
            }},
            {collection:'display', type:'glowbox_image', name:'light_recording', data:{
                x:5+19.5+2/3, y:4.15, height:10, width:19.5,
                glowURL:imageStoreURL_localPrefix+'light_recording_active.png',
                dimURL:imageStoreURL_localPrefix+'light_recording.png',
            }},
            {collection:'display', type:'glowbox_image', name:'light_paused', data:{
                x:5+(19.5+2/3)*2, y:4.15, height:10, width:19.5,
                glowURL:imageStoreURL_localPrefix+'light_paused_active.png',
                dimURL:imageStoreURL_localPrefix+'light_paused.png',
            }},
            {collection:'display', type:'glowbox_image', name:'light_stopped', data:{
                x:5+(19.5+2/3)*3, y:4.15, height:10, width:19.5,
                glowURL:imageStoreURL_localPrefix+'light_stopped_active.png',
                dimURL:imageStoreURL_localPrefix+'light_stopped.png',
            }},

            {collection:'display', type:'readout_sixteenSegmentDisplay_static', name:'time', data:{
                x:5+2/3, y:15+2/3, width:78.75, height:10-10/8, count:15
            }},

            {collection:'control', type:'button_image', name:'button_record', data:{
                x:5, y:25+4/5, width:15+1/3, height:10, hoverable:false, 
                backingURL__up:imageStoreURL_localPrefix+'button_record.png',
                backingURL__press:imageStoreURL_localPrefix+'button_record_active.png',
            }},
            {collection:'control', type:'button_image', name:'button_pause', data:{
                x:5+16+1/6, y:25+4/5, width:15+1/3, height:10, hoverable:false, 
                backingURL__up:imageStoreURL_localPrefix+'button_pause.png',
                backingURL__press:imageStoreURL_localPrefix+'button_pause_active.png',
            }},
            {collection:'control', type:'button_image', name:'button_stop', data:{
                x:5+(16+1/6)*2, y:25+4/5, width:15+1/3, height:10, hoverable:false, 
                backingURL__up:imageStoreURL_localPrefix+'button_stop.png',
                backingURL__press:imageStoreURL_localPrefix+'button_stop_active.png',
            }},
            {collection:'control', type:'button_image', name:'button_save', data:{
                x:5+(16+1/6)*3, y:25+4/5, width:15+1/3, height:10, hoverable:false, 
                backingURL__up:imageStoreURL_localPrefix+'button_save.png',
                backingURL__press:imageStoreURL_localPrefix+'button_save_active.png',
            }},
            {collection:'control', type:'button_image', name:'button_delete', data:{
                x:5+(16+1/6)*4, y:25+4/5, width:15+1/3, height:10, hoverable:false, 
                backingURL__up:imageStoreURL_localPrefix+'button_delete.png',
                backingURL__press:imageStoreURL_localPrefix+'button_delete_active.png',
            }},
        ]
    };
    
    //main object
        var object = _canvas_.interface.unit.builder(design);
        
    //circuitry
        //audio recorder
            object.recorder = new _canvas_.interface.circuit.recorder(_canvas_.library.audio.context);
        //update functions
            //time readout
                setInterval(function(){
                    var time = object.recorder.recordingTime();
                    var decimalValues = time % 1;
                    time = _canvas_.library.math.seconds2time( Math.round(time) );

                    object.elements.readout_sixteenSegmentDisplay_static.time.text(
                        _canvas_.library.misc.padString(time.h,2,'0')+':'+
                        _canvas_.library.misc.padString(time.m,2,'0')+':'+
                        _canvas_.library.misc.padString(time.s,2,'0')+'.'+
                        _canvas_.library.misc.padString((''+decimalValues).slice(2),2,'0')
                    );
                    object.elements.readout_sixteenSegmentDisplay_static.time.print();
                },100);
            //lights
                var state = 'empty'; //empty - recording - paused - full
                function updateLights(action){
                    if( state == 'empty' && (action == 'save' || action == 'stop') ){return;}
                    if( action == 'stop' || action == 'save' ){ state = 'full'; }
                    if( state == 'empty' && action == 'rec' ){ state = 'recording'; }
                    if( action == 'clear' ){ state = 'empty'; }
                    if( state == 'recording' && action == 'pause/resume' ){ state = 'paused'; }
                    else if( state == 'paused' && (action == 'pause/resume' || action == 'rec') ){ state = 'recording'; }

                    if(state == 'empty'){object.elements.glowbox_image.light_empty.on();}else{object.elements.glowbox_image.light_empty.off();}
                    if(state == 'recording'){object.elements.glowbox_image.light_recording.on();}else{object.elements.glowbox_image.light_recording.off();}
                    if(state == 'paused'){object.elements.glowbox_image.light_paused.on();}else{object.elements.glowbox_image.light_paused.off();}
                    if(state == 'full'){object.elements.glowbox_image.light_stopped.on();}else{object.elements.glowbox_image.light_stopped.off();}
                }
                updateLights('clear');
                object.elements.glowbox_image.light_empty.on();

    //wiring
        //interface
            object.elements.button_image.button_record.onpress = function(){
                if(state == 'paused'){object.recorder.resume();}
                else{object.recorder.start();}
                updateLights('rec');
            };
            object.elements.button_image.button_pause.onpress = function(){
                if(state == 'paused'){object.recorder.resume();}
                else{object.recorder.pause();}
                updateLights('pause/resume');
            };
            object.elements.button_image.button_stop.onpress = function(){
                updateLights('stop');
                object.recorder.stop();
            }
            object.elements.button_image.button_save.onpress = function(){
                updateLights('save');
                if(state != 'empty'){ object.recorder.save(); }
            };
            object.elements.button_image.button_delete.onpress = function(){
                updateLights('clear');
                object.recorder.clear();
            };
        //io
            object.elements.connectionNode_audio.io_input_R.out().connect( object.recorder.in_right() );
            object.elements.connectionNode_audio.io_input_L.out().connect( object.recorder.in_left() );

    //interface

    return object;
};



this.audio_recorder.metadata = {
    name:'Audio Recorder',
    category:'monitors',
    helpURL:'/help/units/beta/audio_recorder/'
};