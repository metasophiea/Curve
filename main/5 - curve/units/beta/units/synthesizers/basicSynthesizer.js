this.basic_synthesizer = function(x,y,a){
    var imageStoreURL_localPrefix = imageStoreURL+'basic_synthesizer/';

    var div = 6;
    var offset = 20/div;
    var measurements = { 
        file:{ width:1115, height:680 },
        design:{ width:18.25, height:11 },
    };
    measurements.drawing = { width: measurements.file.width/div, height: measurements.file.height/div };
    measurements.drawingUnit = {
        width: measurements.drawing.width/measurements.design.width,
        height: measurements.drawing.height/measurements.design.height,
    };
    var dialColours = {
        outputGain:{r:0.93,g:0.45,b:0.31,a:1},
        attack:{r:0.99,g:0.93,b:0.31,a:1},
        release:{r:0.44,g:0.95,b:0.79,a:1},
        detune_note:{r:0.61,g:0.16,b:0.96,a:1},
        detune_octave:{r:0.92,g:0.2,b:0.47,a:1},
        periodicWaveType:{r:0.75,g:0.75,b:0.75,a:1},
        gainWobblePeriod:{r:0.57,g:0.97,b:0.3,a:1},
        gainWobbleDepth:{r:0.46,g:0.98,b:0.65,a:1},
        detuneWobblePeriod:{r:0.94,g:0.55,b:0.2,a:1},
        detuneWobbleDepth:{r:0.96,g:0.75,b:0.26,a:1},
    };
    
    var design = {
        name:'basic_synthesizer',
        x:x, y:y, angle:a,
        space:[
            { x:measurements.drawingUnit.width, y:0 },
            { x:measurements.drawing.width -offset -measurements.drawingUnit.width, y:0 },
            { x:measurements.drawing.width -offset, y:measurements.drawingUnit.height },
            { x:measurements.drawing.width -offset, y:measurements.drawingUnit.height*4.5+offset/2.5 },
            { x:measurements.drawingUnit.width*12 -offset/1.5, y:measurements.drawing.height -offset },
            { x:measurements.drawingUnit.width, y:measurements.drawing.height -offset },
            { x:0, y:measurements.drawing.height -offset -measurements.drawingUnit.height },
            { x:0, y:measurements.drawingUnit.height },
        ],
        elements:[
            {collection:'dynamic', type:'connectionNode_audio', name:'io_output', data:{ 
                x:0, y:27.5 + 15/2, width:5, height:15, angle:Math.PI, isAudioOutput:true, cableVersion:2, style:style.connectionNode.audio,
            }},
            {collection:'dynamic', type:'connectionNode_voltage', name:'io_outputGain', data:{ 
                x:20 - 10/2, y:0, width:5, height:10, angle:-Math.PI/2, cableVersion:2, style:style.connectionNode.voltage,
            }},
            {collection:'dynamic', type:'connectionNode_voltage', name:'io_attack', data:{ 
                x:55 - 10/2, y:0, width:5, height:10, angle:-Math.PI/2, cableVersion:2, style:style.connectionNode.voltage,
            }},
            {collection:'dynamic', type:'connectionNode_voltage', name:'io_release', data:{ 
                x:87.5 - 10/2, y:0, width:5, height:10, angle:-Math.PI/2, cableVersion:2, style:style.connectionNode.voltage,
            }},
            {collection:'dynamic', type:'connectionNode_voltage', name:'io_detune_note', data:{ 
                x:122.5 - 10/2, y:0, width:5, height:10, angle:-Math.PI/2, cableVersion:2, style:style.connectionNode.voltage,
            }},
            {collection:'dynamic', type:'connectionNode_signal', name:'io_detune_octave_down', data:{ 
                x:155 - 10/2 - 6, y:0, width:5, height:10, angle:-Math.PI/2, cableVersion:2, style:style.connectionNode.signal,
            }},
            {collection:'dynamic', type:'connectionNode_signal', name:'io_detune_octave_up', data:{ 
                x:155 - 10/2 + 6, y:0, width:5, height:10, angle:-Math.PI/2, cableVersion:2, style:style.connectionNode.signal,
            }},
            {collection:'dynamic', type:'connectionNode_data', name:'io_midiNoteInput', data:{ 
                x:measurements.drawing.width - 5/1.5, y:27.5 - 15/2, width:5, height:15, cableVersion:2, style:style.connectionNode.data,
            }},
            {collection:'dynamic', type:'connectionNode_voltage', name:'io_gainWobblePeriod', data:{ 
                x:40 + 10/2 - 6, y:measurements.drawing.height - 5/1.5, width:5, height:10, angle:Math.PI/2, cableVersion:2, style:style.connectionNode.voltage,
            }},
            {collection:'dynamic', type:'connectionNode_voltage', name:'io_gainWobbleDepth', data:{ 
                x:40 + 10/2 + 6, y:measurements.drawing.height - 5/1.5, width:5, height:10, angle:Math.PI/2, cableVersion:2, style:style.connectionNode.voltage,
            }},
            {collection:'dynamic', type:'connectionNode_voltage', name:'io_detuneWobblePeriod', data:{ 
                x:72.5 + 10/2 - 6, y:measurements.drawing.height - 5/1.5, width:5, height:10, angle:Math.PI/2, cableVersion:2, style:style.connectionNode.voltage,
            }},
            {collection:'dynamic', type:'connectionNode_voltage', name:'io_detuneWobbleDepth', data:{ 
                x:72.5 + 10/2 + 6, y:measurements.drawing.height - 5/1.5, width:5, height:10, angle:Math.PI/2, cableVersion:2, style:style.connectionNode.voltage,
            }},
            {collection:'dynamic', type:'connectionNode_data', name:'io_periodicWaveType_dataIn', data:{ 
                x:measurements.drawingUnit.width*(14+3/4-1/8 - 1/32), y:measurements.drawingUnit.height*(7+3/4+1/8 - 1/32), width:5, height:15, angle:Math.PI/4, cableVersion:2, style:style.connectionNode.data,
            }},
            {collection:'dynamic', type:'connectionNode_signal', name:'io_periodicWaveType_down', data:{ 
                x:measurements.drawingUnit.width*(14+3/4-1/8 -1.25 - 1/32), y:measurements.drawingUnit.height*(7+3/4+1/8 +1.25 - 1/32), width:5, height:10, angle:Math.PI/4, cableVersion:2, style:style.connectionNode.signal,
            }},
            {collection:'dynamic', type:'connectionNode_signal', name:'io_periodicWaveType_up', data:{ 
                x:measurements.drawingUnit.width*(14+3/4-1/8 +0.9 - 1/32), y:measurements.drawingUnit.height*(7+3/4+1/8 -0.9 - 1/32), width:5, height:10, angle:Math.PI/4, cableVersion:2, style:style.connectionNode.signal,
            }},
            {collection:'dynamic', type:'connectionNode_signal', name:'io_panic', data:{ 
                x:measurements.drawingUnit.width*(14+3/4-1/8 +2.4 - 1/32), y:measurements.drawingUnit.height*(7+3/4+1/8 -2.4 - 1/32), width:5, height:10, angle:Math.PI/4, cableVersion:2, style:style.connectionNode.signal,
            }},


            {collection:'basic', type:'image', name:'backing', 
                data:{ x:-offset/2, y:-offset/2, width:measurements.drawing.width, height:measurements.drawing.height, url:imageStoreURL_localPrefix+'guide.png' }
            },

            {collection:'control', type:'dial_colourWithIndent_continuous',name:'outputGain',data:{
                x:20, y:27.5, radius:27.5/2, startAngle:(3*Math.PI)/4, maxAngle:1.5*Math.PI, arcDistance:1.2, resetValue:0.5, value:0.5,
                style:{ handle:dialColours.outputGain, slot:{r:0,g:0,b:0,a:0}, needle:{r:1,g:1,b:1,a:1} },
            }},
            {collection:'control', type:'dial_colourWithIndent_continuous',name:'attack',data:{
                x:55, y:27.5, radius:27.5/2, startAngle:(3*Math.PI)/4, maxAngle:1.5*Math.PI, arcDistance:1.2, resetValue:0,
                style:{ handle:dialColours.attack, slot:{r:0,g:0,b:0,a:0}, needle:{r:1,g:1,b:1,a:1} },
            }},
            {collection:'control', type:'dial_colourWithIndent_continuous',name:'release',data:{
                x:87.5, y:27.5, radius:27.5/2, startAngle:(3*Math.PI)/4, maxAngle:1.5*Math.PI, value:0, arcDistance:1.2, resetValue:0,
                style:{ handle:dialColours.release, slot:{r:0,g:0,b:0,a:0}, needle:{r:1,g:1,b:1,a:1} },
            }},
            {collection:'control', type:'dial_colourWithIndent_continuous',name:'detune_note',data:{
                x:122.5, y:27.5, radius:27.5/2, startAngle:(3*Math.PI)/4, maxAngle:1.5*Math.PI, value:0.5, arcDistance:1.2, resetValue:0.5,
                style:{ handle:dialColours.detune_note, slot:{r:0,g:0,b:0,a:0}, needle:{r:1,g:1,b:1,a:1} },
            }},
            {collection:'control', type:'dial_colourWithIndent_discrete',name:'detune_octave',data:{
                x:155, y:27.5, radius:27.5/2, startAngle:(3*Math.PI)/4, maxAngle:1.5*Math.PI, value:3, arcDistance:1.2, resetValue:3, optionCount:7,
                style:{ handle:dialColours.detune_octave, slot:{r:0,g:0,b:0,a:0}, needle:{r:1,g:1,b:1,a:1} },
            }},
            {collection:'control', type:'dial_colourWithIndent_discrete',name:'periodicWaveType',data:{
                x:130, y:72.5, radius:32.5/2, startAngle:(3*Math.PI)/4, maxAngle:1.5*Math.PI, value:0, arcDistance:1.2, resetValue:0,
                style:{ handle:dialColours.periodicWaveType, slot:{r:0,g:0,b:0,a:0}, needle:{r:1,g:1,b:1,a:1} },
            }},
            {collection:'control', type:'dial_colourWithIndent_continuous',name:'gainWobblePeriod',data:{
                x:40, y:62.5, radius:25/2, startAngle:(3*Math.PI)/4, maxAngle:1.5*Math.PI, value:0, arcDistance:1.2, resetValue:0,
                style:{ handle:dialColours.gainWobblePeriod, slot:{r:0,g:0,b:0,a:0}, needle:{r:1,g:1,b:1,a:1} },
            }},
            {collection:'control', type:'dial_colourWithIndent_continuous',name:'gainWobbleDepth',data:{
                x:40, y:92.5, radius:25/2, startAngle:(3*Math.PI)/4, maxAngle:1.5*Math.PI, value:0, arcDistance:1.2, resetValue:0,
                style:{ handle:dialColours.gainWobbleDepth, slot:{r:0,g:0,b:0,a:0}, needle:{r:1,g:1,b:1,a:1} },
            }},
            {collection:'control', type:'dial_colourWithIndent_continuous',name:'detuneWobblePeriod',data:{
                x:72.5, y:62.5, radius:25/2, startAngle:(3*Math.PI)/4, maxAngle:1.5*Math.PI, value:0, arcDistance:1.2, resetValue:0,
                style:{ handle:dialColours.detuneWobblePeriod, slot:{r:0,g:0,b:0,a:0}, needle:{r:1,g:1,b:1,a:1} },
            }},
            {collection:'control', type:'dial_colourWithIndent_continuous',name:'detuneWobbleDepth',data:{
                x:72.5, y:92.5, radius:25/2, startAngle:(3*Math.PI)/4, maxAngle:1.5*Math.PI, value:0, arcDistance:1.2, resetValue:0,
                style:{ handle:dialColours.detuneWobbleDepth, slot:{r:0,g:0,b:0,a:0}, needle:{r:1,g:1,b:1,a:1} },
            }},

            {collection:'control', type:'button_circle', name:'panicButton', data:{ 
                x:162.5, y:52.5, r:15/2, style:{
                    background__up__colour:{r:0.75,g:0.75,b:0.75,a:1},
                    background__hover__colour:{r:0.85,g:0.85,b:0.85,a:1},
                    background__press__colour:{r:0.5,g:0.5,b:0.5,a:1},
                    background__hover_press__colour:{r:0.5,g:0.5,b:0.5,a:1},
                },
            }},
        ]
    };
    //main object
        var object = _canvas_.interface.unit.builder(this.ruler,design);

    //import/export
        object.exportData = function(){
            return {
                gain: object.elements.dial_colourWithIndent_continuous.outputGain.get(),
                attack: object.elements.dial_colourWithIndent_continuous.attack.get()*10,
                release: object.elements.dial_colourWithIndent_continuous.release.get()*10,
                detune: 100*((object.elements.dial_colourWithIndent_continuous.detune_note.get()*2)-1),
                octave: object.elements.dial_colourWithIndent_discrete.detune_octave.get()-3,
                waveType: ['sine','triangle','square','sawtooth','custom'][object.elements.dial_colourWithIndent_discrete.periodicWaveType.get()],
                gainWobble:{
                    rate: object.elements.dial_colourWithIndent_continuous.gainWobblePeriod.get()*100,
                    depth: object.elements.dial_colourWithIndent_continuous.gainWobbleDepth.get()
                },
                detuneWobble:{
                    rate: object.elements.dial_colourWithIndent_continuous.detuneWobblePeriod.get()*100,
                    depth: object.elements.dial_colourWithIndent_continuous.detuneWobbleDepth.get()
                },
            };
        };
        object.importData = function(data){
            if(data == undefined){return;}

            object.elements.dial_colourWithIndent_continuous.outputGain.set(data.gain);
            object.elements.dial_colourWithIndent_continuous.attack.set(data.attack/10);
            object.elements.dial_colourWithIndent_continuous.release.set(data.release/10);
            object.elements.dial_colourWithIndent_continuous.detune_note.set( (1+(data.detune/100))/2 );
            object.elements.dial_colourWithIndent_discrete.detune_octave.set(data.octave+3);
            object.elements.dial_colourWithIndent_discrete.periodicWaveType.set( ['sine','triangle','square','sawtooth','custom'].indexOf(data.waveType) );
            object.elements.dial_colourWithIndent_continuous.gainWobblePeriod.set(data.gainWobble.rate/100);
            object.elements.dial_colourWithIndent_continuous.gainWobbleDepth.set(data.gainWobble.depth);
            object.elements.dial_colourWithIndent_continuous.detuneWobblePeriod.set(data.detuneWobble.rate/100);
            object.elements.dial_colourWithIndent_continuous.detuneWobbleDepth.set(data.detuneWobble.depth);
        };

    //circuitry
        var attributes = {
            detuneLimits: {min:-100, max:100}
        };
        object.__synthesizer = new _canvas_.interface.circuit.synthesizer(_canvas_.library.audio.context);
        object.__synthesizer.out().connect( object.elements.connectionNode_audio.io_output.in() );

    //wiring
        object.elements.dial_colourWithIndent_continuous.outputGain.onchange = function(value){ object.__synthesizer.gain( value ); };
        object.elements.dial_colourWithIndent_continuous.attack.onchange = function(value){ object.__synthesizer.attack( value ); };
        object.elements.dial_colourWithIndent_continuous.release.onchange = function(value){ object.__synthesizer.release( value ); };
        object.elements.dial_colourWithIndent_continuous.detune_note.onchange = function(value){ object.__synthesizer.detune( value*(attributes.detuneLimits.max-attributes.detuneLimits.min) + attributes.detuneLimits.min ); };
        object.elements.dial_colourWithIndent_discrete.detune_octave.onchange = function(value){ object.__synthesizer.octave(value-3); };
        object.elements.dial_colourWithIndent_discrete.periodicWaveType.onchange = function(value){ object.__synthesizer.waveType(['sine','triangle','square','sawtooth','custom'][value]); };
        object.elements.dial_colourWithIndent_continuous.gainWobblePeriod.onchange = function(value){ object.__synthesizer.gainWobblePeriod( (1-value)<0.01?0.011:(1-value) ); };
        object.elements.dial_colourWithIndent_continuous.gainWobbleDepth.onchange = function(value){ object.__synthesizer.gainWobbleDepth(value);};
        object.elements.dial_colourWithIndent_continuous.detuneWobblePeriod.onchange = function(value){ object.__synthesizer.detuneWobblePeriod( (1-value)<0.01?0.011:(1-value) ); };
        object.elements.dial_colourWithIndent_continuous.detuneWobbleDepth.onchange = function(value){ object.__synthesizer.detuneWobbleDepth(value*100); };
        object.elements.button_circle.panicButton.onpress = function(){object.__synthesizer.panic(); };

        object.elements.connectionNode_data.io_midiNoteInput.onreceive = function(address,data){
            if(address != 'midinumber'){return;}
            object.__synthesizer.perform(data);
        };
        object.elements.connectionNode_data.io_periodicWaveType_dataIn.onreceive = function(address,data){
            if(address != 'periodicWave'){return;}
            object.__synthesizer.periodicWave(data);
        };
        object.elements.connectionNode_voltage.io_outputGain.onchange = function(value){
            object.elements.dial_colourWithIndent_continuous.outputGain.set(value);
        };
        object.elements.connectionNode_voltage.io_attack.onchange = function(value){
            object.elements.dial_colourWithIndent_continuous.attack.set(value);
        };
        object.elements.connectionNode_voltage.io_release.onchange = function(value){
            object.elements.dial_colourWithIndent_continuous.release.set(value);
        };
        object.elements.connectionNode_voltage.io_detune_note.onchange = function(value){
            object.elements.dial_colourWithIndent_continuous.detune_note.set(value);
        };
        object.elements.connectionNode_signal.io_detune_octave_down.onchange = function(value){
            if(!value){return;}
            object.elements.dial_colourWithIndent_discrete.detune_octave.set(
                object.elements.dial_colourWithIndent_discrete.detune_octave.get() - 1
            );
        };
        object.elements.connectionNode_signal.io_detune_octave_up.onchange = function(value){
            if(!value){return;}
            object.elements.dial_colourWithIndent_discrete.detune_octave.set(
                object.elements.dial_colourWithIndent_discrete.detune_octave.get() + 1
            );
        };
        object.elements.connectionNode_voltage.io_gainWobblePeriod.onchange = function(value){
            object.elements.dial_colourWithIndent_continuous.gainWobblePeriod.set(value);
        };
        object.elements.connectionNode_voltage.io_gainWobbleDepth.onchange = function(value){
            object.elements.dial_colourWithIndent_continuous.gainWobbleDepth.set(value);
        };
        object.elements.connectionNode_voltage.io_detuneWobblePeriod.onchange = function(value){
            object.elements.dial_colourWithIndent_continuous.detuneWobblePeriod.set(value);
        };
        object.elements.connectionNode_voltage.io_detuneWobbleDepth.onchange = function(value){
            object.elements.dial_colourWithIndent_continuous.detuneWobbleDepth.set(value);
        };
        object.elements.connectionNode_signal.io_periodicWaveType_down.onchange = function(value){
            if(!value){return;}
            object.elements.dial_colourWithIndent_discrete.periodicWaveType.set(
                object.elements.dial_colourWithIndent_discrete.periodicWaveType.get() - 1
            );
        };
        object.elements.connectionNode_signal.io_periodicWaveType_up.onchange = function(value){
            if(!value){return;}
            object.elements.dial_colourWithIndent_discrete.periodicWaveType.set(
                object.elements.dial_colourWithIndent_discrete.periodicWaveType.get() + 1
            );
        };
        object.elements.connectionNode_signal.io_panic.onchange = function(value){
            if(value){
                object.elements.button_circle.panicButton.press();
            }else{
                object.elements.button_circle.panicButton.release();
            }
        };

    //interface
        object.i = {
            periodicWave:function(data){object.__synthesizer.periodicWave(data);},
            midiNote:function(data){object.__synthesizer.perform(data);},

            gain:function(value){object.elements.dial_colourWithIndent_continuous.outputGain.set(value);},
            attack:function(value){object.elements.dial_colourWithIndent_continuous.attack.set(value);},
            release:function(value){object.elements.dial_colourWithIndent_continuous.release.set(value);},
            detune:function(value){object.elements.dial_colourWithIndent_continuous.detune_note.set(value);},
            octave:function(value){object.elements.dial_colourWithIndent_discrete.detune_octave.set(value);},
            waveType:function(value){object.elements.dial_colourWithIndent_discrete.periodicWaveType.set(value);},
            gainWobblePeriod:function(value){object.elements.dial_colourWithIndent_continuous.gainWobblePeriod.set(value);},
            gainWobbleDepth:function(value){object.elements.dial_colourWithIndent_continuous.gainWobbleDepth.set(value);},
            detuneWobblePeriod:function(value){object.elements.dial_colourWithIndent_continuous.detuneWobblePeriod.set(value);},
            detuneWobbleDepth:function(value){object.elements.dial_colourWithIndent_continuous.detuneWobbleDepth.set(value);},
        };
        
    return object;
};



this.basic_synthesizer.metadata = {
    name:'Basic Synthesizer',
    category:'synthesizers',
    helpURL:'/help/units/beta/basic_synthesizer/'
};