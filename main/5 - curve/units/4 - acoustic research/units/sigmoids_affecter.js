this['sigmoids_affecter'] = function(name,x,y,angle){
    //style data
        const unitStyle = new function(){
            //image store location URL
                this.imageStoreURL_commonPrefix = imageStoreURL+'common/';
                this.imageStoreURL_localPrefix = imageStoreURL+'sigmoids_affecter/';

            //calculation of measurements
                const div = 10;
                const measurement = { 
                    file: { width:875, height:600 },
                    design: { width:8.75, height:6 },
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
            model:'sigmoids_affecter',
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
                    data:{ x:-unitStyle.offset.x, y:-unitStyle.offset.y, width:unitStyle.drawingValue.width, height:unitStyle.drawingValue.height, url:unitStyle.imageStoreURL_localPrefix+'backing.png' }
                },

                {collection:'control', type:'dial_continuous_image', name:'gain', data:{
                    x:15, y:22.5, radius:15/2, startAngle:(3*Math.PI)/4, maxAngle:1.5*Math.PI, value:1, resetValue:0.5, arcDistance:1.2,
                    handleURL:unitStyle.imageStoreURL_commonPrefix+'dial_small.png',
                }},
                {collection:'control', type:'dial_continuous_image', name:'sharpness', data:{
                    x:45, y:30, radius:30/2, startAngle:(3*Math.PI)/4, maxAngle:1.5*Math.PI, value:0, resetValue:0.5, arcDistance:1.2,
                    handleURL:unitStyle.imageStoreURL_commonPrefix+'dial_large.png',
                }},
            ]
        });

    //circuitry
        const state = {
            gain:1,
            sharpness:0,
        };
        const amplitudeExciter = new _canvas_.interface.circuit.sigmoid(_canvas_.library.audio.context);

    //wiring
        //hid
            object.elements.dial_continuous_image.gain.onchange = function(value){
                amplitudeExciter.gain(value);
                state.gain = value;
            };
            object.elements.dial_continuous_image.sharpness.onchange = function(value){
                amplitudeExciter.sharpness(value);
                state.sharpness = value;
            };
        //io
            object.io.audio.input.out().connect( amplitudeExciter.in() );
            amplitudeExciter.out().connect(object.io.audio.output.in());

    //interface
        object.i = {
            gain:function(value){
                object.elements.dial_continuous_image.gain.set(value);
            },
            sharpness:function(value){
                object.elements.dial_continuous_image.sharpness.set(value);
            },
        };

    //import/export
        object.exportData = function(){
            return {
                gain:state.gain,
                sharpness:state.sharpness,
            };
        };
        object.importData = function(data){
            object.elements.dial_continuous_image.gain.set(data.gain);
            object.elements.dial_continuous_image.sharpness.set(data.sharpness);
        };
        
    return object;
};
this['sigmoids_affecter'].metadata = {
    name:'Sigmoid\'s Affecter',
    category:'',
    helpURL:''
};