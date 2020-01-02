this.basic_synthesizer = function(name,x,y,angle){
    //style data
        const unitStyle = new function(){
            //image store location URL
                this.imageStoreURL_localPrefix = imageStoreURL+'basic_synthesizer/';

            //calculation of measurements
                const div = 6;
                const measurement = { 
                    file: { width:1115, height:680 },
                    design: { width:18.25, height:11 },
                };

                this.offset = 20/div;
                this.drawingValue = { 
                    width: measurement.file.width/div, 
                    height: measurement.file.height/div
                };

            //styling values
                this.outputGain = { handle:{r:0.93,g:0.45,b:0.31,a:1}, slot:{r:0,g:0,b:0,a:0}, needle:{r:1,g:1,b:1,a:1} };
                this.attack = { handle:{r:0.99,g:0.93,b:0.31,a:1}, slot:{r:0,g:0,b:0,a:0}, needle:{r:1,g:1,b:1,a:1} };
                this.release = { handle:{r:0.44,g:0.95,b:0.79,a:1}, slot:{r:0,g:0,b:0,a:0}, needle:{r:1,g:1,b:1,a:1} };
                this.detune_note = { handle:{r:0.61,g:0.16,b:0.96,a:1}, slot:{r:0,g:0,b:0,a:0}, needle:{r:1,g:1,b:1,a:1} };
                this.detune_octave = { handle:{r:0.92,g:0.2,b:0.47,a:1}, slot:{r:0,g:0,b:0,a:0}, needle:{r:1,g:1,b:1,a:1} };
                this.periodicWaveType = { handle:{r:0.75,g:0.75,b:0.75,a:1}, slot:{r:0,g:0,b:0,a:0}, needle:{r:1,g:1,b:1,a:1} };
                this.gainWobblePeriod = { handle:{r:0.57,g:0.97,b:0.3,a:1}, slot:{r:0,g:0,b:0,a:0}, needle:{r:1,g:1,b:1,a:1} };
                this.gainWobbleDepth = { handle:{r:0.46,g:0.98,b:0.65,a:1}, slot:{r:0,g:0,b:0,a:0}, needle:{r:1,g:1,b:1,a:1} };
                this.detuneWobblePeriod = { handle:{r:0.94,g:0.55,b:0.2,a:1}, slot:{r:0,g:0,b:0,a:0}, needle:{r:1,g:1,b:1,a:1} };
                this.detuneWobbleDepth = { handle:{r:0.96,g:0.75,b:0.26,a:1}, slot:{r:0,g:0,b:0,a:0}, needle:{r:1,g:1,b:1,a:1} };
                this.panicButton = {
                    background__up__colour:{r:0.75,g:0.75,b:0.75,a:1},
                    background__hover__colour:{r:0.85,g:0.85,b:0.85,a:1},
                    background__press__colour:{r:0.5,g:0.5,b:0.5,a:1},
                    background__hover_press__colour:{r:0.5,g:0.5,b:0.5,a:1},
                };
        };

        //main object creation
            const object = _canvas_.interface.unit.builder({
                name:name,
                model:'basic_synthesizer',
                x:x, y:y, angle:angle,
                space:[
                    { x:unitStyle.drawingValue.width*(1/18.5),                        y:0                                                         },
                    { x:unitStyle.drawingValue.width*(17.5/18.5) -unitStyle.offset,   y:0                                                         },
                    { x:unitStyle.drawingValue.width -unitStyle.offset,               y:unitStyle.drawingValue.height*(1/11)                      },
                    { x:unitStyle.drawingValue.width -unitStyle.offset,               y:(unitStyle.drawingValue.height+unitStyle.offset)*(4.5/11) },
                    { x:(unitStyle.drawingValue.width-unitStyle.offset)*(12.15/18.5), y:unitStyle.drawingValue.height -unitStyle.offset           },
                    { x:unitStyle.drawingValue.width*(1/18.5),                        y:unitStyle.drawingValue.height -unitStyle.offset           },
                    { x:0,                                                            y:(unitStyle.drawingValue.height-unitStyle.offset)*(10/11)  },
                    { x:0,                                                            y:unitStyle.drawingValue.height*(1/11)                      },
                ],
                elements:[
                    {collection:'dynamic', type:'connectionNode_audio', name:'io_output', data:{ 
                        x:0, y:35, width:5, height:15, angle:Math.PI, isAudioOutput:true, cableVersion:2, style:style.connectionNode.audio,
                    }},
                    {collection:'dynamic', type:'connectionNode_voltage', name:'io_outputGain', data:{ 
                        x:15, y:0, width:5, height:10, angle:-Math.PI/2, cableVersion:2, style:style.connectionNode.voltage,
                    }},
                    {collection:'dynamic', type:'connectionNode_voltage', name:'io_attack', data:{ 
                        x:50, y:0, width:5, height:10, angle:-Math.PI/2, cableVersion:2, style:style.connectionNode.voltage,
                    }},
                    {collection:'dynamic', type:'connectionNode_voltage', name:'io_release', data:{ 
                        x:82.5, y:0, width:5, height:10, angle:-Math.PI/2, cableVersion:2, style:style.connectionNode.voltage,
                    }},
                    {collection:'dynamic', type:'connectionNode_voltage', name:'io_detune_note', data:{ 
                        x:117.5, y:0, width:5, height:10, angle:-Math.PI/2, cableVersion:2, style:style.connectionNode.voltage,
                    }},
                    {collection:'dynamic', type:'connectionNode_signal', name:'io_detune_octave_down', data:{ 
                        x:150 - 6, y:0, width:5, height:10, angle:-Math.PI/2, cableVersion:2, style:style.connectionNode.signal,
                    }},
                    {collection:'dynamic', type:'connectionNode_signal', name:'io_detune_octave_up', data:{ 
                        x:150 + 6, y:0, width:5, height:10, angle:-Math.PI/2, cableVersion:2, style:style.connectionNode.signal,
                    }},
                    {collection:'dynamic', type:'connectionNode_data', name:'io_midiNoteInput', data:{ 
                        x:unitStyle.drawingValue.width - 5/1.5, y:27.5 - 15/2, width:5, height:15, cableVersion:2, style:style.connectionNode.data,
                    }},
                    {collection:'dynamic', type:'connectionNode_voltage', name:'io_gainWobblePeriod', data:{ 
                        x:90/2 - 6, y:unitStyle.drawingValue.height - 5/1.5, width:5, height:10, angle:Math.PI/2, cableVersion:2, style:style.connectionNode.voltage,
                    }},
                    {collection:'dynamic', type:'connectionNode_voltage', name:'io_gainWobbleDepth', data:{ 
                        x:90/2 + 6, y:unitStyle.drawingValue.height - 5/1.5, width:5, height:10, angle:Math.PI/2, cableVersion:2, style:style.connectionNode.voltage,
                    }},
                    {collection:'dynamic', type:'connectionNode_voltage', name:'io_detuneWobblePeriod', data:{ 
                        x:155/2 - 6, y:unitStyle.drawingValue.height - 5/1.5, width:5, height:10, angle:Math.PI/2, cableVersion:2, style:style.connectionNode.voltage,
                    }},
                    {collection:'dynamic', type:'connectionNode_voltage', name:'io_detuneWobbleDepth', data:{ 
                        x:155/2 + 6, y:unitStyle.drawingValue.height - 5/1.5, width:5, height:10, angle:Math.PI/2, cableVersion:2, style:style.connectionNode.voltage,
                    }},
                    {collection:'dynamic', type:'connectionNode_data', name:'io_periodicWaveType_dataIn', data:{ 
                        x:unitStyle.drawingValue.width-35 -2.5, y:unitStyle.drawingValue.height-35 +2.5, width:5, height:15, angle:Math.PI/4, cableVersion:2, style:style.connectionNode.data,
                    }},
                    {collection:'dynamic', type:'connectionNode_signal', name:'io_periodicWaveType_down', data:{ 
                        x:unitStyle.drawingValue.width-35 -14, y:unitStyle.drawingValue.height-35 +14, width:5, height:10, angle:Math.PI/4, cableVersion:2, style:style.connectionNode.signal,
                    }},
                    {collection:'dynamic', type:'connectionNode_signal', name:'io_periodicWaveType_up', data:{ 
                        x:unitStyle.drawingValue.width-35 +5.5, y:unitStyle.drawingValue.height-35 -5.5, width:5, height:10, angle:Math.PI/4, cableVersion:2, style:style.connectionNode.signal,
                    }},
                    {collection:'dynamic', type:'connectionNode_signal', name:'io_panic', data:{ 
                        x:unitStyle.drawingValue.width-35 +22.5, y:unitStyle.drawingValue.height-35 -22.5, width:5, height:10, angle:Math.PI/4, cableVersion:2, style:style.connectionNode.signal,
                    }},
                    {collection:'basic', type:'image', name:'backing', 
                        data:{ x:-unitStyle.offset/2, y:-unitStyle.offset/2, width:unitStyle.drawingValue.width, height:unitStyle.drawingValue.height, url:unitStyle.imageStoreURL_localPrefix+'backing.png' }
                    },
                    {collection:'control', type:'dial_2_continuous',name:'outputGain',data:{
                        x:20, y:27.5, radius:27.5/2, startAngle:(3*Math.PI)/4, maxAngle:1.5*Math.PI, arcDistance:1.2, resetValue:0.5, value:0.5, style:unitStyle.outputGain,
                    }},
                    {collection:'control', type:'dial_2_continuous',name:'attack',data:{
                        x:55, y:27.5, radius:27.5/2, startAngle:(3*Math.PI)/4, maxAngle:1.5*Math.PI, arcDistance:1.2, resetValue:0, style:unitStyle.attack,
                    }},
                    {collection:'control', type:'dial_2_continuous',name:'release',data:{
                        x:87.5, y:27.5, radius:27.5/2, startAngle:(3*Math.PI)/4, maxAngle:1.5*Math.PI, value:0, arcDistance:1.2, resetValue:0, style:unitStyle.release,
                    }},
                    {collection:'control', type:'dial_2_continuous',name:'detune_note',data:{
                        x:122.5, y:27.5, radius:27.5/2, startAngle:(3*Math.PI)/4, maxAngle:1.5*Math.PI, value:0.5, arcDistance:1.2, resetValue:0.5, style:unitStyle.detune_note,
                    }},
                    {collection:'control', type:'dial_2_discrete',name:'detune_octave',data:{
                        x:155, y:27.5, radius:27.5/2, startAngle:(3*Math.PI)/4, maxAngle:1.5*Math.PI, value:3, arcDistance:1.2, resetValue:3, optionCount:7, style:unitStyle.detune_octave,
                    }},
                    {collection:'control', type:'dial_2_discrete',name:'periodicWaveType',data:{
                        x:130, y:72.5, radius:32.5/2, startAngle:(3*Math.PI)/4, maxAngle:1.5*Math.PI, value:0, arcDistance:1.2, resetValue:0, style:unitStyle.periodicWaveType,
                    }},
                    {collection:'control', type:'dial_2_continuous',name:'gainWobblePeriod',data:{
                        x:40, y:62.5, radius:25/2, startAngle:(3*Math.PI)/4, maxAngle:1.5*Math.PI, value:0, arcDistance:1.2, resetValue:0, style:unitStyle.gainWobblePeriod,
                    }},
                    {collection:'control', type:'dial_2_continuous',name:'gainWobbleDepth',data:{
                        x:40, y:92.5, radius:25/2, startAngle:(3*Math.PI)/4, maxAngle:1.5*Math.PI, value:0, arcDistance:1.2, resetValue:0, style:unitStyle.gainWobbleDepth,
                    }},
                    {collection:'control', type:'dial_2_continuous',name:'detuneWobblePeriod',data:{
                        x:72.5, y:62.5, radius:25/2, startAngle:(3*Math.PI)/4, maxAngle:1.5*Math.PI, value:0, arcDistance:1.2, resetValue:0, style:unitStyle.detuneWobblePeriod,
                    }},
                    {collection:'control', type:'dial_2_continuous',name:'detuneWobbleDepth',data:{
                        x:72.5, y:92.5, radius:25/2, startAngle:(3*Math.PI)/4, maxAngle:1.5*Math.PI, value:0, arcDistance:1.2, resetValue:0, style:unitStyle.detuneWobbleDepth,
                    }},
                    {collection:'control', type:'button_circle', name:'panicButton', data:{ 
                        x:162.5, y:52.5, r:15/2, style:unitStyle.panicButton,
                    }},
                ]
            });

    //circuitry
        const detuneLimits = {min:-100, max:100};
        const synthesizerCircuit = new _canvas_.interface.circuit.synthesizer(_canvas_.library.audio.context);

    //wiring
        //hid
            object.elements.dial_2_continuous.outputGain.onchange = function(value){ synthesizerCircuit.gain( value ); };
            object.elements.dial_2_continuous.attack.onchange = function(value){ synthesizerCircuit.attack( value ); };
            object.elements.dial_2_continuous.release.onchange = function(value){ synthesizerCircuit.release( value ); };
            object.elements.dial_2_continuous.detune_note.onchange = function(value){ synthesizerCircuit.detune( value*(detuneLimits.max-detuneLimits.min) + detuneLimits.min ); };
            object.elements.dial_2_discrete.detune_octave.onchange = function(value){ synthesizerCircuit.octave( value-3 ); };
            object.elements.dial_2_discrete.periodicWaveType.onchange = function(value){ synthesizerCircuit.waveType( ['sine','triangle','square','sawtooth','custom'][value] ); };
            object.elements.dial_2_continuous.gainWobblePeriod.onchange = function(value){ synthesizerCircuit.gainWobblePeriod( (1-value)<0.01?0.011:(1-value) ); };
            object.elements.dial_2_continuous.gainWobbleDepth.onchange = function(value){ synthesizerCircuit.gainWobbleDepth(value);};
            object.elements.dial_2_continuous.detuneWobblePeriod.onchange = function(value){ synthesizerCircuit.detuneWobblePeriod( (1-value)<0.01?0.011:(1-value) ); };
            object.elements.dial_2_continuous.detuneWobbleDepth.onchange = function(value){ synthesizerCircuit.detuneWobbleDepth( value*100 ); };
            object.elements.button_circle.panicButton.onpress = function(){ synthesizerCircuit.panic(); };
        //io
            synthesizerCircuit.out().connect( object.io.audio.io_output.in() );

            object.io.data.io_midiNoteInput.onreceive = function(address,data){
                if(address != 'midinumber'){return;}
                synthesizerCircuit.perform(data);
            };
            object.io.data.io_periodicWaveType_dataIn.onreceive = function(address,data){
                if(address != 'periodicWave'){return;}
                synthesizerCircuit.periodicWave(data);
            };
            object.io.voltage.io_outputGain.onchange = function(value){
                object.elements.dial_2_continuous.outputGain.set(value);
            };
            object.io.voltage.io_attack.onchange = function(value){
                object.elements.dial_2_continuous.attack.set(value);
            };
            object.io.voltage.io_release.onchange = function(value){
                object.elements.dial_2_continuous.release.set(value);
            };
            object.io.voltage.io_detune_note.onchange = function(value){ 
                object.elements.dial_2_continuous.detune_note.set(value);
            };
            object.io.signal.io_detune_octave_down.onchange = function(value){ if(!value){return;}
                object.elements.dial_2_discrete.detune_octave.set( object.elements.dial_2_discrete.detune_octave.get() - 1 );
            };
            object.io.signal.io_detune_octave_up.onchange = function(value){ if(!value){return;}
                object.elements.dial_2_discrete.detune_octave.set( object.elements.dial_2_discrete.detune_octave.get() + 1 );
            };
            object.io.voltage.io_gainWobblePeriod.onchange = function(value){
                object.elements.dial_2_continuous.gainWobblePeriod.set(value);
            };
            object.io.voltage.io_gainWobbleDepth.onchange = function(value){
                object.elements.dial_2_continuous.gainWobbleDepth.set(value);
            };
            object.io.voltage.io_detuneWobblePeriod.onchange = function(value){
                object.elements.dial_2_continuous.detuneWobblePeriod.set(value);
            };
            object.io.voltage.io_detuneWobbleDepth.onchange = function(value){
                object.elements.dial_2_continuous.detuneWobbleDepth.set(value);
            };
            object.io.signal.io_periodicWaveType_down.onchange = function(value){ if(!value){return;}
                object.elements.dial_2_discrete.periodicWaveType.set( object.elements.dial_2_discrete.periodicWaveType.get() - 1 );
            };
            object.io.signal.io_periodicWaveType_up.onchange = function(value){ if(!value){return;}
                object.elements.dial_2_discrete.periodicWaveType.set( object.elements.dial_2_discrete.periodicWaveType.get() + 1 );
            };
            object.io.signal.io_panic.onchange = function(value){ value ? object.elements.button_circle.panicButton.press() : object.elements.button_circle.panicButton.release(); };

    //interface
        object.i = {
            periodicWave:function(data){return synthesizerCircuit.periodicWave(data);},
            performMidiNote:function(data){synthesizerCircuit.perform(data);},
        };
        ['gain','attack','release','detune','gainWobblePeriod','gainWobbleDepth','detuneWobblePeriod','detuneWobbleDepth'].forEach(dialName => {
            object.i[dialName] = (function(element){
                return function(value){ if(value==undefined){return element.get();}else{element.set(value);} }
            })(object.elements.dial_2_continuous[dialName]);
        });
        ['octave','waveType'].forEach(dialName => {
            object.i[dialName] = (function(element){
                return function(value){ if(value==undefined){return element.get();}else{element.set(value);} }
            })(object.elements.dial_2_discrete[dialName]);
        });

    //import/export
        object.exportData = function(){
            return {
                gain: object.elements.dial_2_continuous.outputGain.get(),
                attack: object.elements.dial_2_continuous.attack.get()*10,
                release: object.elements.dial_2_continuous.release.get()*10,
                detune: 100*((object.elements.dial_2_continuous.detune_note.get()*2)-1),
                octave: object.elements.dial_2_discrete.detune_octave.get()-3,
                waveType: ['sine','triangle','square','sawtooth','custom'][object.elements.dial_2_discrete.periodicWaveType.get()],
                gainWobble:{
                    rate: object.elements.dial_2_continuous.gainWobblePeriod.get()*100,
                    depth: object.elements.dial_2_continuous.gainWobbleDepth.get()
                },
                detuneWobble:{
                    rate: object.elements.dial_2_continuous.detuneWobblePeriod.get()*100,
                    depth: object.elements.dial_2_continuous.detuneWobbleDepth.get()
                },
            };
        };
        object.importData = function(data){
            if(data == undefined){return;}

            object.elements.dial_2_continuous.outputGain.set( data.gain );
            object.elements.dial_2_continuous.attack.set( data.attack/10 );
            object.elements.dial_2_continuous.release.set( data.release/10 );
            object.elements.dial_2_continuous.detune_note.set( (1+(data.detune/100))/2 );
            object.elements.dial_2_discrete.detune_octave.set( data.octave+3 );
            object.elements.dial_2_discrete.periodicWaveType.set( ['sine','triangle','square','sawtooth','custom'].indexOf(data.waveType) );
            object.elements.dial_2_continuous.gainWobblePeriod.set( data.gainWobble.rate/100 );
            object.elements.dial_2_continuous.gainWobbleDepth.set( data.gainWobble.depth );
            object.elements.dial_2_continuous.detuneWobblePeriod.set( data.detuneWobble.rate/100 );
            object.elements.dial_2_continuous.detuneWobbleDepth.set( data.detuneWobble.depth );
        };
        
    return object;
};
this.basic_synthesizer.metadata = {
    name:'Basic Synthesizer',
    category:'synthesizers',
    helpURL:'/help/units/alpha/basic_synthesizer/'
};