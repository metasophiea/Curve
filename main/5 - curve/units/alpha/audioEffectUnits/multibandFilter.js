this.multibandFilter = function(x,y,a){
    var vars = {
        allowUpdate:false,
        freqRange:{ low: 0.1, high: 20000 },
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
        background:{fill:'rgba(200,200,200,1)'},

        h1:{fill:'rgba(0,0,0,1)', font:'6pt Courier New'},
        h2:{fill:'rgba(0,0,0,1)', font:'4pt Courier New'},
        h3:{fill:'rgba(0,0,0,1)', font:'2pt Courier New'},

        panels:[
            {fill:'rgba(0,200,163,  0.5)'},
            {fill:'rgba(100,235,131,0.5)'},
            {fill:'rgba(228,255,26, 0.5)'},
            {fill:'rgba(232,170,20, 0.5)'},
            {fill:'rgba(255,87,20,  0.5)'},
            {fill:'rgba(0,191,255,  0.5)'},
            {fill:'rgba(249,99,202, 0.5)'},
            {fill:'rgba(255,255,255,0.5)'},
        ],

        slide:{
            handle:'rgba(240,240,240,1)',
            backing:'rgba(200,200,200,0.5)',
            slot:'rgba(50,50,50,1)',
        },
        dial:{
            handle:'rgba(220,220,220,1)',
            slot:'rgba(50,50,50,1)',
            needle:'rgba(250,150,150,1)',
        },

        graph:{
            foregrounds: [
                {stroke:'rgba(0,200,163,1)', lineWidth:0.5, lineJoin:'round'},
                {stroke:'rgba(100,235,131,1)', lineWidth:0.5, lineJoin:'round'},
                {stroke:'rgba(228,255,26,1)', lineWidth:0.5, lineJoin:'round'},
                {stroke:'rgba(232,170,20,1)', lineWidth:0.5, lineJoin:'round'},
                {stroke:'rgba(255,87,20,1)', lineWidth:0.5, lineJoin:'round'},
                {stroke:'rgba(0,191,255,1)', lineWidth:0.5, lineJoin:'round'},
                {stroke:'rgba(249,99,202,1)', lineWidth:0.5, lineJoin:'round'},
                {stroke:'rgba(255,255,255,1)', lineWidth:0.5, lineJoin:'round'},
            ], 
            background_stroke: 'rgba(0,200,163,0.25)', 
            background_lineWidth: 0.25, 
            backgroundText_fill: 'rgba(0,200,163,0.75)', 
            backgroundText_font: '8pt Helvetica',
        },
    };
    var width = 195;
    var height = 255;
    var design = {
        name: 'multibandFilter',
        category: 'audioEffectUnits',
        collection: 'alpha',
        x:x, y:y, a:a,
        space:[
            { x:0,        y:10         }, { x:10,       y:0          },
            { x:width-10, y:0          }, { x:width,    y:10         },
            { x:width,    y:height-10  }, { x:width-10, y:height     },
            { x:10,       y:height     }, { x:0,        y:height-10  },
            { x:0, y:75 }, { x:-25, y:65 }, { x:-25, y:10 },
        ],
        // spaceOutline:true,
        elements:[
            {type:'polygon', name:'backing', data:{ points:[ { x:0,        y:10         }, { x:10,       y:0          },
                { x:width-10, y:0          }, { x:width,    y:10         },
                { x:width,    y:height-10  }, { x:width-10, y:height     },
                { x:10,       y:height     }, { x:0,        y:height-10  },
                { x:0, y:75 }, { x:-25, y:65 }, { x:-25, y:10 }
            ], style:style.background }},

            {type:'connectionNode_audio', name:'audioIn_0', data:{x:195, y:15, width:10, height:20}},
            {type:'connectionNode_audio', name:'audioIn_1', data:{x:195, y:40, width:10, height:20}},
            {type:'connectionNode_audio', name:'audioOut_0', data:{x:-35, y:15, width:10, height:20, isAudioOutput:true}},
            {type:'connectionNode_audio', name:'audioOut_1', data:{x:-35, y:40, width:10, height:20, isAudioOutput:true}},
            {type:'dial_continuous',name:'masterGain',data:{ x:-10, y:37.5, r:10, startAngle:(3*Math.PI)/4, maxAngle:1.5*Math.PI, resetValue:0.5, style:style.dial }},
            {type:'grapher_static', name:'graph', data:{x:10, y:10, width:175, height:75, style:style.graph, resolution:5 }},
        ]
    };
    //dynamic design
    for(var a = 0; a < vars.channelCount; a++){
        design.elements.push(
            //channel strip backing
                {type:'rectangle', name:'backing_'+a, data:{ x:13.75+a*22, y:87.5, width:12.5, height:157.5, style:style.panels[a] }},
            //gain
                {type:'slide', name:'gainSlide_'+a, data:{ x:15+a*22, y:90, width: 10, height: 80, angle:0, handleHeight:0.05, resetValue:0.5, style:style.slide }},
            //Q
                {type:'dial_continuous', name:'qDial_'+a, data:{ x:20+a*22, y:180, r:7, startAngle:(3*Math.PI)/4, maxAngle:1.5*Math.PI, style:style.dial }},
            //frequency
                {type:'dial_continuous', name:'frequencyDial_'+a, data:{ x:20+a*22, y:200, r:7, startAngle:(3*Math.PI)/4, maxAngle:1.5*Math.PI, style:style.dial }},
            //frequency readout
                {type:'readout_sixteenSegmentDisplay_static', name:'frequencyReadout_'+a, data:{ x:25+a*22, y:212.5, width:30, height:10, count:8, angle:Math.PI/2, resolution:10 }},
        );
    }

    //main object
        var object = alphaUnit.builder(this.multibandFilter,design);

    //import/export
        object.exportData = function(){
            return {
                masterGain: vars.masterGain,
                freqRange: vars.freqRange,
                channelCount: vars.channelCount,
                gain: vars.gain,
                Q: vars.Q,
                frequency: vars.frequency,
            };
        };
        object.importData = function(data){};

    //circuitry
        object.filterCircuit_0 = new workspace.interface.circuit.alpha.multibandFilter(workspace.library.audio.context, vars.channelCount, true);
        object.filterCircuit_1 = new workspace.interface.circuit.alpha.multibandFilter(workspace.library.audio.context, vars.channelCount, true);
        object.elements.connectionNode_audio.audioIn_0.out().connect( object.filterCircuit_0.in() );
        object.elements.connectionNode_audio.audioIn_1.out().connect( object.filterCircuit_1.in() );
        object.filterCircuit_0.out().connect( object.elements.connectionNode_audio.audioOut_0.in() );
        object.filterCircuit_1.out().connect( object.elements.connectionNode_audio.audioOut_1.in() );

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
            return {frequency:frequencyArray, location:workspace.library.math.normalizeStretchArray(locationArray)};
        }
        function updateGraph(specificBand){
            if(!vars.allowUpdate){return;}
            //if no band has been specified, gather the data for all of them and draw the whole thing. Otherwise, just gather 
            //and redraw the data for the one band

            var frequencyAndLocationArray = getFrequencyAndLocationArray();
                if(specificBand == undefined){
                    var result = object.filterCircuit_0.measureFrequencyResponse(undefined, frequencyAndLocationArray.frequency);
                    for(var a = 0; a < vars.channelCount; a++){ object.elements.grapher_static.graph.draw( result[a][0], frequencyAndLocationArray.location, a ); }
                }else{
                    var result = object.filterCircuit_0.measureFrequencyResponse(specificBand, frequencyAndLocationArray.frequency);
                    object.elements.grapher_static.graph.draw( result[0], frequencyAndLocationArray.location, specificBand);
                }
        }

    //wiring
        object.elements.dial_continuous.masterGain.onchange = function(value){
            vars.masterGain = value*2;
            object.filterCircuit_0.masterGain(vars.masterGain);
            object.filterCircuit_1.masterGain(vars.masterGain);
            updateGraph();
        };

        for(var a = 0; a < vars.channelCount; a++){
            object.elements.slide['gainSlide_'+a].onchange = function(a){
                return function(value){
                    vars.gain[a] = (1-value)*2;
                    object.filterCircuit_0.gain(a,vars.gain[a]);
                    object.filterCircuit_1.gain(a,vars.gain[a]);
                    updateGraph(a);
                }
            }(a);
            object.elements.dial_continuous['qDial_'+a].onchange = function(a){
                return function(value){
                    vars.Q[a] = value;
                    object.filterCircuit_0.Q(a, workspace.library.math.curvePoint.exponential(vars.Q[a],0,20000,vars.curvePointExponentialSharpness));
                    object.filterCircuit_1.Q(a, workspace.library.math.curvePoint.exponential(vars.Q[a],0,20000,vars.curvePointExponentialSharpness));
                    updateGraph(a);
                }
            }(a);
            object.elements.dial_continuous['frequencyDial_'+a].onchange = function(a){
                return function(value){
                    vars.frequency[a] = value;
                    object.elements.readout_sixteenSegmentDisplay_static['frequencyReadout_'+a].text( workspace.library.misc.padString( workspace.library.math.curvePoint.exponential(value,0,20000,vars.curvePointExponentialSharpness).toFixed(2), 8) );
                    object.elements.readout_sixteenSegmentDisplay_static['frequencyReadout_'+a].print('smart');
                    object.filterCircuit_0.frequency(a, workspace.library.math.curvePoint.exponential(vars.frequency[a],0,20000,vars.curvePointExponentialSharpness));
                    object.filterCircuit_1.frequency(a, workspace.library.math.curvePoint.exponential(vars.frequency[a],0,20000,vars.curvePointExponentialSharpness));
                    updateGraph(a);
                }
            }(a);
        }

    //interface
        object.i = {
            gain:function(band,value){ if(value == undefined){return object.elements.slide['gainSlide_'+band].get(value);} object.elements.slide['gainSlide_'+band].set(value); },
            Q:function(band,value){ if(value == undefined){return object.elements.dial_continuous['qDial_'+band].get(value);} object.elements.dial_continuous['qDial_'+band].set(value); },
            frequency:function(band,value){ if(value == undefined){return object.elements.dial_continuous['frequencyDial_'+band].get(value);} object.elements.dial_continuous['frequencyDial_'+band].set(value); },
            reset:function(channel){
                if(channel == undefined){
                    //if no channel if specified, reset all of them
                    for(var a = 0; a < vars.channelCount; a++){ object.i.reset(a); }
                    object.elements.dial_continuous.masterGain.set(0.5);
                    return;
                }
                for(var a = 0; a < vars.channelCount; a++){
                    object.elements.slide['gainSlide_'+a].set( vars.defaultValues.gain[a] );
                    object.elements.dial_continuous['qDial_'+a].set( vars.defaultValues.Q[a] );
                    object.elements.dial_continuous['frequencyDial_'+a].set( vars.defaultValues.frequency[a] );
                }
            },
        };

    //setup
        //draw background
            var arrays = getFrequencyAndLocationArray();
            arrays.frequency = arrays.frequency.filter(function(a,i){return i%Math.pow(2,vars.graphDetail)==0;});
            arrays.location = arrays.location.filter(function(a,i){return i%Math.pow(2,vars.graphDetail)==0;});
            object.elements.grapher_static.graph.viewbox({bottom: 0, top: 2, left: 0, right: 1});
            object.elements.grapher_static.graph.horizontalMarkings({points:[0.25,0.5,0.75,1,1.25,1.5,1.75],textPosition:{x:0.005,y:0.075},printText:true});
            object.elements.grapher_static.graph.verticalMarkings({
                points:arrays.location,
                printingValues:arrays.frequency.map(a => Math.log10(a)%1 == 0 ? a : '').slice(0,arrays.frequency.length-1).concat(''), //only print the factoirs of 10, leaving everything else as an empty string
                textPosition:{x:-0.0025,y:1.99},
                printText:true,
            });

        //setup default settings, allow graphical updates to occur and update graph
            object.i.reset();
            setTimeout(function(){object.i.reset();},1); 
            vars.allowUpdate = true;
            updateGraph();
    
    return object;
};

this.multibandFilter.metadata = {
    name:'Multiband Filter',
    helpURL:'https://curve.metasophiea.com/help/units/alpha/multibandFilter/'
};