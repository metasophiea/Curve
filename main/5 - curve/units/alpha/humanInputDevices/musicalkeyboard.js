this.musicalKeyboard = function(x,y,a){
    var state = {
        velocity:0.5,
    };
    var style = {
        background:{r:200/255,g:200/255,b:200/255,a:1},
        h1:{colour:{r:0/255,g:0/255,b:0/255,a:1}, size:3.5, ratio:1, font:'defaultThin', printingMode:{widthCalculation:'absolute',horizontal:'middle',vertical:'middle'}},
        h2:{colour:{r:150/255,g:150/255,b:150/255,a:1}, size:2, ratio:1.5, font:'defaultThin', printingMode:{widthCalculation:'absolute',horizontal:'middle',vertical:'middle'}},
        dial:{
            handle:{r:220/255,g:220/255,b:220/255,a:1},
            slot:{r:50/255,g:50/255,b:50/255,a:1},
            needle:{r:250/255,g:150/255,b:150/255,a:1},
        },
        keys:{
            white:{
                background__up__colour:{r:250/255,g:250/255,b:250/255,a:1},
                background__press__colour:{r:230/255,g:230/255,b:230/255,a:1},
                background__glow__colour:{r:220/255,g:200/255,b:220/255,a:1},
                background__glow_press__colour:{r:200/255,g:150/255,b:200/255,a:1},
            },
            black:{
                background__up__colour:{r:50/255,g:50/255,b:50/255,a:1},
                background__press__colour:{r:100/255,g:100/255,b:100/255,a:1},
                background__glow__colour:{r:220/255,g:200/255,b:220/255,a:1},
                background__glow_press__colour:{r:200/255,g:150/255,b:200/255,a:1},
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
            {collection:'basic', type:'polygon', name:'backing', data:{ pointsAsXYArray:[{x:0,y:0}, {x:320,y:0}, {x:320,y:62.5}, {x:0,y:62.5}], colour:style.background }},

            {collection:'dynamic', type:'connectionNode_data', name:'midiout', data:{ 
                x: -5, y: 5, width: 5, height: 10,
            }},
            {collection:'dynamic', type:'connectionNode_data', name:'midiin', data:{ 
                x: 320, y: 5, width: 5, height: 10,
                onreceive:function(address,data){
                    if(address != 'midinumber'){return;}
                    if(data.velocity > 0){ object.elements.button_rectangle[_canvas_.library.audio.num2name(data.num)].press();   }
                                     else{ object.elements.button_rectangle[_canvas_.library.audio.num2name(data.num)].release(); }
                },
            }},

            //velocity dial
            {collection:'basic', type:'text', name:'velocity_title', data:{x:17.5, y:56, text:'velocity', width:style.h1.size, height:style.h1.size*style.h1.ratio, colour:style.h1.colour, font:style.h1.font, printingMode:style.h1.printingMode}},
            {collection:'basic', type:'text', name:'velocity_0',     data:{x:8,    y:52, text:'0',        width:style.h2.size, height:style.h2.size*style.h2.ratio, colour:style.h2.colour, font:style.h2.font, printingMode:style.h2.printingMode}},
            {collection:'basic', type:'text', name:'velocity_1/2',   data:{x:17.5, y:28, text:'1/2',      width:style.h2.size, height:style.h2.size*style.h2.ratio, colour:style.h2.colour, font:style.h2.font, printingMode:style.h2.printingMode}},
            {collection:'basic', type:'text', name:'velocity_1',     data:{x:27,   y:52, text:'1',        width:style.h2.size, height:style.h2.size*style.h2.ratio, colour:style.h2.colour, font:style.h2.font, printingMode:style.h2.printingMode}},
            {collection:'control', type:'dial_continuous',name:'velocity_dial',data:{
                x:17.5, y:42, r:12, startAngle:(3*Math.PI)/4, maxAngle:1.5*Math.PI, resetValue:0.5, value:0.5,
                style:{handle:style.dial.handle, slot:style.dial.slot, needle:style.dial.needle},
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
                        {collection:'control', type:'button_rectangle', name:noteNames[a], data:{
                            x:whiteX, y:12.5, width:whiteKeyWidth, height:50, hoverable:false,
                            style:style.keys.white,
                            onpress:function(){ object.io.data.midiout.send('midinumber', { num:_canvas_.library.audio.name2num(this.name), velocity:state.velocity } ); },
                            onrelease:function(){ object.io.data.midiout.send('midinumber', { num:_canvas_.library.audio.name2num(this.name), velocity:0 } ); },
                        }}
                    );
                    whiteX += whiteKeyWidth;
                }
            }

            var count = 0;
            for(var a = 0; a < glyphs.length; a++){
                if( noteNames[a].slice(-1) == '#' ){
                    design.elements.push(
                        {collection:'control', type:'button_rectangle', name:noteNames[a], data:{
                            x:blackX, y:12.5, width:5, height:30, hoverable:false,
                            style:style.keys.black,
                            onpress:function(){ object.io.data.midiout.send('midinumber', { num:_canvas_.library.audio.name2num(this.name), velocity:state.velocity } ); },
                            onrelease:function(){ object.io.data.midiout.send('midinumber', { num:_canvas_.library.audio.name2num(this.name), velocity:0 } ); },
                        }}
                    );
                    blackX += whiteKeyWidth;
                    count = 0;
                }else{ count++; }
                
                if(count > 1){ blackX += whiteKeyWidth; }
            }


    //main object
        var object = _canvas_.interface.unit.builder(design);

    //keycapture
        object.elements.polygon.backing.onkeydown = function(event){
            if( glyphs.includes(event.key) ){
                object.elements.button_rectangle[noteNames[glyphs.indexOf(event.key)]].press();
            }
        };
        object.elements.polygon.backing.onkeyup = function(event){
            if( glyphs.includes(event.key) ){
                object.elements.button_rectangle[noteNames[glyphs.indexOf(event.key)]].release();
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
    category:'humanInputDevices',
    helpURL:'https://curve.metasophiea.com/help/units/alpha/musicalKeyboard/'
};