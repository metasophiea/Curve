this['momentary_amplitude_meter'] = function(name,x,y,angle){
    //style data
        const unitStyle = new function(){
            //image store location URL
                this.imageStoreURL_commonPrefix = imageStoreURL+'common/';
                this.imageStoreURL_localPrefix = imageStoreURL+'momentary_amplitude_meter/';

            //calculation of measurements
                const div = 10;
                const measurement = { 
                    file: { width:950, height:900 },
                    design: { width:9.5, height:9 },
                };

                this.offset = {x:0,y:0};
                this.drawingValue = { 
                    width: measurement.file.width/div, 
                    height: measurement.file.height/div
                };

            this.gauge = {needles:[{r:0,g:0,b:0,a:1}]};
        };

    //main object creation
        const object = _canvas_.interface.unit.builder({
            name:name,
            model:'momentary_amplitude_meter',
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
                
                {collection:'basic', type:'image', name:'backing', 
                    data:{ x:-unitStyle.offset.x, y:-unitStyle.offset.y, width:unitStyle.drawingValue.width, height:unitStyle.drawingValue.height, url:unitStyle.imageStoreURL_localPrefix+'backing.png' }
                },

                {collection:'display', type:'meter_gauge', name:'gauge', data:{ 
                    x:10+0.5, y:10+0.5, width:60-1, height:40-1,
                    markings:{},
                    style:{
                        backing:{r:0,g:0,b:0,a:0},
                        needleColours:[{r:0.98,g:0.98,b:0.98,a:1}],
                    },
                }},
                {collection:'control', type:'checkbox_image', name:'useFullSample', data:{
                    x:15, y:60, width:10, height:20,
                    uncheckURL:unitStyle.imageStoreURL_commonPrefix+'switch_large_up.png', 
                    checkURL:unitStyle.imageStoreURL_commonPrefix+'switch_large_down.png',
                }},
                {collection:'control', type:'dial_continuous_image', name:'sampleRate', data:{
                    x:50, y:71, radius:30/2, startAngle:(3*Math.PI)/4, maxAngle:1.5*Math.PI, value:0, resetValue:0.5, arcDistance:1.2,
                    handleURL:unitStyle.imageStoreURL_commonPrefix+'dial_large.png',
                }},
            ]
        });

    //circuitry
        const state = {
            sampleRate_dial:0,
            sampleRate:1,
            useFullSample:false,
        };
        const momentaryAmplitudeMeter = new _canvas_.interface.circuit.momentaryAmplitudeMeter(_canvas_.library.audio.context);
        momentaryAmplitudeMeter.reading = function(data){
            object.elements.meter_gauge.gauge.set( Math.abs(data) );
        };

    //wiring
        //hid
            object.elements.dial_continuous_image.sampleRate.onchange = function(value){
                state.sampleRate_dial = value;
                value = Math.round(value*30);
                if(value < 1){value = 1;}
                momentaryAmplitudeMeter.updateDelay( 1000/value );
            };
            object.elements.checkbox_image.useFullSample.onchange = function(value){
                state.useFullSample = value;
                momentaryAmplitudeMeter.fullSample(value);
            };
        //io
            object.io.audio.input.audioNode = momentaryAmplitudeMeter.in();

    //interface
        object.i = {
            sampleRate:function(value){
                if(value == undefined){ return state.sampleRate; }

                if(value == 0 || value == 1){
                    object.elements.dial_continuous_image.sampleRate.set(0);
                    return;
                }
                object.elements.dial_continuous_image.sampleRate.set(value/30);
            },
            fullSample:function(bool){
                if(value == undefined){ return state.useFullSample; }
                object.elements.checkbox_image.useFullSample.set(bool);
            },
        };

    //import/export
        object.exportData = function(){
            return JSON.parse(JSON.stringify(state));
        };
        object.importData = function(data){
            object.elements.dial_continuous_image.sampleRate.set(data.sampleRate_dial);
            object.elements.checkbox_image.useFullSample.set(data.useFullSample);
        };
        
    return object;
};
this['momentary_amplitude_meter'].metadata = {
    name:'Momentary Amplitude Meter',
    category:'',
    helpURL:''
};