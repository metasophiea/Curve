this.musicalkeyboard = function(x,y,debug=false){
    var state = {
        velocity:0.5,
    };
    var style = {
        background:'fill:rgba(200,200,200,1)',
        h1: 'fill:rgba(0,0,0,1); font-size:4px; font-family:Courier New;',
        dial:{
            handle: 'fill:rgba(220,220,220,1)',
            slot: 'fill:rgba(50,50,50,1)',
            needle: 'fill:rgba(250,150,150,1)',
            arc: 'fill:none; stroke:rgb(150,150,150); stroke-width:1;',
        },
        keys:{
            white:{
                off:'fill:rgba(250,250,250,1)',
                press:'fill:rgba(230,230,230,1)',
                glow:'fill:rgba(220,200,220,1)',
                pressAndGlow:'fill:rgba(200,150,200,1)',
            },
            black:{
                off:'fill:rgba(50,50,50,1)',
                press:'fill:rgba(100,100,100,1)',
                glow:'fill:rgba(220,200,220,1)',
                pressAndGlow:'fill:rgba(200,150,200,1)',
            }
        }
    };
    var design = {
        type: 'musicalkeyboard',
        x: x, y: y,
        base: {
            type:'path',
            points:[ {x:0,y:0}, {x:320,y:0}, {x:320,y:62.5}, {x:0,y:62.5} ], 
            style:style.background
        },
        elements:[
            {type:'connectionNode_data', name:'midiout', data:{ 
                x: -5, y: 5, width: 5, height: 10,
            }},
            {type:'connectionNode_data', name:'midiin', data:{ 
                x: 320, y: 5, width: 5, height: 10,
                receive:function(address,data){
                    if(address != 'midinumber'){return;}
                    if(data.velocity > 0){ design.key_rect[__globals.audio.num2name(data.num)].press();   }
                                     else{ design.key_rect[__globals.audio.num2name(data.num)].release(); }
                },
            }},

            //velocity dial
            {type:'label', name:'velocity_title', data:{x:9,  y:59,   text:'velocity', style:style.h1}},
            {type:'label', name:'velocity_0',     data:{x:4,  y:55,   text:'0',        style:style.h1}},
            {type:'label', name:'velocity_1/2',   data:{x:14, y:26.5, text:'1/2',      style:style.h1}},
            {type:'label', name:'velocity_1',     data:{x:28, y:55,   text:'1',        style:style.h1}},
            {type:'dial_continuous',name:'velocity',data:{
                x:17.5, y:42, r: 12, startAngle: (3*Math.PI)/4, maxAngle: 1.5*Math.PI, arcDistance: 1.2, 
                style:{handle:style.dial.handle, slot:style.dial.slot, needle:style.dial.needle, outerArc:style.dial.arc},
                onchange:function(value){ state.velocity = value; }
            }},
        ]
    };
    //dynamic design
        //placement of keys
            var glyphs = [ '\\','a','z','s','x','c','f','v','g','b','h','n','m','k',',','l','.','/', '1','q','2','w','3','e','r','5','t','6','y','u','8','i','9','o','0','p','[' ];
            var noteNames = [ '4C', '4C#', '4D', '4D#', '4E', '4F', '4F#', '4G', '4G#', '4A', '4A#', '4B', '5C', '5C#', '5D', '5D#', '5E', '5F', '5F#', '5G', '5G#', '5A', '5A#', '5B', '6C', '6C#', '6D', '6D#', '6E', '6F', '6F#', '6G', '6G#', '6A', '6A#', '6B', '7C' ];
            var whiteX = 35;
            var whiteKeyWidth = 12.5;
            var blackX = 45;

            for(var a = 0; a < glyphs.length; a++){
                if( noteNames[a].slice(-1) != '#' ){
                    design.elements.push(
                        {type:'key_rect', name:noteNames[a], data:{
                            x:whiteX, y:12.5, width:whiteKeyWidth, height:50,
                            style:{
                                off:style.keys.white.off, press:style.keys.white.press,
                                glow:style.keys.white.glow, pressAndGlow:style.keys.white.pressAndGlow,
                            },
                            keydown:function(){ obj.io.midiout.send('midinumber', { num:__globals.audio.name2num(this.id), velocity:state.velocity } ); },
                            keyup:function(){ obj.io.midiout.send('midinumber', { num:__globals.audio.name2num(this.id), velocity:0 } ); },
                        }}
                    );
                    whiteX += whiteKeyWidth;
                }
            }

            var count = 0;
            for(var a = 0; a < glyphs.length; a++){
                if( noteNames[a].slice(-1) == '#' ){
                    design.elements.push(
                        {type:'key_rect', name:noteNames[a], data:{
                            x:blackX, y:12.5, width:5, height:30,
                            style:{
                                off:style.keys.black.off, press:style.keys.black.press,
                                glow:style.keys.black.glow, pressAndGlow:style.keys.black.pressAndGlow,
                            },
                            keydown:function(){ obj.io.midiout.send('midinumber', { num:__globals.audio.name2num(this.id), velocity:state.velocity } ); },
                            keyup:function(){ obj.io.midiout.send('midinumber', { num:__globals.audio.name2num(this.id), velocity:0 } ); },
                        }}
                    );
                    blackX += whiteKeyWidth;
                    count = 0;
                }else{ count++; }
                
                if(count > 1){ blackX += whiteKeyWidth; }
            }


    //main object
        var obj = __globals.utility.misc.objectBuilder(objects.musicalkeyboard,design);

    //keycapture
        var keycaptureObj = __globals.keyboardInteraction.declareKeycaptureObject(obj,{none:glyphs});
        keycaptureObj.keyPress = function(key){ design.key_rect[noteNames[glyphs.indexOf(key)]].press(); };
        keycaptureObj.keyRelease = function(key){ design.key_rect[noteNames[glyphs.indexOf(key)]].release(); };

    //interface
        obj.i = {
            velocity:function(a){design.dial_continuous.velocity.set(a);},
        };

    //setup
        design.dial_continuous.velocity.set(0.5);

    return obj;
};

this.musicalkeyboard.metadata = {
    name:'Musical Keyboard',
    helpurl:'https://metasophiea.com/curve/help/object/musicalKeyboard/'
};