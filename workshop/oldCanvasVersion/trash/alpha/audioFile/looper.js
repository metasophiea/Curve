this.looper = function(x,y,a){
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
    };
    var design = {
        name: 'looper',
        category: 'audioFile',
        collection: 'alpha',
        x:x, y:y, a:a,
        space:[{x:0,y:0},{x:220,y:0},{x:220,y:55},{x:0,y:55}],
        // spaceOutline:true,
        elements:[
            {type:'polygon', name:'backing', data:{ points:[{x:0,y:0},{x:220,y:0},{x:220,y:55},{x:0,y:55}], style:style.background }},

            {type:'connectionNode_audio', name:'outRight', data:{ x:-10, y:5, width:10, height:20, isAudioOutput:true }},
            {type:'connectionNode_audio', name:'outLeft', data:{ x:-10, y:27.5, width:10, height:20, isAudioOutput:true }},
            {type:'connectionNode_data', name:'trigger', data:{
                x: 220, y: 17.5, width: 10, height: 20,
                onreceive:function(address, data){ object.elements.button_rect.fire.press(); }
            }},

            //symbol
                {type:'circle', name:'symbol_outterCircle1', data:{ x:11.5, y:41, r:6, style:style.strokeMarkings }},
                {type:'circle', name:'symbol_outterCircle2', data:{ x:18.5, y:41, r:6, style:style.strokeMarkings }},
                {type:'rectangle', name:'symbol_blockingrect', data:{ x:11.5, y:34, width:7, height:15, style:style.background }},
                {type:'path', name:'symbol_upperarrow', data:{ points:[{x:13.5, y:32.5},{x:16.5, y:35},{x:13.5, y:37.5}], style:style.strokeMarkings }},
                {type:'path', name:'symbol_lowerarrow', data:{ points:[{x:16.5, y:44.75},{x:13.5, y:47.25},{x:16.5, y:49.75}], style:style.strokeMarkings }},

            {type:'button_rect', name:'loadFile', data: { x:5, y: 5, width:20, height:10, style:style.button,
                onpress: function(){
                    object.looper.load('file',function(data){
                        object.elements.grapher_waveWorkspace.grapher_waveWorkspace.draw( object.looper.waveformSegment() );
                    });
                }
            }},
            {type:'button_rect',name:'fire',data:{ x:5, y: 17.5, width:10, height:10, style:style.fire_button,
                onpress:function(){
                    //no file -> don't bother
                        if(object.looper.duration() < 0){return;}

                    //actually start the audio
                        object.looper.start();
                    
                    //perform graphical movements
                        var duration = object.looper.duration();

                    //if there's already a needle; delete it
                        if(needleExists){
                            object.elements.grapher_waveWorkspace.grapher_waveWorkspace.mark(currentPosition);
                            clearTimeout(needleInterval);
                        }

                    //create new needle, and send it on its way
                        previousPosition = undefined;
                        currentPosition = 0;
                        var stepTime = Math.floor(duration); //funky math to adjust the interval time proportional to the length of the file
                        var step = stepTime/(duration*1000);
                        needleInterval = setInterval(function(){
                            //remove previous mark
                                if(previousPosition != undefined){
                                    object.elements.grapher_waveWorkspace.grapher_waveWorkspace.mark(currentPosition);
                                }

                            previousPosition = currentPosition;
                            currentPosition += step;

                            //add new mark
                                object.elements.grapher_waveWorkspace.grapher_waveWorkspace.mark(currentPosition);

                            //check for ending
                                if( currentPosition > 1 ){
                                    object.elements.grapher_waveWorkspace.grapher_waveWorkspace.mark(currentPosition);
                                    currentPosition = 0;
                                    previousPosition = undefined;
                                }

                        },stepTime);
                        needleExists = true;
                },
            }},
            {type:'button_rect',name:'stop',data:{ x:15, y: 17.5, width:10, height:10, style:style.stop_button,
                onpress:function(){
                    object.looper.stop();

                    //if there's a needle, remove it
                        if(needleExists){
                            object.elements.grapher_waveWorkspace.grapher_waveWorkspace.mark(currentPosition);
                            needleExists = false;
                            currentPosition = undefined;
                            clearTimeout(needleInterval);
                        }

                },
            }},

            {type:'grapher_waveWorkspace', name:'grapher_waveWorkspace', data:{ x:30, y:5, width:185, height:45, selectNeedle:false, selectionArea:false }},
        ]
    };

    //main object
        var object = workspace.interface.unit.alpha.builder(this.looper,design);

    //circuitry
        var needleExists = false;
        var needleInterval = undefined;
        var currentPosition = undefined;
        var previousPosition = undefined;

        //audioFilePlayer
            object.looper = new workspace.interface.circuit.alpha.looper(workspace.library.audio.context);
            object.looper.out_right().connect( object.elements.connectionNode_audio.outRight.in() );
            object.looper.out_left().connect( object.elements.connectionNode_audio.outLeft.in() );

    return object;
};

this.looper.metadata = {
    name:'Looper',
    helpURL:'https://metasophiea.com/curve/help/units/alpha/looper/'
};