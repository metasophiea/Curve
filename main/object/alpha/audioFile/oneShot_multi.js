this.oneShot_multi = function(x,y,debug=false){
    var style = {
        background:'fill:rgba(200,200,200,1)',
        markings: 'fill:rgba(150,150,150,1); pointer-events: none;',
        strokeMarkings: 'fill:none; stroke:rgba(150,150,150,1); stroke-width:1; pointer-events: none;',
    };
    var design = {
        name: 'oneShot_multi',
        collection: 'alpha',
        x: x, y: y,
        base: {
            points:[{x:0,y:0},{x:220,y:0},{x:220,y:55},{x:0,y:55}], 
            style:style.background
        },
        elements:[
            //connection nodes
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
                {type:'circle', name:'symbol_infCircle1', data:{ x:8.5, y:40, r:1.5, style:style.strokeMarkings }},
                {type:'circle', name:'symbol_infCircle2', data:{ x:11.5, y:40, r:1.5, style:style.strokeMarkings }},

            //load/fire/panic buttons
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
                    x:5, y: 17.5, width:10, height:10,
                    style:{ up:'fill:rgba(175,195,175,1)', hover:'fill:rgba(220,240,220,1)', hover_press:'fill:rgba(150,170,150,1)' }, 
                    onpress:function(){
                        var filePlayer = obj.oneShot;
                        var waveport = design.grapher_waveWorkspace.grapher_waveWorkspace;
                        
                        //no file = don't bother
                            if(filePlayer.duration() < 0){return;}

                        //determind start, end and duration values
                            var start = waveport.area().A != undefined ? waveport.area().A : 0;
                            var end = waveport.area().B != undefined ? waveport.area().B : 1;
                            var duration = filePlayer.duration();

                            var startTime = start*duration;
                            var duration = end*duration - startTime;

                        //actualy start the audio
                            filePlayer.fire(startTime, duration);

                        //determine playhead number
                            var playheadNumber = 0;
                            while(playheadNumber in playheads){playheadNumber++;}
                            playheads[playheadNumber] = {};

                        //flash light
                            design.glowbox_rect.glowbox_rect.on();
                            setTimeout(
                                function(){
                                    design.glowbox_rect.glowbox_rect.off();
                                }
                            ,100);

                        //perform graphical movements
                            waveport.genericNeedle(playheadNumber,start,'transition: transform '+duration+'s; transition-timing-function: linear;');
                            setTimeout(function(a){waveport.genericNeedle(playheadNumber,a);},1,end);
                            playheads[playheadNumber].timeout = setTimeout(function(){
                                waveport.genericNeedle(playheadNumber);
                                delete playheads[playheadNumber];
                            },duration*1000);
                    }
                }},
                {type:'button_rect',name:'panic',data:{
                    x:15, y: 17.5, width:10, height:10,
                    style:{ up:'fill:rgba(195,175,175,1)', hover:'fill:rgba(240,220,220,1)', hover_press:'fill:rgba(170,150,150,1)' }, 
                    onpress:function(){
                        var filePlayer = obj.oneShot;
                        var waveport = design.grapher_waveWorkspace.grapher_waveWorkspace;

                        filePlayer.panic();

                        var keys = object.alpha.keys(playheads);
                        for(var a = 0; a < keys.length; a++){
                            if(playheads[a] == undefined){continue;}
                            clearTimeout(playheads[a].timeout);
                            waveport.genericNeedle(a);
                            delete playheads[a];
                        }
                    }
                }},

            //rate adjust
                {type:'slide', name:'rate', data:{
                    x:26.25, y:5, width:5, height:45, value:0.5, resetValue:0.5,
                    style:{handle:'fill:rgba(220,220,220,1)'},
                    onchange:function(value){obj.oneShot.rate((1-value)*2);}
                }},

            //fire light
                {type:'glowbox_rect', name:'glowbox_rect', data:{
                    x:32.5, y:5, width:2.5, height:45,
                }},

            //waveport
                {type:'grapher_waveWorkspace', name:'grapher_waveWorkspace', data:{
                    x:35, y:5, width:180, height:45, selectNeedle:false, selectionArea:true,
                }},
        ]
    };

    //main object
        var obj = object.builder(object.alpha.oneShot_multi,design);

    //circuitry
            var playheads = {};

        //audioFilePlayer
            obj.oneShot = new part.circuit.audio.oneShot_multi(system.audio.context);
            obj.oneShot.out_right().connect( design.connectionNode_audio.outRight.in() );
            obj.oneShot.out_left().connect( design.connectionNode_audio.outLeft.in() );

    //interface
        obj.i = {};
        obj.i.loadURL = function(url, callback){
            obj.oneShot.load('url', function(){
                design.grapher_waveWorkspace.grapher_waveWorkspace.draw(obj.oneShot.waveformSegment());
                if(callback != undefined){callback();}
            }, url);
        };
        obj.i.area = function(a,b){
            design.grapher_waveWorkspace.grapher_waveWorkspace.area(a,b);
        };
        
    return obj;
};

this.oneShot_multi.metadata = {
    name:'One Shot (Multi)',
    helpurl:'https://metasophiea.com/curve/help/objects/oneShot_multi/'
};
