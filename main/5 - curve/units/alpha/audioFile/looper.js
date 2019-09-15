this.looper = function(x,y,a){
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
        name: 'looper',
        category: 'audioFile',
        collection: 'alpha',
        x:x, y:y, a:a,
        space:[{x:0,y:0},{x:220,y:0},{x:220,y:55},{x:0,y:55}],
        // spaceOutline:true,
        elements:[
            {collection:'basic', type:'polygon', name:'backing', data:{ pointsAsXYArray:[{x:0,y:0},{x:220,y:0},{x:220,y:55},{x:0,y:55}], colour:style.background }},

            {collection:'dynamic', type:'connectionNode_audio', name:'outRight', data:{ x:-10, y:5, width:10, height:20, isAudioOutput:true }},
            {collection:'dynamic', type:'connectionNode_audio', name:'outLeft', data:{ x:-10, y:27.5, width:10, height:20, isAudioOutput:true }},
            {collection:'dynamic', type:'connectionNode_data', name:'trigger', data:{
                x: 220, y: 17.5, width: 10, height: 20,
                onreceive:function(address, data){ object.elements.button_rectangle.fire.press(); }
            }},

            //symbol
                {collection:'basic', type:'circleWithOutline', name:'symbol_outterCircle1', data:{ x:11.5, y:41, radius:6, colour:style.background, lineColour:style.markings.colour, thickness:style.markings.thickness }},
                {collection:'basic', type:'circleWithOutline', name:'symbol_outterCircle2', data:{ x:18.5, y:41, radius:6, colour:style.background, lineColour:style.markings.colour, thickness:style.markings.thickness }},
                {collection:'basic', type:'rectangle', name:'symbol_blockingrect', data:{ x:11.5, y:34, width:7, height:15, colour:style.background }},
                {collection:'basic', type:'path', name:'symbol_upperarrow', data:{ pointsAsXYArray:[{x:13.5, y:32.5},{x:16.5, y:35},{x:13.5, y:37.5}], colour:style.markings.colour, thickness:style.markings.thickness }},
                {collection:'basic', type:'path', name:'symbol_lowerarrow', data:{ pointsAsXYArray:[{x:16.5, y:44.75},{x:13.5, y:47.25},{x:16.5, y:49.75}], colour:style.markings.colour, thickness:style.markings.thickness }},

            {collection:'control', type:'button_rectangle', name:'loadFile', data: { x:5, y: 5, width:20, height:10, style:style.button,
                onpress: function(){
                    object.looper.load('file',function(data){
                        object.elements.grapher_waveWorkspace.grapher_waveWorkspace.draw( object.looper.waveformSegment() );
                    });
                }
            }},
            {collection:'control', type:'button_rectangle',name:'fire',data:{ x:5, y: 17.5, width:10, height:10, style:style.fire_button,
                onpress:function(){
                    //no file -> don't bother
                        if(object.looper.duration() < 0){return;}

                    //actually start the audio
                        object.looper.start();
                    
                    //perform graphical movements
                        var duration = object.looper.duration();

                    //if there's already a needle; delete it
                        if(needleExists){
                            object.elements.grapher_waveWorkspace.grapher_waveWorkspace.select(0,-1);
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
                                    object.elements.grapher_waveWorkspace.grapher_waveWorkspace.select(0,-1);
                                }

                            previousPosition = currentPosition;
                            currentPosition += step;

                            //add new mark
                                object.elements.grapher_waveWorkspace.grapher_waveWorkspace.select(0,currentPosition);

                            //check for ending
                                if( currentPosition > 1 ){
                                    object.elements.grapher_waveWorkspace.grapher_waveWorkspace.select(0,-1);
                                    currentPosition = 0;
                                    previousPosition = undefined;
                                }

                        },stepTime);
                        needleExists = true;
                },
            }},
            {collection:'control', type:'button_rectangle',name:'stop',data:{ x:15, y: 17.5, width:10, height:10, style:style.stop_button,
                onpress:function(){
                    object.looper.stop();

                    //if there's a needle, remove it
                        if(needleExists){
                            object.elements.grapher_waveWorkspace.grapher_waveWorkspace.select(0,-1);
                            needleExists = false;
                            currentPosition = undefined;
                            clearTimeout(needleInterval);
                        }

                },
            }},

            {collection:'control', type:'grapher_waveWorkspace', name:'grapher_waveWorkspace', data:{ x:30, y:5, width:185, height:45, interactable:false, selectionArea:false }},
        ]
    };

    //main object
        var object = _canvas_.interface.unit.builder(design);

    //circuitry
        var needleExists = false;
        var needleInterval = undefined;
        var currentPosition = undefined;
        var previousPosition = undefined;

        //audioFilePlayer
            object.looper = new _canvas_.interface.circuit.looper(_canvas_.library.audio.context);
            object.looper.out_right().connect( object.elements.connectionNode_audio.outRight.in() );
            object.looper.out_left().connect( object.elements.connectionNode_audio.outLeft.in() );

    return object;
};

this.looper.metadata = {
    name:'Looper',
    category:'audioFile',
    helpURL:'https://curve.metasophiea.com/help/units/alpha/looper/'
};