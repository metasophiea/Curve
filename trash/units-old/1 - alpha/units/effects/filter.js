this.filter = function(name,x,y,angle){
    //style data
        const unitStyle = new function(){
            //image store location URL
                this.imageStoreURL_localPrefix = imageStoreURL+'filter/';

            //calculation of measurements
                const div = 6;
                const measurement = { 
                    file: { width:620, height:260 },
                    design: { width:10, height:4 },
                };

                this.offset = 20/div;
                this.drawingValue = { 
                    width: measurement.file.width/div, 
                    height: measurement.file.height/div
                };

            //styling values
                this.dial_lowBand = { handle:style.primaryEight[0], slot:{r:0,g:0,b:0,a:0}, needle:{r:1,g:1,b:1,a:1} };
                this.dial_midBand = { handle:style.primaryEight[3], slot:{r:0,g:0,b:0,a:0}, needle:{r:1,g:1,b:1,a:1} };
                this.dial_highBand = { handle:style.primaryEight[5], slot:{r:0,g:0,b:0,a:0}, needle:{r:1,g:1,b:1,a:1} };
        };

    //main object creation
        const object = _canvas_.interface.unit.builder({
            name:name,
            model:'filter',
            x:x, y:y, angle:angle,
            space:[
                { x:0,                                              y:0                                               },
                { x:unitStyle.drawingValue.width -unitStyle.offset, y:0                                               },
                { x:unitStyle.drawingValue.width -unitStyle.offset, y:unitStyle.drawingValue.height -unitStyle.offset },
                { x:0,                                              y:unitStyle.drawingValue.height -unitStyle.offset },
            ],
            elements:[
                {collection:'dynamic', type:'connectionNode_audio', name:'input', data:{ 
                    x:unitStyle.drawingValue.width - 10/3, y:unitStyle.drawingValue.height/2 - 9, width:5, height:15, angle:0, isAudioOutput:false, cableVersion:2, style:style.connectionNode.audio,
                }},
                {collection:'dynamic', type:'connectionNode_audio', name:'output', data:{ 
                    x:0, y:unitStyle.drawingValue.height/2 + 6, width:5, height:15, angle:Math.PI, isAudioOutput:true, cableVersion:2, style:style.connectionNode.audio,
                }},
                {collection:'basic', type:'image', name:'backing', data:{ 
                    x:-unitStyle.offset/2, y:-unitStyle.offset/2, width:unitStyle.drawingValue.width, height:unitStyle.drawingValue.height, url:unitStyle.imageStoreURL_localPrefix+'backing.png'
                }},
                {collection:'control', type:'dial_2_continuous',name:'dial_lowBand',data:{
                    x:17.5, y:22.5, radius:12.5, startAngle:(3*Math.PI)/4, maxAngle:1.5*Math.PI, value:0.5, arcDistance:1.2, resetValue:0.5, style:unitStyle.dial_lowBand,
                }},
                {collection:'control', type:'dial_2_continuous',name:'dial_midBand',data:{
                    x:47.5, y:22.5, radius:12.5, startAngle:(3*Math.PI)/4, maxAngle:1.5*Math.PI, value:0.5, arcDistance:1.2, resetValue:0.5, style:unitStyle.dial_midBand,
                }},
                {collection:'control', type:'dial_2_continuous',name:'dial_highBand',data:{
                    x:77.5, y:22.5, radius:12.5, startAngle:(3*Math.PI)/4, maxAngle:1.5*Math.PI, value:0.5, arcDistance:1.2, resetValue:0.5, style:unitStyle.dial_highBand,
                }},
            ]
        });

    //circuitry
        const curvePointExponentialSharpness = 10.586609649448984;
        const state = {
            currentValues:{
                gain: [1,1,1],
                frequency: [250,700,2500],
                Q: [0,1/2,0],
            },
            defaultValues:{
                gain: [1,1,1],
                frequency: [250,700,2500],
                Q: [0,0.35,0],
            }
        };
        const filterCircuit = new _canvas_.interface.circuit.multibandFilter(_canvas_.library.audio.context, 3, true);

        function setGain(band,value){ 
            if(band == undefined){return state.currentValues.gain;}
            if(value == undefined){return state.currentValues.gain[band];}

            state.currentValues.gain[band] = value;
            filterCircuit.gain(band,state.currentValues.gain[band]);
        }

    //wiring
        //hid
            object.elements.dial_2_continuous.dial_lowBand.onchange = function(value){ setGain(0,value*2); };
            object.elements.dial_2_continuous.dial_midBand.onchange = function(value){ setGain(1,value*2); };
            object.elements.dial_2_continuous.dial_highBand.onchange = function(value){ setGain(2,value*2); };
        //io
            object.io.audio.input.out().connect( filterCircuit.in() );
            filterCircuit.out().connect( object.elements.connectionNode_audio.output.in() );

    //interface
        object.i = {
            gain:function(band,value){
                const element = object.elements.dial_2_continuous[ ['dial_lowBand','dial_midBand','dial_highBand'][band] ];
                if(value == undefined){ return element.get(); }
                element.set(value/2);
            },
            Q:function(band,value){ 
                if(band == undefined){return state.currentValues.Q;}
                if(value == undefined){return state.currentValues.Q[band];}

                state.currentValues.Q[band] = value;
                filterCircuit.Q(band, _canvas_.library.math.curvePoint.exponential(state.currentValues.Q[band],0,20000,curvePointExponentialSharpness));
            },
            frequency:function(band,value){
                if(band == undefined){return state.currentValues.frequency;}
                if(value == undefined){return state.currentValues.frequency[band];}

                state.currentValues.frequency[band] = value;
                filterCircuit.frequency(band, state.currentValues.frequency[band]);
            },
            reset:function(channel){
                if(channel == undefined){
                    //if no channel if specified, reset all of them
                    for(let a = 0; a < 3; a++){ object.i.reset(a); }
                    return;
                }
                for(let a = 0; a < 3; a++){
                    object.i.gain(a,state.defaultValues.gain[a]);
                    object.i.Q(a,state.defaultValues.Q[a]);
                    object.i.frequency(a,state.defaultValues.frequency[a]);
                }
            },
        };

    //import/export
        object.exportData = function(){
            return {
                low: object.elements.dial_2_continuous.dial_lowBand.get(),
                mid: object.elements.dial_2_continuous.dial_midBand.get(),
                high: object.elements.dial_2_continuous.dial_highBand.get(),
            };
        };
        object.importData = function(data){
            object.elements.dial_2_continuous.dial_lowBand.set( data.low );
            object.elements.dial_2_continuous.dial_midBand.set( data.mid );
            object.elements.dial_2_continuous.dial_highBand.set( data.high );
        };

    //setup/tearDown
        object.oncreate = function(){
            object.i.reset();
        };

    return object;
};
this.filter.metadata = {
    name:'Filter (unfinished)',
    category:'effects',
    helpURL:'/help/units/alpha/filter/'
};
