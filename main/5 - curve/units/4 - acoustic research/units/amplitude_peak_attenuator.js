this['amplitude_peak_attenuator'] = function(name,x,y,angle){
    //style data
        const unitStyle = new function(){
            //image store location URL
                this.imageStoreURL_commonPrefix = imageStoreURL+'common/';
                this.imageStoreURL_localPrefix = imageStoreURL+'amplitude_peak_attenuator/';

            //calculation of measurements
                const div = 10;
                const measurement = { 
                    file: { width:675, height:600 },
                    design: { width:6.75, height:6 },
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
            model:'amplitude_peak_attenuator',
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

                {collection:'control', type:'dial_continuous_image', name:'sharpness', data:{
                    x:25, y:30, radius:30/2, startAngle:(3*Math.PI)/4, maxAngle:1.5*Math.PI, value:0.1, resetValue:0.1, arcDistance:1.2,
                    handleURL:unitStyle.imageStoreURL_commonPrefix+'dial.png',
                }},
            ]
        });

    //circuitry
        const state = {
            sharpness:10,
        };
        const amplitudePeakAttenuator = new _canvas_.interface.circuit.amplitudePeakAttenuator(_canvas_.library.audio.context);

    //wiring
        //hid
            object.elements.dial_continuous_image.sharpness.onchange = function(value){
                amplitudePeakAttenuator.sharpness(value*100);
            };
        //io
            object.io.audio.input.out().connect( amplitudePeakAttenuator.in() );
            amplitudePeakAttenuator.out().connect(object.io.audio.output.in());

    //interface
        object.i = {
        };

    //import/export
        object.exportData = function(){
        };
        object.importData = function(data){
        };
        
    return object;
};
this['amplitude_peak_attenuator'].metadata = {
    name:'Amplitude Peak Attenuator',
    category:'',
    helpURL:''
};