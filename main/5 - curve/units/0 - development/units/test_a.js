this['test_a'] = function(name,x,y,angle){
    //main object creation
        const object = _canvas_.interface.unit.builder({
            name:name,
            model:'test_a',
            x:x, y:y, angle:angle,
            space:[
                {x:0, y:0},
                {x:100, y:0},
                {x:100, y:100},
                {x:0, y:100},
            ],
            elements:[
                {collection:'dynamic', type:'connectionNode_audio', name:'input_1', data:{ 
                    x:100, y:40, width:5, height:15, angle:0, isAudioOutput:false, cableVersion:2, style:style.connectionNode.audio
                }},
                {collection:'dynamic', type:'connectionNode_audio', name:'input_2', data:{ 
                    x:100, y:60, width:5, height:15, angle:0, isAudioOutput:false, cableVersion:2, style:style.connectionNode.audio
                }},
                {collection:'dynamic', type:'connectionNode_audio', name:'input_3', data:{ 
                    x:100, y:80, width:5, height:15, angle:0, isAudioOutput:false, cableVersion:2, style:style.connectionNode.audio
                }},
                {collection:'dynamic', type:'connectionNode_audio', name:'output', data:{ 
                    x:0, y:55, width:5, height:15, angle:Math.PI, isAudioOutput:true, cableVersion:2, style:style.connectionNode.audio
                }},
                
                {collection:'basic', type:'rectangle', name:'backing', data:{ x:0, y:0, width:100, height:100, colour:{r:200/255,g:200/255,b:200/255,a:1} }},

                {collection:'control', type:'dial_discrete', name:'waveform', data:{
                    x:20, y:20, radius:15/2, startAngle:(3*Math.PI)/4, maxAngle:1.5*Math.PI, value:0, arcDistance:1.2, optionCount:3,
                }},
                {collection:'control', type:'dial_continuous', name:'frequency', data:{
                    x:40, y:20, radius:15/2, startAngle:(3*Math.PI)/4, maxAngle:1.5*Math.PI, value:0.5, arcDistance:1.2,
                }},
                {collection:'control', type:'dial_continuous', name:'gain', data:{
                    x:60, y:20, radius:15/2, startAngle:(3*Math.PI)/4, maxAngle:1.5*Math.PI, value:1, arcDistance:1.2,
                }},
                {collection:'control', type:'dial_continuous', name:'detune', data:{
                    x:80, y:20, radius:15/2, startAngle:(3*Math.PI)/4, maxAngle:1.5*Math.PI, value:0.5, arcDistance:1.2,
                }},
                {collection:'control', type:'dial_continuous', name:'dutyCycle', data:{
                    x:100, y:20, radius:15/2, startAngle:(3*Math.PI)/4, maxAngle:1.5*Math.PI, value:0.5, arcDistance:1.2,
                }},
                {collection:'control', type:'dial_discrete', name:'gainMode', data:{
                    x:20, y:40, radius:15/2, startAngle:(3*Math.PI)/4, maxAngle:1.5*Math.PI, value:0, arcDistance:1.2, optionCount:2,
                }},
                {collection:'control', type:'dial_discrete', name:'detuneMode', data:{
                    x:40, y:40, radius:15/2, startAngle:(3*Math.PI)/4, maxAngle:1.5*Math.PI, value:0, arcDistance:1.2, optionCount:2,
                }},
                {collection:'control', type:'dial_discrete', name:'dutyCycleMode', data:{
                    x:60, y:40, radius:15/2, startAngle:(3*Math.PI)/4, maxAngle:1.5*Math.PI, value:0, arcDistance:1.2, optionCount:2,
                }},
            ]
        });

    //circuitry
        const OSC = new _canvas_.interface.circuit.oscillator(_canvas_.library.audio.context);

    //wiring
        //hid
            object.elements.dial_discrete.waveform.onchange = function(value){
                OSC.waveform(value);
            };
            object.elements.dial_continuous.frequency.onchange = function(value){
                OSC.frequency( value*880 );
            };
            object.elements.dial_continuous.gain.onchange = function(value){
                OSC.gain( value*2 - 1 );
            };
            object.elements.dial_continuous.detune.onchange = function(value){
                OSC.detune( value*2 - 1 );
            };
            object.elements.dial_continuous.dutyCycle.onchange = function(value){
                OSC.dutyCycle( value );
            };
            object.elements.dial_discrete.gainMode.onchange = function(value){
                OSC.gainMode(value);
            };
            object.elements.dial_discrete.detuneMode.onchange = function(value){
                OSC.detuneMode(value);
            };
            object.elements.dial_discrete.dutyCycleMode.onchange = function(value){
                OSC.dutyCycleMode(value);
            };

        //keycapture
        //io
            object.io.audio.input_1.audioNode = OSC.gainControl();
            object.io.audio.input_2.audioNode = OSC.detuneControl();
            object.io.audio.input_3.audioNode = OSC.dutyCycleControl();
            object.io.audio.output.audioNode = OSC.out();

    //interface
        object.i = {
        };

    //import/export
        object.exportData = function(){
        };
        object.importData = function(data){
        };

    //setup/tearDown
        object.oncreate = function(){
        };
        object.ondelete = function(){
        };

    return object;
};
this['test_a'].metadata = {
    name:'test a',
    category:'',
    helpURL:''
};