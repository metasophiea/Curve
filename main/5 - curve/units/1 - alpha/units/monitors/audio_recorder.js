this.audio_recorder = function(name,x,y,angle){
    //style data
        const unitStyle = new function(){
            //image store location URL
                this.imageStoreURL_localPrefix = imageStoreURL+'audio_recorder/';

            //calculation of measurements
                const div = 6;
                const measurement = { 
                    file: { width:590, height:260 },
                    design: { width:9.5, height:4 },
                };

                this.offset = 20/div;
                this.drawingValue = { 
                    width: measurement.file.width/div, 
                    height: measurement.file.height/div
                };

            //styling values
        };

    //main object creation
        const object = _canvas_.interface.unit.builder({
            name:name,
            model:'audio_recorder',
            x:x, y:y, angle:angle,
            space:[
                { x:0,                                              y:0                                               },
                { x:unitStyle.drawingValue.width -unitStyle.offset, y:0                                               },
                { x:unitStyle.drawingValue.width -unitStyle.offset, y:unitStyle.drawingValue.height -unitStyle.offset },
                { x:0,                                              y:unitStyle.drawingValue.height -unitStyle.offset },
            ],
            elements:[
                {collection:'dynamic', type:'connectionNode_audio', name:'io_input_R', data:{ 
                    x:unitStyle.drawingValue.width-10/3, y:5, width:5, height:15, cableVersion:2, style:style.connectionNode.audio,
                }},
                {collection:'dynamic', type:'connectionNode_audio', name:'io_input_L', data:{ 
                    x:unitStyle.drawingValue.width-10/3, y:22.5, width:5, height:15, cableVersion:2, style:style.connectionNode.audio,
                }},
                {collection:'basic', type:'image', name:'backing', data:{ 
                    x:-unitStyle.offset/2, y:-unitStyle.offset/2, width:unitStyle.drawingValue.width, height:unitStyle.drawingValue.height, url:unitStyle.imageStoreURL_localPrefix+'backing.png'
                }},
                {collection:'display', type:'glowbox_image', name:'light_empty', data:{
                    x:5, y:4.15, height:10, width:19.5,
                    glowURL:unitStyle.imageStoreURL_localPrefix+'light_empty_active.png',
                    dimURL:unitStyle.imageStoreURL_localPrefix+'light_empty.png',
                }},
                {collection:'display', type:'glowbox_image', name:'light_recording', data:{
                    x:5+(19.5+2/3)*1, y:4.15, height:10, width:19.5,
                    glowURL:unitStyle.imageStoreURL_localPrefix+'light_recording_active.png',
                    dimURL:unitStyle.imageStoreURL_localPrefix+'light_recording.png',
                }},
                {collection:'display', type:'glowbox_image', name:'light_paused', data:{
                    x:5+(19.5+2/3)*2, y:4.15, height:10, width:19.5,
                    glowURL:unitStyle.imageStoreURL_localPrefix+'light_paused_active.png',
                    dimURL:unitStyle.imageStoreURL_localPrefix+'light_paused.png',
                }},
                {collection:'display', type:'glowbox_image', name:'light_stopped', data:{
                    x:5+(19.5+2/3)*3, y:4.15, height:10, width:19.5,
                    glowURL:unitStyle.imageStoreURL_localPrefix+'light_stopped_active.png',
                    dimURL:unitStyle.imageStoreURL_localPrefix+'light_stopped.png',
                }},
                {collection:'display', type:'readout_sixteenSegmentDisplay', name:'time', data:{
                    x:5+2/3, y:15+2/3, width:78.75, height:8.75, canvasBased:true, count:14, decimalPlaces:true, resolution:5,
                }},
                {collection:'control', type:'button_image', name:'button_record', data:{
                    x:5, y:25+4/5, width:15+1/3, height:10, hoverable:false, 
                    backingURL__up:unitStyle.imageStoreURL_localPrefix+'button_record.png',
                    backingURL__press:unitStyle.imageStoreURL_localPrefix+'button_record_active.png',
                }},
                {collection:'control', type:'button_image', name:'button_pause', data:{
                    x:5+(16+1/6)*1, y:25+4/5, width:15+1/3, height:10, hoverable:false, 
                    backingURL__up:unitStyle.imageStoreURL_localPrefix+'button_pause.png',
                    backingURL__press:unitStyle.imageStoreURL_localPrefix+'button_pause_active.png',
                }},
                {collection:'control', type:'button_image', name:'button_stop', data:{
                    x:5+(16+1/6)*2, y:25+4/5, width:15+1/3, height:10, hoverable:false, 
                    backingURL__up:unitStyle.imageStoreURL_localPrefix+'button_stop.png',
                    backingURL__press:unitStyle.imageStoreURL_localPrefix+'button_stop_active.png',
                }},
                {collection:'control', type:'button_image', name:'button_save', data:{
                    x:5+(16+1/6)*3, y:25+4/5, width:15+1/3, height:10, hoverable:false, 
                    backingURL__up:unitStyle.imageStoreURL_localPrefix+'button_save.png',
                    backingURL__press:unitStyle.imageStoreURL_localPrefix+'button_save_active.png',
                }},
                {collection:'control', type:'button_image', name:'button_delete', data:{
                    x:5+(16+1/6)*4, y:25+4/5, width:15+1/3, height:10, hoverable:false, 
                    backingURL__up:unitStyle.imageStoreURL_localPrefix+'button_delete.png',
                    backingURL__press:unitStyle.imageStoreURL_localPrefix+'button_delete_active.png',
                }},
            ]
        });

    //circuitry
        const recorderCircuit = new _canvas_.interface.circuit.recorder(_canvas_.library.audio.context);

        //time readout
            const interval = setInterval(function(){
                const time = _canvas_.library.math.seconds2time( recorderCircuit.recordingTime() );
                object.elements.readout_sixteenSegmentDisplay.time.text(
                    _canvas_.library.misc.padString(
                        _canvas_.library.misc.padString(time.h,2,'0')+':'+
                        _canvas_.library.misc.padString(time.m,2,'0')+':'+
                        _canvas_.library.misc.padString(time.s,2,'0')+'.'+
                        _canvas_.library.misc.padString(time.ms,2,'0'),
                        13
                    )
                );
                object.elements.readout_sixteenSegmentDisplay.time.print();
            },100);

        //lights
            let state = 'empty'; //empty - recording - paused - full
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
        //hid
            object.elements.button_image.button_record.onpress = function(){
                if(state == 'paused'){recorderCircuit.resume();}
                else{recorderCircuit.start();}
                updateLights('rec');
            };
            object.elements.button_image.button_pause.onpress = function(){
                if(state == 'paused'){recorderCircuit.resume();}
                else{recorderCircuit.pause();}
                updateLights('pause/resume');
            };
            object.elements.button_image.button_stop.onpress = function(){
                updateLights('stop');
                recorderCircuit.stop();
            }
            object.elements.button_image.button_save.onpress = function(){
                updateLights('save');
                if(state != 'empty'){ recorderCircuit.save(); }
            };
            object.elements.button_image.button_delete.onpress = function(){
                updateLights('clear');
                recorderCircuit.clear();
            };
        //io
            object.io.audio.io_input_R.out().connect( recorderCircuit.in_right() );
            object.io.audio.io_input_L.out().connect( recorderCircuit.in_left() );

    //interface
        object.i = {
            record:function(){ object.elements.button_image.button_record.onpress(); },
            pause:function(){ object.elements.button_image.button_pause.onpress(); },
            stop:function(){ object.elements.button_image.button_stop.onpress(); },
            save:function(){ object.elements.button_image.button_save.onpress(); },
            clear:function(){ object.elements.button_image.button_delete.onpress(); },
        };

    //setup/tearDown
        object.ondelete = function(){
            clearInterval(interval);
        };

    return object;
};
this.audio_recorder.metadata = {
    name:'Audio Recorder',
    category:'monitors',
    helpURL:'/help/units/alpha/audio_recorder/'
};