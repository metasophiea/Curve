this['frequency_amplitude_response_workstation'] = function(name,x,y,angle){
    //style data
        const unitStyle = new function(){
            //image store location URL
                this.imageStoreURL_commonPrefix = imageStoreURL+'common/';
                this.imageStoreURL_localPrefix = imageStoreURL+'frequency_amplitude_response_workstation/';

            //calculation of measurements
                const div = 10;
                const measurement = { 
                    file: { width:4100, height:1700 },
                    design: { width:41, height:17 },
                };

                this.offset = {x:0,y:0};
                this.drawingValue = { 
                    width: measurement.file.width/div, 
                    height: measurement.file.height/div
                };

            //styling values
                this.waveport = { backgroundText_size:10, backing:{r:0.15,g:0.15,b:0.15,a:1} };
        };

    //main object creation
        const object = _canvas_.interface.unit.builder({
            name:name,
            model:'frequency_amplitude_response_workstation',
            x:x, y:y, angle:angle,
            space:[
                {x:-unitStyle.offset.x,                               y:-unitStyle.offset.y},
                {x:unitStyle.drawingValue.width - unitStyle.offset.x, y:-unitStyle.offset.y},
                {x:unitStyle.drawingValue.width - unitStyle.offset.x, y:unitStyle.drawingValue.height - unitStyle.offset.y},
                {x:-unitStyle.offset.x,                               y:unitStyle.drawingValue.height - unitStyle.offset.y},
            ],
            elements:[
                {collection:'dynamic', type:'connectionNode_audio', name:'producer', data:{ 
                    x:367.5 + 7.5, y:unitStyle.drawingValue.height, width:5, height:15, angle:Math.PI/2, isAudioOutput:true, cableVersion:2, style:style.connectionNode.audio
                }},
                {collection:'dynamic', type:'connectionNode_audio', name:'consumer', data:{ 
                    x:110 + 7.5, y:unitStyle.drawingValue.height, width:5, height:15, angle:Math.PI/2, isAudioOutput:false, cableVersion:2, style:style.connectionNode.audio
                }},
                
                {collection:'basic', type:'image', name:'backing', 
                    data:{ x:-unitStyle.offset.x, y:-unitStyle.offset.y, width:unitStyle.drawingValue.width, height:unitStyle.drawingValue.height, url:unitStyle.imageStoreURL_localPrefix+'guide.png' }
                },

                {collection:'display', type:'grapher', name:'waveport', data:{
                    x:10+0.5, y:10+0.5, width:200-1, height:150-1, canvasBased:true, style:unitStyle.waveport,
                }},

                {collection:'display', type:'readout_sevenSegmentDisplay', name:'LCD_startFrequency', data:{ 
                    x:221+0.5, y:21+0.5, width:74-1, height:29-1, canvasBased:true, count:5, decimalPlaces:true, style:unitStyle.LCD, resolution:5,
                }},
                {collection:'display', type:'readout_sevenSegmentDisplay', name:'LCD_endFrequency', data:{ 
                    x:307+0.5, y:21+0.5, width:74-1, height:29-1, canvasBased:true, count:5, decimalPlaces:true, style:unitStyle.LCD, resolution:5,
                }},
                {collection:'display', type:'readout_sevenSegmentDisplay', name:'LCD_stepFrequency', data:{ 
                    x:264+0.5, y:80.5+0.5, width:74-1, height:29-1, canvasBased:true, count:5, decimalPlaces:true, style:unitStyle.LCD, resolution:5,
                }},

                {collection:'control', type:'button_image', name:'startFrequency_10000_up',    data:{ x:221+0,   y:11+0,  width:14, height:9, hoverable:false, backingURL__up:unitStyle.imageStoreURL_commonPrefix+'button_tab_up.png', backingURL__press:unitStyle.imageStoreURL_commonPrefix+'button_tab_down.png' }},
                {collection:'control', type:'button_image', name:'startFrequency_1000_up',     data:{ x:221+15,  y:11+0,  width:14, height:9, hoverable:false, backingURL__up:unitStyle.imageStoreURL_commonPrefix+'button_tab_up.png', backingURL__press:unitStyle.imageStoreURL_commonPrefix+'button_tab_down.png' }},
                {collection:'control', type:'button_image', name:'startFrequency_100_up',      data:{ x:221+30,  y:11+0,  width:14, height:9, hoverable:false, backingURL__up:unitStyle.imageStoreURL_commonPrefix+'button_tab_up.png', backingURL__press:unitStyle.imageStoreURL_commonPrefix+'button_tab_down.png' }},
                {collection:'control', type:'button_image', name:'startFrequency_10_up',       data:{ x:221+45,  y:11+0,  width:14, height:9, hoverable:false, backingURL__up:unitStyle.imageStoreURL_commonPrefix+'button_tab_up.png', backingURL__press:unitStyle.imageStoreURL_commonPrefix+'button_tab_down.png' }},
                {collection:'control', type:'button_image', name:'startFrequency_1_up',        data:{ x:221+60,  y:11+0,  width:14, height:9, hoverable:false, backingURL__up:unitStyle.imageStoreURL_commonPrefix+'button_tab_up.png', backingURL__press:unitStyle.imageStoreURL_commonPrefix+'button_tab_down.png' }},
                {collection:'control', type:'button_image', name:'startFrequency_10000_down',  data:{ x:221+0,   y:11+40, width:14, height:9, hoverable:false, backingURL__up:unitStyle.imageStoreURL_commonPrefix+'button_tab_up.png', backingURL__press:unitStyle.imageStoreURL_commonPrefix+'button_tab_down.png' }},
                {collection:'control', type:'button_image', name:'startFrequency_1000_down',   data:{ x:221+15,  y:11+40, width:14, height:9, hoverable:false, backingURL__up:unitStyle.imageStoreURL_commonPrefix+'button_tab_up.png', backingURL__press:unitStyle.imageStoreURL_commonPrefix+'button_tab_down.png' }},
                {collection:'control', type:'button_image', name:'startFrequency_100_down',    data:{ x:221+30,  y:11+40, width:14, height:9, hoverable:false, backingURL__up:unitStyle.imageStoreURL_commonPrefix+'button_tab_up.png', backingURL__press:unitStyle.imageStoreURL_commonPrefix+'button_tab_down.png' }},
                {collection:'control', type:'button_image', name:'startFrequency_10_down',     data:{ x:221+45,  y:11+40, width:14, height:9, hoverable:false, backingURL__up:unitStyle.imageStoreURL_commonPrefix+'button_tab_up.png', backingURL__press:unitStyle.imageStoreURL_commonPrefix+'button_tab_down.png' }},
                {collection:'control', type:'button_image', name:'startFrequency_1_down',      data:{ x:221+60,  y:11+40, width:14, height:9, hoverable:false, backingURL__up:unitStyle.imageStoreURL_commonPrefix+'button_tab_up.png', backingURL__press:unitStyle.imageStoreURL_commonPrefix+'button_tab_down.png' }},

                {collection:'control', type:'button_image', name:'endFrequency_10000_up',      data:{ x:307+0,   y:11+0,  width:14, height:9, hoverable:false, backingURL__up:unitStyle.imageStoreURL_commonPrefix+'button_tab_up.png', backingURL__press:unitStyle.imageStoreURL_commonPrefix+'button_tab_down.png' }},
                {collection:'control', type:'button_image', name:'endFrequency_1000_up',       data:{ x:307+15,  y:11+0,  width:14, height:9, hoverable:false, backingURL__up:unitStyle.imageStoreURL_commonPrefix+'button_tab_up.png', backingURL__press:unitStyle.imageStoreURL_commonPrefix+'button_tab_down.png' }},
                {collection:'control', type:'button_image', name:'endFrequency_100_up',        data:{ x:307+30,  y:11+0,  width:14, height:9, hoverable:false, backingURL__up:unitStyle.imageStoreURL_commonPrefix+'button_tab_up.png', backingURL__press:unitStyle.imageStoreURL_commonPrefix+'button_tab_down.png' }},
                {collection:'control', type:'button_image', name:'endFrequency_10_up',         data:{ x:307+45,  y:11+0,  width:14, height:9, hoverable:false, backingURL__up:unitStyle.imageStoreURL_commonPrefix+'button_tab_up.png', backingURL__press:unitStyle.imageStoreURL_commonPrefix+'button_tab_down.png' }},
                {collection:'control', type:'button_image', name:'endFrequency_1_up',          data:{ x:307+60,  y:11+0,  width:14, height:9, hoverable:false, backingURL__up:unitStyle.imageStoreURL_commonPrefix+'button_tab_up.png', backingURL__press:unitStyle.imageStoreURL_commonPrefix+'button_tab_down.png' }},
                {collection:'control', type:'button_image', name:'endFrequency_10000_down',    data:{ x:307+0,   y:11+40, width:14, height:9, hoverable:false, backingURL__up:unitStyle.imageStoreURL_commonPrefix+'button_tab_up.png', backingURL__press:unitStyle.imageStoreURL_commonPrefix+'button_tab_down.png' }},
                {collection:'control', type:'button_image', name:'endFrequency_1000_down',     data:{ x:307+15,  y:11+40, width:14, height:9, hoverable:false, backingURL__up:unitStyle.imageStoreURL_commonPrefix+'button_tab_up.png', backingURL__press:unitStyle.imageStoreURL_commonPrefix+'button_tab_down.png' }},
                {collection:'control', type:'button_image', name:'endFrequency_100_down',      data:{ x:307+30,  y:11+40, width:14, height:9, hoverable:false, backingURL__up:unitStyle.imageStoreURL_commonPrefix+'button_tab_up.png', backingURL__press:unitStyle.imageStoreURL_commonPrefix+'button_tab_down.png' }},
                {collection:'control', type:'button_image', name:'endFrequency_10_down',       data:{ x:307+45,  y:11+40, width:14, height:9, hoverable:false, backingURL__up:unitStyle.imageStoreURL_commonPrefix+'button_tab_up.png', backingURL__press:unitStyle.imageStoreURL_commonPrefix+'button_tab_down.png' }},
                {collection:'control', type:'button_image', name:'endFrequency_1_down',        data:{ x:307+60,  y:11+40, width:14, height:9, hoverable:false, backingURL__up:unitStyle.imageStoreURL_commonPrefix+'button_tab_up.png', backingURL__press:unitStyle.imageStoreURL_commonPrefix+'button_tab_down.png' }},

                {collection:'control', type:'button_image', name:'stepFrequency_10000_up',      data:{ x:264+0,   y:70.5+0,  width:14, height:9, hoverable:false, backingURL__up:unitStyle.imageStoreURL_commonPrefix+'button_tab_up.png', backingURL__press:unitStyle.imageStoreURL_commonPrefix+'button_tab_down.png' }},
                {collection:'control', type:'button_image', name:'stepFrequency_1000_up',       data:{ x:264+15,  y:70.5+0,  width:14, height:9, hoverable:false, backingURL__up:unitStyle.imageStoreURL_commonPrefix+'button_tab_up.png', backingURL__press:unitStyle.imageStoreURL_commonPrefix+'button_tab_down.png' }},
                {collection:'control', type:'button_image', name:'stepFrequency_100_up',        data:{ x:264+30,  y:70.5+0,  width:14, height:9, hoverable:false, backingURL__up:unitStyle.imageStoreURL_commonPrefix+'button_tab_up.png', backingURL__press:unitStyle.imageStoreURL_commonPrefix+'button_tab_down.png' }},
                {collection:'control', type:'button_image', name:'stepFrequency_10_up',         data:{ x:264+45,  y:70.5+0,  width:14, height:9, hoverable:false, backingURL__up:unitStyle.imageStoreURL_commonPrefix+'button_tab_up.png', backingURL__press:unitStyle.imageStoreURL_commonPrefix+'button_tab_down.png' }},
                {collection:'control', type:'button_image', name:'stepFrequency_1_up',          data:{ x:264+60,  y:70.5+0,  width:14, height:9, hoverable:false, backingURL__up:unitStyle.imageStoreURL_commonPrefix+'button_tab_up.png', backingURL__press:unitStyle.imageStoreURL_commonPrefix+'button_tab_down.png' }},
                {collection:'control', type:'button_image', name:'stepFrequency_10000_down',    data:{ x:264+0,   y:70.5+40, width:14, height:9, hoverable:false, backingURL__up:unitStyle.imageStoreURL_commonPrefix+'button_tab_up.png', backingURL__press:unitStyle.imageStoreURL_commonPrefix+'button_tab_down.png' }},
                {collection:'control', type:'button_image', name:'stepFrequency_1000_down',     data:{ x:264+15,  y:70.5+40, width:14, height:9, hoverable:false, backingURL__up:unitStyle.imageStoreURL_commonPrefix+'button_tab_up.png', backingURL__press:unitStyle.imageStoreURL_commonPrefix+'button_tab_down.png' }},
                {collection:'control', type:'button_image', name:'stepFrequency_100_down',      data:{ x:264+30,  y:70.5+40, width:14, height:9, hoverable:false, backingURL__up:unitStyle.imageStoreURL_commonPrefix+'button_tab_up.png', backingURL__press:unitStyle.imageStoreURL_commonPrefix+'button_tab_down.png' }},
                {collection:'control', type:'button_image', name:'stepFrequency_10_down',       data:{ x:264+45,  y:70.5+40, width:14, height:9, hoverable:false, backingURL__up:unitStyle.imageStoreURL_commonPrefix+'button_tab_up.png', backingURL__press:unitStyle.imageStoreURL_commonPrefix+'button_tab_down.png' }},
                {collection:'control', type:'button_image', name:'stepFrequency_1_down',        data:{ x:264+60,  y:70.5+40, width:14, height:9, hoverable:false, backingURL__up:unitStyle.imageStoreURL_commonPrefix+'button_tab_up.png', backingURL__press:unitStyle.imageStoreURL_commonPrefix+'button_tab_down.png' }},

                {collection:'control', type:'button_image', name:'waveformSelect_sine', data:{ x:357.5, y:78.5, width:15, height:15, hoverable:false,
                    backingURL__up:unitStyle.imageStoreURL_commonPrefix+'button_sine_up.png', 
                    backingURL__glow:unitStyle.imageStoreURL_commonPrefix+'button_sine_down.png',
                    backingURL__glow_press:unitStyle.imageStoreURL_commonPrefix+'button_sine_down.png'
                }},
                {collection:'control', type:'button_image', name:'waveformSelect_square', data:{ x:348.5, y:96.5, width:15, height:15, hoverable:false,
                    backingURL__up:unitStyle.imageStoreURL_commonPrefix+'button_square_up.png', 
                    backingURL__glow:unitStyle.imageStoreURL_commonPrefix+'button_square_down.png',
                    backingURL__glow_press:unitStyle.imageStoreURL_commonPrefix+'button_square_down.png'
                }},
                {collection:'control', type:'button_image', name:'waveformSelect_triangle', data:{ x:366.5, y:96.5, width:15, height:15, hoverable:false,
                    backingURL__up:unitStyle.imageStoreURL_commonPrefix+'button_triangle_up.png', 
                    backingURL__glow:unitStyle.imageStoreURL_commonPrefix+'button_triangle_down.png',
                    backingURL__glow_press:unitStyle.imageStoreURL_commonPrefix+'button_triangle_down.png'
                }},

                {collection:'control', type:'dial_continuous_image', name:'seconds_per_step', data:{
                    x:237.5, y:95, radius:30/2, startAngle:(3*Math.PI)/4, maxAngle:1.5*Math.PI, value:0.5, resetValue:0.5, arcDistance:1.2,
                    handleURL:unitStyle.imageStoreURL_commonPrefix+'dial_large.png',
                }},
                {collection:'control', type:'dial_continuous_image', name:'duty_cycle', data:{
                    x:325, y:145, radius:30/2, startAngle:(3*Math.PI)/4, maxAngle:1.5*Math.PI, value:0.5, resetValue:0.5, arcDistance:1.2,
                    handleURL:unitStyle.imageStoreURL_commonPrefix+'dial_large.png',
                }},
                {collection:'control', type:'dial_continuous_image', name:'signalGeneratorGain', data:{
                    x:367.5, y:145, radius:30/2, startAngle:(3*Math.PI)/4, maxAngle:1.5*Math.PI, value:0.5, resetValue:0.5, arcDistance:1.2,
                    handleURL:unitStyle.imageStoreURL_commonPrefix+'dial_large.png',
                }},

                {collection:'control', type:'button_image', name:'clear', data:{ x:222.5, y:135, width:20, height:20, hoverable:false,
                    backingURL__up:unitStyle.imageStoreURL_localPrefix+'button_clear_up.png', 
                    backingURL__press:unitStyle.imageStoreURL_localPrefix+'button_clear_down.png',
                }},
                {collection:'control', type:'button_image', name:'start', data:{ x:250, y:135, width:20, height:20, hoverable:false,
                    backingURL__up:unitStyle.imageStoreURL_localPrefix+'button_start_up.png', 
                    backingURL__press:unitStyle.imageStoreURL_localPrefix+'button_start_down.png',
                }},
                {collection:'control', type:'button_image', name:'stop', data:{ x:277.5, y:135, width:20, height:20, hoverable:false,
                    backingURL__up:unitStyle.imageStoreURL_localPrefix+'button_stop_up.png', 
                    backingURL__press:unitStyle.imageStoreURL_localPrefix+'button_stop_down.png',
                }},
            ]
        });

    //circuitry
        const state = {
            frequencyLimits:{top:20000, bottom:0.001},
            startFrequencyDigits:[0,0,1,0,0],
            endFrequencyDigits:[0,1,0,0,0],
            stepFrequencyDigits:[0,0,0,1,0],
            waveform:'sine',
            dutyCycle:0.5,
            timePerStep:0.05,
            signalGeneratorGain:1,
        };
        frequencyAmplitudeResponseAnalyser = new _canvas_.interface.circuit.frequencyAmplitudeResponseAnalyser(_canvas_.library.audio.context);
        foolsOutput = new GainNode(_canvas_.library.audio.context); foolsOutput.gain.setValueAtTime(0,0);
        frequencyAmplitudeResponseAnalyser.producer().connect(foolsOutput).connect(_canvas_.library.audio.destination);

        function stepFrequencyCharacter(aspect,index,increment){
            if(increment){
                state[aspect+'FrequencyDigits'][index]++;
                if(state[aspect+'FrequencyDigits'][index] > 9){ state[aspect+'FrequencyDigits'][index] = 0; }
            }else{
                state[aspect+'FrequencyDigits'][index]--;
                if(state[aspect+'FrequencyDigits'][index] < 0){ state[aspect+'FrequencyDigits'][index] = 9; }
            }
            updateFrequency();
        }
        function updateFrequency(){
            ['start','end','step'].forEach(aspect => {
                let frequency = parseFloat(state[aspect+'FrequencyDigits'].join(''));
                if( frequency > state.frequencyLimits.top){
                    state[aspect+'FrequencyDigits'] = [2,0,0,0,0];
                }else if(frequency < state.frequencyLimits.bottom){ 
                    state[aspect+'FrequencyDigits'] = [0,0,0,0,1];
                }
                frequency = state[aspect+'FrequencyDigits'].join('');

                object.elements.readout_sevenSegmentDisplay['LCD_'+aspect+'Frequency'].text( frequency );
                object.elements.readout_sevenSegmentDisplay['LCD_'+aspect+'Frequency'].print();
            });

            frequencyAmplitudeResponseAnalyser.range( parseInt(state.startFrequencyDigits.join('')), parseInt(state.endFrequencyDigits.join('')) );
            frequencyAmplitudeResponseAnalyser.stepSize( parseInt(state.stepFrequencyDigits.join('')) );
            updateViewbox();
        }
        function selectWaveform(waveform){
            if(state.waveform == waveform){ return; }
            object.elements.button_image['waveformSelect_'+state.waveform].glow(false);
            state.waveform = waveform;
            object.elements.button_image['waveformSelect_'+state.waveform].glow(true);

            frequencyAmplitudeResponseAnalyser.waveform(waveform);
        }
        function updateViewbox(){
            const startFrequency = parseInt(state.startFrequencyDigits.join(''));
            const endFrequency = parseInt(state.endFrequencyDigits.join(''));
            object.elements.grapher.waveport.viewbox( {bottom:0, top:2, left:startFrequency, right:endFrequency} );

            const scale = Math.pow(10,Math.round(Math.log10(endFrequency)))/10;

            let counter = startFrequency;
            let markings = [];
            while(counter < endFrequency){
                markings.push(counter);
                counter = counter+scale;
            }

            object.elements.grapher.waveport.verticalMarkings({ points:markings });

            object.elements.grapher.waveport.drawBackground();
        }
        function clearScreen(){
            object.elements.grapher.waveport.clearAll();
            updateViewbox();
        }
        function graphLine(data){
            let Y = [];
            let X = [];

            data.forEach(point => {
                Y.push(point.response);
                X.push(point.frequency);
            });
            object.elements.grapher.waveport.drawForeground(Y,X);
        }
        frequencyAmplitudeResponseAnalyser.onCompletion = function(data){graphLine(data);};
        // frequencyAmplitudeResponseAnalyser.onValue = function(data){
        //     console.log(data);
        // };

    //wiring
        //hid
            object.elements.button_image.clear.onpress = function(value){
                frequencyAmplitudeResponseAnalyser.clear();
                clearScreen();
            };
            object.elements.button_image.start.onpress = function(value){
                frequencyAmplitudeResponseAnalyser.start();
            };
            object.elements.button_image.stop.onpress = function(value){
                frequencyAmplitudeResponseAnalyser.stop();
            };
            object.elements.dial_continuous_image.seconds_per_step.onchange = function(value){
                if(value == 0){ value = 0.001; }
                state.timePerStep = value/10;
                frequencyAmplitudeResponseAnalyser.timePerStep(state.timePerStep);
            };
            object.elements.dial_continuous_image.duty_cycle.onchange = function(value){
                state.dutyCycle = value;
                frequencyAmplitudeResponseAnalyser.dutyCycle(value);
            };
            object.elements.dial_continuous_image.signalGeneratorGain.onchange = function(value){
                state.signalGeneratorGain = value*2;
                frequencyAmplitudeResponseAnalyser.signalGeneratorGain(state.signalGeneratorGain);
            };
            object.elements.button_image.waveformSelect_sine.onpress = function(){
                selectWaveform('sine'); 
            };
            object.elements.button_image.waveformSelect_triangle.onpress = function(){
                selectWaveform('triangle'); 
            };
            object.elements.button_image.waveformSelect_square.onpress = function(){
                selectWaveform('square'); 
            };
            object.elements.button_image['startFrequency_10000_up'].onpress = function(){   stepFrequencyCharacter('start',0,true); };
            object.elements.button_image['startFrequency_1000_up'].onpress = function(){    stepFrequencyCharacter('start',1,true); };
            object.elements.button_image['startFrequency_100_up'].onpress = function(){     stepFrequencyCharacter('start',2,true); };
            object.elements.button_image['startFrequency_10_up'].onpress = function(){      stepFrequencyCharacter('start',3,true); };
            object.elements.button_image['startFrequency_1_up'].onpress = function(){       stepFrequencyCharacter('start',4,true); };
            object.elements.button_image['startFrequency_10000_down'].onpress = function(){ stepFrequencyCharacter('start',0,false); };
            object.elements.button_image['startFrequency_1000_down'].onpress = function(){  stepFrequencyCharacter('start',1,false); };
            object.elements.button_image['startFrequency_100_down'].onpress = function(){   stepFrequencyCharacter('start',2,false); };
            object.elements.button_image['startFrequency_10_down'].onpress = function(){    stepFrequencyCharacter('start',3,false); };
            object.elements.button_image['startFrequency_1_down'].onpress = function(){     stepFrequencyCharacter('start',4,false); };
            object.elements.button_image['endFrequency_10000_up'].onpress = function(){   stepFrequencyCharacter('end',0,true); };
            object.elements.button_image['endFrequency_1000_up'].onpress = function(){    stepFrequencyCharacter('end',1,true); };
            object.elements.button_image['endFrequency_100_up'].onpress = function(){     stepFrequencyCharacter('end',2,true); };
            object.elements.button_image['endFrequency_10_up'].onpress = function(){      stepFrequencyCharacter('end',3,true); };
            object.elements.button_image['endFrequency_1_up'].onpress = function(){       stepFrequencyCharacter('end',4,true); };
            object.elements.button_image['endFrequency_10000_down'].onpress = function(){ stepFrequencyCharacter('end',0,false); };
            object.elements.button_image['endFrequency_1000_down'].onpress = function(){  stepFrequencyCharacter('end',1,false); };
            object.elements.button_image['endFrequency_100_down'].onpress = function(){   stepFrequencyCharacter('end',2,false); };
            object.elements.button_image['endFrequency_10_down'].onpress = function(){    stepFrequencyCharacter('end',3,false); };
            object.elements.button_image['endFrequency_1_down'].onpress = function(){     stepFrequencyCharacter('end',4,false); };
            object.elements.button_image['stepFrequency_10000_up'].onpress = function(){   stepFrequencyCharacter('step',0,true); };
            object.elements.button_image['stepFrequency_1000_up'].onpress = function(){    stepFrequencyCharacter('step',1,true); };
            object.elements.button_image['stepFrequency_100_up'].onpress = function(){     stepFrequencyCharacter('step',2,true); };
            object.elements.button_image['stepFrequency_10_up'].onpress = function(){      stepFrequencyCharacter('step',3,true); };
            object.elements.button_image['stepFrequency_1_up'].onpress = function(){       stepFrequencyCharacter('step',4,true); };
            object.elements.button_image['stepFrequency_10000_down'].onpress = function(){ stepFrequencyCharacter('step',0,false); };
            object.elements.button_image['stepFrequency_1000_down'].onpress = function(){  stepFrequencyCharacter('step',1,false); };
            object.elements.button_image['stepFrequency_100_down'].onpress = function(){   stepFrequencyCharacter('step',2,false); };
            object.elements.button_image['stepFrequency_10_down'].onpress = function(){    stepFrequencyCharacter('step',3,false); };
            object.elements.button_image['stepFrequency_1_down'].onpress = function(){     stepFrequencyCharacter('step',4,false); };

        //io
            object.io.audio.producer.audioNode = frequencyAmplitudeResponseAnalyser.producer();
            object.io.audio.consumer.audioNode = frequencyAmplitudeResponseAnalyser.consumer();

    //interface
        object.i = {
            clear:function(){ 
                object.elements.button_image.clear.press();
                object.elements.button_image.clear.release();
            },
            start:function(){
                object.elements.button_image.start.press();
                object.elements.button_image.start.release();
            },
            stop:function(){ 
                object.elements.button_image.stop.press();
                object.elements.button_image.stop.release();
            },

            range:function(start,end){
                if(start == undefined || end == undefined){
                    return {
                        start: parseInt(state.startFrequencyDigits.join('')),
                        end: parseInt(state.endFrequencyDigits.join('')),
                    };
                }

                state.startFrequencyDigits = _canvas_.library.misc.padString(String(start),5,'0').split('').map(a => parseInt(a));
                state.endFrequencyDigits = _canvas_.library.misc.padString(String(end),5,'0').split('').map(a => parseInt(a));
                updateFrequency();
            },
            stepSize:function(step){
                if(step == undefined){
                    return parseInt(state.FrequencyDigits.join(''));
                }
                state.stepFrequencyDigits = _canvas_.library.misc.padString(String(step),5,'0').split('').map(a => parseInt(a));
                updateFrequency();
            },
            timePerStep:function(time){
                if(time == undefined){
                    return state.timePerStep;
                }
                object.elements.dial_continuous_image.seconds_per_step.set( time*10 );
            },

            dutyCycle:function(ratio){
                if(ratio == undefined){
                    return object.elements.dial_continuous_image.duty_cycle.get();
                }
                object.elements.dial_continuous_image.duty_cycle.set(ratio);
            },
            signalGeneratorGain:function(gain){
                if(gain == undefined){
                    return state.signalGeneratorGain;
                }
                object.elements.dial_continuous_image.signalGeneratorGain.set(gain/2);
            },
            waveform:function(waveform){
                if(waveform == undefined){
                    return state.waveform;
                }
                selectWaveform(waveform);
            },
        };

    //import/export
        object.exportData = function(){
            return JSON.parse(JSON.stringify(state));
        };
        object.importData = function(data){
            state.startFrequencyDigits = data.startFrequencyDigits;
            state.endFrequencyDigits = data.endFrequencyDigits;
            state.stepFrequencyDigits = data.stepFrequencyDigits;
            updateFrequency();

            selectWaveform(data.waveform);

            object.i.timePerStep(data.timePerStep);
            object.i.dutyCycle(data.dutyCycle);
            object.i.signalGeneratorGain(data.signalGeneratorGain);
        };

    //setup/tearDown
        object.oncreate = function(){
            object.elements.grapher.waveport.horizontalMarkings({points:[2, 1.75, 1.5, 1.25, 1, 0.75, 0.5, 0.25, 0]});
            object.elements.grapher.waveport.verticalMarkings({mappedPosition:1});
            object.elements.dial_continuous_image.seconds_per_step.set(0.5);
            clearScreen();
            object.elements.button_image.waveformSelect_sine.glow(true);
            updateFrequency();
        };
        
    return object;
};
this['frequency_amplitude_response_workstation'].metadata = {
    name:'F/AR Workstation',
    category:'',
    helpURL:''
};