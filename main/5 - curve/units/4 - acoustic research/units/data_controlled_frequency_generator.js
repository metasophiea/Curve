this.data_controlled_frequency_generator = function(name,x,y,angle){

    //style data
        const unitStyle = new function(){
            //image store location URL
                this.imageStoreURL_commonPrefix = imageStoreURL+'common/';
                this.imageStoreURL_localPrefix = imageStoreURL+'data_controlled_frequency_generator/';

            //calculation of measurements
                const div = 10;
                const measurement = { 
                    file: { width:2040, height:500 },
                    design: { width:20.4, height:5 },
                };

                this.offset = {x:0,y:0};
                this.drawingValue = { 
                    width: measurement.file.width/div, 
                    height: measurement.file.height/div
                };
        };

    //main object creation
        const object = _canvas_.interface.unit.builder({
            name:name,
            model:'data_controlled_frequency_generator',
            x:x, y:y, angle:angle,
            space:[
                {x:-unitStyle.offset.x,                               y:-unitStyle.offset.y},
                {x:unitStyle.drawingValue.width - unitStyle.offset.x, y:-unitStyle.offset.y},
                {x:unitStyle.drawingValue.width - unitStyle.offset.x, y:unitStyle.drawingValue.height - unitStyle.offset.y},
                {x:-unitStyle.offset.x,                               y:unitStyle.drawingValue.height - unitStyle.offset.y},
            ],
            elements:[
                {collection:'dynamic', type:'connectionNode_signal', name:'waveform_toggle', data:{ 
                    x:5.67, y:0, width:5, height:10, angle:-Math.PI/2, cableVersion:2, style:style.connectionNode.signal,
                }},

                {collection:'dynamic', type:'connectionNode_data', name:'note_data_in', data:{ 
                    x:unitStyle.drawingValue.width, y:unitStyle.drawingValue.height/2 - 15/2, width:5, height:15, angle:0, cableVersion:2, style:style.connectionNode.data
                }},

                {collection:'dynamic', type:'connectionNode_audio', name:'control_gain', data:{ 
                    x:25 + 0.67 + 15/2, y:unitStyle.drawingValue.height, width:5, height:15, angle:Math.PI/2, isAudioOutput:false, cableVersion:2, style:style.connectionNode.audio
                }},
                {collection:'dynamic', type:'connectionNode_voltage', name:'voltage_gain', data:{ 
                    x:25 + 32.5 + 0.67, y:unitStyle.drawingValue.height, width:5, height:10, angle:Math.PI/2, cableVersion:2, style:style.connectionNode.voltage,
                }},

                {collection:'dynamic', type:'connectionNode_audio', name:'control_detune', data:{ 
                    x:25 + 55 + 0.67 + 15/2, y:unitStyle.drawingValue.height, width:5, height:15, angle:Math.PI/2, isAudioOutput:false, cableVersion:2, style:style.connectionNode.audio
                }},
                {collection:'dynamic', type:'connectionNode_voltage', name:'voltage_detune', data:{ 
                    x:25 + 32.5 + 0.67 + 55, y:unitStyle.drawingValue.height, width:5, height:10, angle:Math.PI/2, cableVersion:2, style:style.connectionNode.voltage,
                }},

                {collection:'dynamic', type:'connectionNode_audio', name:'control_adjust', data:{ 
                    x:25 + 55*2 + 0.67 + 15/2, y:unitStyle.drawingValue.height, width:5, height:15, angle:Math.PI/2, isAudioOutput:false, cableVersion:2, style:style.connectionNode.audio
                }},
                {collection:'dynamic', type:'connectionNode_voltage', name:'voltage_adjust', data:{ 
                    x:25 + 32.5 + 0.67 + 55*2, y:unitStyle.drawingValue.height, width:5, height:10, angle:Math.PI/2, cableVersion:2, style:style.connectionNode.voltage,
                }},

                {collection:'dynamic', type:'connectionNode_audio', name:'output', data:{ 
                    x:0, y:unitStyle.drawingValue.height/2 + 15/2, width:5, height:15, angle:Math.PI, isAudioOutput:true, cableVersion:2, style:style.connectionNode.audio
                }},

                {collection:'basic', type:'image', name:'backing', 
                    data:{ x:-unitStyle.offset.x, y:-unitStyle.offset.y, width:unitStyle.drawingValue.width, height:unitStyle.drawingValue.height, url:unitStyle.imageStoreURL_localPrefix+'backing.png' }
                },

                {collection:'control', type:'button_image', name:'waveformSelect_sine', data:{ x:4, y:4, width:13, height:13, hoverable:false,
                    backingURL__up:unitStyle.imageStoreURL_localPrefix+'button_sine_up.png', 
                    backingURL__glow:unitStyle.imageStoreURL_localPrefix+'button_sine_down.png',
                    backingURL__glow_press:unitStyle.imageStoreURL_localPrefix+'button_sine_down.png'
                }},
                {collection:'control', type:'button_image', name:'waveformSelect_triangle', data:{ x:4, y:4+14.5, width:13, height:13, hoverable:false,
                    backingURL__up:unitStyle.imageStoreURL_localPrefix+'button_triangle_up.png', 
                    backingURL__glow:unitStyle.imageStoreURL_localPrefix+'button_triangle_down.png',
                    backingURL__glow_press:unitStyle.imageStoreURL_localPrefix+'button_triangle_down.png'
                }},
                {collection:'control', type:'button_image', name:'waveformSelect_square', data:{ x:4, y:4+14.5+14.5, width:13, height:13, hoverable:false,
                    backingURL__up:unitStyle.imageStoreURL_localPrefix+'button_square_up.png', 
                    backingURL__glow:unitStyle.imageStoreURL_localPrefix+'button_square_down.png',
                    backingURL__glow_press:unitStyle.imageStoreURL_localPrefix+'button_square_down.png'
                }},

                {collection:'control', type:'dial_continuous_image', name:'gain', data:{
                    x:40+13.2, y:24.75, radius:30/2, startAngle:(3*Math.PI)/4, maxAngle:1.5*Math.PI,value:1, resetValue:0.5, arcDistance:1.2,
                    handleURL:unitStyle.imageStoreURL_commonPrefix+'dial_large.png',
                }},
                {collection:'control', type:'dial_continuous_image', name:'detune', data:{
                    x:95+13.2, y:24.75, radius:30/2, startAngle:(3*Math.PI)/4, maxAngle:1.5*Math.PI,value:0.5, resetValue:0.5, arcDistance:1.2,
                    handleURL:unitStyle.imageStoreURL_commonPrefix+'dial_large.png',
                }},
                {collection:'control', type:'dial_continuous_image', name:'adjust', data:{
                    x:150+13.2, y:24.75, radius:30/2, startAngle:(3*Math.PI)/4, maxAngle:1.5*Math.PI,value:0.5, resetValue:0.5, arcDistance:1.2,
                    handleURL:unitStyle.imageStoreURL_commonPrefix+'dial_large.png',
                }},

                {collection:'control', type:'checkbox_image', name:'gain_useControl', data:{
                    x:7.5 + 13.2, y:14.75, width:10, height:20,
                    uncheckURL:unitStyle.imageStoreURL_commonPrefix+'switch_large_up.png', 
                    checkURL:unitStyle.imageStoreURL_commonPrefix+'switch_large_down.png',
                }},
                {collection:'control', type:'checkbox_image', name:'detune_useControl', data:{
                    x:62.5 + 13.2, y:14.75, width:10, height:20,
                    uncheckURL:unitStyle.imageStoreURL_commonPrefix+'switch_large_up.png', 
                    checkURL:unitStyle.imageStoreURL_commonPrefix+'switch_large_down.png',
                }},
                {collection:'control', type:'checkbox_image', name:'adjust_useControl', data:{
                    x:117.5 + 13.2, y:14.75, width:10, height:20,
                    uncheckURL:unitStyle.imageStoreURL_commonPrefix+'switch_large_up.png', 
                    checkURL:unitStyle.imageStoreURL_commonPrefix+'switch_large_down.png',
                }},
            ],
        });

        //circuitry
            const state = {
                waveforms:['sine', 'triangle', 'square'],
                waveform:'sine',
                gain:1,
                detune:0,
                adjust:0.5,
                gain_useControl:false,
                detune_useControl:false,
                adjust_useControl:false,
            };
            const OSC = new _canvas_.library.audio.audioWorklet.production.wasm.integrated_synthesizer_type_1(_canvas_.library.audio.context);

            function selectWaveform(waveform){
                if(state.waveform == waveform){ return; }
                object.elements.button_image['waveformSelect_'+state.waveform].glow(false);
                state.waveform = waveform;
                object.elements.button_image['waveformSelect_'+state.waveform].glow(true);
    
                OSC.waveform = waveform;
            }

        //wiring
            //hid
                object.elements.button_image.waveformSelect_sine.onpress = function(){ selectWaveform('sine'); };
                object.elements.button_image.waveformSelect_triangle.onpress = function(){ selectWaveform('triangle'); };
                object.elements.button_image.waveformSelect_square.onpress = function(){ selectWaveform('square'); };

                object.elements.dial_continuous_image.gain.onchange = function(value){ 
                    state.gain = value;
                    _canvas_.library.audio.changeAudioParam( _canvas_.library.audio.context, OSC.gain, (value*2 - 1), 0, 'instant', true );
                };
                object.elements.dial_continuous_image.detune.onchange = function(value){ 
                    state.detune = value;
                    _canvas_.library.audio.changeAudioParam( _canvas_.library.audio.context, OSC.detune, (value*2 - 1), 0, 'instant', true );
                };
                object.elements.dial_continuous_image.adjust.onchange = function(value){ 
                    state.adjust = value;
                    _canvas_.library.audio.changeAudioParam( _canvas_.library.audio.context, OSC.dutyCycle, (value), 0, 'instant', true );
                };
                object.elements.checkbox_image.gain_useControl.onchange = function(value){ 
                    state.gain_useControl = value;
                    OSC.gain_useControl = value;
                };
                object.elements.checkbox_image.detune_useControl.onchange = function(value){ 
                    state.detune_useControl = value;
                    OSC.detune_useControl = value;
                };
                object.elements.checkbox_image.adjust_useControl.onchange = function(value){ 
                    state.adjust_useControl = value;
                    OSC.dutyCycle_useControl = value;
                };

            //io
                object.io.signal.waveform_toggle.onchange = function(value){
                    if(value){
                        const index = state.waveforms.indexOf(state.waveform);
                        selectWaveform(state.waveforms[
                            index == state.waveforms.length-1 ? 0 : index+1
                        ]);
                    }
                };
                object.io.data.note_data_in.onreceive = function(address,data){
                    if(address != 'midinumber'){return;}
                    OSC.perform(
                        _canvas_.library.audio.num2freq(data.num), 
                        data.velocity
                    );
                };
                object.io.voltage.voltage_gain.onchange = function(value){
                    object.elements.dial_continuous_image.gain.set( (value+1)/2 );
                };
                object.io.voltage.voltage_detune.onchange = function(value){
                    object.elements.dial_continuous_image.detune.set( (value+1)/2 );
                };
                object.io.voltage.voltage_adjust.onchange = function(value){
                    object.elements.dial_continuous_image.adjust.set( value );
                };
                
                object.io.audio.control_gain.audioNode = OSC;
                object.io.audio.control_gain.inputChannelIndex = 0;
                object.io.audio.control_detune.audioNode = OSC;
                object.io.audio.control_detune.inputChannelIndex = 1;
                object.io.audio.control_adjust.audioNode = OSC;
                object.io.audio.control_adjust.inputChannelIndex = 2;

                object.io.audio.output.audioNode = OSC;

        //interface
            object.i = {
                performMidiNote:function(data){
                    OSC.perform(data)
                },
                waveform:function(wavename){
                    if(wavename == undefined){ return state.waveform; }
                    selectWaveform(wavename);
                },
                gain:function(value){
                    if(value == undefined){ return state.gain; }
                    object.elements.dial_continuous_image.gain.set((value+1)/2);
                },
                detune:function(value){
                    if(value == undefined){ return state.detune; }
                    object.elements.dial_continuous_image.detune.set((value+1)/2);
                },
                adjust:function(value){
                    if(value == undefined){ return state.adjust; }
                    object.elements.dial_continuous_image.adjust.set(value);
                },
                gain_useControl:function(bool){
                    if(bool == undefined){ return state.gain_useControl; }
                    object.elements.checkbox_image.gain_useControl.set(bool);
                },
                detune_useControl:function(bool){
                    if(bool == undefined){ return state.detune_useControl; }
                    object.elements.checkbox_image.detune_useControl.set(bool);
                },
                adjust_useControl:function(bool){
                    if(bool == undefined){ return state.adjust_useControl; }
                    object.elements.checkbox_image.adjust_useControl.set(bool);
                },
            };

        //import/export
            object.exportData = function(){
                return JSON.parse(JSON.stringify(state));
            };
            object.importData = function(data){
                selectWaveform(data.waveform);
                object.elements.dial_continuous_image.gain.set((data.gain+1)/2);
                object.elements.dial_continuous_image.detune.set((data.detune+1)/2);
                object.elements.dial_continuous_image.adjust.set(data.adjust);
                object.elements.checkbox_image.gain_useControl.set(data.gain_useControl);
                object.elements.checkbox_image.detune_useControl.set(data.detune_useControl);
                object.elements.checkbox_image.adjust_useControl.set(data.adjust_useControl);
            
            };

        //oncreate/ondelete 
            object.oncreate = function(){
                object.elements.button_image.waveformSelect_sine.glow(true);
            };
            object.ondelete = function(){
                OSC.shutdown();
            };

        return object;
};
this.data_controlled_frequency_generator.metadata = {
    name:'Data Controlled Frequency Generator',
    category:'',
    helpURL:''
};