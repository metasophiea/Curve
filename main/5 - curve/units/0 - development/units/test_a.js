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
                {collection:'dynamic', type:'connectionNode_data', name:'input_note', data:{ 
                    x:100, y:20, width:5, height:15, angle:0, cableVersion:2, style:style.connectionNode.data
                }},
                {collection:'dynamic', type:'connectionNode_audio', name:'input_gain', data:{ 
                    x:100, y:40, width:5, height:15, angle:0, isAudioOutput:false, cableVersion:2, style:style.connectionNode.audio
                }},
                {collection:'dynamic', type:'connectionNode_audio', name:'input_detune', data:{ 
                    x:100, y:60, width:5, height:15, angle:0, isAudioOutput:false, cableVersion:2, style:style.connectionNode.audio
                }},
                {collection:'dynamic', type:'connectionNode_audio', name:'input_dutyCycle', data:{ 
                    x:100, y:80, width:5, height:15, angle:0, isAudioOutput:false, cableVersion:2, style:style.connectionNode.audio
                }},
                {collection:'dynamic', type:'connectionNode_audio', name:'output', data:{ 
                    x:0, y:55, width:5, height:15, angle:Math.PI, isAudioOutput:true, cableVersion:2, style:style.connectionNode.audio
                }},
                
                {collection:'basic', type:'rectangle', name:'backing', data:{ x:0, y:0, width:100, height:100, colour:{r:200/255,g:200/255,b:200/255,a:1} }},

                {collection:'control', type:'dial_discrete', name:'waveform', data:{
                    x:20, y:20, radius:15/2, startAngle:(5/4)*Math.PI, maxAngle:(2/4)*Math.PI, value:0, optionCount:3,
                }},
                {collection:'control', type:'dial_continuous', name:'dial_gain', data:{
                    x:60, y:40+7.5, radius:15/2, startAngle:(3*Math.PI)/4, maxAngle:1.5*Math.PI, value:0.5,
                }},
                {collection:'control', type:'dial_continuous', name:'dial_detune', data:{
                    x:60, y:60+7.5, radius:15/2, startAngle:(3*Math.PI)/4, maxAngle:1.5*Math.PI, value:0.5,
                }},
                {collection:'control', type:'dial_continuous', name:'dial_dutyCycle', data:{
                    x:60, y:80+7.5, radius:15/2, startAngle:(3*Math.PI)/4, maxAngle:1.5*Math.PI, value:0.5,
                }},

                {collection:'control', type:'checkbox_circle', name:'checkbox_gain', data:{
                    x:80, y:40+7.5, radius:15/2, style:{backing:{r:1,g:1,b:1,a:1}},
                }},
                {collection:'control', type:'checkbox_circle', name:'checkbox_detune', data:{
                    x:80, y:60+7.5, radius:15/2, style:{backing:{r:1,g:1,b:1,a:1}},
                }},
                {collection:'control', type:'checkbox_circle', name:'checkbox_dutyCycle', data:{
                    x:80, y:80+7.5, radius:15/2, style:{backing:{r:1,g:1,b:1,a:1}},
                }},
            ]
        });

    //circuitry
        const gain_input_node = new _canvas_.library.audio.audioWorklet.production.only_js.nothing(_canvas_.library.audio.context);
        const detune_input_node = new _canvas_.library.audio.audioWorklet.production.only_js.nothing(_canvas_.library.audio.context);
        const dutyCycle_input_node = new _canvas_.library.audio.audioWorklet.production.only_js.nothing(_canvas_.library.audio.context);
        const OSC = new _canvas_.library.audio.audioWorklet.workshop.wasm.integrated_synthesizer_type_1(_canvas_.library.audio.context);

        gain_input_node.connect(OSC, undefined, 0);
        detune_input_node.connect(OSC, undefined, 1);
        dutyCycle_input_node.connect(OSC, undefined, 2);

    //wiring
        //hid
            object.elements.dial_discrete.waveform.onchange = function(value){
                OSC.waveform = ['sine', 'square', 'triangle'][value];
            };

            object.elements.dial_continuous.dial_gain.onchange = function(value){
                _canvas_.library.audio.changeAudioParam( _canvas_.library.audio.context, OSC.gain, value, 0, 'instant', true );
            };
            object.elements.dial_continuous.dial_detune.onchange = function(value){
                _canvas_.library.audio.changeAudioParam( _canvas_.library.audio.context, OSC.detune, (2*value)-1, 0, 'instant', true );
            };
            object.elements.dial_continuous.dial_dutyCycle.onchange = function(value){
                _canvas_.library.audio.changeAudioParam( _canvas_.library.audio.context, OSC.dutyCycle, value, 0, 'instant', true );
            };

            object.elements.checkbox_circle.checkbox_gain.onchange = function(value){
                OSC.gain_useControl = value;
            };
            object.elements.checkbox_circle.checkbox_detune.onchange = function(value){
                OSC.detune_useControl = value;
            };
            object.elements.checkbox_circle.checkbox_dutyCycle.onchange = function(value){
                OSC.dutyCycle_useControl = value;
            };

        //keycapture
        //io
            object.io.data.input_note.onreceive = function(address,data){
                if(address != 'midinumber'){return;}
                OSC.perform(
                    _canvas_.library.audio.num2freq(data.num), 
                    data.velocity
                );
            };

            object.io.audio.input_gain.audioNode = gain_input_node;
            object.io.audio.input_detune.audioNode = detune_input_node;
            object.io.audio.input_dutyCycle.audioNode = dutyCycle_input_node;
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
this['test_a'].metadata = {
    name:'test a',
    category:'',
    helpURL:''
};