this.oneShot_multi_multiTrack = function(x,y,debug=false){
    var trackCount = 8;

    var style = {
        background:'fill:rgba(200,200,200,1)',
        markings: 'fill:rgba(150,150,150,1); pointer-events: none;',
        strokeMarkings: 'fill:none; stroke:rgba(150,150,150,1); stroke-width:1; pointer-events: none;',
    };
    var design = {
        type: 'oneShot_multi_multiTrack',
        x: x, y: y,
        base: {
            points:[{x:0,y:0},{x:220,y:0},{x:220,y:385},{x:0,y:385}], 
            style:style.background
        },
        elements:[
            {type:'connectionNode_audio', name:'outRight', data:{ type: 1, x: -10, y: 5, width: 10, height: 20 }},
            {type:'connectionNode_audio', name:'outLeft', data:{  type: 1, x: -10, y: 27.5, width: 10, height: 20 }},
        ]
    };
    //dynamic design
        for(var a = 0; a < trackCount; a++){
            //symbols
            design.elements = design.elements.concat([
                {type:'path', name:'symbol_'+a+'_arrow', data:{ path:[{x:19, y:35+a*(2+45)},{x:25,y:40+a*(2+45)},{x:19, y:45+a*(2+45)}], style:style.strokeMarkings }},
                {type:'rect', name:'symbol_'+a+'_line', data:{ x:15, y:39.5+a*(2+45), width:6, height:1, style:style.markings }},
                {type:'circle', name:'symbo_'+a+'l_outterCircle', data:{ x:10, y:40+a*(2+45), r:5.5, style:style.strokeMarkings }},
                {type:'circle', name:'symbol_'+a+'_infCircle1', data:{ x:8.5, y:40+a*(2+45), r:1.5, style:style.strokeMarkings }},
                {type:'circle', name:'symbol_'+a+'_infCircle2', data:{ x:11.5, y:40+a*(2+45), r:1.5, style:style.strokeMarkings }},
            ]);

            //waveport
            design.elements.push(
                {type:'grapher_waveWorkspace', name:'grapher_waveWorkspace_'+a, data:{
                    x:30, y:5+a*(2+45), width:185, height:45, selectNeedle:false, selectionArea:false,
                }}
            );

            //load button
            design.elements.push(
                {type:'button_rect', name:'loadFile_'+a, data: {
                    x:5, y: 5+a*(2+45), width:20, height:10,
                    style:{
                        up:'fill:rgba(175,175,175,1)', hover:'fill:rgba(220,220,220,1)', 
                        down:'fill:rgba(150,150,150,1)', glow:'fill:rgba(220,200,220,1)'
                    },
                    onclick: function(){
                        var a = parseInt(this.id.split('_')[1]);
                        obj.oneShot_multi_array[a].load('file',
                            function(a){
                                return function(data){
                                    design.grapher_waveWorkspace['grapher_waveWorkspace_'+a].draw( obj.oneShot_multi_array[a].waveformSegment() );
                                }
                            }(a)
                        );
                    }
                }}
            );

            //fire button
            design.elements.push(
                {type:'button_rect',name:'fire_'+a,data:{
                    x:5, y: 17.5+a*(2+45), width:10, height:10, 
                    style:{
                        up:'fill:rgba(175,195,175,1)', hover:'fill:rgba(220,240,220,1)', 
                        down:'fill:rgba(150,170,150,1)', glow:'fill:rgba(220,220,220,1)'
                    }, 
                    onclick:function(){
                        var filePlayer = obj.oneShot_multi_array[parseInt(this.id.split('_')[1])];
                        var waveport = design.grapher_waveWorkspace['grapher_waveWorkspace_'+parseInt(this.id.split('_')[1])];
                        var playheads = obj.playheads[parseInt(this.id.split('_')[1])];

                        //no file = don't bother
                            if(filePlayer.duration() < 0){return;}
                
                        //actualy start the audio
                            filePlayer.fire();

                        //determine playhead number
                            var playheadNumber = 0;
                            while(playheadNumber in playheads){playheadNumber++;}
                            playheads[playheadNumber] = true;

                        //perform graphical movements
                            var duration = filePlayer.duration();
                            waveport.genericNeedle(playheadNumber,0,'transition: transform '+duration+'s;transition-timing-function: linear;');
                            setTimeout(function(){waveport.genericNeedle(playheadNumber,1);},1);
                            setTimeout(function(){
                                waveport.genericNeedle(playheadNumber);
                                delete playheads[playheadNumber];
                            },duration*1000);
                    }
                }}
            );

            //fire connection
            design.elements.push(
                {type:'connectionNode_data', name:'trigger_'+a, data:{
                    x: 220, y: 17.5+a*(2+45), width: 10, height: 20,
                    receive:function(address, data){
                        design.button_rect['fire_'+parseInt(this.id.split('_')[1])].click();
                    }
                }}
            );

        }

    //main object
        var obj = __globals.utility.experimental.objectBuilder(objects.oneShot_multi_multiTrack,design);

    //circuitry
        //audioFilePlayers
            obj.playheads = [];

            obj.oneShot_multi_array = [];
            for(var a = 0; a < trackCount; a++){
                obj.oneShot_multi_array.push( new parts.circuits.audio.oneShot_multi(__globals.audio.context) );
                obj.oneShot_multi_array[a].out_right().connect( design.connectionNode_audio.outRight.in() );
                obj.oneShot_multi_array[a].out_left().connect( design.connectionNode_audio.outLeft.in() );

                obj.playheads.push([]);
            }

    return obj;
};
