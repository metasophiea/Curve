this['test_b'] = function(name,x,y,angle){
    //main object creation
        const object = _canvas_.interface.unit.builder({
            name:name,
            model:'test_b',
            x:x, y:y, angle:angle,
            space:[
                {x:0, y:0},
                {x:100, y:0},
                {x:100, y:100},
                {x:0, y:100},
            ],
            elements:[
                // {collection:'dynamic', type:'connectionNode_audio', name:'input_1', data:{ 
                //     x:100, y:40, width:5, height:15, angle:0, isAudioOutput:false, cableVersion:2, style:style.connectionNode.audio
                // }},
                // {collection:'dynamic', type:'connectionNode_audio', name:'input_2', data:{ 
                //     x:100, y:60, width:5, height:15, angle:0, isAudioOutput:false, cableVersion:2, style:style.connectionNode.audio
                // }},
                // {collection:'dynamic', type:'connectionNode_audio', name:'input_3', data:{ 
                //     x:100, y:80, width:5, height:15, angle:0, isAudioOutput:false, cableVersion:2, style:style.connectionNode.audio
                // }},
                {collection:'dynamic', type:'connectionNode_audio', name:'output', data:{ 
                    x:0, y:55, width:5, height:15, angle:Math.PI, isAudioOutput:true, cableVersion:2, style:style.connectionNode.audio
                }},
                
                {collection:'basic', type:'rectangle', name:'backing', data:{ x:0, y:0, width:100, height:100, colour:{r:200/255,g:200/255,b:200/255,a:1} }},

                {collection:'control', type:'dial_continuous', name:'frequency', data:{
                    x:20, y:20, radius:15/2, startAngle:(3*Math.PI)/4, maxAngle:1.5*Math.PI, value:0.5, arcDistance:1.2, optionCount:3,
                }},
                {collection:'control', type:'dial_continuous', name:'harmonic_mux_1', data:{
                    x:20+20, y:20, radius:15/2, startAngle:(3*Math.PI)/4, maxAngle:1.5*Math.PI, value:1/4, arcDistance:1.2, optionCount:3,
                }},
                {collection:'control', type:'dial_continuous', name:'harmonic_mux_2', data:{
                    x:40+20, y:20, radius:15/2, startAngle:(3*Math.PI)/4, maxAngle:1.5*Math.PI, value:1/4, arcDistance:1.2,
                }},
                {collection:'control', type:'dial_continuous', name:'harmonic_power_1', data:{
                    x:20+20, y:40, radius:15/2, startAngle:(3*Math.PI)/4, maxAngle:1.5*Math.PI, value:1/4, arcDistance:1.2,
                }},
                {collection:'control', type:'dial_continuous', name:'harmonic_power_2', data:{
                    x:40+20, y:40, radius:15/2, startAngle:(3*Math.PI)/4, maxAngle:1.5*Math.PI, value:1/4, arcDistance:1.2,
                }},
            ]
        });

    //circuitry
        OSC = new _canvas_.library.audio.audioWorklet.workshop.only_js.osc_2(_canvas_.library.audio.context);

    //wiring
        //hid
            object.elements.dial_continuous.frequency.onchange = function(value){
                _canvas_.library.audio.changeAudioParam(_canvas_.library.audio.context, OSC.frequency, value*880, 0.01, 'instant', true);
            };
            object.elements.dial_continuous.harmonic_mux_1.onchange = function(value){
                _canvas_.library.audio.changeAudioParam(_canvas_.library.audio.context, OSC.harmonic_mux_1, value*4, 0.01, 'instant', true);
            };
            object.elements.dial_continuous.harmonic_mux_2.onchange = function(value){
                _canvas_.library.audio.changeAudioParam(_canvas_.library.audio.context, OSC.harmonic_mux_2, value*4, 0.01, 'instant', true);
            };
            object.elements.dial_continuous.harmonic_power_1.onchange = function(value){
                _canvas_.library.audio.changeAudioParam(_canvas_.library.audio.context, OSC.harmonic_power_1, value*4, 0.01, 'instant', true);
            };
            object.elements.dial_continuous.harmonic_power_2.onchange = function(value){
                _canvas_.library.audio.changeAudioParam(_canvas_.library.audio.context, OSC.harmonic_power_2, value*4, 0.01, 'instant', true);
            };

        //keycapture
        //io
            // object.io.audio.input_1.audioNode = OSC.gainControl();
            // object.io.audio.input_2.audioNode = OSC.detuneControl();
            // object.io.audio.input_3.audioNode = OSC.dutyCycleControl();
            object.io.audio.output.audioNode = OSC;

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
this['test_b'].metadata = {
    name:'test b',
    category:'',
    helpURL:''
};