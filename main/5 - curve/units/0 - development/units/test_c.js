this['test_c'] = function(name,x,y,angle){
    //main object creation
        const object = _canvas_.interface.unit.builder({
            name:name,
            model:'test_c',
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
                {collection:'dynamic', type:'connectionNode_audio', name:'output', data:{ 
                    x:0, y:55, width:5, height:15, angle:Math.PI, isAudioOutput:true, cableVersion:2, style:style.connectionNode.audio
                }},
                
                {collection:'basic', type:'rectangle', name:'backing', data:{ x:0, y:0, width:100, height:100, colour:{r:200/255,g:200/255,b:200/255,a:1} }},
            ]
        });

    //circuitry
        const N = _canvas_.library.audio.context.createAnalyser(); //new _canvas_.library.audio.audioWorklet.nothing(_canvas_.library.audio.context);

    //wiring
        //hid
        //keycapture
        //io
            object.io.audio.input_1.audioNode = N;
            object.io.audio.output.audioNode = N;

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
this['test_c'].metadata = {
    name:'test c',
    category:'',
    helpURL:''
};