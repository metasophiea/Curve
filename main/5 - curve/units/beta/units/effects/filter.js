this.filter = function(x,y,a){
    var imageStoreURL_localPrefix = imageStoreURL+'filter/';

    var div = 6;
    var offset = 20/div;
    var measurements = { 
        file:{ width:620, height:260 },
        design:{ width:10, height:4 },
    };
    measurements.drawing = { width: measurements.file.width/div, height: measurements.file.height/div };
    measurements.drawingUnit = {
        width: measurements.drawing.width/measurements.design.width,
        height: measurements.drawing.height/measurements.design.height,
    };

    var design = {
        name:'filter',
        x:x, y:y, angle:a,
        space:[
            { x:0,                                  y:0                                   },
            { x:measurements.drawing.width -offset, y:0                                   },
            { x:measurements.drawing.width -offset, y:measurements.drawing.height -offset },
            { x:0,                                  y:measurements.drawing.height -offset },
        ],
        elements:[
            {collection:'dynamic', type:'connectionNode_audio', name:'input', data:{ 
                x:measurements.drawing.width - 3-1/3, y:measurements.drawing.height/2 - 9, width:5, height:15, angle:0, isAudioOutput:false, cableVersion:2,
                style:style.connectionNode.audio,
            }},
            {collection:'dynamic', type:'connectionNode_audio', name:'output', data:{ 
                x:0, y:measurements.drawing.height/2 + 6, width:5, height:15, angle:Math.PI, isAudioOutput:true, cableVersion:2,
                style:style.connectionNode.audio,
            }},
            {collection:'basic', type:'image', name:'backing', data:{ 
                x:-offset/2, y:-offset/2, width:measurements.drawing.width, height:measurements.drawing.height, url:imageStoreURL_localPrefix+'backing.png'
            }},
            {collection:'control', type:'dial_colourWithIndent_continuous',name:'dial_lowBand',data:{
                x:17.5, y:22.5, radius:75/6, startAngle:(3*Math.PI)/4, maxAngle:1.5*Math.PI, value:0.5, arcDistance:1.2, resetValue:0.5,
                style:{ handle:style.primaryEight[0], slot:{r:0,g:0,b:0,a:0}, needle:{r:1,g:1,b:1,a:1} },
            }},
            {collection:'control', type:'dial_colourWithIndent_continuous',name:'dial_midBand',data:{
                x:17.5+30, y:22.5, radius:75/6, startAngle:(3*Math.PI)/4, maxAngle:1.5*Math.PI, value:0.5, arcDistance:1.2, resetValue:0.5,
                style:{ handle:style.primaryEight[3], slot:{r:0,g:0,b:0,a:0}, needle:{r:1,g:1,b:1,a:1} },
            }},
            {collection:'control', type:'dial_colourWithIndent_continuous',name:'dial_highBand',data:{
                x:17.5+60, y:22.5, radius:75/6, startAngle:(3*Math.PI)/4, maxAngle:1.5*Math.PI, value:0.5, arcDistance:1.2, resetValue:0.5,
                style:{ handle:style.primaryEight[5], slot:{r:0,g:0,b:0,a:0}, needle:{r:1,g:1,b:1,a:1} },
            }},
        ]
    };
    
    //main object
        var object = _canvas_.interface.unit.builder(design);

    //circuitry
        var curvePointExponentialSharpness = 10.586609649448984;
        var vars = {
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

        object.filterCircuit = new _canvas_.interface.circuit.multibandFilter(_canvas_.library.audio.context, 3, true);
        object.elements.connectionNode_audio.input.out().connect( object.filterCircuit.in() );
        object.filterCircuit.out().connect( object.elements.connectionNode_audio.output.in() );

    //interface
        object.i = {
            gain:function(band,value){ 
                if(band == undefined){return vars.currentValues.gain;}
                if(value == undefined){return vars.currentValues.gain[band];}

                vars.currentValues.gain[band] = value;
                object.filterCircuit.gain(band,vars.currentValues.gain[band]);
            },
            Q:function(band,value){ 
                if(band == undefined){return vars.currentValues.Q;}
                if(value == undefined){return vars.currentValues.Q[band];}

                vars.currentValues.Q[band] = value;
                object.filterCircuit.Q(band, _canvas_.library.math.curvePoint.exponential(vars.currentValues.Q[band],0,20000,curvePointExponentialSharpness));
            },
            frequency:function(band,value){
                if(band == undefined){return vars.currentValues.frequency;}
                if(value == undefined){return vars.currentValues.frequency[band];}

                vars.currentValues.frequency[band] = value;
                object.filterCircuit.frequency(band, vars.currentValues.frequency[band]);
            },
            reset:function(channel){
                if(channel == undefined){
                    //if no channel if specified, reset all of them
                    for(var a = 0; a < 3; a++){ object.i.reset(a); }
                    return;
                }
                for(var a = 0; a < 3; a++){
                    object.i.gain(a,vars.defaultValues.gain[a]);
                    object.i.Q(a,vars.defaultValues.Q[a]);
                    object.i.frequency(a,vars.defaultValues.frequency[a]);
                }
            },
        };

    //wiring
        object.elements.dial_colourWithIndent_continuous.dial_lowBand.onchange = function(value){ object.i.gain(0,value*2); };
        object.elements.dial_colourWithIndent_continuous.dial_midBand.onchange = function(value){ object.i.gain(1,value*2); };
        object.elements.dial_colourWithIndent_continuous.dial_highBand.onchange = function(value){ object.i.gain(2,value*2); };

    //setup
        object.i.reset();

    return object;
};



this.filter.metadata = {
    name:'Filter (unfinished)',
    category:'effects',
    helpURL:'/help/units/beta/filter/'
};