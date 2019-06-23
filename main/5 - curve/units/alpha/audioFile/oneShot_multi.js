this.oneShot_multi = function(x,y,a){
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
        slide:{
            handle:{r:220/255,g:220/255,b:220/255,a:1}
        },
    };
    var design = {
        name: 'oneShot_multi',
        category: 'audioFile',
        collection: 'alpha',
        x:x, y:y, a:a,
        space:[{x:0,y:0},{x:220,y:0},{x:220,y:55},{x:0,y:55}],
        // spaceOutline:true,
        elements:[
            {collection:'basic', type:'polygon', name:'backing', data:{ pointsAsXYArray:[{x:0,y:0},{x:220,y:0},{x:220,y:55},{x:0,y:55}], colour:style.background }},

            //connection nodes
                {collection:'dynamic', type:'connectionNode_audio', name:'outRight', data:{ x:-10, y:5, width:10, height:20, isAudioOutput:true }},
                {collection:'dynamic', type:'connectionNode_audio', name:'outLeft', data:{ x:-10, y:27.5, width:10, height:20, isAudioOutput:true }},
                {collection:'dynamic', type:'connectionNode_data', name:'trigger', data:{
                    x:220, y:17.5, width:10, height:20,
                    onreceive:function(address, data){ object.elements.button_rectangle.fire.press(); object.elements.button_rectangle.fire.release(); }
                }},

            //symbol
                {collection:'basic', type:'path', name:'symbol_arrow', data:{ pointsAsXYArray:[{x:19, y:35},{x:25,y:40},{x:19, y:45}], colour:style.markings.colour, thickness:style.markings.thickness }},
                {collection:'basic', type:'rectangle', name:'symbol_line', data:{ x:15, y:39.5, width:6, height:1, colour:style.markings.colour }},
                {collection:'basic', type:'circleWithOutline', name:'symbol_outterCircle', data:{ x:10, y:40, radius:5.5, colour:style.background, lineColour:style.markings.colour, thickness:style.markings.thickness }},
                {collection:'basic', type:'circleWithOutline', name:'symbol_infCircle1', data:{ x:8.5, y:40, radius:1.5, colour:style.background, lineColour:style.markings.colour, thickness:style.markings.thickness }},
                {collection:'basic', type:'circleWithOutline', name:'symbol_infCircle2', data:{ x:11.5, y:40, radius:1.5, colour:style.background, lineColour:style.markings.colour, thickness:style.markings.thickness }},

            //load/fire/panic buttons
                {collection:'control', type:'button_rectangle', name:'loadFile', data: { x:5, y: 5, width:20, height:10, style:style.button,
                    onpress: function(){
                        object.oneShot.load('file',function(data){
                            object.elements.grapher_waveWorkspace.grapher_waveWorkspace.draw( object.oneShot.waveformSegment() );
                        });
                    }
                }},
                {collection:'control', type:'button_rectangle', name:'fire', data:{ x:5, y: 17.5, width:10, height:10, style:style.fire_button,
                    onpress:function(){
                        var filePlayer = object.oneShot;
                        var waveport = object.elements.grapher_waveWorkspace.grapher_waveWorkspace;

                        //no file = don't bother
                            if(filePlayer.duration() < 0){return;}

                        //determine start, end and duration values
                            var start = waveport.area().A != undefined ? waveport.area().A : 0;
                            var end = waveport.area().B != undefined ? waveport.area().B : 1;
                            if(start > end){var tmp = start; start = end; end = tmp;} //the 'ol switcheroo
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
                            object.elements.glowbox_rect.glowbox_rect.on();
                            setTimeout(object.elements.glowbox_rect.glowbox_rect.off, 100);

                        //perform graphical movements
                            needles[needleNumber].previousPosition = undefined;
                            needles[needleNumber].currentPosition = start;
                            needles[needleNumber].endPosition = end;

                            var desiredIntervalTime = 10;
                            var step = (desiredIntervalTime*(end-start))/(subduration*1000);
                            needles[needleNumber].needleInterval = setInterval(function(nN){
                                //remove previous mark
                                    if(needles[nN].previousPosition != undefined){
                                        waveport.mark(needles[nN].currentPosition);
                                    }

                                //update position
                                    needles[nN].previousPosition = needles[nN].currentPosition;
                                    needles[nN].currentPosition += step;

                                //add new mark
                                    waveport.mark(needles[nN].currentPosition);

                                //check for ending
                                    if( needles[nN].currentPosition > needles[nN].endPosition ){
                                        waveport.mark(needles[nN].currentPosition);
                                        clearInterval(needles[nN].needleInterval);
                                        delete needles[nN];
                                    }
                            },desiredIntervalTime,needleNumber);
                    },
                }},
                {collection:'control', type:'button_rectangle', name:'panic', data:{ x:15, y: 17.5, width:10, height:10, style:style.stop_button,
                    onpress:function(){
                        var filePlayer = object.oneShot;
                        var waveport = object.elements.grapher_waveWorkspace.grapher_waveWorkspace;

                        filePlayer.panic();

                        var keys = Object.keys(needles);
                        for(var a = 0; a < keys.length; a++){
                            if(needles[a] == undefined){continue;}
                            clearTimeout(needles[a].needleInterval);
                            delete needles[a];
                        }
                        waveport.removeAllMarks();
                    },
                }},

            //rate adjust
                {collection:'control', type:'slide', name:'rate', data:{ x:26.25, y:5, width:5, height:45, value:0.5, resetValue:0.5, style:style.slide,
                    onchange:function(value){object.oneShot.rate((1-value)*2);}
                }},

            //fire light
                {collection:'display', type:'glowbox_rect', name:'glowbox_rect', data:{ x:32.5, y:5, width:2.5, height:45 }},

            //waveport
                {collection:'control', type:'grapher_waveWorkspace', name:'grapher_waveWorkspace', data:{ x:35, y:5, width:180, height:45, selectNeedle:false, selectionArea:true }},
        ]
    };

    //main object
        var object = _canvas_.interface.unit.builder(this.oneShot_multi,design);

    //circuitry
        var needles = [];

        //audioFilePlayer
            object.oneShot = new _canvas_.interface.circuit.oneShot_multi(_canvas_.library.audio.context);
            object.oneShot.out_right().connect( object.elements.connectionNode_audio.outRight.in() );
            object.oneShot.out_left().connect( object.elements.connectionNode_audio.outLeft.in() );

    //interface
        object.i = {};
        object.i.loadURL = function(url, callback){
            object.oneShot.load('url', function(){
                object.elements.grapher_waveWorkspace.grapher_waveWorkspace.draw(object.oneShot.waveformSegment());
                if(callback != undefined){callback();}
            }, url);
        };
        object.i.area = function(a,b){
            object.elements.grapher_waveWorkspace.grapher_waveWorkspace.area(a,b);
        };
        
    return object;
};

this.oneShot_multi.metadata = {
    name:'One Shot (Multi)',
    category:'audioFile',
    helpURL:'https://curve.metasophiea.com/help/units/alpha/oneShot_multi/'
};
