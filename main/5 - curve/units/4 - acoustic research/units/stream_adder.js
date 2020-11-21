this['stream_adder'] = function(name,x,y,angle){
    //style data
        const unitStyle = new function(){
            //image store location URL
                this.imageStoreURL_commonPrefix = imageStoreURL+'common/';
                this.imageStoreURL_localPrefix = imageStoreURL+'stream_adder/';

            //calculation of measurements
                const div = 10;
                const measurement = { 
                    file: { width:775, height:600 },
                    design: { width:7.75, height:6 },
                };

                this.offset = {x:0,y:0};
                this.drawingValue = { 
                    width: measurement.file.width/div, 
                    height: measurement.file.height/div
                };
        };

    //main object creation
        const object = _canvas_.interface.unit.builder({
            name:name,
            model:'stream_adder',
            x:x, y:y, angle:angle,
            space:[
                {x:-unitStyle.offset.x,                               y:-unitStyle.offset.y},
                {x:unitStyle.drawingValue.width - unitStyle.offset.x, y:-unitStyle.offset.y},
                {x:unitStyle.drawingValue.width - unitStyle.offset.x, y:unitStyle.drawingValue.height - unitStyle.offset.y},
                {x:-unitStyle.offset.x,                               y:unitStyle.drawingValue.height - unitStyle.offset.y},
            ],
            elements:[
                {collection:'dynamic', type:'connectionNode_audio', name:'input_1', data:{ 
                    x:unitStyle.drawingValue.width, y:unitStyle.drawingValue.height*0.75 - 15/2, width:5, height:15, angle:0, isAudioOutput:false, cableVersion:2, style:style.connectionNode.audio
                }},
                {collection:'dynamic', type:'connectionNode_audio', name:'input_2', data:{ 
                    x:unitStyle.drawingValue.width, y:unitStyle.drawingValue.height*0.25 - 15/2, width:5, height:15, angle:0, isAudioOutput:false, cableVersion:2, style:style.connectionNode.audio
                }},
                {collection:'dynamic', type:'connectionNode_voltage', name:'voltage_mix', data:{ 
                    x:30, y:0, width:5, height:10, angle:-Math.PI/2, cableVersion:2, style:style.connectionNode.voltage,
                }},
                {collection:'dynamic', type:'connectionNode_audio', name:'control', data:{ 
                    x:42.5, y:unitStyle.drawingValue.height, width:5, height:15, angle:Math.PI/2, isAudioOutput:false, cableVersion:2, style:style.connectionNode.audio
                }},
                {collection:'dynamic', type:'connectionNode_audio', name:'output', data:{ 
                    x:0, y:unitStyle.drawingValue.height/2 + 15/2, width:5, height:15, angle:Math.PI, isAudioOutput:true, cableVersion:2, style:style.connectionNode.audio
                }},
                
                {collection:'basic', type:'image', name:'backing', 
                    data:{ x:-unitStyle.offset.x, y:-unitStyle.offset.y, width:unitStyle.drawingValue.width, height:unitStyle.drawingValue.height, url:unitStyle.imageStoreURL_localPrefix+'backing.png' }
                },

                {collection:'control', type:'dial_continuous_image', name:'mix', data:{
                    x:35, y:30, radius:30/2, startAngle:(Math.PI)/4, maxAngle:1.5*Math.PI, value:0.5, resetValue:0.5, arcDistance:1.2,
                    handleURL:unitStyle.imageStoreURL_commonPrefix+'dial_large.png',
                }},
                {collection:'control', type:'checkbox_image', name:'invert', data:{
                    x:5, y:20, width:10, height:20,
                    uncheckURL:unitStyle.imageStoreURL_commonPrefix+'switch_large_up.png', 
                    checkURL:unitStyle.imageStoreURL_commonPrefix+'switch_large_down.png',
                }},
            ]
        });

    //circuitry
        const state = {
            mix:0.5,
            mode:false,
        };
        const streamAdder = new _canvas_.interface.circuit.streamAdder(_canvas_.library.audio.context);

    //wiring
        //hid
            object.elements.dial_continuous_image.mix.onchange = function(value){
                state.mix = value;
                streamAdder.mix( value );
            };
            object.elements.checkbox_image.invert.onchange = function(value){
                state.mode = value;
                streamAdder.mode(value);
            };
        //io
            object.io.audio.input_1.audioNode = streamAdder.in_1();
            object.io.audio.input_2.audioNode = streamAdder.in_2();
            object.io.audio.control.audioNode = streamAdder.mixControl();
            object.io.voltage.voltage_mix.onchange = function(value){
                object.elements.dial_continuous_image.mix.set( (value+1)/2 );
            };
            object.io.audio.output.audioNode = streamAdder.out();

    //interface
        object.i = {
            mix:function(a){
                if(a == undefined){ return state.mix; }
                object.elements.dial_continuous_image.mix.set(a);
            },
        };

    //import/export
        object.exportData = function(){
            return JSON.parse(JSON.stringify(state));
        };
        object.importData = function(data){
            object.elements.dial_continuous_image.mix.set( data.mix );
        };

    //oncreate/ondelete
        object.ondelete = function(){
            streamAdder.shutdown();
        };
        
    return object;
};
this['stream_adder'].metadata = {
    name:'Stream Adder',
    category:'',
    helpURL:''
};