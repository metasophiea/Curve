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
                {collection:'dynamic', type:'connectionNode_audio', name:'input', data:{ 
                    x:100, y:40, width:5, height:15, angle:0, isAudioOutput:false, cableVersion:2, style:style.connectionNode.audio
                }},
                {collection:'dynamic', type:'connectionNode_audio', name:'output', data:{ 
                    x:0, y:55, width:5, height:15, angle:Math.PI, isAudioOutput:true, cableVersion:2, style:style.connectionNode.audio
                }},
                
                {collection:'basic', type:'rectangle', name:'backing', data:{ x:0, y:0, width:100, height:100, colour:{r:200/255,g:200/255,b:200/255,a:1} }},

                {collection:'control', type:'dial_discrete', name:'a', data:{
                    x:20, y:20, radius:15/2, startAngle:(3*Math.PI)/4, maxAngle:1.5*Math.PI, value:9, arcDistance:1.2, optionCount:128,
                }},
                {collection:'control', type:'dial_discrete', name:'b', data:{
                    x:40, y:20, radius:15/2, startAngle:(3*Math.PI)/4, maxAngle:1.5*Math.PI, value:4, arcDistance:1.2, optionCount:7,
                }},
            ]
        });

    //circuitry
        const BC = new _canvas_.interface.circuit.bitcrusher(_canvas_.library.audio.context);

    //wiring
        //hid
            object.elements.dial_discrete.a.onchange = function(value){
                BC.amplitudeResolution(value+1);
            };
            object.elements.dial_discrete.b.onchange = function(value){
                BC.sampleFrequency(Math.pow(2,value));
            };

        //keycapture
        //io
            object.io.audio.input.out().connect( BC.in() );
            BC.out().connect(object.io.audio.output.in());

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
    name:'bitcrusher',
    category:'',
    helpURL:''
};