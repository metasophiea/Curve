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
                {collection:'dynamic', type:'connectionNode_audio', name:'input', data:{ 
                    x:100, y:40, width:5, height:15, angle:0, isAudioOutput:false, cableVersion:2, style:style.connectionNode.audio
                }},
                {collection:'dynamic', type:'connectionNode_audio', name:'output', data:{ 
                    x:0, y:55, width:5, height:15, angle:Math.PI, isAudioOutput:true, cableVersion:2, style:style.connectionNode.audio
                }},
                {collection:'basic', type:'rectangle', name:'backing', data:{ x:0, y:0, width:100, height:100, colour:{r:200/255,g:200/255,b:200/255,a:1} }},

                {collection:'control', type:'dial_discrete', name:'amplitudeResolution', data:{
                    x:20, y:20, radius:15/2, startAngle:(3*Math.PI)/4, maxAngle:1.5*Math.PI, value:10, arcDistance:1.2, optionCount:20,
                }},
                {collection:'control', type:'dial_discrete', name:'sampleFrequency', data:{
                    x:40, y:20, radius:15/2, startAngle:(3*Math.PI)/4, maxAngle:1.5*Math.PI, value:0, arcDistance:1.2, optionCount:7,
                }},
            ]
        });

    //circuitry
        const bitcrusher = new _canvas_.interface.circuit.bitcrusher(_canvas_.library.audio.context);

    //wiring
        //hid
            object.elements.dial_discrete.amplitudeResolution.onchange = function(value){
                bitcrusher.amplitudeResolution(value+1);
            };
            object.elements.dial_discrete.sampleFrequency.onchange = function(value){
                bitcrusher.sampleFrequency(Math.pow(2,value)+1);
            };
            
        //keycapture
        //io
            object.io.audio.input.out().connect(bitcrusher.in());
            bitcrusher.out().connect(object.io.audio.output.in());

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
    name:'test_a',
    category:'',
    helpURL:''
};














// _canvas_.library.audio.context.audioWorklet.addModule(window.URL.createObjectURL(blob)).then( () => {
//     const osc = new OscillatorNode(_canvas_.library.audio.context);
//     const bitcrusher = new AudioWorkletNode(_canvas_.library.audio.context, 'bitcrusher');
//     osc.connect(bitcrusher).connect(_canvas_.library.audio.destination);
//     osc.start();

//     const notes = [261.6, 277.2, 293.7, 311.1, 329.6, 349.2, 370.0, 392.0, 415.3, 440.0, 466.2, 493.9];
//     let step = 0;
//     setInterval(() => {
//         osc.frequency.setTargetAtTime(notes[step], _canvas_.library.audio.context.currentTime, 0);
//         step++; if(step == notes.length){step = 0;}
//     },250);



//     const paramBitDepth = bitcrusher.parameters.get('bitDepth');
//     const paramReduction = bitcrusher.parameters.get('frequencyReduction');
// });
