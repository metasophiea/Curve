this['stable_amplitude_generator'] = function(name,x,y,angle){
    //style data
        const unitStyle = new function(){
            //image store location URL
                this.imageStoreURL_commonPrefix = imageStoreURL+'common/';
                this.imageStoreURL_localPrefix = imageStoreURL+'stable_amplitude_generator/';

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
            model:'stable_amplitude_generator',
            x:x, y:y, angle:angle,
            space:[
                {x:-unitStyle.offset.x,                               y:-unitStyle.offset.y},
                {x:unitStyle.drawingValue.width - unitStyle.offset.x, y:-unitStyle.offset.y},
                {x:unitStyle.drawingValue.width - unitStyle.offset.x, y:unitStyle.drawingValue.height - unitStyle.offset.y},
                {x:-unitStyle.offset.x,                               y:unitStyle.drawingValue.height - unitStyle.offset.y},
            ],
            elements:[
                {collection:'dynamic', type:'connectionNode_audio', name:'output', data:{ 
                    x:0, y:unitStyle.drawingValue.height/2 + 15/2, width:5, height:15, angle:Math.PI, isAudioOutput:true, cableVersion:2, style:style.connectionNode.audio
                }},
                {collection:'dynamic', type:'connectionNode_voltage', name:'voltage', data:{ 
                    x:unitStyle.drawingValue.width/2 - 2.5, y:unitStyle.drawingValue.height, width:5, height:10, angle:Math.PI/2, cableVersion:2, style:style.connectionNode.voltage,
                }},
                
                {collection:'basic', type:'image', name:'backing', 
                    data:{ x:-unitStyle.offset.x, y:-unitStyle.offset.y, width:unitStyle.drawingValue.width, height:unitStyle.drawingValue.height, url:unitStyle.imageStoreURL_localPrefix+'backing.png' }
                },

                {collection:'control', type:'dial_continuous_image', name:'amplitude', data:{
                    x:30, y:30, radius:30/2, startAngle:(3*Math.PI)/4, maxAngle:1.5*Math.PI, value:0.5, resetValue:0.5, arcDistance:1.2,
                    handleURL:unitStyle.imageStoreURL_commonPrefix+'dial_large.png',
                }},
            ]
        });

    //circuitry
        const state = {
            amplitude:0,
            amplitude_dial:0.5,
        };
        const stableAmplitudeGenerator = new _canvas_.interface.circuit.stableAmplitudeGenerator(_canvas_.library.audio.context);

    //wiring
        //hid
            object.elements.dial_continuous_image.amplitude.onchange = function(value){
                state.amplitude_dial = value;
                state.amplitude = value*2 - 1;
                stableAmplitudeGenerator.amplitude( state.amplitude );
            };
        //io
            object.io.audio.output.audioNode = stableAmplitudeGenerator.out();
            object.io.voltage.voltage.onchange = function(value){
                object.elements.dial_continuous_image.amplitude.set( (value+1)/2 );
            };

    //interface
        object.i = {
            amplitude:function(a){
                object.elements.dial_continuous_image.amplitude.set(a);
            },
        };

    //import/export
        object.exportData = function(){
            return JSON.parse(JSON.stringify(state));
        };
        object.importData = function(data){
            object.elements.dial_continuous_image.amplitude.set( data.amplitude_dial );
        };
        
    return object;
};
this['stable_amplitude_generator'].metadata = {
    name:'Stable Amplitude Generator',
    category:'',
    helpURL:''
};