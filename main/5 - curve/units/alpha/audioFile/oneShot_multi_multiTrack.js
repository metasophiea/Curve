this.oneShot_multi_multiTrack = function(x,y,a){
    var trackCount = 8;

    var style = {
        background: {fill:'rgba(200,200,200,1)'},
        markings: {fill:'rgba(150,150,150,1)'},
        strokeMarkings: {fill:'rgba(0,0,0,0)', stroke:'rgba(150,150,150,1)', lineWidth:1},
        button:{
            background__up__fill:'rgba(175,175,175,1)', 
            background__hover__fill:'rgba(220,220,220,1)', 
            background__hover_press__fill:'rgba(150,150,150,1)',
        },
        fire_button:{
            background__up__fill:'rgba(175,195,175,1)', 
            background__hover__fill:'rgba(220,240,220,1)', 
            background__hover_press__fill:'rgba(150,170,150,1)',
        },
        stop_button:{
            background__up__fill:'rgba(195,175,175,1)', 
            background__hover__fill:'rgba(240,220,220,1)', 
            background__hover_press__fill:'rgba(170,150,150,1)',
        },
        slide:{
            handle:'rgba(220,220,220,1)'
        },
    };
    var design = {
        name: 'oneShot_multi_multiTrack',
        category: 'audioFile',
        collection: 'alpha',
        x:x, y:y, a:a,
        space:[{x:0,y:0},{x:220,y:0},{x:220,y:385},{x:0,y:385}],
        // spaceOutline:true,
        elements:[
            {type:'polygon', name:'backing', data:{ points:[{x:0,y:0},{x:220,y:0},{x:220,y:385},{x:0,y:385}], style:style.background }},

            {type:'connectionNode_audio', name:'outRight', data:{ x:-10, y:5, width:10, height:20, isAudioOutput:true }},
            {type:'connectionNode_audio', name:'outLeft', data:{ x:-10, y:27.5, width:10, height:20, isAudioOutput:true }},
        ]
    };
    //dynamic design
        for(var a = 0; a < trackCount; a++){
            //symbols
                design.elements = design.elements.concat([
                    {type:'path', name:'symbol_'+a+'_arrow', data:{ points:[{x:19, y:35+a*(2+45)},{x:25,y:40+a*(2+45)},{x:19, y:45+a*(2+45)}], style:style.strokeMarkings }},
                    {type:'rectangle', name:'symbol_'+a+'_line', data:{ x:15, y:39.5+a*(2+45), width:6, height:1, style:style.markings }},
                    {type:'circle', name:'symbol_'+a+'l_outerCircle', data:{ x:10, y:40+a*(2+45), r:5.5, style:style.strokeMarkings }},
                    {type:'circle', name:'symbol_'+a+'_infCircle1', data:{ x:8.5, y:40+a*(2+45), r:1.5, style:style.strokeMarkings }},
                    {type:'circle', name:'symbol_'+a+'_infCircle2', data:{ x:11.5, y:40+a*(2+45), r:1.5, style:style.strokeMarkings }},
                ]);

            //rate adjust
                design.elements.push(
                    {type:'slide', name:'rate_'+a, data:{
                        x:26.25, y:5+a*(2+45), width:5, height:45, value:0.5, resetValue:0.5, style:style.slide,
                        onchange:function(instance){
                            return function(value){
                                object.oneShot_multi_array[instance].rate((1-value)*2);
                            }
                        }(a)
                    }}
                );

            //activation light
                design.elements.push(
                    {type:'glowbox_rect', name:'glowbox_rect_'+a, data:{ x:32.5, y:5+a*(2+45), width:2.5, height:45 }}
                );

            //waveport
                design.elements.push(
                    {type:'grapher_waveWorkspace', name:'grapher_waveWorkspace_'+a, data:{ x:35, y:5+a*(2+45), width:180, height:45, selectNeedle:false, selectionArea:true }}
                );

            //load button
                design.elements.push(
                    {type:'button_rect', name:'loadFile_'+a, data: { x:5, y: 5+a*(2+45), width:20, height:10, style:style.button,
                        onpress:function(instance){
                            return function(){
                                object.oneShot_multi_array[instance].load('file',
                                    function(instance){
                                        return function(data){
                                            object.elements.grapher_waveWorkspace['grapher_waveWorkspace_'+instance].draw( object.oneShot_multi_array[instance].waveformSegment() );
                                        }
                                    }(instance)
                                );
                            }
                        }(a)
                    }}
                );

            //fire button
                design.elements.push(
                    {type:'button_rect',name:'fire_'+a,data:{ x:5, y: 17.5+a*(2+45), width:10, height:10, style:style.fire_button,
                        onpress:function(instance){
                            return function(){
                                var filePlayer = object.oneShot_multi_array[instance];
                                var waveport = object.elements.grapher_waveWorkspace['grapher_waveWorkspace_'+instance];
                                var needles = object.players[instance];
        
                                //no file = don't bother
                                    if(filePlayer.duration() < 0){return;}
                        
                                //determine start, end and duration values
                                    var start = waveport.area().A != undefined ? waveport.area().A : 0;
                                    var end = waveport.area().B != undefined ? waveport.area().B : 1;
                                    if(start > end){var temp=start;start=end; end=temp;}
                                    var duration = filePlayer.duration();
        
                                    var startTime = start*duration;
                                    var subduration = end*duration - startTime;
        
                                //actually start the audio
                                    filePlayer.fire(startTime, subduration);
        
                                //determine needle number
                                    var needleNumber = 0;
                                    while(needleNumber in needles){needleNumber++;}
                                    needles[needleNumber] = {};
        
                                //flash light
                                    object.elements.glowbox_rect['glowbox_rect_'+instance].on();
                                    setTimeout(
                                        function(a){
                                            return function(){
                                                object.elements.glowbox_rect['glowbox_rect_'+a].off();
                                            }
                                        }(instance)
                                    ,100);
        
                            //perform graphical movements
                                needles[needleNumber].previousPosition = undefined;
                                needles[needleNumber].currentPosition = startTime/duration;
                                needles[needleNumber].endPosition = startTime/duration + subduration/duration;

                                var desiredIntervalTime = 10;
                                var step = desiredIntervalTime/(subduration*1000)
                                needles[needleNumber].needleInterval = setInterval(function(){
                                    //remove previous mark
                                        if(needles[needleNumber].previousPosition != undefined){
                                            waveport.mark(needles[needleNumber].currentPosition);
                                        }
    
                                    needles[needleNumber].previousPosition = needles[needleNumber].currentPosition;
                                    needles[needleNumber].currentPosition += step;
    
                                    //add new mark
                                    waveport.mark(needles[needleNumber].currentPosition);
    
                                    //check for ending
                                        if( needles[needleNumber].currentPosition > needles[needleNumber].endPosition ){
                                            waveport.mark(needles[needleNumber].currentPosition);
                                            clearInterval(needles[needleNumber].needleInterval);
                                        }
    
                                },desiredIntervalTime);
                            }
                        }(a)
                    }}
                );

            //panic button
                design.elements.push(
                    {type:'button_rect',name:'panic_'+a,data:{ x:15, y: 17.5+a*(2+45), width:10, height:10, style:style.stop_button,
                        onpress:function(instance){
                            return function(value){
                                var filePlayer = object.oneShot_multi_array[instance];
                                var waveport = object.elements.grapher_waveWorkspace['grapher_waveWorkspace_'+instance];
                                var needles = object.players[instance];
        
                                filePlayer.panic();
        
                                var keys = Object.keys(needles);
                                for(var a = 0; a < keys.length; a++){
                                    if(needles[a] == undefined){continue;}
                                    clearTimeout(needles[a].needleInterval);
                                    delete needles[a];
                                }
                                waveport.removeAllMarks();
                            }
                        }(a)
                    }}
                );

            //fire connection
                design.elements.push(
                    {type:'connectionNode_data', name:'trigger_'+a, data:{ x: 220, y: 17.5+a*(2+45), width: 10, height: 20,
                        onreceive:function(instance){
                            return function(address,data){
                                if(address == 'pulse'){ 
                                    object.elements.button_rect['fire_'+instance].press();
                                    object.elements.button_rect['fire_'+instance].release();
                                }
                                else if(address == 'hit'){
                                    if(data.velocity > 0.49){
                                        object.elements.button_rect['fire_'+instance].press();
                                        object.elements.button_rect['fire_'+instance].release();
                                    }
                                }
                            }
                        }(a)
                    }}
                );

        }

    //main object
        var object = alphaUnit.builder(this.oneShot_multi_multiTrack,design);

    //import/export
        object.exportData = function(){
            var data = {
                tracks:[],
                areas:[],
            };

            for(var a = 0; a < trackCount; a++){
                data.tracks.push(
                    object.oneShot_multi_array[a].unloadRaw()
                );
                data.areas.push(
                    object.i.area(a)
                );
            }

            return data;
        };
        object.importData = function(data){
            for(var a = 0; a < trackCount; a++){
                object.i.loadRaw(a,data.tracks[a]);
                object.i.area(a,data.areas[a].A,data.areas[a].B);
            }
        };

    //circuitry
        //audioFilePlayers
            object.players = [];

            object.oneShot_multi_array = [];
            for(var a = 0; a < trackCount; a++){
                object.oneShot_multi_array.push( new workspace.interface.circuit.alpha.oneShot_multi(workspace.library.audio.context) );
                object.oneShot_multi_array[a].out_right().connect( object.elements.connectionNode_audio.outRight.in() );
                object.oneShot_multi_array[a].out_left().connect( object.elements.connectionNode_audio.outLeft.in() );

                object.players.push([]);
            }

    //interface
        object.i = {
            loadURL:function(trackNumber, url, callback){
                object.oneShot_multi_array[trackNumber].load('url', 
                    function(a){
                        return function(){
                            document.getElementById('oneShot_multi_multiTrack').children['grapher_waveWorkspace_'+a].draw(document.getElementById('oneShot_multi_multiTrack').oneShot_multi_array[a].waveformSegment());
                        };
                    }(trackNumber)
                ,url);
            },
            loadRaw:function(trackNumber, data){
                object.oneShot_multi_array[trackNumber].loadRaw(data);
                object.elements.grapher_waveWorkspace['grapher_waveWorkspace_'+trackNumber].draw(
                    object.oneShot_multi_array[trackNumber].waveformSegment()
                );
            },
            area:function(trackNumber,a,b){
                return object.elements.grapher_waveWorkspace['grapher_waveWorkspace_'+trackNumber].area(a,b);
            }
        };
    
    return object;
};

this.oneShot_multi_multiTrack.metadata = {
    name:'One Shot (Multi)(8 Track)',
    helpURL:'https://curve.metasophiea.com/help/units/alpha/oneShot_multi_multiTrack/'
};