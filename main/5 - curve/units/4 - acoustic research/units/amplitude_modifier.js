this['amplitude_modifier'] = function(name,x,y,angle){
    //style data
        const unitStyle = new function(){
            //image store location URL
                this.imageStoreURL_localPrefix = imageStoreURL+'amplitude_modifier/';

            //calculation of measurements
                const div = 10;
                const measurement = { 
                    file: { width:1150, height:900 },
                    design: { width:11.5, height:9 },
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
            model:'amplitude_modifier',
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

                {collection:'control', type:'dial_continuous_image', name:'offset', data:{
                    x:35, y:25, radius:30/2, startAngle:(3*Math.PI)/4, maxAngle:1.5*Math.PI, value:0.5, resetValue:0.5, arcDistance:1.2,
                    handleURL:unitStyle.imageStoreURL_localPrefix+'dial.png',
                }},
                {collection:'control', type:'dial_continuous_image', name:'divideBy', data:{
                    x:35, y:65, radius:30/2, startAngle:(3*Math.PI)/4, maxAngle:1.5*Math.PI, value:0, resetValue:1/7, arcDistance:1.2,
                    handleURL:unitStyle.imageStoreURL_localPrefix+'dial.png',
                }},
                {collection:'control', type:'dial_continuous_image', name:'ceiling', data:{
                    x:75, y:25, radius:30/2, startAngle:(3*Math.PI)/4, maxAngle:1.5*Math.PI, value:1, arcDistance:1.2,
                    handleURL:unitStyle.imageStoreURL_localPrefix+'dial.png',
                }},
                {collection:'control', type:'dial_continuous_image', name:'floor', data:{
                    x:75, y:65, radius:30/2, startAngle:(3*Math.PI)/4, maxAngle:1.5*Math.PI, value:0, arcDistance:1.2,
                    handleURL:unitStyle.imageStoreURL_localPrefix+'dial.png',
                }},
                {collection:'control', type:'checkbox_image', name:'invert', data:{
                    x:5, y:35, width:10, height:20,
                    uncheckURL:unitStyle.imageStoreURL_localPrefix+'switch_up.png', 
                    checkURL:unitStyle.imageStoreURL_localPrefix+'switch_down.png',
                }},
            ]
        });

    //circuitry
        const state = {
            offset:0,
            divideBy:1,
            ceiling:2,
            floor:-2,
            invert:false,
        };
        const AM = new _canvas_.interface.circuit.amplitudeModifier(_canvas_.library.audio.context);

    //wiring
        //hid
            object.elements.dial_continuous_image.offset.onchange = function(value){
                AM.offset(value*2 - 1);
                state.offset = value*2 - 1;
            };
            object.elements.dial_continuous_image.divideBy.onchange = function(value){
                AM.divisor(value*7 + 1);
                state.divideBy = value*7 + 1;
            };
            object.elements.dial_continuous_image.ceiling.onchange = function(value){
                AM.ceiling(value*2);
                state.ceiling = value*2;
            };
            object.elements.dial_continuous_image.floor.onchange = function(value){
                AM.floor(-(1-value)*2);
                state.floor = -(1-value)*2;
            };
            object.elements.checkbox_image.invert.onchange = function(value){
                AM.invert(value);
                state.invert = value;
            };
        //io
            object.io.audio.input.out().connect( AM.in() );
            AM.out().connect(object.io.audio.output.in());

    //interface
        object.i = {
            offset:function(a){
                if(a==undefined){ return state.offset; }
                object.elements.dial_continuous_image.offset.set( (a+1)/2 );
            },
            divideBy:function(a){
                if(a==undefined){ return state.divideBy; }
                object.elements.dial_continuous_image.divideBy.set( (a-1)/7 );
            },
            ceiling:function(a){
                if(a==undefined){ return state.ceiling; }
                object.elements.dial_continuous_image.ceiling.set( a/2 );
            },
            floor:function(a){
                if(a==undefined){ return state.floor; }
                object.elements.dial_continuous_image.floor.set( 1 + a/2 );
            },
            invert:function(a){
                if(a==undefined){ return state.invert; }
                object.elements.checkbox_image.invert.set( a );
            },
        };

    //import/export
        object.exportData = function(){
            return JSON.parse(JSON.stringify(state));
        };
        object.importData = function(data){
            object.elements.dial_continuous_image.offset.set( (data.offset+1)/2 );
            object.elements.dial_continuous_image.divideBy.set( (data.divideBy-1)/7 );
            object.elements.dial_continuous_image.ceiling.set( data.ceiling/2 );
            object.elements.dial_continuous_image.floor.set( -data.floor/2 );
            object.elements.checkbox_image.invert.set( data.invert );
        };

    //setup/tearDown
        object.oncreate = function(){
        };
        object.ondelete = function(){
        };

    return object;
};
this['amplitude_modifier'].metadata = {
    name:'Amplitude Modifier',
    category:'',
    helpURL:''
};