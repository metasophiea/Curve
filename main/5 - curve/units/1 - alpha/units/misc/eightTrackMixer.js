this.eightTrackMixer = function(x,y,angle){
    //style data
        var unitStyle = new function(){
            //image store location URL
                this.imageStoreURL_localPrefix = imageStoreURL+'eightTrackMixer/';

            //calculation of measurements
                var div = 6;
                var measurement = { 
                    file: { width:1550, height:830 },
                    design: { width:25.5, height:13.5 },
                };

                this.offset = 20/div;
                this.drawingValue = { 
                    width: measurement.file.width/div, 
                    height: measurement.file.height/div
                };

            //styling values
                this.dial = style.primaryEight.map(item => { return { handle:item, slot:{r:0,g:0,b:0,a:0}, needle:{r:1,g:1,b:1,a:1} }; });
        };

    //main object creation
        var object = _canvas_.interface.unit.builder({
            name:'eightTrackMixer',
            x:x, y:y, angle:angle,
            space:[
                { x:0,                                              y:0                                               },
                { x:unitStyle.drawingValue.width -unitStyle.offset, y:0                                               },
                { x:unitStyle.drawingValue.width -unitStyle.offset, y:unitStyle.drawingValue.height -unitStyle.offset },
                { x:0,                                              y:unitStyle.drawingValue.height -unitStyle.offset },
            ],
            elements:[
                {collection:'dynamic', type:'connectionNode_audio', name:'output_L', data:{ 
                    x:105, y:0, width:5, height:15, angle:-Math.PI/2, isAudioOutput:true, cableVersion:2, style:style.connectionNode.audio,
                }},
                {collection:'dynamic', type:'connectionNode_audio', name:'output_R', data:{ 
                    x:130, y:0, width:5, height:15, angle:-Math.PI/2, isAudioOutput:true, cableVersion:2, style:style.connectionNode.audio,
                }},
                {collection:'basic', type:'image', name:'backing', 
                    data:{ x:-unitStyle.offset/2, y:-unitStyle.offset/2, width:unitStyle.drawingValue.width, height:unitStyle.drawingValue.height, url:unitStyle.imageStoreURL_localPrefix+'backing.png' }
                },
            ].concat(
                (function(){
                    var newElements = [];
                    for(var a = 0; a < 8; a++){
                        newElements.push(
                            {collection:'control', type:'dial_colourWithIndent_continuous',name:'dial_panner_'+a,data:{
                                x:20 +30*a, y:32.75, radius:(165/6)/2, startAngle:(3*Math.PI)/4, maxAngle:1.5*Math.PI, arcDistance:1.2, value:0.5, resetValue:0.5, style:unitStyle.dial[a],
                            }},
                        );
                        newElements.push(
                            {collection:'control', type:'slide_continuous_image',name:'slide_volume_'+a,data:{
                                x:12.5 +30*a, y:52.5, width:15, height:75, handleHeight:0.125, value:1, resetValue:0.5,
                                handleURL:unitStyle.imageStoreURL_localPrefix+'volumeSlideHandles_'+a+'.png'
                            }}
                        );
                        newElements.unshift(
                            {collection:'dynamic', type:'connectionNode_audio', name:'input_'+a, data:{ 
                                x:27.5 +30*a, y:135, width:5, height:15, angle:Math.PI/2, isAudioOutput:false, cableVersion:2, style:style.connectionNode.audio,
                            }},
                        );
                        newElements.unshift(
                            {collection:'dynamic', type:'connectionNode_voltage', name:'voltageConnection_panner_'+a, data:{ 
                                x:0, y:20 +12.5*a, width:5, height:10, angle:Math.PI, cableVersion:2, style:style.connectionNode.voltage
                            }},
                        );
                        newElements.unshift(
                            {collection:'dynamic', type:'connectionNode_voltage', name:'voltageConnection_volume_'+a, data:{ 
                                x:255, y:30 +12.5*a, width:5, height:10, angle:0, cableVersion:2, style:style.connectionNode.voltage
                            }},
                        );
                    }
                    return newElements;
                })()
            )
        });

    //circuitry
        var audioLanes = []
        for(var a = 0; a < 8; a++){
            audioLanes.push( new _canvas_.interface.circuit.channelMultiplier(_canvas_.library.audio.context,2) );
        }

    //wiring
        //hid
            for(var a = 0; a < 8; a++){
                object.elements.slide_continuous_image['slide_volume_'+a].onchange = function(a){
                    return function(value){
                        audioLanes[a].inGain(2*(1-value));
                    }
                }(a);
                object.elements.dial_colourWithIndent_continuous['dial_panner_'+a].onchange = function(a){
                    return function(value){
                        audioLanes[a].outGain(0,1-value);
                        audioLanes[a].outGain(1,value);
                    }
                }(a);

                object.elements.connectionNode_voltage['voltageConnection_panner_'+a].onchange = function(a){
                    return function(value){
                        object.elements.dial_colourWithIndent_continuous['dial_panner_'+a].set(value);
                    }
                }(a);
                object.elements.connectionNode_voltage['voltageConnection_volume_'+a].onchange = function(a){
                    return function(value){
                        object.elements.slide_continuous_image['slide_volume_'+a].set(1-value);
                    }
                }(a);
            }
        //io
            for(var a = 0; a < 8; a++){
                object.elements.connectionNode_audio['input_'+a].out().connect(audioLanes[a].in());
                audioLanes[a].out(0).connect( object.elements.connectionNode_audio['output_L'].in() );
                audioLanes[a].out(1).connect( object.elements.connectionNode_audio['output_R'].in() );
            }

    //interface
        object.i = {
            gain:function(track,value){
                if(value == undefined){
                    return 1-object.elements.slide_continuous_image['slide_volume_'+track].get();
                }else{
                    object.elements.slide_continuous_image['slide_volume_'+track].set(1-value);
                }
            },
            pan:function(track,value){
                if(value == undefined){
                    return object.elements.dial_colourWithIndent_continuous['dial_panner_'+track].get();
                }else{
                    object.elements.dial_colourWithIndent_continuous['dial_panner_'+track].set(value);
                }
            },
        };

    //import/export
        object.exportData = function(){
            return {
                gains:[...Array(8).keys()].map(item => object.i.gain(item)),
                pans:[...Array(8).keys()].map(item => object.i.pan(item)),
            };
        };
        object.importData = function(data){
            data.gains.forEach((value,index) => object.i.gain(index,value));
            data.pans.forEach((value,index) => object.i.pan(index,value));
        };

    //setup
        for(var a = 0; a < 8; a++){
            object.i.gain(a,0.5);
            object.i.pan(a,0.5);
        }

    return object;
};
this.eightTrackMixer.metadata = {
    name:'Eight Track Mixer',
    category:'misc',
    helpURL:'/help/units/beta/eightTrackMixer/'
};