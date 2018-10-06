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

            //rate adjust
            design.elements.push(
                {type:'slide', name:'rate_'+a, data:{
                    x:26.25, y:5+a*(2+45), width:5, height:45, value:0.5, resetValue:0.5,
                    style:{handle:'fill:rgba(220,220,220,1)'},
                    onchange:function(instance){
                        return function(value){
                            var filePlayer = obj.oneShot_multi_array[instance];
                            filePlayer.rate((1-design.slide['rate_'+instance].get())*2);
                        }
                    }(a)
                }}
            );

            //activation light
            design.elements.push(
                {type:'glowbox_rect', name:'glowbox_rect_'+a, data:{
                    x:32.5, y:5+a*(2+45), width:2.5, height:45,
                }}
            );

            //waveport
            design.elements.push(
                {type:'grapher_waveWorkspace', name:'grapher_waveWorkspace_'+a, data:{
                    x:35, y:5+a*(2+45), width:180, height:45, selectNeedle:false, selectionArea:true,
                }}
            );

            //load button
            design.elements.push(
                {type:'button_rect', name:'loadFile_'+a, data: {
                    x:5, y: 5+a*(2+45), width:20, height:10,
                    style:{ up:'fill:rgba(175,175,175,1)', hover:'fill:rgba(220,220,220,1)', hover_press:'fill:rgba(150,150,150,1)' },
                    onpress:function(instance){
                        return function(){
                            obj.oneShot_multi_array[instance].load('file',
                                function(instance){
                                    return function(data){
                                        design.grapher_waveWorkspace['grapher_waveWorkspace_'+instance].draw( obj.oneShot_multi_array[instance].waveformSegment() );
                                    }
                                }(instance)
                            );
                        }
                    }(a)
                }}
            );

            //fire button
            design.elements.push(
                {type:'button_rect',name:'fire_'+a,data:{
                    x:5, y: 17.5+a*(2+45), width:10, height:10,
                    style:{ up:'fill:rgba(175,195,175,1)', hover:'fill:rgba(220,240,220,1)', hover_press:'fill:rgba(150,170,150,1)' }, 
                    onpress:function(instance){
                        return function(){
                            var filePlayer = obj.oneShot_multi_array[instance];
                            var waveport = design.grapher_waveWorkspace['grapher_waveWorkspace_'+instance];
                            var playheads = obj.playheads[instance];
    
                            //no file = don't bother
                                if(filePlayer.duration() < 0){return;}
                    
                            //determine start, end and duration values
                                var start = waveport.area().A != undefined ? waveport.area().A : 0;
                                var end = waveport.area().B != undefined ? waveport.area().B : 1;
                                if(start > end){var temp=start;start=end; end=temp;}
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
                                design.glowbox_rect['glowbox_rect_'+instance].on();
                                setTimeout(
                                    function(a){
                                        return function(){
                                            design.glowbox_rect['glowbox_rect_'+a].off();
                                        }
                                    }(instance)
                                ,100);
    
                            //perform graphical movements
                                waveport.genericNeedle(playheadNumber,start,'transition: transform '+duration+'s; transition-timing-function: linear;');
                                setTimeout(function(a){waveport.genericNeedle(playheadNumber,a);},1,end);
                                playheads[playheadNumber].timeout = setTimeout(function(playheadNumber){
                                    waveport.genericNeedle(playheadNumber);
                                    delete playheads[playheadNumber];
                                },duration*1000,playheadNumber);
                        }
                    }(a)
                }}
            );

            //panic button
            design.elements.push(
                {type:'button_rect',name:'panic_'+a,data:{
                    x:15, y: 17.5+a*(2+45), width:10, height:10,
                    style:{ up:'fill:rgba(195,175,175,1)', hover:'fill:rgba(240,220,220,1)', hover_press:'fill:rgba(170,150,150,1)' }, 
                    onpress:function(instance){
                        return function(value){
                            var filePlayer = obj.oneShot_multi_array[instance];
                            var waveport = design.grapher_waveWorkspace['grapher_waveWorkspace_'+instance];
                            var playheads = obj.playheads[instance];
    
                            filePlayer.panic();
    
                            var keys = object.alpha.keys(playheads);
                            for(var a = 0; a < keys.length; a++){
                                if(playheads[a] == undefined){continue;}
                                clearTimeout(playheads[a].timeout);
                                waveport.genericNeedle(a);
                                delete playheads[a];
                            }
                        }
                    }(a)
                }}
            );

            //fire connection
            design.elements.push(
                {type:'connectionNode_data', name:'trigger_'+a, data:{
                    x: 220, y: 17.5+a*(2+45), width: 10, height: 20,
                    receive:function(instance){
                        return function(address,data){
                            if(address == 'pulse'){ 
                                design.button_rect['fire_'+instance].press();
                                design.button_rect['fire_'+instance].release();
                            }
                            else if(address == 'hit'){
                                if(data.velocity > 0.5){
                                    design.button_rect['fire_'+instance].press();
                                    design.button_rect['fire_'+instance].release();
                                }
                            }
                        }
                    }(a)
                }}
            );

        }

    //main object
        var obj = object.builder(object.alpha.oneShot_multi_multiTrack,design);

    //import/export
        obj.exportData = function(){
            var data = {
                tracks:[],
                areas:[],
            };

            for(var a = 0; a < trackCount; a++){
                data.tracks.push(
                    obj.oneShot_multi_array[a].unloadRaw()
                );
                data.areas.push(
                    obj.i.area(a)
                );
            }

            return data;
        };
        obj.importData = function(data){
            for(var a = 0; a < trackCount; a++){
                obj.i.loadRaw(a,data.tracks[a]);
                obj.i.area(a,data.areas[a].A,data.areas[a].B);
            }
        };

    //circuitry
        //audioFilePlayers
            obj.playheads = [];

            obj.oneShot_multi_array = [];
            for(var a = 0; a < trackCount; a++){
                obj.oneShot_multi_array.push( new part.circuit.audio.oneShot_multi(system.audio.context) );
                obj.oneShot_multi_array[a].out_right().connect( design.connectionNode_audio.outRight.in() );
                obj.oneShot_multi_array[a].out_left().connect( design.connectionNode_audio.outLeft.in() );

                obj.playheads.push([]);
            }

    //interface
        obj.i = {
            loadURL:function(trackNumber, url, callback){
                obj.oneShot_multi_array[trackNumber].load('url', 
                    function(a){
                        return function(){
                            document.getElementById('oneShot_multi_multiTrack').children['grapher_waveWorkspace_'+a].draw(document.getElementById('oneShot_multi_multiTrack').oneShot_multi_array[a].waveformSegment());
                        };
                    }(trackNumber)
                ,url);
            },
            loadRaw:function(trackNumber, data){
                obj.oneShot_multi_array[trackNumber].loadRaw(data);
                design.grapher_waveWorkspace['grapher_waveWorkspace_'+trackNumber].draw(
                    obj.oneShot_multi_array[trackNumber].waveformSegment()
                );
            },
            area:function(trackNumber,a,b){
                return design.grapher_waveWorkspace['grapher_waveWorkspace_'+trackNumber].area(a,b);
            }
        };
    
    return obj;
};

this.oneShot_multi_multiTrack.metadata = {
    name:'One Shot (Multi)(8 Track)',
    helpurl:'https://metasophiea.com/curve/help/objects/oneShot_multi_multiTrack/'
};