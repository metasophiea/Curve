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
                {collection:'dynamic', type:'connectionNode_voltage', name:'voltage_gain', data:{ 
                    x:10, y:0, width:5, height:10, angle:-Math.PI/2, cableVersion:2, style:style.connectionNode.voltage,
                }},
                {collection:'dynamic', type:'connectionNode_voltage', name:'voltage_sharpness', data:{ 
                    x:50, y:unitStyle.drawingValue.height, width:5, height:10, angle:Math.PI/2, cableVersion:2, style:style.connectionNode.voltage,
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
                {collection:'control', type:'checkbox_image', name:'allowOne', data:{
                    x:8.5, y:35, width:5, height:10,
                    uncheckURL:unitStyle.imageStoreURL_commonPrefix+'switch_small_down.png', 
                    checkURL:unitStyle.imageStoreURL_commonPrefix+'switch_small_up.png',
                }},
                {collection:'control', type:'checkbox_image', name:'exponentialMode', data:{
                    x:16.5, y:35, width:5, height:10,
                    uncheckURL:unitStyle.imageStoreURL_commonPrefix+'switch_small_down.png', 
                    checkURL:unitStyle.imageStoreURL_commonPrefix+'switch_small_up.png',
                }},
            ]
        });

    //circuitry
        const state = {
            gain:1,
            sharpness:0,
            sharpnessDial:0,
            allowOne:false,
            exponentialMode:false,
            asCloseToOneAsIsAllowed:0.999,
        };
        const sigmoid = new _canvas_.interface.circuit.sigmoid(_canvas_.library.audio.context);


        function setSharpness(value){
            if(state.exponentialMode){
                value = _canvas_.library.math.curvePoint.halfSigmoid_up( value, 0, 1, 0.75 );
            }

            if(!state.allowOne && value == 1){
                value = state.asCloseToOneAsIsAllowed;
            }

            sigmoid.sharpness(value);
            state.sharpness = value;
        }

    //wiring
        //hid
            object.elements.dial_continuous_image.gain.onchange = function(value){
                sigmoid.gain(value);
                state.gain = value;
            };
            object.elements.dial_continuous_image.sharpness.onchange = function(value){
                state.sharpnessDial = value;
                setSharpness(value);
            };
            object.elements.checkbox_image.allowOne.onchange = function(value){
                state.allowOne = value;
                setSharpness(state.sharpnessDial);
            };
            object.elements.checkbox_image.exponentialMode.onchange = function(value){
                state.exponentialMode = value;
                setSharpness(state.sharpnessDial);
            };
        //io
            object.io.audio.input.audioNode = sigmoid.in();
            object.io.audio.output.audioNode = sigmoid.out();
            object.io.voltage.voltage_gain.onchange = function(value){
                object.elements.dial_continuous_image.gain.set(value);
            };
            object.io.voltage.voltage_sharpness.onchange = function(value){
                object.elements.dial_continuous_image.sharpness.set(value);
            };

    //interface
        object.i = {
            gain:function(value){
                if(value == undefined){
                    return object.elements.dial_continuous_image.gain.get();
                }
                object.elements.dial_continuous_image.gain.set(value);
            },
            sharpness:function(value){
                if(value == undefined){
                    return object.elements.dial_continuous_image.sharpness.get();
                }
                object.elements.dial_continuous_image.sharpness.set(value);
            },
            allowOne:function(bool){
                if(bool == undefined){
                    return state.allowOne;
                }
                state.allowOne = bool;
                object.elements.checkbox_image.allowOne.set(bool);
            },
            exponentialMode:function(bool){
                if(bool == undefined){
                    return state.exponentialMode;
                }
                state.exponentialMode = bool;
                object.elements.checkbox_image.exponentialMode.set(bool);
            },
        };

    //import/export
        object.exportData = function(){
            return {
                gain:state.gain,
                sharpnessDial:state.sharpnessDial,
                allowOne:state.allowOne,
                exponentialMode:state.exponentialMode,
            };
        };
        object.importData = function(data){
            object.elements.dial_continuous_image.gain.set(data.gain);
            object.elements.dial_continuous_image.sharpness.set(data.sharpnessDial);
            object.elements.checkbox_image.allowOne.set(data.allowOne);
            object.elements.checkbox_image.exponentialMode.set(data.exponentialMode);
        };

    //oncreate/ondelete
        object.ondelete = function(){
            sigmoid.shutdown();
        };
        
    return object;
};
this['sigmoids_affecter'].metadata = {
    name:'Sigmoid\'s Affecter',
    category:'',
    helpURL:''
};