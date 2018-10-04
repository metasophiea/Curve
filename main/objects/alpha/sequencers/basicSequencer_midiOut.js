this.basicSequencer_midiOut = function(x,y,debug=false){
    var vals = {
        sequencer:{
            width:64, //height:100,
            midiRange:{ bottom:24, top:131 },
            pattern:[0,0,1,0,1,0,1,0,0,1,0,1],
        }
    };
    //calculate pattern basied on midi range
    var temp = vals.sequencer.pattern.length - ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'].indexOf(system.audio.num2name(vals.sequencer.midiRange.top).slice(1))
    vals.sequencer.pattern = vals.sequencer.pattern.slice(temp).concat(vals.sequencer.pattern.slice(0,temp));

    var style = {
        background:'fill:rgba(200,200,200,1)',
        markings: {
            fill:'fill:rgba(150,150,150,1); pointer-events: none;',
            stroke:'fill:none; stroke:rgba(150,150,150,1); stroke-width:1; pointer-events: none;',
        },
        rangeslide:{
            handle:'fill:rgba(240,240,240,1)',
            backing:'fill:rgba(150,150,150,1)',
            slot:'fill:rgba(50,50,50,1)',
            invisibleHandle:'fill:rgba(0,0,0,0);',
            span:'fill:rgba(220,220,220,1)',
        },
        rangeslide_loop:{
            handle:'fill:rgba(240,240,240,1)',
            backing:'fill:rgba(150,150,150,1)',
            slot:'fill:rgba(50,50,50,1)',
            invisibleHandle:'fill:rgba(0,0,0,0);',
            span:'fill:rgba(255,247,145,0.5)',
        },
        button:{
            up:'fill:rgba(220,220,220,1)',
            hover:'fill:rgba(240,240,240,1)',
            down:'fill:rgba(180,180,180,1)',
            glow:'fill:rgba(220,200,220,1)',
        },
        checkbox:{
            backing:'fill:rgba(229, 229, 229,1)',
            check:'fill:rgba(252,252,252,1)',
        },
        checkbox_loop:{
            backing:'fill:rgba(229, 221, 112,1)',
            check:'fill:rgba(252,244,128,1)',
        },
    };

    var design = {
        type: 'basicSequencer_midiOut',
        x: x, y: y,
        base: {
            type:'path',
            points:[ 
                {x:0,y:0}, 
                {x:800,y:0}, 
                {x:800,y:210}, 
                {x:140,y:210},
                {x:115,y:225},
                {x:0,y:225}
            ], 
            style:style.background
        },
        elements:[
            //midi out
                {type:'connectionNode_data', name:'midiout', data:{
                    x: -5, y: 11.25, width: 5, height: 17.5,
                }},


            //main sequencer
                {type:'sequencer', name:'main', data:{
                    x:20, y:20, width:770, height:170, 
                    xCount:vals.sequencer.width, yCount:vals.sequencer.midiRange.top-vals.sequencer.midiRange.bottom+1,
                    event:function(event){
                        for(var a = 0; a < event.length; a++){
                            design.connectionNode_data.midiout.send('midinumber',{num:midiNumber_line_converter(event[a].line), velocity:event[a].strength});
                        }
                    },
                    style:{
                        horizontalStrip_pattern:vals.sequencer.pattern
                    },
                    onchangeviewarea:function(data){
                        design.rangeslide.viewselect_x.set( {start:data.left, end:data.right}, false );
                        design.rangeslide.viewselect_y.set( {start:data.top, end:data.bottom}, false );
                    },
                }},
                {type:'rangeslide', name:'viewselect_y', data:{
                    x:10, y:20, height:170, width: 10, angle:0, handleHeight:1/16, spanWidth:1,
                    style:{
                        handle: style.rangeslide.handle,
                        backing: style.rangeslide.backing,
                        slot: style.rangeslide.slot,
                        invisibleHandle: style.rangeslide.invisibleHandle,
                        span: style.rangeslide.span,
                    },
                    onchange:function(values){ design.sequencer.main.viewArea({top:values.start,bottom:values.end},false); },
                }},
                {type:'rangeslide', name:'viewselect_x', data:{
                    x:20, y:20, height: 770, width: 10, angle:-Math.PI/2, handleHeight:1/32, spanWidth:1,
                    style:{
                        handle: style.rangeslide.handle,
                        backing: style.rangeslide.backing,
                        slot: style.rangeslide.slot,
                        invisibleHandle: style.rangeslide.invisibleHandle,
                        span: style.rangeslide.span,
                    },
                    onchange:function(values){ design.sequencer.main.viewArea({left:values.start,right:values.end},false); },
                }},

            //follow playhead
                {type:'checkbox_rect', name:'followPlayhead',data:{
                    x:100, y:205, width:15, height:15,
                    style:{
                        backing:style.checkbox.backing,
                        check:style.checkbox.check,
                    },
                    onchange:function(value){design.sequencer.main.automove(value);}
                }},

            //loop control   
                //activation
                {type:'checkbox_rect', name:'loopActive',data:{
                    x:70, y:205, width:25, height:15,
                    style:{
                        backing:style.checkbox_loop.backing,
                        check:style.checkbox_loop.check,
                    },
                    onchange:function(value){design.sequencer.main.loopActive(value);}
                }},
                //range
                {type:'rangeslide', name:'loopSelect', data:{
                    x:20, y:200, height: 770, width: 10, angle:-Math.PI/2, handleHeight:1/64, spanWidth:0.75,
                    style:{
                        handle: style.rangeslide_loop.handle,
                        backing: style.rangeslide_loop.backing,
                        slot: style.rangeslide_loop.slot,
                        invisibleHandle: style.rangeslide_loop.invisibleHandle,
                        span: style.rangeslide_loop.span,
                    },
                    onchange:function(values){ 
                        var a = Math.round(values.start*vals.sequencer.width);
                        var b = Math.round(values.end*vals.sequencer.width);
                        if(b == 0){b = 1;}
                        design.sequencer.main.loopPeriod(a,b);
                    },
                }},    

            //progression
                //button
                {type:'button_rect', name:'progress', data:{
                    x:10, y:205, width:25, height:15,
                    style:{
                        up:style.button.up,
                        hover:style.button.hover,
                        hover_press:style.button.down,
                    },
                    onpress:function(){design.sequencer.main.progress();},
                }},     
                //connection node
                {type:'connectionNode_data', name:'progress', data:{ 
                    x: 800, y: 5, width: 5, height: 20,
                    receive:function(){design.sequencer.main.progress();}
                }},
                //symbol
                {type:'path', name:'progress_arrow', data:{ path:[{x:20, y:209},{x:25,y:212.5},{x:20, y:216}], style:style.markings.stroke }},


            //reset
                //button
                {type:'button_rect', name:'reset', data:{
                    x:40, y:205, width:25, height:15,
                    style:{
                        up:style.button.up,
                        hover:style.button.hover,
                        hover_press:style.button.down,
                    },
                    onpress:function(){design.sequencer.main.playheadPosition(0);},
                }},
                //connection node
                {type:'connectionNode_data', name:'reset', data:{ 
                    x: 800, y: 30, width: 5, height: 20,
                    receive:function(){design.sequencer.main.playheadPosition(0);}
                }},
                //symbol
                {type:'path', name:'reset_arrow', data:{ path:[{x:55, y:209},{x:50,y:212.5},{x:55, y:216}], style:style.markings.stroke }},
                {type:'path', name:'reset_line', data:{ path:[{x:49, y:209},{x:49, y:216}], style:style.markings.stroke }},
        ]
    };

    //internal functions
        function midiNumber_line_converter(num){ return vals.sequencer.midiRange.top - num; }

    //main object
        var obj = system.utility.misc.objectBuilder(objects.basicSequencer_midiOut,design);

    //import/export
        obj.exportData = function(){
            return {
                loop:{
                    active:design.checkbox_rect.loopActive.get(),
                    range:design.sequencer.main.loopPeriod(),
                },
                autofollow:design.checkbox_rect.followPlayhead.get(),
                notes:design.sequencer.main.getAllNotes(),
                viewArea:design.sequencer.main.viewArea(),
            };
        };
        obj.importData = function(data){
            design.sequencer.main.addNotes(data.notes);
            obj.i.loopActive(data.loop.active);
            design.rangeslide.loopSelect.set(data.loop.range);
            design.checkbox_rect.followPlayhead.set(data.autofollow);
            design.sequencer.main.viewArea(data.viewArea);
        };

    //interface
        obj.i = {
            addNote:function(number, position, length, strength=1){design.sequencer.main.addNote(midiNumber_line_converter(number), position, length, strength);},
            addNotes:function(data){ for(var a = 0; a < data.length; a++){ this.addNote(data[a].line, data[a].position, data[a].length, data[a].strength); } },
            getNotes:function(){return design.sequencer.main.getAllNotes();},
            loopActive:function(a){design.checkbox_rect.loopActive.set(a);},
            stepSize:design.sequencer.main.step,
        };

    //setup
        design.rangeslide.viewselect_y.set({start:0.3, end:0.7});

    return obj;
};

this.basicSequencer_midiOut.metadata = {
    name:'Basic Sequencer (Midi Out)',
    helpurl:'https://metasophiea.com/curve/help/objects/basicSequencer_midiOut/'
};