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
                {collection:'dynamic', type:'connectionNode_audio', name:'output', data:{ 
                    x:0, y:55, width:5, height:15, angle:Math.PI, isAudioOutput:true, cableVersion:2, style:style.connectionNode.audio
                }},
                
                {collection:'basic', type:'rectangle', name:'backing', data:{ x:0, y:0, width:100, height:100, colour:{r:200/255,g:200/255,b:200/255,a:1} }},

                {collection:'control', type:'dial_discrete', name:'a', data:{
                    x:20, y:20, radius:15/2, startAngle:(3*Math.PI)/4, maxAngle:1.5*Math.PI, value:0, arcDistance:1.2, optionCount:2,
                }},
                {collection:'control', type:'dial_discrete', name:'b', data:{
                    x:40, y:20, radius:15/2, startAngle:(3*Math.PI)/4, maxAngle:1.5*Math.PI, value:10, arcDistance:1.2, optionCount:21,
                }},
                {collection:'control', type:'dial_continuous', name:'c', data:{
                    x:60, y:20, radius:15/2, startAngle:(3*Math.PI)/4, maxAngle:1.5*Math.PI, value:0, arcDistance:1.2,
                }},
            ]
        });

    //circuitry
        const AM = new _canvas_.interface.circuit.amplitudeModifier(_canvas_.library.audio.context);

    //wiring
        //hid
            object.elements.dial_discrete.a.onchange = function(value){
                AM.invert(value!=0);
            };
            object.elements.dial_discrete.b.onchange = function(value){
                AM.offset(value-10);
            };
            object.elements.dial_continuous.c.onchange = function(value){
                AM.divisor(value+1);
            };

        //keycapture
        //io
            object.io.audio.input_1.out().connect( AM.in() );
            AM.out().connect(object.io.audio.output.in());

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