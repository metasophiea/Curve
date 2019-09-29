this.distortion = function(x,y,angle){
    //style data
        var unitStyle = new function(){
            //image store location URL
                this.imageStoreURL_localPrefix = imageStoreURL+'distortion/';

            //calculation of measurements
                var div = 6;
                var measurement = { 
                    file: { width:725, height:395 },
                    design: { width:11.75, height:6.25 },
                };

                this.offset = 20/div;
                this.drawingValue = { 
                    width: measurement.file.width/div, 
                    height: measurement.file.height/div
                };

            //styling values
                this.inGain = { handle:style.primaryEight[1], slot:{r:0,g:0,b:0,a:0}, needle:{r:1,g:1,b:1,a:1} };
                this.resolution = { handle:style.primaryEight[7], slot:{r:0,g:0,b:0,a:0}, needle:{r:1,g:1,b:1,a:1} };
                this.distortion = { handle:style.primaryEight[4], slot:{r:0,g:0,b:0,a:0}, needle:{r:1,g:1,b:1,a:1} };
                this.outGain = { handle:style.primaryEight[0], slot:{r:0,g:0,b:0,a:0}, needle:{r:1,g:1,b:1,a:1} };
        };

    //main object creation
        var object = _canvas_.interface.unit.builder({
            name:'distortion',
            x:x, y:y, angle:angle,
            space:[
                { x:0,                                              y:0                                               },
                { x:unitStyle.drawingValue.width -unitStyle.offset, y:0                                               },
                { x:unitStyle.drawingValue.width -unitStyle.offset, y:unitStyle.drawingValue.height -unitStyle.offset },
                { x:0,                                              y:unitStyle.drawingValue.height -unitStyle.offset },
            ],
            elements:[
                {collection:'dynamic', type:'connectionNode_audio', name:'input', data:{ 
                    x:unitStyle.drawingValue.width-2.9, y:40, width:5, height:15, angle:0, isAudioOutput:false, cableVersion:2, style:style.connectionNode.audio
                }},
                {collection:'dynamic', type:'connectionNode_audio', name:'output', data:{ 
                    x:0, y:55, width:5, height:15, angle:Math.PI, isAudioOutput:true, cableVersion:2, style:style.connectionNode.audio
                }},
                {collection:'dynamic', type:'connectionNode_voltage', name:'inGain_connection', data:{ 
                    x:97, y:unitStyle.drawingValue.height-3.5, width:5, height:10, angle:Math.PI*0.5, cableVersion:2, style:style.connectionNode.voltage,
                }},
                {collection:'dynamic', type:'connectionNode_voltage', name:'resolution_connection', data:{ 
                    x:67, y:0, width:5, height:10, angle:-Math.PI*0.5, cableVersion:2, style:style.connectionNode.voltage,
                }},
                {collection:'dynamic', type:'connectionNode_voltage', name:'distortion_connection', data:{ 
                    x:32, y:0, width:5, height:10, angle:-Math.PI*0.5, cableVersion:2, style:style.connectionNode.voltage,
                }},
                {collection:'dynamic', type:'connectionNode_voltage', name:'outGain_connection', data:{ 
                    x:22, y:unitStyle.drawingValue.height-3.5, width:5, height:10, angle:Math.PI*0.5, cableVersion:2, style:style.connectionNode.voltage,
                }},
                {collection:'dynamic', type:'connectionNode_signal', name:'oversample_left', data:{ 
                    x:50, y:unitStyle.drawingValue.height-3.5, width:5, height:10, angle:Math.PI*0.5, cableVersion:2, style:style.connectionNode.signal,
                }},
                {collection:'dynamic', type:'connectionNode_signal', name:'oversample_right', data:{ 
                    x:68, y:unitStyle.drawingValue.height-3.5, width:5, height:10, angle:Math.PI*0.5, cableVersion:2, style:style.connectionNode.signal,
                }},
                {collection:'basic', type:'image', name:'backing', 
                    data:{ x:-unitStyle.offset/2, y:-unitStyle.offset/2, width:unitStyle.drawingValue.width, height:unitStyle.drawingValue.height, url:unitStyle.imageStoreURL_localPrefix+'backing.png' }
                },
                {collection:'control', type:'dial_colourWithIndent_continuous',name:'inGain',data:{
                    x:92, y:47, radius:22.5/2, startAngle:(3*Math.PI)/4, maxAngle:1.5*Math.PI, value:0, arcDistance:1.2, resetValue:0.5, style:unitStyle.inGain,
                }},
                {collection:'control', type:'dial_colourWithIndent_continuous',name:'resolution',data:{
                    x:72, y:19.5, radius:27.5/2, startAngle:(3*Math.PI)/4, maxAngle:1.5*Math.PI, value:0, arcDistance:1.2, resetValue:0.5, style:unitStyle.resolution,
                }},
                {collection:'control', type:'dial_colourWithIndent_continuous',name:'distortion',data:{
                    x:37, y:19.5, radius:27.5/2, startAngle:(3*Math.PI)/4, maxAngle:1.5*Math.PI, value:0, arcDistance:1.2, resetValue:0.5, style:unitStyle.distortion,
                }},
                {collection:'control', type:'dial_colourWithIndent_continuous',name:'outGain',data:{
                    x:17, y:47, radius:22.5/2, startAngle:(3*Math.PI)/4, maxAngle:1.5*Math.PI, value:0, arcDistance:1.2, resetValue:0.5, style:unitStyle.outGain,
                }},
                {collection:'control', type:'slide_discrete_image',name:'oversample',data:{
                    x:41.5, y:57.5, width:10, height:27, handleHeight:1/3, resetValue:0.5, angle:-Math.PI/2, optionCount:3, value:0,
                    handleURL:unitStyle.imageStoreURL_localPrefix+'handle.png',
                }},
            ]
        });

    //circuitry
        distortionCircuit = new _canvas_.interface.circuit.distortionUnit(_canvas_.library.audio.context);

    //wiring
        //hid
            object.elements.dial_colourWithIndent_continuous.inGain.onchange = function(value){distortionCircuit.inGain(2*value);};
            object.elements.dial_colourWithIndent_continuous.resolution.onchange = function(value){distortionCircuit.resolution(Math.round(value*1000));};
            object.elements.dial_colourWithIndent_continuous.distortion.onchange = function(value){distortionCircuit.distortionAmount(value*100);};
            object.elements.dial_colourWithIndent_continuous.outGain.onchange = function(value){distortionCircuit.outGain(value);};
            object.elements.slide_discrete_image.oversample.onchange = function(value){distortionCircuit.oversample(['none','2x','4x'][value]);};
        //io
            object.elements.connectionNode_audio.input.out().connect( distortionCircuit.in() );
            distortionCircuit.out().connect( object.elements.connectionNode_audio.output.in() );
            object.elements.connectionNode_signal.oversample_left.onchange = function(value){ if(!value){return;} object.elements.slide_discrete_image.oversample.set( object.elements.slide_discrete_image.oversample.get() - 1 ); };
            object.elements.connectionNode_signal.oversample_right.onchange = function(value){ if(!value){return;} object.elements.slide_discrete_image.oversample.set( object.elements.slide_discrete_image.oversample.get() + 1 ); };
            object.elements.connectionNode_voltage.inGain_connection.onchange = function(value){ object.elements.dial_colourWithIndent_continuous.inGain.set(value); };
            object.elements.connectionNode_voltage.resolution_connection.onchange = function(value){ object.elements.dial_colourWithIndent_continuous.resolution.set(value); };
            object.elements.connectionNode_voltage.distortion_connection.onchange = function(value){ object.elements.dial_colourWithIndent_continuous.distortion.set(value); };
            object.elements.connectionNode_voltage.outGain_connection.onchange = function(value){ object.elements.dial_colourWithIndent_continuous.outGain.set(value); };

    //interface
        object.i = {
            outGain:function(value){
                if(value==undefined){ return object.elements.dial_colourWithIndent_continuous.outGain.get(); }
                object.elements.dial_colourWithIndent_continuous.outGain.set(value);
            },
            distortionAmount:function(value){
                if(value==undefined){ return object.elements.dial_colourWithIndent_continuous.distortion.get(); }
                object.elements.dial_colourWithIndent_continuous.distortion.set(value);
            },
            resolution:function(value){
                if(value==undefined){ return object.elements.dial_colourWithIndent_continuous.resolution.get(); }
                object.elements.dial_colourWithIndent_continuous.resolution.set(value);
            },
            overSample:function(value){
                if(value==undefined){ return object.elements.slide_discrete_image.oversample.get(); }
                object.elements.slide_discrete_image.oversample.set(value);
            },
            inGain:function(value){
                if(value==undefined){ return object.elements.dial_colourWithIndent_continuous.inGain.get(); }
                object.elements.dial_colourWithIndent_continuous.inGain.set(value);
            },
        };

    //import/export
        object.importData = function(data){
            object.elements.dial_colourWithIndent_continuous.outGain.set(data.outGain);
            object.elements.dial_colourWithIndent_continuous.distortion.set(data.distortionAmount);
            object.elements.dial_colourWithIndent_continuous.resolution.set(data.resolution);
            object.elements.slide_discrete_image.oversample.set(data.overSample);
            object.elements.dial_colourWithIndent_continuous.inGain.set(data.inGain);
        };
        object.exportData = function(){
            return {
                outGain:          object.elements.dial_colourWithIndent_continuous.outGain.get(), 
                distortionAmount: object.elements.dial_colourWithIndent_continuous.distortion.get(), 
                resolution:       object.elements.dial_colourWithIndent_continuous.resolution.get(), 
                overSample:       object.elements.slide_discrete_image.oversample.get(), 
                inGain:           object.elements.dial_colourWithIndent_continuous.inGain.get()
            };
        };

    //setup
        object.elements.dial_colourWithIndent_continuous.resolution.set(0.5);
        object.elements.dial_colourWithIndent_continuous.inGain.set(0.5);
        object.elements.dial_colourWithIndent_continuous.outGain.set(1);

    return object;
};
this.distortion.metadata = {
    name:'Distortion',
    category:'effects',
    helpURL:'/help/units/beta/distortion/'
};

