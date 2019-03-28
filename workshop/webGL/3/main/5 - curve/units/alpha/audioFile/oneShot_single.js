this.oneShot_single = function(x,y,a){
    var style = {
        background:{r:200/255,g:200/255,b:200/255,a:1},
        markings:{ colour:{r:150/255,g:150/255,b:150/255,a:1}, thickness:1},
        button:{
            background__up__colour:{r:175/255,g:175/255,b:175/255,a:1}, 
            background__hover__colour:{r:220/255,g:220/255,b:220/255,a:1}, 
            background__hover_press__colour:{r:150/255,g:150/255,b:150/255,a:1},
        },
        fire_button:{
            background__up__colour:{r:175/255,g:195/255,b:175/255,a:1}, 
            background__hover__colour:{r:220/255,g:240/255,b:220/255,a:1}, 
            background__hover_press__colour:{r:150/255,g:170/255,b:150/255,a:1},
        },
        stop_button:{
            background__up__colour:{r:195/255,g:175/255,b:175/255,a:1}, 
            background__hover__colour:{r:240/255,g:220/255,b:220/255,a:1}, 
            background__hover_press__colour:{r:170/255,g:150/255,b:150/255,a:1},
        },
    };
    var design = {
        name: 'oneShot_single',
        category: 'audioFile',
        collection: 'alpha',
        x:x, y:y, a:a,
        space:[{x:0,y:0},{x:220,y:0},{x:220,y:55},{x:0,y:55}],
        // spaceOutline:true,
        elements:[
            {type:'polygon', name:'backing', data:{ pointsAsXYArray:[{x:0,y:0},{x:220,y:0},{x:220,y:55},{x:0,y:55}], colour:style.background }},

            {type:'connectionNode_audio', name:'outRight', data:{ x:-10, y:5, width:10, height:20, isAudioOutput:true }},
            {type:'connectionNode_audio', name:'outLeft', data:{ x:-10, y:27.5, width:10, height:20, isAudioOutput:true }},
            {type:'connectionNode_data', name:'trigger', data:{
                x:220, y:17.5, width:10, height:20,
                onreceive:function(address, data){ object.elements.button_rectangle.fire.press(); object.elements.button_rectangle.fire.release(); }
            }},

            //symbol
                {type:'path', name:'symbol_arrow', data:{ pointsAsXYArray:[{x:19, y:35},{x:25,y:40},{x:19, y:45}], colour:style.markings.colour }},
                {type:'rectangle', name:'symbol_line', data:{ x:15, y:39.5, width:6, height:1, colour:style.markings.colour }},
                {type:'circleWithOutline', name:'symbol_outerCircle', data:{ x:10, y:40, radius:5.5, colour:style.background, lineColour:style.markings.colour, thickness:style.markings.thickness }},
                {type:'rectangle', name:'symbol_1', data:{ x:9.5, y:37.5, width:1, height:5, colour:style.markings.colour }},

            {type:'button_rectangle', name:'loadFile', data: { x:5, y: 5, width:20, height:10, style:style.button,
                onpress: function(){
                    object.oneShot.load('file',function(data){
                        object.elements.grapher_waveWorkspace.grapher_waveWorkspace.draw( object.oneShot.waveformSegment() );
                    });
                }
            }},
            {type:'button_rectangle',name:'fire',data:{ x:5, y: 17.5, width:20, height:10, style:style.fire_button,
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

                        var desiredIntervalTime = 10;
                        var step = desiredIntervalTime/(duration*1000)
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
                        },desiredIntervalTime);
                        
                        needleExists = true;
                },
            }},

            {type:'grapher_waveWorkspace', name:'grapher_waveWorkspace', data:{ x:30, y:5, width:185, height:45, selectNeedle:false, selectionArea:false }},
        ]
    };

    //main object
        var object = _canvas_.interface.unit.builder(this.oneShot_single,design);

    //circuitry
        var needleExists = undefined;
        var needleInterval = undefined;
        var currentPosition = undefined;
        var previousPosition = undefined;

        //audioFilePlayer
            object.oneShot = new _canvas_.interface.circuit.oneShot_single(_canvas_.library.audio.context);
            object.oneShot.out_right().connect( object.elements.connectionNode_audio.outRight.in() );
            object.oneShot.out_left().connect( object.elements.connectionNode_audio.outLeft.in() );

    return object;
};

this.oneShot_single.metadata = {
    name:'One Shot (Single)',
    category:'audioFile',
    helpURL:'https://curve.metasophiea.com/help/objects/units/oneShot_single/'
};

