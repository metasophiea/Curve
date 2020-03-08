this['bitcrusher'] = function(name,x,y,angle){
    //style data
        const unitStyle = new function(){
            //image store location URL
                this.imageStoreURL_commonPrefix = imageStoreURL+'common/';
                this.imageStoreURL_localPrefix = imageStoreURL+'bitcrusher/';

            //calculation of measurements
                const div = 10;
                const measurement = { 
                    file: { width:1050, height:600 },
                    design: { width:10.5, height:6 },
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
            model:'bitcrusher',
            x:x, y:y, angle:angle,
            space:[
                {x:-unitStyle.offset.x,                               y:-unitStyle.offset.y},
                {x:unitStyle.drawingValue.width - unitStyle.offset.x, y:-unitStyle.offset.y},
                {x:unitStyle.drawingValue.width - unitStyle.offset.x, y:unitStyle.drawingValue.height - unitStyle.offset.y},
                {x:-unitStyle.offset.x,                               y:unitStyle.drawingValue.height - unitStyle.offset.y},
            ],
            elements:[
                {collection:'dynamic', type:'connectionNode_audio', name:'input', data:{ 
                    x:unitStyle.drawingValue.width, y:22.5, width:5, height:15, angle:0, isAudioOutput:false, cableVersion:2, style:style.connectionNode.audio
                }},
                {collection:'dynamic', type:'connectionNode_audio', name:'output', data:{ 
                    x:0, y:37.5, width:5, height:15, angle:Math.PI, isAudioOutput:true, cableVersion:2, style:style.connectionNode.audio
                }},
                {collection:'dynamic', type:'connectionNode_voltage', name:'voltage_amplitudeResolution', data:{ 
                    x:30, y:unitStyle.drawingValue.height, width:5, height:10, angle:Math.PI/2, cableVersion:2, style:style.connectionNode.voltage,
                }},
                {collection:'dynamic', type:'connectionNode_voltage', name:'voltage_sampleFrequency', data:{ 
                    x:70, y:unitStyle.drawingValue.height, width:5, height:10, angle:Math.PI/2, cableVersion:2, style:style.connectionNode.voltage,
                }},
                
                {collection:'basic', type:'image', name:'backing', 
                    data:{ x:-unitStyle.offset.x, y:-unitStyle.offset.y, width:unitStyle.drawingValue.width, height:unitStyle.drawingValue.height, url:unitStyle.imageStoreURL_localPrefix+'backing.png' }
                },

                {collection:'control', type:'dial_continuous_image', name:'amplitudeResolution', data:{
                    x:25, y:30, radius:30/2, startAngle:(3*Math.PI)/4, maxAngle:1.5*Math.PI, value:0, arcDistance:1.2, optionCount:128, 
                    handleURL:unitStyle.imageStoreURL_commonPrefix+'dial_large.png',
                }},
                {collection:'control', type:'dial_discrete_image', name:'sampleFrequency', data:{
                    x:65, y:30, radius:30/2, startAngle:(3*Math.PI)/4, maxAngle:1.5*Math.PI, value:0, arcDistance:1.2, optionCount:8, 
                    handleURL:unitStyle.imageStoreURL_commonPrefix+'dial_large.png',
                }},
            ]
        });

    //circuitry
        const state = {
            amplitudeResolution:0.425,
            sampleFrequency:4,
        };
        const bitcrusher = new _canvas_.interface.circuit.bitcrusher(_canvas_.library.audio.context);

    //wiring
        //hid
            object.elements.dial_continuous_image.amplitudeResolution.onchange = function(value){
                bitcrusher.amplitudeResolution( Math.pow(2,value*7) );
                state.amplitudeResolution = value;
            };
            object.elements.dial_discrete_image.sampleFrequency.onchange = function(value){
                bitcrusher.sampleFrequency(Math.pow(2, value));
                state.sampleFrequency = value;
            };

        //io
            object.io.audio.input.audioNode = bitcrusher.in();
            object.io.audio.output.audioNode = bitcrusher.out();
            object.io.voltage.voltage_amplitudeResolution.onchange = function(value){
                object.elements.dial_continuous_image.amplitudeResolution.set(value);
            };
            object.io.voltage.voltage_sampleFrequency.onchange = function(value){
                object.elements.dial_discrete_image.sampleFrequency.set(Math.round(value*7));
            };

    //interface
        object.i = {
            amplitudeResolution:function(a){
                if(a == undefined){ return bitcrusher.amplitudeResolution(); }
                object.elements.dial_continuous_image.amplitudeResolution.set( Math.log2(a)/7 );
            },
            sampleFrequency:function(a){
                if(a == undefined){ return bitcrusher.sampleFrequency(); }
                if( ![1,2,4,8,16,32,64,128].includes(a) ){ return; }
                object.elements.dial_discrete_image.sampleFrequency.set( Math.log2(a) );
            },
        };

    //import/export
        object.exportData = function(){
            return JSON.parse(JSON.stringify(state));
        };
        object.importData = function(data){
            object.elements.dial_continuous_image.amplitudeResolution.set( data.amplitudeResolution );
            object.elements.dial_discrete_image.sampleFrequency.set( data.sampleFrequency );
        };

    //setup/tearDown
        object.oncreate = function(){
            object.elements.dial_continuous_image.amplitudeResolution.set(0.425);
            object.elements.dial_discrete_image.sampleFrequency.set(4);
        };

    return object;
};
this['bitcrusher'].metadata = {
    name:'Bitcrusher',
    category:'',
    helpURL:''
};