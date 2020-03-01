this['frequency_generator'] = function(name,x,y,angle){
    //style data
        const unitStyle = new function(){
            //image store location URL
                this.imageStoreURL_commonPrefix = imageStoreURL+'common/';
                this.imageStoreURL_localPrefix = imageStoreURL+'frequency_generator/';

            //calculation of measurements
                const div = 10;
                const measurement = { 
                    file: { width:1900, height:1050 },
                    design: { width:19, height:10.5 },
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
            model:'frequency_generator',
            x:x, y:y, angle:angle,
            space:[
                {x:-unitStyle.offset.x,                               y:-unitStyle.offset.y},
                {x:unitStyle.drawingValue.width - unitStyle.offset.x, y:-unitStyle.offset.y},
                {x:unitStyle.drawingValue.width - unitStyle.offset.x, y:unitStyle.drawingValue.height - unitStyle.offset.y},
                {x:-unitStyle.offset.x,                               y:unitStyle.drawingValue.height - unitStyle.offset.y},
            ],
            elements:[
                {collection:'dynamic', type:'connectionNode_audio', name:'control_gain', data:{ 
                    x:20, y:unitStyle.drawingValue.height, width:5, height:15, angle:Math.PI/2, isAudioOutput:false, cableVersion:2, style:style.connectionNode.audio
                }},
                {collection:'dynamic', type:'connectionNode_audio', name:'control_detune', data:{ 
                    x:75, y:unitStyle.drawingValue.height, width:5, height:15, angle:Math.PI/2, isAudioOutput:false, cableVersion:2, style:style.connectionNode.audio
                }},
                {collection:'dynamic', type:'connectionNode_audio', name:'control_adjust', data:{ 
                    x:130, y:unitStyle.drawingValue.height, width:5, height:15, angle:Math.PI/2, isAudioOutput:false, cableVersion:2, style:style.connectionNode.audio
                }},
                {collection:'dynamic', type:'connectionNode_audio', name:'output', data:{ 
                    x:0, y:unitStyle.drawingValue.height/2 + 15/2, width:5, height:15, angle:Math.PI, isAudioOutput:true, cableVersion:2, style:style.connectionNode.audio
                }},
                
                {collection:'basic', type:'image', name:'backing', 
                    data:{ x:-unitStyle.offset.x, y:-unitStyle.offset.y, width:unitStyle.drawingValue.width, height:unitStyle.drawingValue.height, url:unitStyle.imageStoreURL_localPrefix+'backing.png' }
                },

                {collection:'display', type:'readout_sevenSegmentDisplay', name:'LCD', data:{ 
                    x:10+0.5, y:20+0.5, width:119-1, height:29.5-1, canvasBased:true, count:8, decimalPlaces:true, style:unitStyle.LCD, resolution:5,
                }},

                {collection:'control', type:'button_image', name:'waveformSelect_sine', data:{ x:133.5, y:18.5, width:15, height:15, hoverable:false,
                    backingURL__up:unitStyle.imageStoreURL_localPrefix+'button_sine_up.png', 
                    backingURL__glow:unitStyle.imageStoreURL_localPrefix+'button_sine_down.png',
                    backingURL__glow_press:unitStyle.imageStoreURL_localPrefix+'button_sine_down.png'
                }},
                {collection:'control', type:'button_image', name:'waveformSelect_pointed', data:{ x:151.5, y:18.5, width:15, height:15, hoverable:false,
                    backingURL__up:unitStyle.imageStoreURL_localPrefix+'button_pointed_up.png', 
                    backingURL__glow:unitStyle.imageStoreURL_localPrefix+'button_pointed_down.png',
                    backingURL__glow_press:unitStyle.imageStoreURL_localPrefix+'button_pointed_down.png'
                }},
                {collection:'control', type:'button_image', name:'waveformSelect_square', data:{ x:133.5, y:36.5, width:15, height:15, hoverable:false,
                    backingURL__up:unitStyle.imageStoreURL_localPrefix+'button_square_up.png', 
                    backingURL__glow:unitStyle.imageStoreURL_localPrefix+'button_square_down.png',
                    backingURL__glow_press:unitStyle.imageStoreURL_localPrefix+'button_square_down.png'
                }},
                {collection:'control', type:'button_image', name:'waveformSelect_noise', data:{ x:151.5, y:36.5, width:15, height:15, hoverable:false,
                    backingURL__up:unitStyle.imageStoreURL_localPrefix+'button_noise_up.png', 
                    backingURL__glow:unitStyle.imageStoreURL_localPrefix+'button_noise_down.png',
                    backingURL__glow_press:unitStyle.imageStoreURL_localPrefix+'button_noise_down.png'
                }},

                {collection:'control', type:'button_image', name:'10000_up',    data:{ x:10, y:10, width:14, height:9, hoverable:false, backingURL__up:unitStyle.imageStoreURL_localPrefix+'button_up.png', backingURL__press:unitStyle.imageStoreURL_localPrefix+'button_down.png' }},
                {collection:'control', type:'button_image', name:'1000_up',     data:{ x:25, y:10, width:14, height:9, hoverable:false, backingURL__up:unitStyle.imageStoreURL_localPrefix+'button_up.png', backingURL__press:unitStyle.imageStoreURL_localPrefix+'button_down.png' }},
                {collection:'control', type:'button_image', name:'100_up',      data:{ x:40, y:10, width:14, height:9, hoverable:false, backingURL__up:unitStyle.imageStoreURL_localPrefix+'button_up.png', backingURL__press:unitStyle.imageStoreURL_localPrefix+'button_down.png' }},
                {collection:'control', type:'button_image', name:'10_up',       data:{ x:55, y:10, width:14, height:9, hoverable:false, backingURL__up:unitStyle.imageStoreURL_localPrefix+'button_up.png', backingURL__press:unitStyle.imageStoreURL_localPrefix+'button_down.png' }},
                {collection:'control', type:'button_image', name:'1_up',        data:{ x:70, y:10, width:14, height:9, hoverable:false, backingURL__up:unitStyle.imageStoreURL_localPrefix+'button_up.png', backingURL__press:unitStyle.imageStoreURL_localPrefix+'button_down.png' }},
                {collection:'control', type:'button_image', name:'0.1_up',      data:{ x:85, y:10, width:14, height:9, hoverable:false, backingURL__up:unitStyle.imageStoreURL_localPrefix+'button_up.png', backingURL__press:unitStyle.imageStoreURL_localPrefix+'button_down.png' }},
                {collection:'control', type:'button_image', name:'0.01_up',     data:{ x:100, y:10, width:14, height:9, hoverable:false, backingURL__up:unitStyle.imageStoreURL_localPrefix+'button_up.png', backingURL__press:unitStyle.imageStoreURL_localPrefix+'button_down.png' }},
                {collection:'control', type:'button_image', name:'0.001_up',    data:{ x:115, y:10, width:14, height:9, hoverable:false, backingURL__up:unitStyle.imageStoreURL_localPrefix+'button_up.png', backingURL__press:unitStyle.imageStoreURL_localPrefix+'button_down.png' }},
                {collection:'control', type:'button_image', name:'10000_down',  data:{ x:10, y:50, width:14, height:9, hoverable:false, backingURL__up:unitStyle.imageStoreURL_localPrefix+'button_up.png', backingURL__press:unitStyle.imageStoreURL_localPrefix+'button_down.png' }},
                {collection:'control', type:'button_image', name:'1000_down',   data:{ x:25, y:50, width:14, height:9, hoverable:false, backingURL__up:unitStyle.imageStoreURL_localPrefix+'button_up.png', backingURL__press:unitStyle.imageStoreURL_localPrefix+'button_down.png' }},
                {collection:'control', type:'button_image', name:'100_down',    data:{ x:40, y:50, width:14, height:9, hoverable:false, backingURL__up:unitStyle.imageStoreURL_localPrefix+'button_up.png', backingURL__press:unitStyle.imageStoreURL_localPrefix+'button_down.png' }},
                {collection:'control', type:'button_image', name:'10_down',     data:{ x:55, y:50, width:14, height:9, hoverable:false, backingURL__up:unitStyle.imageStoreURL_localPrefix+'button_up.png', backingURL__press:unitStyle.imageStoreURL_localPrefix+'button_down.png' }},
                {collection:'control', type:'button_image', name:'1_down',      data:{ x:70, y:50, width:14, height:9, hoverable:false, backingURL__up:unitStyle.imageStoreURL_localPrefix+'button_up.png', backingURL__press:unitStyle.imageStoreURL_localPrefix+'button_down.png' }},
                {collection:'control', type:'button_image', name:'0.1_down',    data:{ x:85, y:50, width:14, height:9, hoverable:false, backingURL__up:unitStyle.imageStoreURL_localPrefix+'button_up.png', backingURL__press:unitStyle.imageStoreURL_localPrefix+'button_down.png' }},
                {collection:'control', type:'button_image', name:'0.01_down',   data:{ x:100, y:50, width:14, height:9, hoverable:false, backingURL__up:unitStyle.imageStoreURL_localPrefix+'button_up.png', backingURL__press:unitStyle.imageStoreURL_localPrefix+'button_down.png' }},
                {collection:'control', type:'button_image', name:'0.001_down',  data:{ x:115, y:50, width:14, height:9, hoverable:false, backingURL__up:unitStyle.imageStoreURL_localPrefix+'button_up.png', backingURL__press:unitStyle.imageStoreURL_localPrefix+'button_down.png' }},

                {collection:'control', type:'dial_continuous_image', name:'gain', data:{
                    x:40, y:80, radius:30/2, startAngle:(3*Math.PI)/4, maxAngle:1.5*Math.PI,value:1, resetValue:0.5, arcDistance:1.2,
                    handleURL:unitStyle.imageStoreURL_commonPrefix+'dial_large.png',
                }},
                {collection:'control', type:'dial_continuous_image', name:'detune', data:{
                    x:95, y:80, radius:30/2, startAngle:(3*Math.PI)/4, maxAngle:1.5*Math.PI,value:0.5, resetValue:0.5, arcDistance:1.2,
                    handleURL:unitStyle.imageStoreURL_commonPrefix+'dial_large.png',
                }},
                {collection:'control', type:'dial_continuous_image', name:'adjust', data:{
                    x:150, y:80, radius:30/2, startAngle:(3*Math.PI)/4, maxAngle:1.5*Math.PI,value:0.5, resetValue:0.5, arcDistance:1.2,
                    handleURL:unitStyle.imageStoreURL_commonPrefix+'dial_large.png',
                }},
                {collection:'control', type:'checkbox_image', name:'gain_mode', data:{
                    x:7.5, y:70, width:10, height:20,
                    uncheckURL:unitStyle.imageStoreURL_commonPrefix+'switch_large_up.png', 
                    checkURL:unitStyle.imageStoreURL_commonPrefix+'switch_large_down.png',
                }},
                {collection:'control', type:'checkbox_image', name:'detune_mode', data:{
                    x:62.5, y:70, width:10, height:20,
                    uncheckURL:unitStyle.imageStoreURL_commonPrefix+'switch_large_up.png', 
                    checkURL:unitStyle.imageStoreURL_commonPrefix+'switch_large_down.png',
                }},
                {collection:'control', type:'checkbox_image', name:'adjust_mode', data:{
                    x:117.5, y:70, width:10, height:20,
                    uncheckURL:unitStyle.imageStoreURL_commonPrefix+'switch_large_up.png', 
                    checkURL:unitStyle.imageStoreURL_commonPrefix+'switch_large_down.png',
                }},
            ]
        });

    //circuitry
        const state = {
            frequencyLimits:{top:20000, bottom:0.001},
            frequencyDigits:[0,0,1,0,0,0,0,0],
            waveform:'sine',
            gain:1,
            detune:0,
            adjust:0.5,
            gain_mode:false,
            detune_mode:false,
            adjust_mode:false,
        };
        const oscillator = new _canvas_.interface.circuit.oscillator(_canvas_.library.audio.context);
        function stepFrequencyCharacter(index,increment){
            if(increment){
                state.frequencyDigits[index]++;
                if(state.frequencyDigits[index] > 9){ state.frequencyDigits[index] = 0; }
            }else{
                state.frequencyDigits[index]--;
                if(state.frequencyDigits[index] < 0){ state.frequencyDigits[index] = 9; }
            }
            updateFrequency();
        }
        function updateFrequency(){
            let frequency = parseFloat(state.frequencyDigits.slice(0,5).join('') +'.'+ state.frequencyDigits.slice(5).join(''));
            if( frequency > state.frequencyLimits.top){
                state.frequencyDigits = [2,0,0,0,0,0,0,0];
            }else if(frequency < state.frequencyLimits.bottom){ 
                state.frequencyDigits = [0,0,0,0,0,0,0,1];
            }
            frequency = state.frequencyDigits.slice(0,5).join('') +'.'+ state.frequencyDigits.slice(5).join('');

            object.elements.readout_sevenSegmentDisplay.LCD.text( frequency );
            object.elements.readout_sevenSegmentDisplay.LCD.print();

            oscillator.frequency(parseFloat(frequency));
        }
        function selectWaveform(waveform){
            if(state.waveform == waveform){ return; }
            object.elements.button_image['waveformSelect_'+state.waveform].glow(false);
            state.waveform = waveform;
            object.elements.button_image['waveformSelect_'+state.waveform].glow(true);

            oscillator.waveform(
                ['sine','square','pointed','noise'].indexOf(waveform)
            );
        }

    //wiring
        //hid
            object.elements.button_image.waveformSelect_sine.onpress = function(){ selectWaveform('sine'); };
            object.elements.button_image.waveformSelect_pointed.onpress = function(){ selectWaveform('pointed'); };
            object.elements.button_image.waveformSelect_square.onpress = function(){ selectWaveform('square'); };
            object.elements.button_image.waveformSelect_noise.onpress = function(){ selectWaveform('noise'); };
            
            object.elements.button_image['10000_up'].onpress = function(){   stepFrequencyCharacter(0,true); };
            object.elements.button_image['1000_up'].onpress = function(){    stepFrequencyCharacter(1,true); };
            object.elements.button_image['100_up'].onpress = function(){     stepFrequencyCharacter(2,true); };
            object.elements.button_image['10_up'].onpress = function(){      stepFrequencyCharacter(3,true); };
            object.elements.button_image['1_up'].onpress = function(){       stepFrequencyCharacter(4,true); };
            object.elements.button_image['0.1_up'].onpress = function(){     stepFrequencyCharacter(5,true); };
            object.elements.button_image['0.01_up'].onpress = function(){    stepFrequencyCharacter(6,true); };
            object.elements.button_image['0.001_up'].onpress = function(){   stepFrequencyCharacter(7,true); };
            object.elements.button_image['10000_down'].onpress = function(){ stepFrequencyCharacter(0,false); };
            object.elements.button_image['1000_down'].onpress = function(){  stepFrequencyCharacter(1,false); };
            object.elements.button_image['100_down'].onpress = function(){   stepFrequencyCharacter(2,false); };
            object.elements.button_image['10_down'].onpress = function(){    stepFrequencyCharacter(3,false); };
            object.elements.button_image['1_down'].onpress = function(){     stepFrequencyCharacter(4,false); };
            object.elements.button_image['0.1_down'].onpress = function(){   stepFrequencyCharacter(5,false); };
            object.elements.button_image['0.01_down'].onpress = function(){  stepFrequencyCharacter(6,false); };
            object.elements.button_image['0.001_down'].onpress = function(){ stepFrequencyCharacter(7,false); };

            object.elements.dial_continuous_image.gain.onchange = function(value){ 
                state.gain = value;
                oscillator.gain(value*2 - 1);
            };
            object.elements.dial_continuous_image.detune.onchange = function(value){ 
                state.detune = value;
                oscillator.detune(value*2 - 1);
            };
            object.elements.dial_continuous_image.adjust.onchange = function(value){ 
                state.adjust = value;
                oscillator.dutyCycle(value);
            };
            object.elements.checkbox_image.gain_mode.onchange = function(value){ 
                state.gain_mode = value;
                oscillator.gainMode(value?1:0);
            };
            object.elements.checkbox_image.detune_mode.onchange = function(value){ 
                state.detune_mode = value;
                oscillator.detuneMode(value?1:0);
            };
            object.elements.checkbox_image.adjust_mode.onchange = function(value){ 
                state.adjust_mode = value;
                oscillator.dutyCycleMode(value?1:0);
            };

        //io
            object.io.audio.control_gain.audioNode = oscillator.gainControl();
            object.io.audio.control_detune.audioNode = oscillator.detuneControl();
            object.io.audio.control_adjust.audioNode = oscillator.dutyCycleControl();
            object.io.audio.output.audioNode = oscillator.out();

    //interface
        object.i = {
            frequency:function(value){
                if(value == undefined){ return parseFloat(state.frequencyDigits.slice(0,5).join('') +'.'+ state.frequencyDigits.slice(5).join('')); }

                if( value > state.frequencyLimits.top){
                    value = 20000;
                }else if(value < state.frequencyLimits.bottom){ 
                    value = 0.001;
                }

                const sides = String(value).split('.');
                _canvas_.library.misc.padString(String(sides[0]).split('.')[0],5,'0').split('').forEach((value,index) => {
                    state.frequencyDigits[index] = value;
                });
                if(sides.length > 1){
                    _canvas_.library.misc.padString(String(sides[1]).split('.')[0],3,'0','r').split('').forEach((value,index) => {
                        state.frequencyDigits[index+5] = value;
                    });
                }

                updateFrequency();
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
            gainMode:function(bool){
                if(bool == undefined){ return state.gain_mode; }
                object.elements.checkbox_image.gain_mode.set(bool);
            },
            detuneMode:function(bool){
                if(bool == undefined){ return state.detune_mode; }
                object.elements.checkbox_image.detune_mode.set(bool);
            },
            adjustMode:function(bool){
                if(bool == undefined){ return state.adjust_mode; }
                object.elements.checkbox_image.adjust_mode.set(bool);
            },
        };

    //import/export
        object.exportData = function(){
            return JSON.parse(JSON.stringify(state));
        };
        object.importData = function(data){
            state.frequencyDigits = data.frequencyDigits;
            updateFrequency();
            selectWaveform(data.waveform);
            object.elements.dial_continuous_image.gain.set((data.gain+1)/2);
            object.elements.dial_continuous_image.detune.set((data.detune+1)/2);
            object.elements.dial_continuous_image.adjust.set(data.adjust);
            object.elements.checkbox_image.gain_mode.set(data.gain_mode);
            object.elements.checkbox_image.detune_mode.set(data.detune_mode);
            object.elements.checkbox_image.adjust_mode.set(data.adjust_mode);
        };

    //oncreate/ondelete
        object.oncreate = function(){
            updateFrequency();
            object.elements.button_image.waveformSelect_sine.glow(true);
        };
    
    return object;
};
this['frequency_generator'].metadata = {
    name:'Frequency Generator',
    category:'',
    helpURL:''
};