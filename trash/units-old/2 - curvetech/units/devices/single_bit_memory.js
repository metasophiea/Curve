this.single_bit_memory = function(name,x,y,angle){
    //unitStyle
        const unitStyle = new function(){
            //image store location URL
                this.imageStoreURL_localPrefix = imageStoreURL+'single_bit_memory/';

            //calculation of measurements
                const div = 10;
                const measurement = {
                    file: { width:250, height:250 },
                    design: { width:2.5, height:2.5 },
                };

                this.offset = 20/div;
                this.drawingValue = { 
                    width: measurement.file.width/div, 
                    height: measurement.file.height/div
                };
        };

    //main object creation
        const object = _canvas_.interface.unit.builder({
            name:name,
            model:'single_bit_memory',
            x:x, y:y, angle:angle,
            space:[
                { x:0,                             y:0                             },
                { x:unitStyle.drawingValue.width , y:0                             },
                { x:unitStyle.drawingValue.width , y:unitStyle.drawingValue.height },
                { x:0,                             y:unitStyle.drawingValue.height },
            ],
            elements:[
                {collection:'dynamic', type:'connectionNode_signal', name:'out', data:{ 
                    x:unitStyle.drawingValue.width*0.4-2.5, y:0, width:2.5, height:5, angle:-Math.PI/2, cableVersion:2, style:style.connectionNode.signal,
                }},
                {collection:'dynamic', type:'connectionNode_signal', name:'read', data:{ 
                    x:unitStyle.drawingValue.width, y:unitStyle.drawingValue.height*1/3 - 2.5, width:2.5, height:5, angle:0, cableVersion:2, style:style.connectionNode.signal,
                }},
                {collection:'dynamic', type:'connectionNode_signal', name:'write', data:{ 
                    x:unitStyle.drawingValue.width, y:unitStyle.drawingValue.height*2/3 - 2.5, width:2.5, height:5, angle:0, cableVersion:2, style:style.connectionNode.signal,
                }},
                {collection:'dynamic', type:'connectionNode_signal', name:'in', data:{ 
                    x:unitStyle.drawingValue.width*0.4+2.5, y:unitStyle.drawingValue.height, width:2.5, height:5, angle:Math.PI/2, cableVersion:2, style:style.connectionNode.signal,
                }},
                {collection:'basic', type:'image', name:'backing', 
                    data:{ x:0, y:0, width:unitStyle.drawingValue.width, height:unitStyle.drawingValue.height, url:unitStyle.imageStoreURL_localPrefix+'backing.png' }
                },
                {collection:'display', type:'glowbox_image', name:'lamp', 
                    data:{ 
                        x:4-0.2, y:9-0.2, width:12 + 0.4, height:12 + 0.4,
                        dimURL:unitStyle.imageStoreURL_localPrefix+'light_off.png',
                        glowURL:unitStyle.imageStoreURL_localPrefix+'light_on.png',
                    },
                },
                {collection:'control', type:'button_image', name:'button_set', data:{
                    x:11, y:3, width:5, height:5, hoverable:false, 
                    backingURL__up:unitStyle.imageStoreURL_localPrefix+'button_set_up.png',
                    backingURL__press:unitStyle.imageStoreURL_localPrefix+'button_set_down.png',
                }},
                {collection:'control', type:'button_image', name:'button_read', data:{
                    x:17, y:3, width:5, height:5, hoverable:false, 
                    backingURL__up:unitStyle.imageStoreURL_localPrefix+'button_read_up.png',
                    backingURL__press:unitStyle.imageStoreURL_localPrefix+'button_read_down.png',
                }},
                {collection:'control', type:'button_image', name:'button_clear', data:{
                    x:17, y:9, width:5, height:5, hoverable:false, 
                    backingURL__up:unitStyle.imageStoreURL_localPrefix+'button_clear_up.png',
                    backingURL__press:unitStyle.imageStoreURL_localPrefix+'button_clear_down.png',
                }},
            ]
        });
        
        //circuitry
            const state = {
                memory:false,
                read:false,
                write:false,
            };
            function update(){
                if(state.write){ state.memory = object.io.signal.in.read(); }
                if(state.memory){ object.elements.glowbox_image.lamp.on(); }else{ object.elements.glowbox_image.lamp.off(); }
                object.io.signal.out.set(state.read && state.memory);
            }

        //wiring
            //hid
                object.elements.button_image.button_set.onpress = function(value){ if(!value){return;} state.memory = true; update(); };
                object.elements.button_image.button_read.onpress = function(){ state.read = true; update(); };
                object.elements.button_image.button_read.onrelease = function(){ state.read = false; update(); };
                object.elements.button_image.button_clear.onpress = function(value){ if(!value){return;} state.memory = false; update(); };

            //io
                object.io.signal.read.onchange = function(value){
                    if(value){ object.elements.button_image.button_read.press(); }else{ object.elements.button_image.button_read.release(); }
                };
                object.io.signal.write.onchange = function(value){ state.write = value; update(); };
                object.io.signal.in.onchange = function(value){ update(); };

        //interface
                object.i = {
                    memory:function(value){ if(value==undefined){return state.memory;} state.memory = value; update(); },
                    read:function(value){ if(value==undefined){return state.read;} state.read = value; update(); },
                    write:function(value){ if(value==undefined){return state.write;} state.write = value; update(); },
                    info:function(){ return Object.assign({},state); },
                };

        //import/export
            object.importData = function(data){
                state.memory = data.memory;
                update();
            };
            object.exportData = function(){
                return { memory: state.memory };
            };

    return object;
};
this.single_bit_memory.metadata = {
    name:'Single Bit Memory',
    category:'devices',
    helpURL:'/help/units/curvetech/single_bit_memory/'
};