this['gain'] = function(name,x,y,angle){
    //style data
        const unitStyle = new function(){
            //image store location URL
                this.imageStoreURL_commonPrefix = imageStoreURL+'common/';
                this.imageStoreURL_localPrefix = imageStoreURL+'gain/';

            //calculation of measurements
                const div = 10;
                const measurement = { 
                    file: { width:1200, height:500 },
                    design: { width:12, height:5 },
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
            model:'gain',
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
                {collection:'dynamic', type:'connectionNode_audio', name:'control', data:{ 
                    x:32.5, y:unitStyle.drawingValue.height, width:5, height:15, angle:Math.PI/2, isAudioOutput:false, cableVersion:2, style:style.connectionNode.audio
                }},
                
                {collection:'basic', type:'image', name:'backing', 
                    data:{ x:-unitStyle.offset.x, y:-unitStyle.offset.y, width:unitStyle.drawingValue.width, height:unitStyle.drawingValue.height, url:unitStyle.imageStoreURL_localPrefix+'guide.png' }
                },

                {collection:'control', type:'dial_continuous_image', name:'gain', data:{
                    x:80, y:25, radius:30/2, startAngle:(3*Math.PI)/4, maxAngle:1.5*Math.PI, value:0.5, resetValue:0.5, arcDistance:1.2, optionCount:128, 
                    handleURL:unitStyle.imageStoreURL_commonPrefix+'dial_large.png',
                }},
                {collection:'control', type:'checkbox_image', name:'plusOne', data:{
                    x:45, y:15, width:10, height:20,
                    uncheckURL:unitStyle.imageStoreURL_commonPrefix+'switch_large_down.png', 
                    checkURL:unitStyle.imageStoreURL_commonPrefix+'switch_large_up.png',
                }},
                {collection:'control', type:'checkbox_image', name:'byTen', data:{
                    x:30, y:15, width:10, height:20,
                    uncheckURL:unitStyle.imageStoreURL_commonPrefix+'switch_large_down.png', 
                    checkURL:unitStyle.imageStoreURL_commonPrefix+'switch_large_up.png',
                }},
                {collection:'control', type:'checkbox_image', name:'flow', data:{
                    x:10, y:15, width:10, height:20,
                    uncheckURL:unitStyle.imageStoreURL_commonPrefix+'switch_large_up.png', 
                    checkURL:unitStyle.imageStoreURL_commonPrefix+'switch_large_down.png',
                }},
            ]
        });

    //circuitry
        const state = {
            gain_dial:0.5,
            gain:1,
            plusOne:false,
            byTen:false,
            flow:false,
        };
        const gain = new _canvas_.interface.circuit.gain(_canvas_.library.audio.context);

        function update(){
            const v = state.gain_dial*2 - 1;
            state.gain = ( v + (state.plusOne?1:0) ) * (state.byTen?10:1);
            gain.gain(state.gain);
        }

    //wiring
        //hid
            object.elements.dial_continuous_image.gain.onchange = function(value){
                state.gain_dial = value;
                update();
            };
            object.elements.checkbox_image.plusOne.onchange = function(value){
                state.plusOne = value;
                update();
            };
            object.elements.checkbox_image.byTen.onchange = function(value){
                state.byTen = value;
                update();
            };
            object.elements.checkbox_image.flow.onchange = function(value){
                state.flow = value;
                gain.mode(value);
            };
        //io
            object.io.audio.input.audioNode = gain.in();
            object.io.audio.output.audioNode = gain.out();
            object.io.audio.control.audioNode = gain.control();

    //interface
        object.i = {
            flow:function(a){
                if(a==undefined){ return state.flow; }
                object.elements.checkbox_image.flow.set( a );
            },
            plusOne:function(a){
                if(a==undefined){ return state.plusOne; }
                object.elements.checkbox_image.plusOne.set( a );
            },
            byTen:function(a){
                if(a==undefined){ return state.byTen; }
                object.elements.checkbox_image.byTen.set( a );
            },
            dial:function(a){
                if(a==undefined){ return state.gain_dial; }
                object.elements.dial_continuous_image.gain.set( a );
            },
        };

    //import/export
        object.exportData = function(){
            return JSON.parse(JSON.stringify(state));
        };
        object.importData = function(data){
            object.elements.checkbox_image.flow.set( data.flow );
            object.elements.checkbox_image.plusOne.set( data.plusOne );
            object.elements.checkbox_image.byTen.set( data.byTen );
            object.elements.dial_continuous_image.gain.set( data.gain_dial );
        };

    //setup/tearDown
        object.oncreate = function(){
            object.elements.checkbox_image.plusOne.set(true);
        };

    return object;
};
this['gain'].metadata = {
    name:'Gain',
    category:'',
    helpURL:''
};