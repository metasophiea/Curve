this.basicSequencer = function(x,y,debug=false){
    var vals = {
        sequencer:{
            width:64, height:10,
        }
    };

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
        type: 'basicSequencer',
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
            //main sequencer
                {type:'sequencer', name:'main', data:{
                    x:10, y:20, width:780, height:170, 
                    xCount:vals.sequencer.width, yCount:vals.sequencer.height,
                    event:function(event){
                        for(var a = 0; a < event.length; a++){
                            design.connectionNode_data['output_'+event[a].line].send('hit',{velocity:event[a].strength});
                        }
                    },
                    onchangeviewarea:function(data){
                        design.rangeslide.viewselect.set( {start:data.left, end:data.right}, false );
                    },
                }},
                {type:'rangeslide', name:'viewselect', data:{
                    x:10, y:20, height: 780, width: 10, angle:-Math.PI/2, handleHeight:1/32, spanWidth:1,
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
                    x:10, y:200, height: 780, width: 10, angle:-Math.PI/2, handleHeight:1/32, spanWidth:0.75,
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
                {type:'button_rect_3', name:'progress', data:{
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
                {type:'button_rect_3', name:'reset', data:{
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
    //dynamic design
        for(var a = 0; a < vals.sequencer.height; a++){
            design.elements.push(
                {type:'connectionNode_data', name:'output_'+a, data:{ 
                    x: -5, y: 11+a*(180/vals.sequencer.height), width: 5, height:(180/vals.sequencer.height)-2,
                    receive:function(){design.sequencer.main.playheadPosition(0);}
                }},
            );
        }


    //main object
        var obj = __globals.utility.misc.objectBuilder(objects.basicSequencer,design);

    //import/export
        obj.exportData = function(){
            return {
                loop:{
                    active:design.checkbox_rect.loopActive.get(),
                    range:design.sequencer.main.loopPeriod(),
                },
                autofollow:design.checkbox_rect.followPlayhead.get(),
                notes:design.sequencer.main.getAllNotes(),
            };
        };
        obj.importData = function(data){
            design.sequencer.main.addNotes(data.notes);
            obj.i.loopActive(data.loop.active);
            design.rangeslide.loopSelect.set(data.loop.range);
            design.checkbox_rect.followPlayhead.set(data.autofollow);
        };

    //interface
        obj.i = {
            addNote:function(line, position, length, strength=1){design.sequencer.main.addNote(line, position, length, strength);},
            addNotes:function(data){design.sequencer.main.addNotes(data);},
            getNotes:function(){return design.sequencer.main.getAllNotes();},
            loopActive:function(a){design.checkbox_rect.loopActive.set(a);},
        };

    return obj;
};

this.basicSequencer.metadata = {
    name:'Basic Sequencer (Multi Pulse Out)',
    helpurl:'https://metasophiea.com/curve/help/object/basicSequencer_pulseOut/'
};