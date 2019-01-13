this.musicalKeyboard = function(x,y,a){
    var state = {
        velocity:0.5,
    };
    var style = {
        background:{fill:'rgba(200,200,200,1)'},
        h1:{fill:'rgba(0,0,0,1)', font:'4pt Courier New'},
        h2:{fill:'rgba(0,0,0,1)', font:'3pt Courier New'},
        dial:{
            handle:{fill:'rgba(220,220,220,1)'},
            slot:{fill:'rgba(50,50,50,1)'},
            needle:{fill:'rgba(250,150,150,1)'},
        },
        keys:{
            white:{
                background__up__fill:'rgba(250,250,250,1)',
                background__press__fill:'rgba(230,230,230,1)',
                background__glow__fill:'rgba(220,200,220,1)',
                background__glow_press__fill:'rgba(200,150,200,1)',
            },
            black:{
                background__up__fill:'rgba(50,50,50,1)',
                background__press__fill:'rgba(100,100,100,1)',
                background__glow__fill:'rgba(220,200,220,1)',
                background__glow_press__fill:'rgba(200,150,200,1)',
            }
        }
    };
    var design = {
        name: 'musicalKeyboard',
        category:'humanInputDevices',
        collection: 'alpha',
        x:x, y:y, a:a,
        space:[{x:0,y:0}, {x:320,y:0}, {x:320,y:62.5}, {x:0,y:62.5}],
        // spaceOutline:true,
        elements:[
            {type:'polygon', name:'backing', data:{ points:[{x:0,y:0}, {x:320,y:0}, {x:320,y:62.5}, {x:0,y:62.5}], style:style.background }},

            {type:'connectionNode_data', name:'midiout', data:{ 
                x: -5, y: 5, width: 5, height: 10,
            }},
            {type:'connectionNode_data', name:'midiin', data:{ 
                x: 320, y: 5, width: 5, height: 10,
                onreceive:function(address,data){
                    if(address != 'midinumber'){return;}
                    if(data.velocity > 0){ object.elements.button_rect[workspace.library.audio.num2name(data.num)].press();   }
                                     else{ object.elements.button_rect[workspace.library.audio.num2name(data.num)].release(); }
                },
            }},

            //velocity dial
            {type:'text', name:'velocity_title', data:{x:5,  y:59,   text:'velocity', style:style.h1}},
            {type:'text', name:'velocity_0',     data:{x:4,  y:55,   text:'0',        style:style.h2}},
            {type:'text', name:'velocity_1/2',   data:{x:14, y:26.5, text:'1/2',      style:style.h2}},
            {type:'text', name:'velocity_1',     data:{x:29, y:55,   text:'1',        style:style.h2}},
            {type:'dial_continuous',name:'velocity_dial',data:{
                x:17.5, y:42, r:12, startAngle:(3*Math.PI)/4, maxAngle:1.5*Math.PI, resetValue:0.5, value:0.5,
                style:{handle:style.dial.handle.fill, slot:style.dial.slot.fill, needle:style.dial.needle.fill},
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
                        {type:'button_rect', name:noteNames[a], data:{
                            x:whiteX, y:12.5, width:whiteKeyWidth, height:50, hoverable:false,
                            style:style.keys.white,
                            onpress:function(){ object.io.data.midiout.send('midinumber', { num:workspace.library.audio.name2num(this.name), velocity:state.velocity } ); },
                            onrelease:function(){ object.io.data.midiout.send('midinumber', { num:workspace.library.audio.name2num(this.name), velocity:0 } ); },
                        }}
                    );
                    whiteX += whiteKeyWidth;
                }
            }

            var count = 0;
            for(var a = 0; a < glyphs.length; a++){
                if( noteNames[a].slice(-1) == '#' ){
                    design.elements.push(
                        {type:'button_rect', name:noteNames[a], data:{
                            x:blackX, y:12.5, width:5, height:30, hoverable:false,
                            style:style.keys.black,
                            onpress:function(){ object.io.data.midiout.send('midinumber', { num:workspace.library.audio.name2num(this.name), velocity:state.velocity } ); },
                            onrelease:function(){ object.io.data.midiout.send('midinumber', { num:workspace.library.audio.name2num(this.name), velocity:0 } ); },
                        }}
                    );
                    blackX += whiteKeyWidth;
                    count = 0;
                }else{ count++; }
                
                if(count > 1){ blackX += whiteKeyWidth; }
            }


    //main object
        var object = alphaUnit.builder(this.musicalKeyboard,design);

    //keycapture
        object.onkeydown = function(x,y,event){
            if( glyphs.includes(event.key) ){
                object.elements.button_rect[noteNames[glyphs.indexOf(event.key)]].press();
            }
        };
        object.onkeyup = function(x,y,event){
            if( glyphs.includes(event.key) ){
                object.elements.button_rect[noteNames[glyphs.indexOf(event.key)]].release();
            }
        };

    //wiring
        

    //interface
        object.i = {
            velocity:function(a){object.elements.dial_continuous.velocity.set(a);},
        };

    return object;
};

this.musicalKeyboard.metadata = {
    name:'Musical Keyboard',
    helpURL:'https://curve.metasophiea.com/help/units/alpha/musicalKeyboard/'
};