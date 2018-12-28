this.oneShot_multi = function(x,y,debug=false){
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
        name: 'oneShot_multi',
        category: 'audioFile',
        collection: 'alpha',
        x:x, y:y,
        space:[{x:0,y:0},{x:220,y:0},{x:220,y:55},{x:0,y:55}],
        // spaceOutline:true,
        elements:[
            {type:'polygon', name:'backing', data:{ points:[{x:0,y:0},{x:220,y:0},{x:220,y:55},{x:0,y:55}], style:style.background }},

            // //connection nodes
            {type:'connectionNode_audio', name:'outRight', data:{ x:-10, y:5, width:10, height:20, isAudioOutput:true }},
            {type:'connectionNode_audio', name:'outLeft', data:{ x:-10, y:27.5, width:10, height:20, isAudioOutput:true }},
            {type:'connectionNode_data', name:'trigger', data:{
                x:220, y:17.5, width:10, height:20,
                onreceive:function(address, data){ object.elements.button_rect.fire.press(); object.elements.button_rect.fire.release(); }
            }},

            //symbol
                {type:'path', name:'symbol_arrow', data:{ points:[{x:19, y:35},{x:25,y:40},{x:19, y:45}], style:style.strokeMarkings }},
                {type:'rectangle', name:'symbol_line', data:{ x:15, y:39.5, width:6, height:1, style:style.markings }},
                {type:'circle', name:'symbol_outterCircle', data:{ x:10, y:40, r:5.5, style:style.strokeMarkings }},
                {type:'circle', name:'symbol_infCircle1', data:{ x:8.5, y:40, r:1.5, style:style.strokeMarkings }},
                {type:'circle', name:'symbol_infCircle2', data:{ x:11.5, y:40, r:1.5, style:style.strokeMarkings }},

            //load/fire/panic buttons
                {type:'button_rect', name:'loadFile', data: { x:5, y: 5, width:20, height:10, style:style.button,
                    onpress: function(){
                        object.oneShot.load('file',function(data){
                            object.elements.grapher_waveWorkspace.grapher_waveWorkspace.draw( object.oneShot.waveformSegment() );
                        });
                    }
                }},
                {type:'button_rect', name:'fire', data:{ x:5, y: 17.5, width:10, height:10, style:style.fire_button,
                    onpress:function(){
                        var filePlayer = object.oneShot;
                        var waveport = object.elements.grapher_waveWorkspace.grapher_waveWorkspace;

                        //no file = don't bother
                            if(filePlayer.duration() < 0){return;}

                        //determine start, end and duration values
                            var start = waveport.area().A != undefined ? waveport.area().A : 0;
                            var end = waveport.area().B != undefined ? waveport.area().B : 1;
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
                            setTimeout(
                                function(){
                                    object.elements.glowbox_rect.glowbox_rect.off();
                                }
                            ,100);

                        //perform graphical movements
                            needles[needleNumber].previousPosition = undefined;
                            needles[needleNumber].currentPosition = startTime/duration;
                            needles[needleNumber].endPosition = startTime/duration + subduration/duration;
                            var stepTime = Math.floor(duration); //funky math to adjust the interval time proportional to the length of the file
                            var step = stepTime/(duration*1000);
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

                            },stepTime);
                    },
                }},
                {type:'button_rect', name:'panic', data:{ x:15, y: 17.5, width:10, height:10, style:style.stop_button,
                    onpress:function(){
                        var filePlayer = object.oneShot;
                        var waveport = object.elements.grapher_waveWorkspace.grapher_waveWorkspace;

                        filePlayer.panic();

                        var keys = Object.keys(needles);
                        for(var a = 0; a < keys.length; a++){
                            if(needles[a] == undefined){continue;}
                            clearTimeout(needles[a].needleInterval);
                            waveport.mark(needles[a].currentPosition);
                            delete needles[a];
                        }
                    },
                }},

            //rate adjust
                {type:'slide', name:'rate', data:{ x:26.25, y:5, width:5, height:45, value:0.5, resetValue:0.5, style:style.slide,
                    onchange:function(value){object.oneShot.rate((1-value)*2);}
                }},

            //fire light
                {type:'glowbox_rect', name:'glowbox_rect', data:{ x:32.5, y:5, width:2.5, height:45 }},

            //waveport
                {type:'grapher_waveWorkspace', name:'grapher_waveWorkspace', data:{ x:35, y:5, width:180, height:45, selectNeedle:false, selectionArea:true }},
        ]
    };

    //main object
        var object = interfaceUnit.builder(this.oneShot_multi,design);

    //circuitry
        var needles = [];

        //audioFilePlayer
            object.oneShot = new workspace.interface.circuit.alpha.oneShot_multi(workspace.library.audio.context);
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
    helpURL:'https://metasophiea.com/curve/help/units/alpha/oneShot_multi/'
};
