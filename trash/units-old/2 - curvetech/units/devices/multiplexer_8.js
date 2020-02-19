this.multiplexer_8 = function(name,x,y,angle){
    //unitStyle
        const unitStyle = new function(){
            //image store location URL
                this.imageStoreURL_localPrefix = imageStoreURL+'multiplexer/';

            //calculation of measurements
                const div = 10;
                const measurement = {
                    file: { width:200, height:500 },
                    design: { width:2, height:5 },
                };

                this.offset = 20/div;
                this.drawingValue = { 
                    width: measurement.file.width/div, 
                    height: measurement.file.height/div
                };

            //styling values
                this.LEDs = {
                    glow:{r:232/255, g:160/255, b:111/255, a:1}, 
                    dim:{r:164/255, g:80/255, b:61/255, a:1},
                };
        };

    //main object creation
        const object = _canvas_.interface.unit.builder({
            name:name,
            model:'multiplexer_8',
            x:x, y:y, angle:angle,
            space:[
                { x:0,                             y:0                             },
                { x:unitStyle.drawingValue.width , y:0                             },
                { x:unitStyle.drawingValue.width , y:unitStyle.drawingValue.height },
                { x:0,                             y:unitStyle.drawingValue.height },
            ],
            elements:[
                {collection:'dynamic', type:'connectionNode_signal', name:'switch', data:{ 
                    x:unitStyle.drawingValue.width*0.5-2.5, y:0, width:2.5, height:5, angle:-Math.PI/2, cableVersion:2, style:style.connectionNode.signal,
                }},
                {collection:'dynamic', type:'connectionNode_signal', name:'in', data:{ 
                    x:0, y:unitStyle.drawingValue.height*0.6 - 2.5, width:2.5, height:5, angle:-Math.PI, cableVersion:2, style:style.connectionNode.signal,
                }},
                {collection:'dynamic', type:'connectionNode_signal', name:'out_0', data:{ 
                    x:unitStyle.drawingValue.width, y:6 - 2.5 + 5.5*0, width:2.5, height:5, angle:0, cableVersion:2, style:style.connectionNode.signal,
                }},
                {collection:'dynamic', type:'connectionNode_signal', name:'out_1', data:{ 
                    x:unitStyle.drawingValue.width, y:6 - 2.5 + 5.5*1, width:2.5, height:5, angle:0, cableVersion:2, style:style.connectionNode.signal,
                }},
                {collection:'dynamic', type:'connectionNode_signal', name:'out_2', data:{ 
                    x:unitStyle.drawingValue.width, y:6 - 2.5 + 5.5*2, width:2.5, height:5, angle:0, cableVersion:2, style:style.connectionNode.signal,
                }},
                {collection:'dynamic', type:'connectionNode_signal', name:'out_3', data:{ 
                    x:unitStyle.drawingValue.width, y:6 - 2.5 + 5.5*3, width:2.5, height:5, angle:0, cableVersion:2, style:style.connectionNode.signal,
                }},
                {collection:'dynamic', type:'connectionNode_signal', name:'out_4', data:{ 
                    x:unitStyle.drawingValue.width, y:6 - 2.5 + 5.5*4, width:2.5, height:5, angle:0, cableVersion:2, style:style.connectionNode.signal,
                }},
                {collection:'dynamic', type:'connectionNode_signal', name:'out_5', data:{ 
                    x:unitStyle.drawingValue.width, y:6 - 2.5 + 5.5*5, width:2.5, height:5, angle:0, cableVersion:2, style:style.connectionNode.signal,
                }},
                {collection:'dynamic', type:'connectionNode_signal', name:'out_6', data:{ 
                    x:unitStyle.drawingValue.width, y:6 - 2.5 + 5.5*6, width:2.5, height:5, angle:0, cableVersion:2, style:style.connectionNode.signal,
                }},
                {collection:'dynamic', type:'connectionNode_signal', name:'out_7', data:{ 
                    x:unitStyle.drawingValue.width, y:6 - 2.5 + 5.5*7, width:2.5, height:5, angle:0, cableVersion:2, style:style.connectionNode.signal,
                }},
                {collection:'basic', type:'image', name:'backing', 
                    data:{ x:0, y:0, width:unitStyle.drawingValue.width, height:unitStyle.drawingValue.height, url:unitStyle.imageStoreURL_localPrefix+'8_backing.png' }
                },
                {collection:'display', type:'glowbox_rectangle',name:'LED_0',data:{ x:10 - 0.5/2, y:8 - 2.5 + 5*0, width:0.5, height:4, style:unitStyle.LEDs }},
                {collection:'display', type:'glowbox_rectangle',name:'LED_1',data:{ x:10 - 0.5/2, y:8 - 2.5 + 5*1, width:0.5, height:4, style:unitStyle.LEDs }},
                {collection:'display', type:'glowbox_rectangle',name:'LED_2',data:{ x:10 - 0.5/2, y:8 - 2.5 + 5*2, width:0.5, height:4, style:unitStyle.LEDs }},
                {collection:'display', type:'glowbox_rectangle',name:'LED_3',data:{ x:10 - 0.5/2, y:8 - 2.5 + 5*3, width:0.5, height:4, style:unitStyle.LEDs }},
                {collection:'display', type:'glowbox_rectangle',name:'LED_4',data:{ x:10 - 0.5/2, y:8 - 2.5 + 5*4, width:0.5, height:4, style:unitStyle.LEDs }},
                {collection:'display', type:'glowbox_rectangle',name:'LED_5',data:{ x:10 - 0.5/2, y:8 - 2.5 + 5*5, width:0.5, height:4, style:unitStyle.LEDs }},
                {collection:'display', type:'glowbox_rectangle',name:'LED_6',data:{ x:10 - 0.5/2, y:8 - 2.5 + 5*6, width:0.5, height:4, style:unitStyle.LEDs }},
                {collection:'display', type:'glowbox_rectangle',name:'LED_7',data:{ x:10 - 0.5/2, y:8 - 2.5 + 5*7, width:0.5, height:4, style:unitStyle.LEDs }},
            ]
        });

    //circuitry
        const state = {
            channelCount:8,
            previousPosition:-1,
            position:0,
        };
        function gotoPosition(value){
            state.previousPosition = state.position;
            state.position = value;
        }
        function step(){
            if( state.channelCount <= state.position+1 ){ gotoPosition(0); }else{ gotoPosition(state.position+1); }
        }
        function update(){
            if(state.previousPosition != -1){
                object.io.signal['out_'+state.previousPosition].set(false);
                object.elements.glowbox_rectangle['LED_'+state.previousPosition].off();
            }
            object.elements.glowbox_rectangle['LED_'+state.position].on();
            object.io.signal['out_'+state.position].set( object.io.signal.in.read() );
        }

    //wiring
        //io
            object.io.signal.in.onchange = function(value){ object.io.signal['out_'+state.position].set(value); };
            object.io.signal.switch.onchange = function(value){
                if(!value){return;}
                step();
                update();
            };

    //interface
        object.i = {
            step:function(){step();update();},
            position:function(value){
                if(value==undefined){return state.position;}
                gotoPosition(value);
                update();
            },
        };

    //import/export
        object.importData = function(data){
            gotoPosition(data.position);
            update();
        };
        object.exportData = function(){
            return { position: state.position };
        };

    //setup
        update();

    return object;
};
this.multiplexer_8.metadata = {
    name:'Multiplexer - Type C',
    category:'devices',
    helpURL:'/help/units/curvetech/multiplexer_8/'
};