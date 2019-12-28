this.musicalKeyboard = function(name,x,y,angle){
    //style data
        const unitStyle = new function(){
            //image store location URL
                this.imageStoreURL_localPrefix = imageStoreURL+'musicalKeyboard/';

            //calculation of measurements
                const div = 6;
                const measurement = { 
                    file: { width:3800, height:800 },
                    design: { width:63.5, height:13 },
                };

                this.offset = 20/div;
                this.drawingValue = { 
                    width: measurement.file.width/div, 
                    height: measurement.file.height/div
                };

            //styling values
                this.velocityDial = { handle:style.primaryEight[5], slot:{r:0,g:0,b:0,a:0}, needle:{r:1,g:1,b:1,a:1} };
                this.whiteKey = {
                    background__up__colour:{r:0.97,g:0.97,b:0.97,a:1},
                    background__hover__colour:{r:1,g:1,b:1,a:1},
                    background__press__colour:{r:0.87,g:0.87,b:0.87,a:1},
                    background__hover_press__colour:{r:0.87,g:0.87,b:0.87,a:1},
                };
                this.blackKey = { 
                    background__up__colour:{r:0.18,g:0.18,b:0.18,a:1}, 
                    background__hover__colour:{r:0.28,g:0.28,b:0.28,a:1}, 
                    background__press__colour:{r:0.08,g:0.08,b:0.08,a:1},
                    background__hover_press__colour:{r:0.08,g:0.08,b:0.08,a:1},
                };
                this.LEDs = {
                    glow:{r:232/255, g:160/255, b:111/255, a:1}, 
                    dim:{r:164/255, g:80/255, b:61/255, a:1},
                };
                this.keyCount = 49;
        };

    //main object creation
        const object = _canvas_.interface.unit.builder({
            name:name,
            model:'musicalKeyboard',
            x:x, y:y, angle:angle,
            space:[
                { x:0,                                              y:0                                               },
                { x:unitStyle.drawingValue.width -unitStyle.offset, y:0                                               },
                { x:unitStyle.drawingValue.width -unitStyle.offset, y:unitStyle.drawingValue.height -unitStyle.offset },
                { x:0,                                              y:unitStyle.drawingValue.height -unitStyle.offset },
            ],
            elements:[
                {collection:'dynamic', type:'connectionNode_data', name:'midiIn', data:{ 
                    x:unitStyle.drawingValue.width-3.5, y:10, width:5, height:15, angle:0, cableVersion:2, style:style.connectionNode.data,
                }},
                {collection:'dynamic', type:'connectionNode_data', name:'midiOut', data:{ 
                    x:0, y:117.5, width:5, height:15, angle:Math.PI, cableVersion:2, style:style.connectionNode.data
                }},
                {collection:'dynamic', type:'connectionNode_voltage', name:'velocityIn', data:{ 
                    x:25, y:unitStyle.drawingValue.height-3.5, width:5, height:10, angle:Math.PI*0.5, cableVersion:2, style:style.connectionNode.voltage,
                }},
                {collection:'basic', type:'image', name:'backing', 
                    data:{ x:-unitStyle.offset/2, y:-unitStyle.offset/2, width:unitStyle.drawingValue.width, height:unitStyle.drawingValue.height, url:unitStyle.imageStoreURL_localPrefix+'backing.png' }
                },
                {collection:'control', type:'dial_2_continuous',name:'velocity',data:{
                    x:20, y:110, radius:25/2, startAngle:(3*Math.PI)/4, maxAngle:1.5*Math.PI, value:0, arcDistance:1.2, resetValue:0.5, style:unitStyle.velocityDial,
                }},
            ].concat(
                (function(){
                    const newKeys = [];

                    const keyPattern = 'wbwbwwbwbwbw'.split('');

                    //white keys
                        let whiteOffset = 0;
                        for(let a = 0; a < unitStyle.keyCount; a++){
                            const keyType = keyPattern[a%keyPattern.length];

                            if(keyType == 'w'){
                                newKeys.unshift(
                                    {collection:'dynamic', type:'connectionNode_signal', name:'signalOut_'+a, data:{ 
                                        x:55 +whiteOffset -0.5 -10, y:0, width:5, height:9, angle:-Math.PI/2, cableVersion:2, style:style.connectionNode.signal,
                                    }},
                                );
                                newKeys.unshift(
                                    {collection:'dynamic', type:'connectionNode_signal', name:'activateKey_'+a, data:{ 
                                        x:55 +whiteOffset -0.5, y:unitStyle.drawingValue.height -unitStyle.offset, width:5, height:9, angle:Math.PI*0.5, cableVersion:2, style:style.connectionNode.signal,
                                    }},
                                );
                                newKeys.push(
                                    {collection:'display', type:'glowbox_rectangle',name:'LED'+a,data:{ x:41.25 +whiteOffset, y:6, width:17.5, height:1, style:unitStyle.LEDs }},
                                    {collection:'control', type:'button_rectangle', name:'key_'+a, data:{ x:40.5 +whiteOffset, y:10, width:19, height:120, style:unitStyle.whiteKey }},
                                );
                                whiteOffset += 20;
                            }
                        }

                    //black keys
                        let blackOffset = 0;
                        for(let a = 0; a < unitStyle.keyCount; a++){
                            const keyType = keyPattern[a%keyPattern.length];

                            if(keyType == 'b'){
                                newKeys.unshift(
                                    {collection:'dynamic', type:'connectionNode_signal', name:'signalOut_'+a, data:{ 
                                        x:55 +blackOffset -0.5, y:0, width:5, height:9, angle:-Math.PI/2, cableVersion:2, style:style.connectionNode.signal,
                                    }},
                                );
                                newKeys.unshift(
                                    {collection:'dynamic', type:'connectionNode_signal', name:'activateKey_'+a, data:{ 
                                        x:65 +blackOffset -0.5, y:unitStyle.drawingValue.height -unitStyle.offset, width:5, height:9, angle:Math.PI*0.5, cableVersion:2, style:style.connectionNode.signal,
                                    }},
                                );
                                newKeys.push(
                                    {collection:'display', type:'glowbox_rectangle',name:'LED'+a,data:{ x:51.25 +blackOffset, y:2.75, width:17.5, height:1, style:unitStyle.LEDs }},
                                    {collection:'control', type:'button_rectangle', name:'key_'+a, data:{ x:55 +blackOffset, y:10, width:10, height:70, style:unitStyle.blackKey }},
                                );
                                blackOffset += 20;
                            }
                            if(keyType == keyPattern[(a-1)%keyPattern.length]){ blackOffset += 20; }

                        }

                    return newKeys;
                })()
            )
        });

    //circuitry
        const state = {
            midiNumberOffset:60,
            velocity:0,
        };

        function sendMidiData(keyNumber,mode){
            if(keyNumber < 0){return;}

            if(mode == 'press'){
                object.elements.glowbox_rectangle['LED'+keyNumber].on();
                object.io.signal['signalOut_'+keyNumber].set(true);
            }else{
                object.elements.glowbox_rectangle['LED'+keyNumber].off();
                object.io.signal['signalOut_'+keyNumber].set(false);
            }

            object.io.data.midiOut.send('midinumber', { 
                num:keyNumber+state.midiNumberOffset,
                velocity: mode == 'press' ? object.elements.dial_2_continuous.velocity.get() : 0,
            } );
        }

    //wiring
        //hid
            object.elements.dial_2_continuous.velocity.onchange = function(value){ state.velocity = value; };
            for(let a = 0; a < unitStyle.keyCount; a++){
                object.elements.button_rectangle['key_'+a].onpress = (function(keyNumber){ return function(){sendMidiData(keyNumber,'press');} })(a);
                object.elements.button_rectangle['key_'+a].onrelease = (function(keyNumber){ return function(){sendMidiData(keyNumber,'release');} })(a);
            }

        //keycapture
            const glyphs = [ '`','a','z','s','x','c','f','v','g','b','h','n','m','k',',','l','.','/', '1','q','2','w','3','e','r','5','t','6','y','u','8','i','9','o','0','p','[' ]; 
            object.elements.image.backing.attachCallback('onkeydown', function(x,y,event){
                if( glyphs.includes(event.key) ){
                    object.elements.button_rectangle['key_'+glyphs.indexOf(event.key)].press();
                }
            });
            object.elements.image.backing.attachCallback('onkeyup', function(x,y,event){
                if( glyphs.includes(event.key) ){
                    object.elements.button_rectangle['key_'+glyphs.indexOf(event.key)].release();
                }
            });

        //io
            object.io.data.midiIn.onreceive = function(address, data){ if(address != 'midinumber'){return;} sendMidiData(data.num-state.midiNumberOffset,data.velocity>0?'press':'release'); };
            object.io.voltage.velocityIn.onchange = function(value){ object.elements.dial_2_continuous.velocity.set(value); };
            for(let a = 0; a < unitStyle.keyCount; a++){
                object.io.signal['activateKey_'+a].onchange = (function(keyNumber){ return function(value){ sendMidiData(keyNumber,value?'press':'release'); } })(a);
            }

    //interface
        object.i = {
            velocity:function(value){ 
                if(value==undefined){return state.velocity; }
                object.elements.dial_2_continuous.velocity.set(value);
            },
            pushKey:function(key){ object.elements.button_rectangle['key_'+key].press(); },
            releaseKey:function(key){ object.elements.button_rectangle['key_'+key].release();},
            releaseAllKeys:function(){ for(let a = 0; a < keyCount; a++){ object.elements.button_rectangle['key_'+a].release(); } },
        };

    //import/export
        object.exportData = function(){ return {velocity:state.velocity}; };
        object.importData = function(data){ object.elements.dial_2_continuous.velocity.set(data.velocity); };

    //setup
        object.elements.dial_2_continuous.velocity.set(0.5);

    return object;
};
this.musicalKeyboard.metadata = {
    name:'Musical Keyboard',
    category:'humanInterfaceDevices',
    helpURL:'/help/units/beta/musicalKeyboard/'
};
