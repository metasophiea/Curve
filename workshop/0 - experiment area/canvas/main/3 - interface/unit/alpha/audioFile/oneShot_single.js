this.oneShot_single = function(x,y,debug=false){
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
        name: 'oneShot_single',
        category: 'audioFile',
        collection: 'alpha',
        x:x, y:y,
        space:[{x:0,y:0},{x:220,y:0},{x:220,y:55},{x:0,y:55}],
        // spaceOutline:true,
        elements:[
            {type:'polygon', name:'backing', data:{ points:[{x:0,y:0},{x:220,y:0},{x:220,y:55},{x:0,y:55}], style:style.background }},

            {type:'connectionNode_audio', name:'outRight', data:{ x:-10, y:5, width:10, height:20, isAudioOutput:true }},
            {type:'connectionNode_audio', name:'outLeft', data:{ x:-10, y:27.5, width:10, height:20, isAudioOutput:true }},
            {type:'connectionNode_data', name:'trigger', data:{
                x:220, y:17.5, width:10, height:20,
                onreceive:function(address, data){ object.elements.button_rect.fire.press(); object.elements.button_rect.fire.release(); }
            }},

            //symbol
                {type:'path', name:'symbol_arrow', data:{ points:[{x:19, y:35},{x:25,y:40},{x:19, y:45}], style:style.strokeMarkings }},
                {type:'rectangle', name:'symbol_line', data:{ x:15, y:39.5, width:6, height:1, style:style.markings }},
                {type:'circle', name:'symbol_outerCircle', data:{ x:10, y:40, r:5.5, style:style.strokeMarkings }},
                {type:'rectangle', name:'symbol_1', data:{ x:9.5, y:37.5, width:1, height:5, style:style.markings }},

            {type:'button_rect', name:'loadFile', data: { x:5, y: 5, width:20, height:10, style:style.button,
                onpress: function(){
                    object.oneShot.load('file',function(data){
                        object.elements.grapher_waveWorkspace.grapher_waveWorkspace.draw( object.oneShot.waveformSegment() );
                    });
                }
            }},
            {type:'button_rect',name:'fire',data:{ x:5, y: 17.5, width:20, height:10, style:style.fire_button,
                onpress:function(){
                    //no file = don't bother
                        if(object.oneShot.duration() < 0){return;}
            
                    //actually start the audio
                        object.oneShot.fire();

                    //perform graphical movements
                        var duration = object.oneShot.duration();

                    //if there's a playhead, remove it
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
                                    clearInterval(needleInterval);
                                }

                        },stepTime);
                        needleExists = true;
                },
            }},

            {type:'grapher_waveWorkspace', name:'grapher_waveWorkspace', data:{ x:30, y:5, width:185, height:45, selectNeedle:false, selectionArea:false }},
        ]
    };

    //main object
        var object = interfaceUnit.builder(this.oneShot_single,design);

    //circuitry
        var needleExists = undefined;
        var needleInterval = undefined;
        var currentPosition = undefined;
        var previousPosition = undefined;

        //audioFilePlayer
            object.oneShot = new workspace.interface.circuit.alpha.oneShot_single(workspace.library.audio.context);
            object.oneShot.out_right().connect( object.elements.connectionNode_audio.outRight.in() );
            object.oneShot.out_left().connect( object.elements.connectionNode_audio.outLeft.in() );

    return object;
};

this.oneShot_single.metadata = {
    name:'One Shot (Single)',
    helpURL:'https://metasophiea.com/curve/help/objects/units/oneShot_single/'
};

