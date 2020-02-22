this['lag_processor'] = function(name,x,y,angle){
    //style data
        const unitStyle = new function(){
            //image store location URL
                this.imageStoreURL_commonPrefix = imageStoreURL+'common/';
                this.imageStoreURL_localPrefix = imageStoreURL+'lag_processor/';

            //calculation of measurements
                const div = 10;
                const measurement = { 
                    file: { width:750, height:600 },
                    design: { width:7.5, height:6 },
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
            model:'lag_processor',
            x:x, y:y, angle:angle,
            space:[
                {x:-unitStyle.offset.x,                               y:-unitStyle.offset.y},
                {x:unitStyle.drawingValue.width - unitStyle.offset.x, y:-unitStyle.offset.y},
                {x:unitStyle.drawingValue.width - unitStyle.offset.x, y:unitStyle.drawingValue.height - unitStyle.offset.y},
                {x:-unitStyle.offset.x,                               y:unitStyle.drawingValue.height - unitStyle.offset.y},
            ],
            elements:[
                {collection:'dynamic', type:'connectionNode_audio', name:'input', data:{ 
                    x:unitStyle.drawingValue.width, y:unitStyle.drawingValue.height/2 - 15/2, width:5, height:15, angle:0, isAudioOutput:false, cableVersion:2, style:style.connectionNode.audio
                }},
                {collection:'dynamic', type:'connectionNode_audio', name:'output', data:{ 
                    x:0, y:unitStyle.drawingValue.height/2 + 15/2, width:5, height:15, angle:Math.PI, isAudioOutput:true, cableVersion:2, style:style.connectionNode.audio
                }},
                
                {collection:'basic', type:'image', name:'backing', 
                    data:{ x:-unitStyle.offset.x, y:-unitStyle.offset.y, width:unitStyle.drawingValue.width, height:unitStyle.drawingValue.height, url:unitStyle.imageStoreURL_localPrefix+'guide.png' }
                },

                {collection:'control', type:'dial_continuous_image', name:'samples', data:{
                    x:30, y:30, radius:30/2, startAngle:(3*Math.PI)/4, maxAngle:1.5*Math.PI, value:0, resetValue:0.5, arcDistance:1.2,
                    handleURL:unitStyle.imageStoreURL_commonPrefix+'dial_large.png',
                }},
            ]
        });

    //circuitry
        const state = {
            samples:1,
            samples_dial:0,
        };
        const lagProcessor = new _canvas_.interface.circuit.lagProcessor(_canvas_.library.audio.context);

    //wiring
        //hid
            object.elements.dial_continuous_image.samples.onchange = function(value){
                state.samples_dial = value;

                if(value <= 0.5){ value = 1 + 2*value * 9; }
                else if(value > 0.5){ value = 10 * (1 + (2*value-1) * 9); }

                lagProcessor.samples( Math.round(value) );
                state.samples = value;
            };
        //io
            object.io.audio.input.audioNode = lagProcessor.in();
            object.io.audio.output.audioNode = lagProcessor.out();

    //interface
        object.i = {
            samples:function(a){
                if(a == undefined){ return state.samples_dial; }
                object.elements.dial_continuous_image.samples.set(a);
            },
        };

    //import/export
        object.exportData = function(){
            return JSON.parse(JSON.stringify(state));
        };
        object.importData = function(data){
            object.elements.dial_continuous_image.samples.set( data.samples_dial );
        };
        
    return object;
};
this['lag_processor'].metadata = {
    name:'Lag Processor',
    category:'',
    helpURL:''
};