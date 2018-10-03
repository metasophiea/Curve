this.looper = function(x,y,debug=false){
    var style = {
        background:'fill:rgba(200,200,200,1)',
        markings: 'fill:rgba(150,150,150,1); pointer-events: none;',
        strokeMarkings: 'fill:none; stroke:rgba(150,150,150,1); stroke-width:1; pointer-events: none;',
    };
    var design = {
        type: 'looper',
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
                receive:function(address, data){ design.button_rect.fire.press(); }
            }},

            //symbol
            {type:'circle', name:'symbol_outterCircle1', data:{ x:11.5, y:41, r:6, style:style.strokeMarkings }},
            {type:'circle', name:'symbol_outterCircle2', data:{ x:18.5, y:41, r:6, style:style.strokeMarkings }},
            {type:'rect', name:'symbol_blockingrect', data:{ x:11.5, y:34, width:7, height:15, style:style.background }},
            {type:'path', name:'symbol_upperarrow', data:{ path:[{x:13.5, y:32.5},{x:16.5, y:35},{x:13.5, y:37.5}], style:style.strokeMarkings }},
            {type:'path', name:'symbol_lowerarrow', data:{ path:[{x:16.5, y:44.75},{x:13.5, y:47.25},{x:16.5, y:49.75}], style:style.strokeMarkings }},

            {type:'button_rect', name:'loadFile', data: {
                x:5, y: 5, width:20, height:10,
                style:{ up:'fill:rgba(175,175,175,1)', hover:'fill:rgba(220,220,220,1)', hover_press:'fill:rgba(150,150,150,1)' },
                onpress: function(){
                    obj.looper.load('file',function(data){
                        design.grapher_waveWorkspace.grapher_waveWorkspace.draw( obj.looper.waveformSegment() );
                    });
                }
            }},
            {type:'button_rect',name:'fire',data:{
                x:5, y: 17.5, width:10, height:10,
                style:{ up:'fill:rgba(175,195,175,1)', hover:'fill:rgba(220,240,220,1)', hover_press:'fill:rgba(150,170,150,1)' }, 
                onpress:function(){
                    //no file = don't bother
                        if(obj.looper.duration() < 0){return;}
            
                    //actualy start the audio
                        obj.looper.start();

                    //perform graphical movements
                        var duration = obj.looper.duration();
                        function func(){
                            //if there's already a needle; delete it
                            if(needle){
                                design.grapher_waveWorkspace.grapher_waveWorkspace.genericNeedle(0);
                                clearTimeout(needleTimout);
                            }

                            //create new needle, and send it on its way
                            design.grapher_waveWorkspace.grapher_waveWorkspace.genericNeedle(0,0,'transition: transform '+duration+'s;transition-timing-function: linear;');
                            setTimeout(function(){design.grapher_waveWorkspace.grapher_waveWorkspace.genericNeedle(0,1);},1);
                            needle = true;

                            //prep the next time this function should be run
                            needleTimout = setTimeout(func,duration*1000);
                        }

                        func();
                }
            }},
            {type:'button_rect',name:'stop',data:{
                x:15, y: 17.5, width:10, height:10,
                style:{ up:'fill:rgba(195,175,175,1)', hover:'fill:rgba(240,220,220,1)', hover_press:'fill:rgba(170,150,150,1)' }, 
                onpress:function(){
                    obj.looper.stop();

                    //if there's a needle, remove it
                    if(needle){
                        design.grapher_waveWorkspace.grapher_waveWorkspace.genericNeedle(0);
                        needle = false;
                        clearTimeout(needleTimout);
                    }
                }
            }},

            {type:'grapher_waveWorkspace', name:'grapher_waveWorkspace', data:{
                x:30, y:5, width:185, height:45, selectNeedle:false, selectionArea:false,
            }},
        ]
    };

    //main object
        var obj = __globals.utility.misc.objectBuilder(objects.looper,design);

    //circuitry
            var needle = undefined;
            var needleTimout = undefined;

        //audioFilePlayer
            obj.looper = new parts.circuits.audio.looper(__globals.audio.context);
            obj.looper.out_right().connect( design.connectionNode_audio.outRight.in() );
            obj.looper.out_left().connect( design.connectionNode_audio.outLeft.in() );

    return obj;
};

this.looper.metadata = {
    name:'Looper',
    helpurl:'https://metasophiea.com/curve/help/object/looper/'
};