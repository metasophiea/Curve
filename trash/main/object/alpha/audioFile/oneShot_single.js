this.oneShot_single = function(x,y,debug=false){
    var style = {
        background:'fill:rgba(200,200,200,1)',
        markings: 'fill:rgba(150,150,150,1); pointer-events: none;',
        strokeMarkings: 'fill:none; stroke:rgba(150,150,150,1); stroke-width:1; pointer-events: none;',
    };
    var design = {
        name: 'oneShot_single',
        collection: 'alpha',
        x: x, y: y,
        base: {
            points:[{x:0,y:0},{x:220,y:0},{x:220,y:55},{x:0,y:55}], 
            style:style.background
        },
        elements:[
            {type:'connectionNode_audio', name:'outRight', data:{ type: 1, x: -10, y: 5, width: 10, height: 20 }},
            {type:'connectionNode_audio', name:'outLeft', data:{ type: 1, x: -10, y: 27.5, width: 10, height: 20 }},
            {type:'connectionNode_data', name:'trigger', data:{
                x: 220, y: 17.5, width: 10, height: 20,
                receive:function(address, data){ design.button_rect.fire.press(); design.button_rect.fire.release(); }
            }},

            //symbol
            {type:'path', name:'symbol_arrow', data:{ path:[{x:19, y:35},{x:25,y:40},{x:19, y:45}], style:style.strokeMarkings }},
            {type:'rect', name:'symbol_line', data:{ x:15, y:39.5, width:6, height:1, style:style.markings }},
            {type:'circle', name:'symbol_outterCircle', data:{ x:10, y:40, r:5.5, style:style.strokeMarkings }},
            {type:'rect', name:'symbol_1', data:{ x:9.5, y:37.5, width:1, height:5, style:style.markings }},

            {type:'button_rect', name:'loadFile', data: {
                x:5, y: 5, width:20, height:10,
                style:{ up:'fill:rgba(175,175,175,1)', hover:'fill:rgba(220,220,220,1)', hover_press:'fill:rgba(150,150,150,1)' },
                onpress: function(){
                    obj.oneShot.load('file',function(data){
                        design.grapher_waveWorkspace.grapher_waveWorkspace.draw( obj.oneShot.waveformSegment() );
                    });
                }
            }},
            {type:'button_rect',name:'fire',data:{
                x:5, y: 17.5, width:20, height:10,
                style:{ up:'fill:rgba(175,195,175,1)', hover:'fill:rgba(220,240,220,1)', hover_press:'fill:rgba(150,170,150,1)' }, 
                onpress:function(){
                    //no file = don't bother
                        if(obj.oneShot.duration() < 0){return;}
            
                    //actualy start the audio
                        obj.oneShot.fire();

                    //if there's a playhead, remove it
                        if(playhead){
                            design.grapher_waveWorkspace.grapher_waveWorkspace.genericNeedle(0);
                            playhead = false;
                            clearTimeout(playheadTimout);
                        }

                    //perform graphical movements
                        var duration = obj.oneShot.duration();
                        design.grapher_waveWorkspace.grapher_waveWorkspace.genericNeedle(0,0,'transition: transform '+duration+'s;transition-timing-function: linear;');
                        playhead = true;
                        setTimeout(function(){design.grapher_waveWorkspace.grapher_waveWorkspace.genericNeedle(0,1);},1);
                        playheadTimout = setTimeout(function(){
                            design.grapher_waveWorkspace.grapher_waveWorkspace.genericNeedle(0);
                            playhead = false;
                        },duration*1000);
                }
            }},

            {type:'grapher_waveWorkspace', name:'grapher_waveWorkspace', data:{
                x:30, y:5, width:185, height:45, selectNeedle:false, selectionArea:false,
            }},
        ]
    };

    //main object
        var obj = object.builder(object.alpha.oneShot_single,design);

    //circuitry
            var playhead = undefined;
            var playheadTimout = undefined;

        //audioFilePlayer
            obj.oneShot = new part.circuit.audio.oneShot_single(system.audio.context);
            obj.oneShot.out_right().connect( design.connectionNode_audio.outRight.in() );
            obj.oneShot.out_left().connect( design.connectionNode_audio.outLeft.in() );

    return obj;
};

this.oneShot_single.metadata = {
    name:'One Shot (Single)',
    helpurl:'https://metasophiea.com/curve/help/objects/oneShot_single/'
};

