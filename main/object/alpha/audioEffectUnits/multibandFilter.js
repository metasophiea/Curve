this.multibandFilter = function(
    x, y, angle,
){
    var vars = {
        allowUpdate:false,
        freqRange:{ low: 0.1, high: 20000, },
        graphDetail: 2, //factor of the number of points a graphed line is drawn with
        channelCount: 8,
        masterGain:1,
        gain:[],
        Q:[],
        frequency:[],
        curvePointExponentialSharpness:10.586609649448984,
        defaultValues:{
            gain:[0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,],
            //standard tunings
                // Q:[0,0.06,0.06,0.06,0.06,0.06,0.06,0],
                // frequency:[0.05, 0.1, 0.225, 0.375, 0.5, 0.65, 0.8, 0.875],
            //human range tunings
                Q:[0,0.09,0.09,0.09,0.09,0.09,0.09,0],
                frequency:[0.41416, 0.479046, 0.565238, 0.630592, 0.717072, 0.803595, 0.91345175, 0.93452845],
        }
    };
    var style = {
        background: 'fill:rgba(200,200,200,1); stroke:none;',
        h1: 'fill:rgba(0,0,0,1); font-size:6px; font-family:Courier New;',
        h2: 'fill:rgba(0,0,0,1); font-size:4px; font-family:Courier New;',
        h3: 'fill:rgba(0,0,0,1); font-size:2px; font-family:Courier New;',
        panels:[
            'fill:rgba(0,200,163,  0.25);  pointer-events:none;',
            'fill:rgba(100,235,131,0.25); pointer-events:none;',
            'fill:rgba(228,255,26, 0.25); pointer-events:none;',
            'fill:rgba(232,170,20, 0.25); pointer-events:none;',
            'fill:rgba(255,87,20,  0.25); pointer-events:none;',
            'fill:rgba(0,191,255,  0.25); pointer-events:none;',
            'fill:rgba(249,99,202, 0.25); pointer-events:none;',
            'fill:rgba(255,255,255,0.25); pointer-events:none;',
        ],

        slide:{
            handle:'fill:rgba(240,240,240,1)',
            backing:'fill:rgba(150,150,150,0)',
            slot:'fill:rgba(50,50,50,1)',
        },
        dial:{
            handle: 'fill:rgba(220,220,220,1)',
            slot: 'fill:rgba(50,50,50,1)',
            needle: 'fill:rgba(250,150,150,1)',
            arc: 'fill:none; stroke:rgb(150,150,150); stroke-width:1;',
        },
        graph:{
            foregroundlines:[
                'stroke:rgba(0,200,163,1); stroke-width:0.5; stroke-linecap:round;',
                'stroke:rgba(100,235,131,1); stroke-width:0.5; stroke-linecap:round;',
                'stroke:rgba(228,255,26,1); stroke-width:0.5; stroke-linecap:round;',
                'stroke:rgba(232,170,20,1); stroke-width:0.5; stroke-linecap:round;',
                'stroke:rgba(255,87,20,1); stroke-width:0.5; stroke-linecap:round;',
                'stroke:rgba(0,191,255,1); stroke-width:0.5; stroke-linecap:round;',
                'stroke:rgba(249,99,202,1); stroke-width:0.5; stroke-linecap:round;',
                'stroke:rgba(255,255,255,1); stroke-width:0.5; stroke-linecap:round;',
            ],
            backgroundlines:'stroke:rgba(0,200,163,0.25); stroke-width:0.25;',
            backgroundtext:'fill:rgba(0,200,163,0.75); font-size:1; font-family:Helvetica;',
        }
    };
    var width = 195;
    var height = 255;
    var design = {
        name: 'multibandFilter',
        collection: 'alpha',
        x: x, y: y,
        base: {
            points:[
                { x:0,        y:10         }, { x:10,       y:0          },
                { x:width-10, y:0          }, { x:width,    y:10         },
                { x:width,    y:height-10  }, { x:width-10, y:height     },
                { x:10,       y:height     }, { x:0,        y:height-10  },
                { x:0, y:75 }, { x:-25, y:65 }, { x:-25, y:10 },
            ], 
            style:style.background
        },
        elements:[
            {type:'connectionNode_audio', name:'audioIn_0', data:{type:0, x:195, y:15, width:10, height:20}},
            {type:'connectionNode_audio', name:'audioIn_1', data:{type:0, x:195, y:40, width:10, height:20}},
            {type:'connectionNode_audio', name:'audioOut_0', data:{type:1, x:-35, y:15, width:10, height:20}},
            {type:'connectionNode_audio', name:'audioOut_1', data:{type:1, x:-35, y:40, width:10, height:20}},
            {type:'dial_continuous',name:'masterGain',data:{
                x:-10, y:37.5, r:10, startAngle:(3*Math.PI)/4, maxAngle:1.5*Math.PI, arcDistance:1.35, 
                style:{handle:style.dial.handle, slot:style.dial.slot, needle:style.dial.needle, outerArc:style.dial.markings},
                onchange:function(a){
                    return function(value){
                        vars.masterGain = value*2;
                        obj.filterCircuit_0.masterGain(vars.masterGain);
                        obj.filterCircuit_1.masterGain(vars.masterGain);
                        updateGraph();
                    }
                }(a)
            }},
            {type:'grapherSVG', name:'graph', data:{x:10, y:10, width:175, height:75, style:{foreground:style.graph.foregroundlines, background:style.graph.backgroundlines, backgroundText:style.graph.backgroundtext}}},
        ]
    };
    //dynamic design
    for(var a = 0; a < vars.channelCount; a++){
        design.elements.push(
            //channel strip backing
                {type:'rect', name:'backing_'+a, data:{
                    x:13.75+a*22, y:87.5, width:12.5, height:157.5, style:style.panels[a],
                }},
            //gain
                {type:'slide',name:'gainSlide_'+a,data:{
                    x:15+a*22, y:90, width: 10, height: 80, angle:0, handleHeight:0.05, resetValue:0.5,
                    style:{handle:style.slide.handle, backing:style.slide.backing, slot:style.slide.slot}, 
                    onchange:function(a){
                        return function(value){
                            vars.gain[a] = (1-value)*2;
                            obj.filterCircuit_0.gain(a,vars.gain[a]);
                            obj.filterCircuit_1.gain(a,vars.gain[a]);
                            updateGraph(a);
                        }
                    }(a)
                }},
            //Q
                {type:'dial_continuous',name:'qDial_'+a,data:{
                    x:20+a*22, y:180, r:7, startAngle:(3*Math.PI)/4, maxAngle:1.5*Math.PI, arcDistance:1.35, 
                    style:{handle:style.dial.handle, slot:style.dial.slot, needle:style.dial.needle, outerArc:style.dial.markings},
                    onchange:function(a){
                        return function(value){
                            vars.Q[a] = value;
                            obj.filterCircuit_0.Q(a, system.utility.math.curvePoint.exponential(vars.Q[a],0,20000,vars.curvePointExponentialSharpness));
                            obj.filterCircuit_1.Q(a, system.utility.math.curvePoint.exponential(vars.Q[a],0,20000,vars.curvePointExponentialSharpness));
                            updateGraph(a);
                        }
                    }(a)
                }},
            //frequency
                {type:'dial_continuous',name:'frequencyDial_'+a,data:{
                    x:20+a*22, y:200, r:7, startAngle:(3*Math.PI)/4, maxAngle:1.5*Math.PI, arcDistance:1.35, 
                    style:{handle:style.dial.handle, slot:style.dial.slot, needle:style.dial.needle, outerArc:style.dial.markings},
                    onchange:function(a){
                        return function(value){
                            vars.frequency[a] = value;
                            design.readout_sixteenSegmentDisplay['frequencyReadout_'+a].text( system.utility.misc.padString( system.utility.math.curvePoint.exponential(value,0,20000,vars.curvePointExponentialSharpness).toFixed(2), 8) );
                            design.readout_sixteenSegmentDisplay['frequencyReadout_'+a].print('smart');
                            obj.filterCircuit_0.frequency(a, system.utility.math.curvePoint.exponential(vars.frequency[a],0,20000,vars.curvePointExponentialSharpness));
                            obj.filterCircuit_1.frequency(a, system.utility.math.curvePoint.exponential(vars.frequency[a],0,20000,vars.curvePointExponentialSharpness));
                            updateGraph(a);
                        }
                    }(a)
                }},
            //frequency readout
                {type:'readout_sixteenSegmentDisplay',name:'frequencyReadout_'+a,data:{
                    x:25+a*22, y:212.5, width:30, height:10, count:8, angle:Math.PI/2,
                }},
        );
    }

    //main object
        var obj = object.builder(object.alpha.multibandFilter,design);

    //import/export
        obj.exportData = function(){
            return {
                masterGain: vars.masterGain,
                freqRange: vars.freqRange,
                channelCount: vars.channelCount,
                gain: vars.gain,
                Q: vars.Q,
                frequency: vars.frequency,
            };
        };
        obj.importData = function(data){};

    //circuitry
        obj.filterCircuit_0 = new part.circuit.audio.multibandFilter(system.audio.context, vars.channelCount, true);
        obj.filterCircuit_1 = new part.circuit.audio.multibandFilter(system.audio.context, vars.channelCount, true);
        design.connectionNode_audio.audioIn_0.out().connect( obj.filterCircuit_0.in() );
        design.connectionNode_audio.audioIn_1.out().connect( obj.filterCircuit_1.in() );
        obj.filterCircuit_0.out().connect( design.connectionNode_audio.audioOut_0.in() );
        obj.filterCircuit_1.out().connect( design.connectionNode_audio.audioOut_1.in() );

    //internal functions
        function getFrequencyAndLocationArray(){
            var locationArray = [];
            var frequencyArray = [];
            for(var a = 0; a <= Math.floor(Math.log10(vars.freqRange.high))+1; a++){
                for(var b = 1; b < 10; b+=1/Math.pow(2,vars.graphDetail)){
                    if( Math.pow(10,a)*(b/10) >= vars.freqRange.high){break;}
                    locationArray.push( Math.log10(Math.pow(10,a)*b) );
                    frequencyArray.push( Math.pow(10,a)*(b/10) );
                }
            }
            return {frequency:frequencyArray, location:system.utility.math.normalizeStretchArray(locationArray)};
        }
        function updateGraph(specificBand){
            if(!vars.allowUpdate){return;}
            //if no band has been specified, gather the data for all of them and draw the whole thing. Otherwise, just gather 
            //and redraw the data for the one band

            var frequencyAndLocationArray = getFrequencyAndLocationArray();
                if(specificBand == undefined){
                    var result = obj.filterCircuit_0.measureFrequencyResponse(undefined, frequencyAndLocationArray.frequency);
                    for(var a = 0; a < vars.channelCount; a++){ design.grapherSVG.graph.draw( result[a][0], frequencyAndLocationArray.location, a ); }
                }else{
                    var result = obj.filterCircuit_0.measureFrequencyResponse(specificBand, frequencyAndLocationArray.frequency);
                    design.grapherSVG.graph.draw( result[0], frequencyAndLocationArray.location, specificBand);
                }
        }

    //interface
        obj.i = {
            gain:function(band,value){ if(value == undefined){return design.slide['gainSlide_'+band].get(value);} design.slide['gainSlide_'+band].set(value); },
            Q:function(band,value){ if(value == undefined){return design.dial_continuous['qDial_'+band].get(value);} design.dial_continuous['qDial_'+band].set(value); },
            frequency:function(band,value){ if(value == undefined){return design.dial_continuous['frequencyDial_'+band].get(value);} design.dial_continuous['frequencyDial_'+band].set(value); },
            reset:function(channel){
                if(channel == undefined){
                    //if no channel if specified, reset all of them
                    for(var a = 0; a < vars.channelCount; a++){ obj.i.reset(a); }
                    design.dial_continuous.masterGain.set(0.5);
                    return;
                }
                for(var a = 0; a < vars.channelCount; a++){
                    design.slide['gainSlide_'+a].set( vars.defaultValues.gain[a] );
                    design.dial_continuous['qDial_'+a].set( vars.defaultValues.Q[a] );
                    design.dial_continuous['frequencyDial_'+a].set( vars.defaultValues.frequency[a] );
                }
            },
        };

    //setup
        //draw background
            var arrays = getFrequencyAndLocationArray();
            arrays.frequency = arrays.frequency.filter(function(a,i){return i%Math.pow(2,vars.graphDetail)==0;});
            arrays.location = arrays.location.filter(function(a,i){return i%Math.pow(2,vars.graphDetail)==0;});
            design.grapherSVG.graph.viewbox({'bottom':0,'top':2});
            design.grapherSVG.graph.horizontalMarkings({points:[0.25,0.5,0.75,1,1.25,1.5,1.75],textPosition:{x:0.005,y:0.075},printText:true});
            design.grapherSVG.graph.verticalMarkings({
                    points:arrays.location,
                    printingValues:arrays.frequency.map(a => Math.log10(a)%1 == 0 ? a : '').slice(0,arrays.frequency.length-1).concat(''), //only print the factoirs of 10, leaving everything else as an empty string
                    textPosition:{x:-0.0025,y:1.99},
                    printText:true,
                });
            design.grapherSVG.graph.drawBackground();
        // setup default settings, allow graphical updates to occur and update graph
            obj.i.reset();
            vars.allowUpdate = true;
            updateGraph();
    
    return obj;
};

this.multibandFilter.metadata = {
    name:'Multiband Filter',
    helpurl:'https://metasophiea.com/curve/help/objects/multibandFilter/'
};