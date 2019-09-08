this.musicalKeyboard = function(x,y,a){
    var imageStoreURL_localPrefix = imageStoreURL+'musicalKeyboard/';
    var keyCount = 49;
    var midiNumberOffset = 60;

    var div = 6;
    var offset = 20/div;
    var measurements = { 
        file:{ width:3800, height:800 },
        design:{ width:63.5, height:13 },
    };
    measurements.drawing = { width: measurements.file.width/div, height: measurements.file.height/div };
    var colours = {
        whiteKey:{
            background__up__colour:{r:0.97,g:0.97,b:0.97,a:1},
            background__hover__colour:{r:1,g:1,b:1,a:1},
            background__press__colour:{r:0.87,g:0.87,b:0.87,a:1},
            background__hover_press__colour:{r:0.87,g:0.87,b:0.87,a:1},
        },
        blackKey:{ 
            background__up__colour:{r:0.18,g:0.18,b:0.18,a:1}, 
            background__hover__colour:{r:0.28,g:0.28,b:0.28,a:1}, 
            background__press__colour:{r:0.08,g:0.08,b:0.08,a:1},
            background__hover_press__colour:{r:0.08,g:0.08,b:0.08,a:1},
        },
        LEDs:{
            glow:{r:232/255, g:160/255, b:111/255, a:1}, 
            dim:{r:164/255, g:80/255, b:61/255, a:1},
        },
    };
    
    var design = {
        name:'musicalKeyboard',
        x:x, y:y, angle:a,
        space:[
            { x:0,                                  y:0                                     },
            { x:measurements.drawing.width -offset, y:0                                     },
            { x:measurements.drawing.width -offset, y:measurements.drawing.height -offset   },
            { x:0,                                  y:measurements.drawing.height -offset   },
        ],
        elements:[
            {collection:'dynamic', type:'connectionNode_data', name:'midiIn', data:{ 
                x:measurements.drawing.width-3.5, y:10, width:5, height:15, angle:0, cableVersion:2, style:style.connectionNode.data,
                onreceive:function(address, data){ if(address != 'midinumber'){return;} sendMidiData(data.num-midiNumberOffset,data.velocity>0?'press':'release'); },
            }},
            {collection:'dynamic', type:'connectionNode_data', name:'midiOut', data:{ 
                x:0, y:117.5, width:5, height:15, angle:Math.PI, cableVersion:2, style:style.connectionNode.data
            }},
            {collection:'dynamic', type:'connectionNode_voltage', name:'velocityIn', data:{ 
                x:25, y:measurements.drawing.height-3.5, width:5, height:10, angle:Math.PI*0.5, cableVersion:2,
                style:{ dim:style.connectionNode.voltage.dim, glow:style.connectionNode.voltage.glow, cable_dim:style.connectionCable.voltage.dim, cable_glow:style.connectionCable.voltage.glow },
                onchange:function(value){ object.elements.dial_colourWithIndent_continuous.velocity.set(value); },
            }},

            {collection:'basic', type:'image', name:'backing', 
                data:{ x:-offset/2, y:-offset/2, width:measurements.drawing.width, height:measurements.drawing.height, url:imageStoreURL_localPrefix+'backing.png' }
            },

            {collection:'control', type:'dial_colourWithIndent_continuous',name:'velocity',data:{
                x:20, y:110, radius:25/2, startAngle:(3*Math.PI)/4, maxAngle:1.5*Math.PI, value:0, arcDistance:1.2, resetValue:0.5,
                style:{ handle:style.primaryEight[5], slot:{r:0,g:0,b:0,a:0}, needle:{r:1,g:1,b:1,a:1} },
            }},
        ]
    };
    //dynamic design
        var keyPattern = 'wbwbwwbwbwbw'.split('');

        //white keys
            var whiteOffset = 0;
            for(var a = 0; a < keyCount; a++){
                var keyType = keyPattern[a%keyPattern.length];
    
                if(keyType == 'w'){
                    design.elements.unshift(
                        {collection:'dynamic', type:'connectionNode_signal', name:'activateKey_'+a, data:{ 
                            x:55 +whiteOffset - 0.5, y:measurements.drawing.height -offset, width:5, height:9, angle:Math.PI*0.5, cableVersion:2, style:style.connectionNode.signal,
                            onchange:(function(keyNumber){ return function(value){ sendMidiData(keyNumber,value?'press':'release'); } })(a),
                        }},
                    );
                    design.elements.push(
                        {collection:'display', type:'glowbox_rectangle',name:'LED'+a,data:{ x:41.25 +whiteOffset, y:6, width:17.5, height:1, style:colours.LEDs }},
                        {collection:'control', type:'button_rectangle', name:'key_'+a, data:{ 
                            x:40.5 +whiteOffset, y:10, width:19, height:120, style:colours.whiteKey,
                            onpress:(function(keyNumber){ return function(){sendMidiData(keyNumber,'press');} })(a),
                            onrelease:(function(keyNumber){ return function(){sendMidiData(keyNumber,'release');} })(a),
                        }},
                    );
                    whiteOffset += 20;
                }
            }
        //black keys
            var blackOffset = 0;

            for(var a = 0; a < keyCount; a++){
                var keyType = keyPattern[a%keyPattern.length];
    
                if(keyType == 'b'){
                    design.elements.unshift(
                        {collection:'dynamic', type:'connectionNode_signal', name:'activateKey_'+a, data:{ 
                            x:65 +blackOffset - 0.5, y:measurements.drawing.height -offset, width:5, height:9, angle:Math.PI*0.5, cableVersion:2, style:style.connectionNode.signal,
                            onchange:(function(keyNumber){ return function(value){ sendMidiData(keyNumber,value?'press':'release'); } })(a),
                        }},
                    );
                    design.elements.push(
                        {collection:'display', type:'glowbox_rectangle',name:'LED'+a,data:{ x:51.25 +blackOffset, y:2.75, width:17.5, height:1, style:colours.LEDs }},
                        {collection:'control', type:'button_rectangle', name:'key_'+a, data:{ 
                            x:55 +blackOffset, y:10, width:10, height:70, style:colours.blackKey,
                            onpress:(function(keyNumber){ return function(){sendMidiData(keyNumber,'press');} })(a),
                            onrelease:(function(keyNumber){ return function(){sendMidiData(keyNumber,'release');} })(a),
                        }},
                    );
                    blackOffset += 20;
                }
                if(keyType == keyPattern[(a-1)%keyPattern.length]){ blackOffset += 20; }
            }
    
    //main object
        var object = _canvas_.interface.unit.builder(design);

    //keycapture
        object.elements.image.backing.glyphs = [ '`','a','z','s','x','c','f','v','g','b','h','n','m','k',',','l','.','/', '1','q','2','w','3','e','r','5','t','6','y','u','8','i','9','o','0','p','[' ]; 
        object.elements.image.backing.onkeydown = function(x,y,event){
            if( this.glyphs.includes(event.key) ){
                object.elements.button_rectangle['key_'+this.glyphs.indexOf(event.key)].press();
            }
        };
        object.elements.image.backing.onkeyup = function(x,y,event){
            if( this.glyphs.includes(event.key) ){
                object.elements.button_rectangle['key_'+this.glyphs.indexOf(event.key)].release();
            }
        };

    //circuitry
        function sendMidiData(keyNumber,mode){
            if(keyNumber < 0){return;}

            if(mode == 'press'){
                object.elements.glowbox_rectangle['LED'+keyNumber].on();
            }else{
                object.elements.glowbox_rectangle['LED'+keyNumber].off();
            }

            object.io.data.midiOut.send('midinumber', { 
                num:keyNumber+midiNumberOffset,
                velocity: mode == 'press' ? object.elements.dial_colourWithIndent_continuous.velocity.get() : 0,
            } );
        }

    //import/export
        object.exportData = function(){ return {velocity:object.elements.dial_colourWithIndent_continuous.velocity.get()}; };
        object.importData = function(data){ object.elements.dial_colourWithIndent_continuous.velocity.set(data.velocity); };

    //interface
        object.i = {
            velocity:function(value){ object.elements.dial_colourWithIndent_continuous.velocity.set(value); },
            pushKey:function(key){ object.elements.button_rectangle['key_'+key].press(); },
            releaseKey:function(key){ object.elements.button_rectangle['key_'+key].release();},
            releaseAllKeys:function(){ for(var a = 0; a < keyCount; a++){ object.elements.button_rectangle['key_'+a].release(); } },
        };
        
    return object;
};



this.musicalKeyboard.metadata = {
    name:'Musical Keyboard',
    category:'humanInterfaceDevices',
    helpURL:'/help/units/beta/musicalKeyboard/'
};