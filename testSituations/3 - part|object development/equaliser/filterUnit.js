objects.filterUnit = function(x,y){
    var style = {
        background: 'fill:rgba(200,200,200,1); stroke:none;',
        h1: 'fill:rgba(0,0,0,1); font-size:4px; font-family:Courier New;',
        h2: 'fill:rgba(0,0,0,1); font-size:3px; font-family:Courier New;',
        h3: 'fill:rgba(0,0,0,1); font-size:2px; font-family:Courier New;',

        dial:{
            handle: 'fill:rgba(220,220,220,1)',
            slot: 'fill:rgba(50,50,50,1)',
            needle: 'fill:rgba(250,150,150,1)',
            arc: 'fill:none; stroke:rgb(150,150,150); stroke-width:0.5;',
        },
        graph:{
            foregroundlines:'stroke:rgba(0,200,163,1); stroke-width:0.5; stroke-linecap:round;',
            backgroundlines:'stroke:rgba(0,200,163,0.25); stroke-width:0.25;',
            backgroundtext:'fill:rgba(0,200,163,0.75); font-size:1; font-family:Helvetica;',
        }
    };
    var design = {
        type: 'filterUnit',
        x: x, y: y,
        base: {
            points:[
                {x:10,y:0},
                {x:92.5,y:0},
                {x:102.5,y:70},
                {x:51.25,y:100},
                {x:0,y:70},
            ], 
            style:style.background
        },
        elements:[
            {type:'connectionNode_audio', name:'audioIn', data:{ type: 0, x: 94.8, y: 16, width: 10, height: 20, angle:-0.14}},
            {type:'connectionNode_audio', name:'audioOut', data:{ type: 1, x: -2.3, y: 16, width: 10, height: 20, angle:0.144 }},
        
            {type:'grapherSVG', name:'graph', data:{x:15, y:5, width:72.5, height:50, 
                style:{foreground:style.graph.foregroundlines, background:style.graph.backgroundlines, backgroundText:style.graph.backgroundtext}}
            },

            {type:'label', name:'Q_0',     data:{x:74,   y: 76,   text:'0',   style:style.h2}},
            {type:'label', name:'Q_1/2',   data:{x:79.5, y: 59.5, text:'1/2', style:style.h2}},
            {type:'label', name:'Q_1',     data:{x:89,   y: 76,   text:'1',   style:style.h2}},
            {type:'label', name:'Q_title', data:{x:81,   y:79,    text:'Q',   style:style.h1}},
            {type:'dial_continuous',name:'Q',data:{
                x: 82.5, y: 68.5, r: 7, startAngle: (3*Math.PI)/4, maxAngle: 1.5*Math.PI, arcDistance: 1.2, 
                style:{handle:style.dial.handle, slot:style.dial.slot, needle:style.dial.needle, outerArc:style.dial.arc},
                onchange:function(value){obj.filterCircuit.Q(value*10);updateGraph();},
            }},

            {type:'label', name:'gain_0',     data:{x:54,   y: 86,   text:'0',    style:style.h2}},
            {type:'label', name:'gain_1/2',   data:{x:61.5, y: 68.5, text:'5',    style:style.h2}},
            {type:'label', name:'gain_1',     data:{x:69,   y: 86,   text:'10',   style:style.h2}},
            {type:'label', name:'gain_title', data:{x:58,   y:89,    text:'Gain', style:style.h1}},
            {type:'dial_continuous',name:'gain',data:{
                x: 62.5, y: 77.5, r: 7, startAngle: (3*Math.PI)/4, maxAngle: 1.5*Math.PI, arcDistance: 1.2, 
                style:{handle:style.dial.handle, slot:style.dial.slot, needle:style.dial.needle, outerArc:style.dial.arc},
                onchange:function(value){obj.filterCircuit.gain(value*10);updateGraph();},
            }},
            
            {type:'label', name:'frequency_0',     data:{x:31.5, y: 86,   text:'0',     style:style.h3}},
            {type:'label', name:'frequency_100',   data:{x:38.25, y:68.5, text:'100',   style:style.h3}},
            {type:'label', name:'frequency_10000', data:{x:46.5, y: 86,   text:'10000', style:style.h3}},
            {type:'label', name:'frequency_title', data:{x:35.5, y:89,    text:'Freq',  style:style.h1}},
            {type:'dial_continuous',name:'frequency',data:{
                x: 40, y: 77.5, r: 7, startAngle: (3*Math.PI)/4, maxAngle: 1.5*Math.PI, arcDistance: 1.2, 
                style:{handle:style.dial.handle, slot:style.dial.slot, needle:style.dial.needle, outerArc:style.dial.arc},
                onchange:function(value){ obj.filterCircuit.frequency( __globals.utility.math.curvePoint.exponential(value,0,20000,10.5866095) );updateGraph(); },
            }},

            {type:'label', name:'type_lowp',  data:{x:10,    y: 74.5, text:'lowp', style:style.h3}},
            {type:'label', name:'type_highp', data:{x:5,     y: 69,   text:'highp',style:style.h3}},
            {type:'label', name:'type_band',  data:{x:8,     y: 63,   text:'band', style:style.h3}},
            {type:'label', name:'type_lows',  data:{x:14,    y: 59,   text:'lows', style:style.h3}},
            {type:'label', name:'type_highs', data:{x:22.5,  y: 59.5, text:'highs',style:style.h3}},
            {type:'label', name:'type_peak',  data:{x:27.5,  y: 63,   text:'peak', style:style.h3}},
            {type:'label', name:'type_notch', data:{x:29,    y: 69,   text:'notch',style:style.h3}},
            {type:'label', name:'type_all',   data:{x:25.5,  y: 74.5, text:'all',  style:style.h3}},
            {type:'label', name:'type_title', data:{x:15.5,  y:78.5,  text:'Type', style:style.h1}},
            {type:'dial_discrete',name:'type',data:{
                x: 20, y: 67.5, r: 7, startAngle: (3*Math.PI)/4, maxAngle: 1.5*Math.PI, arcDistance: 1.35, optionCount: 8,
                style:{handle:style.dial.handle, slot:style.dial.slot, needle:style.dial.needle},
                onchange:function(value){obj.filterCircuit.type(['lowpass','highpass','bandpass','lowshelf','highshelf','peaking','notch','allpass'][value]);updateGraph();},
            }},
        ]
    };

    //main object
        var obj = __globals.utility.misc.objectBuilder(objects.filterUnit,design);

    //import/export
        obj.importData = function(data){
            design.dial_continuous.Q.set(data.Q);
            design.dial_continuous.gain.set(data.gain);
            design.dial_discrete.type.select(data.type);
            design.dial_continuous.frequency.set(data.frequency);
        };
        obj.exportData = function(){
            return {
                Q:         design.dial_continuous.Q.get(), 
                gain:      design.dial_continuous.gain.get(), 
                type:      design.dial_discrete.type.select(), 
                frequency: design.dial_continuous.frequency.get(), 
            };
        };

    //circuitry
        //filter
            obj.filterCircuit = new parts.circuits.audio.filterUnit(__globals.audio.context);
            design.connectionNode_audio.audioIn.out().connect( obj.filterCircuit.in() );
            obj.filterCircuit.out().connect( design.connectionNode_audio.audioOut.in() );

        //internalfunctions
            function updateGraph(){
                //classic range: 20Hz to 20,000Hz

                var maxFreq = 20000;
                var frequencyArray = [];
                var locationArray = [];
                for(var a = 0; a < 6; a++){
                    for(var b = 1; b < 10; b++){
                        if( Math.pow(10,a)*(b/10) > maxFreq){break;}
                        locationArray.push( Math.log10(Math.pow(10,a)*b) );
                        frequencyArray.push( Math.pow(10,a)*(b/10) );
                    }
                }
                locationArray = __globals.utility.math.normalizeStretchArray(locationArray);

                design.grapherSVG.graph.horizontalMarkings({points:[0.25,0.5,0.75,1,1.25,1.5,1.75],printText:true});
                design.grapherSVG.graph.verticalMarkings({
                        points:locationArray,
                        printingValues:frequencyArray.map(a => Math.log10(a)%1 == 0 ? a : '').slice(0,frequencyArray.length-1).concat(''),
                        printText:true,
                    });
                design.grapherSVG.graph.drawBackground();

                var temp = obj.filterCircuit.measureFrequencyResponse_values(frequencyArray);
                design.grapherSVG.graph.draw( temp[0], locationArray );
            };

    //setup
        design.grapherSVG.graph.drawBackground();
        design.grapherSVG.graph.viewbox({'l':0,'h':2});

        design.dial_discrete.type.select(0);
        design.dial_continuous.Q.set(0);
        design.dial_continuous.gain.set(0.1);
        design.dial_continuous.frequency.set(0.5);
        setTimeout(updateGraph,50);

    return obj;
};
