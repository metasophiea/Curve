var equalizer = function(
    id='equalizer',
    x, y, width, height, angle,
){
    var vars = {
        freqRange:{ low: 0.1, high: 20000, },
        graphDetail: 3,
        channels: 8,
    };
    var style = {
        background: 'fill:rgba(200,200,200,1); stroke:none;',
        h1: 'fill:rgba(0,0,0,1); font-size:6px; font-family:Courier New;',
        h2: 'fill:rgba(0,0,0,1); font-size:4px; font-family:Courier New;',
        h3: 'fill:rgba(0,0,0,1); font-size:2px; font-family:Courier New;',
        markings: 'fill:rgba(150,150,150,1); pointer-events:none;',

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

    var design = {
        type: 'distortionUnit',
        x: x, y: y,
        base: {
            points:[
                { x:0,        y:10      }, { x:10,       y:0      },
                { x:102.5-10, y:0       }, { x:102.5,    y:10     },
                { x:102.5,    y:195-10  }, { x:102.5-10, y:195     },
                { x:10,       y:195     }, { x:0,        y:195-10  }
            ], 
            style:style.background
        },
        elements:[
            {type:'connectionNode_audio', name:'audioIn', data:{ type: 0, x: 120, y: 16, width: 10, height: 20, angle:-0.14}},
            {type:'connectionNode_audio', name:'audioOut', data:{ type: 1, x: -2.3, y: 16, width: 10, height: 20, angle:0.144 }},

            {type:'rect', name:'vertical_0', data:{
                x:25, y:15, width:30, height:242.5, 
                style:style.markings,
            }},
            {type:'rect', name:'vertical_1', data:{
                x:57.5, y:15, width:30, height:242.5, 
                style:style.markings,
            }},
            {type:'rect', name:'vertical_2', data:{
                x:90, y:15, width:30, height:242.5, 
                style:style.markings,
            }},
            {type:'label', name:'frequency_title', data:{x:33, y:11, text:'Freq', style:style.h1}},
            {type:'label', name:'Q_title', data:{x:68, y:11, text:'Q', style:style.h1}},
            {type:'label', name:'gain_title', data:{x:98, y:11, text:'Gain', style:style.h1}},
            {type:'grapherSVG', name:'graph', data:{x:185, y:5, width:120, height:75, style:{foreground:style.graph.foregroundlines, background:style.graph.backgroundlines, backgroundText:style.graph.backgroundtext}}},
        ]
    };
    //dynamic design
    for(var a = 0; a < vars.channels; a++){
        design.elements.push(
            {type:'label', name:'freqLabel_'+a+'_0',     data:{x:29,    y: 30*a+43,    text:'0',     style:style.h3}},
            {type:'label', name:'freqLabel_'+a+'_100',   data:{x:38.25, y: 30*a+18.25, text:'100',   style:style.h3}},
            {type:'label', name:'freqLabel_'+a+'_20k',   data:{x:50,    y: 30*a+43,    text:'20k',   style:style.h3}},
            {type:'dial_continuous',name:'freq_'+a, data:{ x: 40, y: 30*a+32.5,  r: 12, startAngle: (3*Math.PI)/4, maxAngle: 1.5*Math.PI, arcDistance: 1.2,
                onchange:function(a){
                    return function(value){
                        design.readout_sixteenSegmentDisplay['readout_'+a].text( __globals.utility.misc.padString( __globals.utility.math.curvePoint.exponential(value,0,20000,10.5866095).toFixed(2), 8) );
                        design.readout_sixteenSegmentDisplay['readout_'+a].print('smart');
                        obj.filterCircuit.frequency(a, __globals.utility.math.curvePoint.exponential(value,0,20000,10.5866095));
                        updateGraph(a);
                    }
                }(a)
            }},
            {type:'label', name:'qLabel_'+a+'_0',     data:{x:2.5+59,    y: 30*a+43,    text:'0',   style:style.h3}},
            {type:'label', name:'qLabel_'+a+'_1/2',   data:{x:2.5+68.25, y: 30*a+18.25, text:'1/2', style:style.h3}},
            {type:'label', name:'qLabel_'+a+'_1',     data:{x:2.5+80,    y: 30*a+43,    text:'1',   style:style.h3}},
            {type:'dial_continuous',name:'q_'+a,   data:{ x:  2.5+70, y: 30*a+32.5,  r: 12, startAngle: (3*Math.PI)/4, maxAngle: 1.5*Math.PI, arcDistance: 1.2,
                onchange:function(a){
                    return function(value){
                        obj.filterCircuit.Q(a, value*10);
                        updateGraph(a);
                    }
                }(a)
            }},
            {type:'label', name:'gainLabel_'+a+'_0', data:{x:35+59,    y: 30*a+43,    text:'0',   style:style.h3}},
            {type:'label', name:'gainLabel_'+a+'_2', data:{x:35+69.5, y: 30*a+18.25, text:'1',   style:style.h3}},
            {type:'label', name:'gainLabel_'+a+'_1', data:{x:35+80,    y: 30*a+43,    text:'2',   style:style.h3}},
            {type:'dial_continuous',name:'gain_'+a,  data:{x:35+70, y: 30*a+32.5,  r: 12, startAngle: (3*Math.PI)/4, maxAngle: 1.5*Math.PI, arcDistance: 1.2,
                onchange:function(a){
                    return function(value){
                        obj.filterCircuit.gain(a, value*2);
                        updateGraph(a);
                    }
                }(a)
            }},
            {type:'readout_sixteenSegmentDisplay',name:'readout_'+a,data:{
                x:122.5, y:30*a+22.5, width:60, height:20, count:8,
            }},
        );
    }

    //main object
        var obj = __globals.utility.misc.objectBuilder(objects.distortionUnit,design);

    //import/export
    //circuitry
        //multiband filter
            obj.filterCircuit = new parts.circuits.audio.multibandFilter(__globals.audio.context,vars.channels);
            design.connectionNode_audio.audioIn.out().connect( obj.filterCircuit.in() );
            obj.filterCircuit.out().connect( design.connectionNode_audio.audioOut.in() );

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
                return {frequency:frequencyArray, location:__globals.utility.math.normalizeStretchArray(locationArray)};
            }
            function updateGraph(specificBand){
                //if no band has been specified, gather the data for all of them and draw the whole thing. Otherwise, just gather 
                //and redraw the data for the one band

                var frequencyAndLocationArray = getFrequencyAndLocationArray();
                if(specificBand == undefined){
                    var result = obj.filterCircuit.measureFrequencyResponse_values_allBands(frequencyAndLocationArray.frequency);
                    for(var a = 0; a < vars.channels; a++){ design.grapherSVG.graph.draw( result[a][0], frequencyAndLocationArray.location, a ); }
                }else{
                    var result = obj.filterCircuit.measureFrequencyResponse_values(specificBand, frequencyAndLocationArray.frequency);
                    design.grapherSVG.graph.draw( result[0], frequencyAndLocationArray.location, specificBand);
                }
            }

    //setup
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

        for(var a = 0; a < vars.channels; a++){
            design.dial_continuous['freq_'+a].set( a/vars.channels );
            design.dial_continuous['q_'+a].set(0.15);
            design.dial_continuous['gain_'+a].set(0.5);
        }
        design.dial_continuous['freq_'+0].set( 0.4/vars.channels );
        updateGraph();

    return obj;
};