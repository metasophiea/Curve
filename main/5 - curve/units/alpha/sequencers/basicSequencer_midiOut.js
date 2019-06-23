this.basicSequencer_midiOut = function(x,y,a){
    var vals = {
        sequencer:{
            width:64, height:undefined,
            midiRange:{ bottom:24, top:131 },
            pattern:[0,0,1,0,1,0,1,0,0,1,0,1],
        }
    };
    vals.sequencer.height = vals.sequencer.midiRange.top - vals.sequencer.midiRange.bottom + 1;
    //calculate pattern based on midi range
        var temp = vals.sequencer.pattern.length - ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'].indexOf(_canvas_.library.audio.num2name(vals.sequencer.midiRange.top).slice(1))
        vals.sequencer.pattern = vals.sequencer.pattern.slice(temp).concat(vals.sequencer.pattern.slice(0,temp));

    var style = {
        background:{r:200/255,g:200/255,b:200/255,a:1},
        markings:{ colour:{r:150/255,g:150/255,b:150/255,a:1}, thickness:0.5},
        rangeslide:{
            handle:{r:240/255,g:240/255,b:240/255,a:1},
            backing:{r:150/255,g:150/255,b:150/255,a:1},
            slot:{r:50/255,g:50/255,b:50/255,a:1},
            invisibleHandle:{r:0/255,g:0/255,b:0/255,a:0},
            span:{r:220/255,g:220/255,b:220/255,a:1},
        },
        rangeslide_loop:{
            handle:{r:240/255,g:240/255,b:240/255,a:1},
            backing:{r:150/255,g:150/255,b:150/255,a:1},
            slot:{r:50/255,g:50/255,b:50/255,a:1},
            span:{r:255/255,g:247/255,b:145/255,a:0.5},
        },
        button:{
            background__up__colour:{r:220/255,g:220/255,b:220/255,a:1}, 
            background__hover__colour:{r:240/255,g:240/255,b:240/255,a:1}, 
            background__hover_press__colour:{r:180/255,g:180/255,b:180/255,a:1},
        },
        checkbox:{
            backing:{r:229/255,g: 229/255,b: 229/255,a:1},
            check:{r:252/255,g:252/255,b:252/255,a:1},
        },
        checkbox_loop:{
            backing:{r:229/255,g: 221/255,b: 112/255,a:1},
            check:{r:252/255,g:244/255,b:128/255,a:1},
        },
    };

    var design = {
        name: 'basicSequencer_midiOut',
        category:'sequencers',
        collection: 'alpha',
        x:x, y:y, a:a,
        space:[{x:0,y:0}, {x:800,y:0}, {x:800,y:210}, {x:140,y:210}, {x:115,y:225}, {x:0,y:225}],
        // spaceOutline:true,
        elements:[
            {collection:'basic', type:'polygon', name:'backing', data:{ pointsAsXYArray:[{x:0,y:0}, {x:800,y:0}, {x:800,y:210}, {x:140,y:210}, {x:115,y:225}, {x:0,y:225}], colour:style.background }},

            //midi out
                {collection:'dynamic', type:'connectionNode_data', name:'midiout', data:{ x: -5, y: 11.25, width: 5, height: 17.5 }},

            //main sequencer
                {collection:'control', type:'sequencer', name:'main', data:{ x:20, y:20, width:770, height:170, xCount:vals.sequencer.width, yCount:vals.sequencer.height,
                    horizontalStripStyle_pattern:vals.sequencer.pattern,
                    event:function(event){
                        for(var a = 0; a < event.length; a++){
                            object.elements.connectionNode_data.midiout.send('midinumber',{num:midiNumber_line_converter(event[a].line), velocity:event[a].strength});
                        }
                    },
                    onpan:function(data){
                        object.elements.rangeslide.viewselect_y.set( {start:data.topLeft.y, end:data.bottomRight.y}, false );
                        object.elements.rangeslide.viewselect_x.set( {start:data.topLeft.x, end:data.bottomRight.x}, false );
                    },
                }},
                {collection:'control', type:'rangeslide', name:'viewselect_y', data:{ x:10, y:20, height:170, width: 10, angle:0, handleHeight:1/16, spanWidth:1, style:style.rangeslide }},
                {collection:'control', type:'rangeslide', name:'viewselect_x', data:{ x:20, y:20, height: 770, width: 10, angle:-Math.PI/2, handleHeight:1/64, spanWidth:1, style:style.rangeslide }},   

            //follow playhead
                {collection:'control', type:'checkbox_rectangle', name:'followPlayhead',data:{ x:100, y:205, width:15, height:15, style:style.checkbox,
                    onchange:function(value){object.elements.sequencer.main.automove(value);},
                }},

            //loop control
                {collection:'control', type:'checkbox_rectangle', name:'loopActive',data:{ x:70, y:205, width:25, height:15, style:style.checkbox_loop,
                    onchange:function(value){object.elements.sequencer.main.loopActive(value);},
                }},
                {collection:'control', type:'rangeslide', name:'loopSelect', data:{ x:10, y:200, height: 780, width: 10, angle:-Math.PI/2, handleHeight:1/64, spanWidth:0.75, style:style.rangeslide_loop }},    

            //progression
                {collection:'dynamic', type:'connectionNode_data', name:'progress_input', data:{ x: 800, y: 5, width: 5, height: 20,
                    onreceive:function(){object.elements.sequencer.main.progress();},
                }},
                {collection:'control', type:'button_rectangle', name:'progress_button', data:{ x:10, y:205, width:25, height:15, style:style.button,
                    onpress:function(){object.elements.sequencer.main.progress();},
                }},
                {collection:'basic', type:'path', name:'progress_arrow', data:{ pointsAsXYArray:[{x:20, y:209},{x:25,y:212.5},{x:20, y:216}], colour:style.markings.colour, thickness:style.markings.thickness }},

            //reset
                {collection:'dynamic', type:'connectionNode_data', name:'reset_input', data:{ x: 800, y: 30, width: 5, height: 20,
                    onreceive:function(){object.elements.sequencer.main.playheadPosition(0);},
                }},
                {collection:'control', type:'button_rectangle', name:'reset_button', data:{ x:40, y:205, width:25, height:15, style:style.button,
                    onpress:function(){object.elements.sequencer.main.playheadPosition(0);},
                }},
                {collection:'basic', type:'path', name:'reset_arrow', data:{ pointsAsXYArray:[{x:55, y:209},{x:50,y:212.5},{x:55, y:216}], colour:style.markings.colour, thickness:style.markings.thickness }},
                {collection:'basic', type:'path', name:'reset_line', data:{ pointsAsXYArray:[{x:49, y:209},{x:49, y:216}], colour:style.markings.colour, thickness:style.markings.thickness }},
        ]
    };

    //internal functions
        function midiNumber_line_converter(num){ return vals.sequencer.midiRange.top - num; }

    //main object
        var object = _canvas_.interface.unit.builder(this.basicSequencer,design);

    //wiring
        object.elements.rangeslide.viewselect_y.onchange = function(values){ object.elements.sequencer.main.viewarea({topLeft:{y:values.start}, bottomRight:{y:values.end}},false); };
        object.elements.rangeslide.viewselect_x.onchange = function(values){ object.elements.sequencer.main.viewarea({topLeft:{x:values.start}, bottomRight:{x:values.end}},false); };
        object.elements.rangeslide.loopSelect.onchange = function(values){ 
            var a = Math.round(values.start*vals.sequencer.width);
            var b = Math.round(values.end*vals.sequencer.width);
            if(b == 0){b = 1;}
            object.elements.sequencer.main.loopPeriod(a,b);
        };

    //import/export
        object.exportData = function(){
            return {
                loop:{
                    active: object.elements.checkbox_rectangle.loopActive.get(),
                    range: object.elements.rangeslide.loopSelect.get(),
                },
                autofollow: object.elements.checkbox_rectangle.followPlayhead.get(),
                notes: object.elements.sequencer.main.getAllSignals(),
                viewarea:{
                    horizontal: object.elements.rangeslide.viewselect_y.get(),
                    vertical: object.elements.rangeslide.viewselect_x.get(),
                }
            };
        };
        object.importData = function(data){
            object.elements.sequencer.main.addSignals(data.notes);
            object.i.loopActive(data.loop.active);
            object.elements.rangeslide.loopSelect.set(data.loop.range);
            object.elements.checkbox_rectangle.followPlayhead.set(data.autofollow);
            object.elements.rangeslide.viewselect_y.set(data.viewarea.horizontal);
            object.elements.rangeslide.viewselect_x.set(data.viewarea.vertical);
        };

    //interface
        object.i = {
            addNote:function(number, position, length, strength=1){object.elements.sequencer.main.addSignal(midiNumber_line_converter(number), position, length, strength);},
            addNotes:function(data){ for(var a = 0; a < data.length; a++){ this.addSignal(data[a].line, data[a].position, data[a].length, data[a].strength); } },
            getNotes:function(){return object.elements.sequencer.main.getAllSignals();},
            loopActive:function(a){object.elements.checkbox_rectangle.loopActive.set(a);},
            step:object.elements.sequencer.step,
        };

    //setup
        object.elements.rangeslide.viewselect_y.set({start:0.3, end:0.7});
        
    return object;
};

this.basicSequencer_midiOut.metadata = {
    name:'Basic Sequencer (Midi Out)',
    category:'sequencer',
    helpURL:'https://curve.metasophiea.com/help/units/alpha/basicSequencer_midiOut/'
};