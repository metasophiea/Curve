this.pianoroll = function(x,y,debug=false){
    var height = 37;
    var width = 128;
    var topNoteNumber = 108;
    var style = {
        background:'fill:rgba(200,200,200,1)',
        rangeslide:{
            handle:'fill:rgba(240,240,240,1)',
            backing:'fill:rgba(150,150,150,1)',
            slot:'fill:rgba(50,50,50,1)',
            invisibleHandle:'fill:rgba(0,0,0,0);',
            span:'fill:rgba(220,220,220,1)',
        },
        button:{
            up:'fill:rgba(220,220,220,1)',
            hover:'fill:rgba(240,240,240,1)',
            down:'fill:rgba(180,180,180,1)',
            glow:'fill:rgba(220,200,220,1)',
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
        type: 'pianoroll',
        x: x, y: y,
        base: {
            type:'path',
            points:[ 
                {x:0,y:0}, 
                {x:825,y:0}, 
                {x:825,y:210}, 
                {x:0,y:210}
            ], 
            style:style.background
        },
        elements:[
            {type:'rangeslide',name:'loopSelect', data:{
                x:35, y:200, height: 780, width: 10, angle:-Math.PI/2, handleHeight:1/width, spanWidth:1,
                style:{
                    handle: style.rangeslide.handle,
                    backing: style.rangeslide.backing,
                    slot: style.rangeslide.slot,
                    invisibleHandle: style.rangeslide.invisibleHandle,
                    span: style.rangeslide.span,
                },
                onchange:function(values){
                    var a = Math.round(values[0]*width);
                    var b = Math.round(values[1]*width);
                    if(b == 0){b = 1;}
                    pianoroll.loopPeriod({start:a,end:b});
                },
            }},            
            {type:'button_rect', name:'restart', data:{
                x:10, y:190, width:25, height:10,
                style:{
                    up:style.button.up,
                    hover:style.button.hover,
                    down:style.button.down,
                    glow:style.button.glow,
                },
                onclick:function(){
                    pianoroll.position(0);
                },
            }},
            {type:'connectionNode_data', name:'midiout', data:{ 
                x: -5, y: 5, width: 5, height: 20,
            }},
            {type:'connectionNode_data', name:'pulse', data:{ 
                x: 825, y: 5, width: 5, height: 20,
                receive:function(){pianoroll.progress();}
            }},
        ]
    };
    //dynamic design
        var mux_1 = 180/height;
        function keyDown(keyID){
            obj.io.midiout.send( 'midinumber', { num: topNoteNumber-parseInt(keyID), velocity:1 } );
        }
        function keyUp(keyID){
            obj.io.midiout.send( 'midinumber', { num: topNoteNumber-parseInt(keyID), velocity:0 } );
        }

        design.elements.push(
            {type:'key_rect', name:0, data:{
                x:10, y:10, width:25, height:mux_1,
                style:style.keys.white,
                keydown:function(){keyDown(this.id);},
                keyup:function(){keyUp(this.id);},
            }}
        );
        //white keys
            for(var a = 1; a < height; a++){
                var temp = [
                    {y:10+mux_1*a,       height:1.5*mux_1 },
                    null,
                    {y:10+mux_1*(a-0.5), height:2*mux_1   },
                    null,
                    {y:10+mux_1*(a-0.5), height:2*mux_1   },
                    null,
                    {y:10+mux_1*(a-0.5), height:2*mux_1   },
                    {y:10+mux_1*a,       height:1.5*mux_1 },
                    null,
                    {y:10+mux_1*(a-0.5), height:2*mux_1   },
                    null,
                    {y:10+mux_1*(a-0.5), height:1.5*mux_1 },
                ][(a-1)%12];
                if(temp == null){continue;}
                design.elements.push(
                    {type:'key_rect', name:a, data:{
                        x:10, y:temp.y, width:25, height:temp.height,
                        style:style.keys.white,
                        keydown:function(){keyDown(this.id);},
                        keyup:function(){keyUp(this.id);},
                    }}
                );
            }
        //black keys
            for(var a = 1; a < height; a++){
                var temp = [ false, true, false, true, false, true, false, false, true, false, true, false ];
                if(!temp[(a-1)%12]){continue;}
                design.elements.push(
                    {type:'key_rect', name:a, data:{
                        x:10, y:10+mux_1*a, width:15, height:mux_1,
                        style:style.keys.black,
                        keydown:function(){keyDown(this.id);},
                        keyup:function(){keyUp(this.id);},
                    }}
                );
            }
            


    //internal functions
        function roll2midi(event){
            return {
                num: topNoteNumber - event.line,
                velocity:event.strength,
            };
        }

    //main object
        var obj = __globals.utility.experimental.objectBuilder(objects.pianoroll,design);

        //pianoroll
            var pianoroll = parts.elements.control.pianoroll('mainroll', 35, 10, 780, 180, 0, width, height) 
            obj.appendChild( pianoroll );
            pianoroll.loopPeriod({start:0,end:width});
            pianoroll.event = function(events){
                for(var a = 0; a < events.length; a++){ 
                    obj.io.midiout.send( 'midinumber', roll2midi(events[a]) ); 
                }
            };

    //interface
        obj.i = {
            addNotes:function(noteData){pianoroll.addNotes(noteData);},
            loopSelect:function(data={start:0,end:1}){design.rangeslide.loopSelect.set(data);},
            restart:function(){design.button_rect.restart.click();},
            dumpNotes:function(){return pianoroll.allNotes();},
        };

    return obj;
};