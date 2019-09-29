this.filterUnit = function(x,y,a){
    var state = {
        freqRange:{ low:0.1, high:20000, },
        graphDetail:3,
    };
    var style = {
        background:{r:200/255,g:200/255,b:200/255,a:1},
        h1:{colour:{r:0/255,g:0/255,b:0/255,a:1}, size:2.5, ratio:1, font:'defaultThin', printingMode:{widthCalculation:'absolute',horizontal:'middle',vertical:'middle'}},
        h2:{colour:{r:150/255,g:150/255,b:150/255,a:1}, size:1, ratio:1.5, font:'defaultThin', printingMode:{widthCalculation:'absolute',horizontal:'middle',vertical:'middle'}},
        
        dial:{
            handle:{r:220/255,g:220/255,b:220/255,a:1},
            slot:{r:50/255,g:50/255,b:50/255,a:1},
            needle:{r:250/255,g:150/255,b:150/255,a:1},
        },
        graph:{
            foregroundlines:[{colour:{r:0/255,g:200/255,b:163/255,a:1}, thickness:0.25}],
            backgroundlines:{colour:{r:0/255,g:200/255,b:163/255,a:0.25}, thickness:0.25},
            backgroundtext:{colour:{r:0/255,g:200/255,b:163/255,a:0.75}, font:'Helvetica'},
        }
    };
    var design = {
        name:'filterUnit',
        category:'audioEffectUnits',
        collection:'alpha',
        x:x, y:y, angle:a,
        space:[ {x:10,y:0}, {x:92.5,y:0}, {x:102.5,y:70}, {x:51.25,y:100}, {x:0,y:70} ],
        // spaceOutline:true,
        elements:[
            {collection:'basic', type:'polygon', name:'backing', data:{ pointsAsXYArray:[{x:10,y:0}, {x:92.5,y:0}, {x:102.5,y:70}, {x:51.25,y:100}, {x:0,y:70}], colour:style.background }},

            {collection:'dynamic', type:'connectionNode_audio', name:'audioIn', data:{ x:94.8, y:16, width:10, height:20, angle:-0.14 }},
            {collection:'dynamic', type:'connectionNode_audio', name:'audioOut', data:{ x:-2.3, y:16, width:10, height:20, angle:0.144, isAudioOutput:true }},
        
            {collection:'display', type:'grapher_static', name:'graph', data:{x:15, y:5, width:72.5, height:50, resolution:15,
                style:{
                    foregrounds:style.graph.foregroundlines, 
                    background_colour:style.graph.backgroundlines.colour, 
                    background_lineThickness:style.graph.backgroundlines.thickness, 
                    backgroundText_colour:style.graph.backgroundtext.colour, 
                    backgroundText_font:style.graph.backgroundtext.font,
                }}
            },

            {collection:'basic', type:'text', name:'Q_0',     data:{x:76,   y:75,   text:'0',   width:style.h2.size, height:style.h2.size*style.h2.ratio, colour:style.h2.colour, font:style.h2.font, printingMode:style.h2.printingMode}},
            {collection:'basic', type:'text', name:'Q_1/2',   data:{x:82.5, y:59.5, text:'1/2', width:style.h2.size, height:style.h2.size*style.h2.ratio, colour:style.h2.colour, font:style.h2.font, printingMode:style.h2.printingMode}},
            {collection:'basic', type:'text', name:'Q_1',     data:{x:89,   y:75,   text:'1',   width:style.h2.size, height:style.h2.size*style.h2.ratio, colour:style.h2.colour, font:style.h2.font, printingMode:style.h2.printingMode}},
            {collection:'basic', type:'text', name:'Q_title', data:{x:82.5, y:78,   text:'Q',   width:style.h1.size, height:style.h1.size*style.h1.ratio, colour:style.h1.colour, font:style.h1.font, printingMode:style.h1.printingMode}},
            {collection:'control', type:'dial_continuous',name:'Q_dial',data:{
                x:82.5, y:68.5, radius:7, startAngle:(3*Math.PI)/4, maxAngle:1.5*Math.PI,
                style:{handle:style.dial.handle, slot:style.dial.slot, needle:style.dial.needle},
            }},

            {collection:'basic', type:'text', name:'gain_0',     data:{x:56,    y:84,   text:'0',    width:style.h2.size, height:style.h2.size*style.h2.ratio, colour:style.h2.colour, font:style.h2.font, printingMode:style.h2.printingMode}},
            {collection:'basic', type:'text', name:'gain_1/2',   data:{x:62.5,  y:68.5, text:'5',    width:style.h2.size, height:style.h2.size*style.h2.ratio, colour:style.h2.colour, font:style.h2.font, printingMode:style.h2.printingMode}},
            {collection:'basic', type:'text', name:'gain_1',     data:{x:69,    y:84,   text:'10',   width:style.h2.size, height:style.h2.size*style.h2.ratio, colour:style.h2.colour, font:style.h2.font, printingMode:style.h2.printingMode}},
            {collection:'basic', type:'text', name:'gain_title', data:{x:62.5,  y:87,   text:'Gain', width:style.h1.size, height:style.h1.size*style.h1.ratio, colour:style.h1.colour, font:style.h1.font, printingMode:style.h1.printingMode}},
            {collection:'control', type:'dial_continuous',name:'gain_dial',data:{
                x:62.5, y:77.5, radius:7, startAngle:(3*Math.PI)/4, maxAngle:1.5*Math.PI,
                style:{handle:style.dial.handle, slot:style.dial.slot, needle:style.dial.needle},
            }},
            
            {collection:'basic', type:'text', name:'frequency_0',     data:{x:33.5, y:84, text:'0',    width:style.h2.size, height:style.h2.size*style.h2.ratio, colour:style.h2.colour, font:style.h2.font, printingMode:style.h2.printingMode}},
            {collection:'basic', type:'text', name:'frequency_100',   data:{x:40, y:68.5, text:'100',  width:style.h2.size, height:style.h2.size*style.h2.ratio, colour:style.h2.colour, font:style.h2.font, printingMode:style.h2.printingMode}},
            {collection:'basic', type:'text', name:'frequency_20000', data:{x:47.5, y:84, text:'20k',  width:style.h2.size, height:style.h2.size*style.h2.ratio, colour:style.h2.colour, font:style.h2.font, printingMode:style.h2.printingMode}},
            {collection:'basic', type:'text', name:'frequency_title', data:{x:40, y:87,   text:'Freq', width:style.h1.size, height:style.h1.size*style.h1.ratio, colour:style.h1.colour, font:style.h1.font, printingMode:style.h1.printingMode}},
            {collection:'control', type:'dial_continuous',name:'frequency_dial',data:{
                x:40, y:77.5, radius:7, startAngle:(3*Math.PI)/4, maxAngle:1.5*Math.PI, 
                style:{handle:style.dial.handle, slot:style.dial.slot, needle:style.dial.needle},
            }},

            {collection:'basic', type:'text', name:'type_lowp',  data:{x:13,   y:74.5, text:'lowp',  width:style.h2.size, height:style.h2.size*style.h2.ratio, colour:style.h2.colour, font:style.h2.font, printingMode:style.h2.printingMode}},
            {collection:'basic', type:'text', name:'type_highp', data:{x:10,   y:69,   text:'highp', width:style.h2.size, height:style.h2.size*style.h2.ratio, colour:style.h2.colour, font:style.h2.font, printingMode:style.h2.printingMode}},
            {collection:'basic', type:'text', name:'type_band',  data:{x:10.5, y:63,   text:'band',  width:style.h2.size, height:style.h2.size*style.h2.ratio, colour:style.h2.colour, font:style.h2.font, printingMode:style.h2.printingMode}},
            {collection:'basic', type:'text', name:'type_lows',  data:{x:16,   y:58.5, text:'lows',  width:style.h2.size, height:style.h2.size*style.h2.ratio, colour:style.h2.colour, font:style.h2.font, printingMode:style.h2.printingMode}},
            {collection:'basic', type:'text', name:'type_highs', data:{x:24.5, y:58.5, text:'highs', width:style.h2.size, height:style.h2.size*style.h2.ratio, colour:style.h2.colour, font:style.h2.font, printingMode:style.h2.printingMode}},
            {collection:'basic', type:'text', name:'type_peak',  data:{x:29.5, y:63,   text:'peak',  width:style.h2.size, height:style.h2.size*style.h2.ratio, colour:style.h2.colour, font:style.h2.font, printingMode:style.h2.printingMode}},
            {collection:'basic', type:'text', name:'type_notch', data:{x:30.5, y:69,   text:'notch', width:style.h2.size, height:style.h2.size*style.h2.ratio, colour:style.h2.colour, font:style.h2.font, printingMode:style.h2.printingMode}},
            {collection:'basic', type:'text', name:'type_all',   data:{x:26.5, y:74.5, text:'all',   width:style.h2.size, height:style.h2.size*style.h2.ratio, colour:style.h2.colour, font:style.h2.font, printingMode:style.h2.printingMode}},
            {collection:'basic', type:'text', name:'type_title', data:{x:22,   y:77,   text:'Type',  width:style.h1.size, height:style.h1.size*style.h1.ratio, colour:style.h1.colour, font:style.h1.font, printingMode:style.h1.printingMode}},
            {collection:'control', type:'dial_discrete',name:'type_dial',data:{
                x:20, y:67.5, radius:7, startAngle:(3*Math.PI)/4, maxAngle:1.5*Math.PI, optionCount:8,
                style:{handle:style.dial.handle, slot:style.dial.slot, needle:style.dial.needle},
            }},
        ]
    };

    //main object
        var object = _canvas_.interface.unit.builder(design);

    //import/export
        object.importData = function(data){
            object.elements.dial_continuous.Q_dial.set(data.Q);
            object.elements.dial_continuous.gain_dial.set(data.gain);
            object.elements.dial_discrete.type_dial.set(data.type);
            object.elements.dial_continuous.frequency_dial.set(data.frequency);
        };
        object.exportData = function(){
            return {
                Q:        object.elements.dial_continuous.Q_dial.get(), 
                gain:     object.elements.dial_continuous.gain_dial.get(), 
                type:     object.elements.dial_discrete.type_dial.get(), 
                frequency:object.elements.dial_continuous.frequency_dial.get(), 
            };
        };

    //circuitry
        //filter
            object.filterCircuit = new _canvas_.interface.circuit.filterUnit(_canvas_.library.audio.context);
            object.elements.connectionNode_audio.audioIn.out().connect( object.filterCircuit.in() );
            object.filterCircuit.out().connect( object.elements.connectionNode_audio.audioOut.in() );

        //internal functions
            function getFrequencyAndLocationArray(){
                var locationArray = [];
                var frequencyArray = [];
                for(var a = 0; a <= Math.floor(Math.log10(state.freqRange.high))+1; a++){
                    for(var b = 1; b < 10; b+=1/Math.pow(2,state.graphDetail)){
                        if( Math.pow(10,a)*(b/10) >= state.freqRange.high){break;}
                        locationArray.push( Math.log10(Math.pow(10,a)*b) );
                        frequencyArray.push( Math.pow(10,a)*(b/10) );
                    }
                }
                return {frequency:frequencyArray, location:_canvas_.library.math.normalizeStretchArray(locationArray)};
            }
            function updateGraph(){
                var temp = getFrequencyAndLocationArray();
                object.elements.grapher_static.graph.draw( object.filterCircuit.measureFrequencyResponse_values(temp.frequency)[0], temp.location );
            };
        
        //wiring
            object.elements.dial_continuous.Q_dial.onchange = function(value){object.filterCircuit.Q(value*10);updateGraph();};
            object.elements.dial_continuous.gain_dial.onchange = function(value){object.filterCircuit.gain(value*10);updateGraph();};
            object.elements.dial_continuous.frequency_dial.onchange = function(value){object.filterCircuit.frequency( _canvas_.library.math.curvePoint.exponential(value,0,20000,10.5866095) );updateGraph();};
            object.elements.dial_discrete.type_dial.onchange = function(value){object.filterCircuit.type(['lowpass','highpass','bandpass','lowshelf','highshelf','peaking','notch','allpass'][value]);updateGraph();};

    //setup
        var arrays = getFrequencyAndLocationArray();
        arrays.frequency = arrays.frequency.filter(function(a,i){return i%Math.pow(2,state.graphDetail)==0;});
        arrays.location = arrays.location.filter(function(a,i){return i%Math.pow(2,state.graphDetail)==0;});
        object.elements.grapher_static.graph.viewbox({bottom:0, top:2, left:0, right:1});
        object.elements.grapher_static.graph.horizontalMarkings({points:[0.25,0.5,0.75,1,1.25,1.5,1.75],textPosition:{x:0.005,y:0.075},printText:true});
        object.elements.grapher_static.graph.verticalMarkings({
            points:arrays.location,
            printingValues:arrays.frequency.map(a => Math.log10(a)%1 == 0 ? a :'').slice(0,arrays.frequency.length-1).concat(''), //only print the factors of 10, leaving everything else as an empty string
            textPosition:{x:-0.0025,y:1.99},
            printText:true,
        });

        object.elements.dial_discrete.type_dial.set(0);
        object.elements.dial_continuous.Q_dial.set(0);
        object.elements.dial_continuous.gain_dial.set(0.1);
        object.elements.dial_continuous.frequency_dial.set(0.5);
        setTimeout(updateGraph,100);

    return object;
};
this.filterUnit.metadata = {
    name:'Filter Unit - Mono',
    category:'audioEffectUnits',
    helpURL:'https://curve.metasophiea.com/help/units/alpha/filterUnit/'
};

this.filterUnit_stereo = function(x,y,a){
    var state = {
        freqRange:{ low:0.1, high:20000, },
        graphDetail:3,
    };
    var style = {
        background:{r:200/255,g:200/255,b:200/255,a:1},
        h1:{colour:{r:0/255,g:0/255,b:0/255,a:1}, size:2.5, ratio:1, font:'defaultThin', printingMode:{widthCalculation:'absolute',horizontal:'middle',vertical:'middle'}},
        h2:{colour:{r:150/255,g:150/255,b:150/255,a:1}, size:1, ratio:1.5, font:'defaultThin', printingMode:{widthCalculation:'absolute',horizontal:'middle',vertical:'middle'}},
        
        dial:{
            handle:{r:220/255,g:220/255,b:220/255,a:1},
            slot:{r:50/255,g:50/255,b:50/255,a:1},
            needle:{r:250/255,g:150/255,b:150/255,a:1},
        },
        graph:{
            foregroundlines:[{colour:{r:0/255,g:200/255,b:163/255,a:1}, thickness:0.25}],
            backgroundlines:{colour:{r:0/255,g:200/255,b:163/255,a:0.25}, thickness:0.25},
            backgroundtext:{colour:{r:0/255,g:200/255,b:163/255,a:0.75}, font:'Helvetica'},
        }
    };
    var design = {
        name:'filterUnit_stereo',
        category:'audioEffectUnits',
        collection:'alpha',
        x:x, y:y, angle:a,
        space:[ {x:10,y:0}, {x:92.5,y:0}, {x:102.5,y:70}, {x:51.25,y:100}, {x:0,y:70} ],
        // spaceOutline:true,
        elements:[
            {collection:'dynamic', type:'connectionNode_audio', name:'audioIn_R', data:{ x:94.8, y:16, width:10, height:20, angle:-0.14 }},
            {collection:'dynamic', type:'connectionNode_audio', name:'audioIn_L', data:{ x:94.8+3.65, y:42, width:10, height:20, angle:-0.14 }},
            {collection:'dynamic', type:'connectionNode_audio', name:'audioOut_R', data:{ x:-2.3, y:16, width:10, height:20, angle:0.144, isAudioOutput:true }},
            {collection:'dynamic', type:'connectionNode_audio', name:'audioOut_L', data:{ x:-2.3-3.65, y:42, width:10, height:20, angle:0.144, isAudioOutput:true }},

            {collection:'basic', type:'polygon', name:'backing', data:{ pointsAsXYArray:[{x:10,y:0}, {x:92.5,y:0}, {x:102.5,y:70}, {x:51.25,y:100}, {x:0,y:70}], colour:style.background }},
        
            {collection:'display', type:'grapher_static', name:'graph', data:{x:15, y:5, width:72.5, height:50, resolution:15,
                style:{
                    foregrounds:style.graph.foregroundlines, 
                    background_colour:style.graph.backgroundlines.colour, 
                    background_lineThickness:style.graph.backgroundlines.thickness, 
                    backgroundText_colour:style.graph.backgroundtext.colour, 
                    backgroundText_font:style.graph.backgroundtext.font,
                }}
            },

            {collection:'basic', type:'text', name:'Q_0',     data:{x:76,   y:75,   text:'0',   width:style.h2.size, height:style.h2.size*style.h2.ratio, colour:style.h2.colour, font:style.h2.font, printingMode:style.h2.printingMode}},
            {collection:'basic', type:'text', name:'Q_1/2',   data:{x:82.5, y:59.5, text:'1/2', width:style.h2.size, height:style.h2.size*style.h2.ratio, colour:style.h2.colour, font:style.h2.font, printingMode:style.h2.printingMode}},
            {collection:'basic', type:'text', name:'Q_1',     data:{x:89,   y:75,   text:'1',   width:style.h2.size, height:style.h2.size*style.h2.ratio, colour:style.h2.colour, font:style.h2.font, printingMode:style.h2.printingMode}},
            {collection:'basic', type:'text', name:'Q_title', data:{x:82.5, y:78,   text:'Q',   width:style.h1.size, height:style.h1.size*style.h1.ratio, colour:style.h1.colour, font:style.h1.font, printingMode:style.h1.printingMode}},
            {collection:'control', type:'dial_continuous',name:'Q_dial',data:{
                x:82.5, y:68.5, radius:7, startAngle:(3*Math.PI)/4, maxAngle:1.5*Math.PI,
                style:{handle:style.dial.handle, slot:style.dial.slot, needle:style.dial.needle},
            }},

            {collection:'basic', type:'text', name:'gain_0',     data:{x:56,    y:84,   text:'0',    width:style.h2.size, height:style.h2.size*style.h2.ratio, colour:style.h2.colour, font:style.h2.font, printingMode:style.h2.printingMode}},
            {collection:'basic', type:'text', name:'gain_1/2',   data:{x:62.5,  y:68.5, text:'5',    width:style.h2.size, height:style.h2.size*style.h2.ratio, colour:style.h2.colour, font:style.h2.font, printingMode:style.h2.printingMode}},
            {collection:'basic', type:'text', name:'gain_1',     data:{x:69,    y:84,   text:'10',   width:style.h2.size, height:style.h2.size*style.h2.ratio, colour:style.h2.colour, font:style.h2.font, printingMode:style.h2.printingMode}},
            {collection:'basic', type:'text', name:'gain_title', data:{x:62.5,  y:87,   text:'Gain', width:style.h1.size, height:style.h1.size*style.h1.ratio, colour:style.h1.colour, font:style.h1.font, printingMode:style.h1.printingMode}},
            {collection:'control', type:'dial_continuous',name:'gain_dial',data:{
                x:62.5, y:77.5, radius:7, startAngle:(3*Math.PI)/4, maxAngle:1.5*Math.PI,
                style:{handle:style.dial.handle, slot:style.dial.slot, needle:style.dial.needle},
            }},
            
            {collection:'basic', type:'text', name:'frequency_0',     data:{x:33.5, y:84, text:'0',    width:style.h2.size, height:style.h2.size*style.h2.ratio, colour:style.h2.colour, font:style.h2.font, printingMode:style.h2.printingMode}},
            {collection:'basic', type:'text', name:'frequency_100',   data:{x:40, y:68.5, text:'100',  width:style.h2.size, height:style.h2.size*style.h2.ratio, colour:style.h2.colour, font:style.h2.font, printingMode:style.h2.printingMode}},
            {collection:'basic', type:'text', name:'frequency_20000', data:{x:47.5, y:84, text:'20k',  width:style.h2.size, height:style.h2.size*style.h2.ratio, colour:style.h2.colour, font:style.h2.font, printingMode:style.h2.printingMode}},
            {collection:'basic', type:'text', name:'frequency_title', data:{x:40, y:87,   text:'Freq', width:style.h1.size, height:style.h1.size*style.h1.ratio, colour:style.h1.colour, font:style.h1.font, printingMode:style.h1.printingMode}},
            {collection:'control', type:'dial_continuous',name:'frequency_dial',data:{
                x:40, y:77.5, radius:7, startAngle:(3*Math.PI)/4, maxAngle:1.5*Math.PI, 
                style:{handle:style.dial.handle, slot:style.dial.slot, needle:style.dial.needle},
            }},

            {collection:'basic', type:'text', name:'type_lowp',  data:{x:13,   y:74.5, text:'lowp',  width:style.h2.size, height:style.h2.size*style.h2.ratio, colour:style.h2.colour, font:style.h2.font, printingMode:style.h2.printingMode}},
            {collection:'basic', type:'text', name:'type_highp', data:{x:10,   y:69,   text:'highp', width:style.h2.size, height:style.h2.size*style.h2.ratio, colour:style.h2.colour, font:style.h2.font, printingMode:style.h2.printingMode}},
            {collection:'basic', type:'text', name:'type_band',  data:{x:10.5, y:63,   text:'band',  width:style.h2.size, height:style.h2.size*style.h2.ratio, colour:style.h2.colour, font:style.h2.font, printingMode:style.h2.printingMode}},
            {collection:'basic', type:'text', name:'type_lows',  data:{x:16,   y:58.5, text:'lows',  width:style.h2.size, height:style.h2.size*style.h2.ratio, colour:style.h2.colour, font:style.h2.font, printingMode:style.h2.printingMode}},
            {collection:'basic', type:'text', name:'type_highs', data:{x:24.5, y:58.5, text:'highs', width:style.h2.size, height:style.h2.size*style.h2.ratio, colour:style.h2.colour, font:style.h2.font, printingMode:style.h2.printingMode}},
            {collection:'basic', type:'text', name:'type_peak',  data:{x:29.5, y:63,   text:'peak',  width:style.h2.size, height:style.h2.size*style.h2.ratio, colour:style.h2.colour, font:style.h2.font, printingMode:style.h2.printingMode}},
            {collection:'basic', type:'text', name:'type_notch', data:{x:30.5, y:69,   text:'notch', width:style.h2.size, height:style.h2.size*style.h2.ratio, colour:style.h2.colour, font:style.h2.font, printingMode:style.h2.printingMode}},
            {collection:'basic', type:'text', name:'type_all',   data:{x:26.5, y:74.5, text:'all',   width:style.h2.size, height:style.h2.size*style.h2.ratio, colour:style.h2.colour, font:style.h2.font, printingMode:style.h2.printingMode}},
            {collection:'basic', type:'text', name:'type_title', data:{x:22,   y:77,   text:'Type',  width:style.h1.size, height:style.h1.size*style.h1.ratio, colour:style.h1.colour, font:style.h1.font, printingMode:style.h1.printingMode}},
            {collection:'control', type:'dial_discrete',name:'type_dial',data:{
                x:20, y:67.5, radius:7, startAngle:(3*Math.PI)/4, maxAngle:1.5*Math.PI, optionCount:8,
                style:{handle:style.dial.handle, slot:style.dial.slot, needle:style.dial.needle},
            }},
        ]
    };

    //main object
        var object = _canvas_.interface.unit.builder(design);

    //import/export
        object.importData = function(data){
            object.elements.dial_continuous.Q_dial.set(data.Q);
            object.elements.dial_continuous.gain_dial.set(data.gain);
            object.elements.dial_discrete.type_dial.set(data.type);
            object.elements.dial_continuous.frequency_dial.set(data.frequency);
        };
        object.exportData = function(){
            return {
                Q:        object.elements.dial_continuous.Q_dial.get(), 
                gain:     object.elements.dial_continuous.gain_dial.get(), 
                type:     object.elements.dial_discrete.type_dial.get(), 
                frequency:object.elements.dial_continuous.frequency_dial.get(), 
            };
        };

    //circuitry
        //filter
            object.filterCircuit_R = new _canvas_.interface.circuit.filterUnit(_canvas_.library.audio.context);
            object.elements.connectionNode_audio.audioIn_R.out().connect( object.filterCircuit_R.in() );
            object.filterCircuit_R.out().connect( object.elements.connectionNode_audio.audioOut_R.in() );

            object.filterCircuit_L = new _canvas_.interface.circuit.filterUnit(_canvas_.library.audio.context);
            object.elements.connectionNode_audio.audioIn_L.out().connect( object.filterCircuit_L.in() );
            object.filterCircuit_L.out().connect( object.elements.connectionNode_audio.audioOut_L.in() );

        //internal functions
            function getFrequencyAndLocationArray(){
                var locationArray = [];
                var frequencyArray = [];
                for(var a = 0; a <= Math.floor(Math.log10(state.freqRange.high))+1; a++){
                    for(var b = 1; b < 10; b+=1/Math.pow(2,state.graphDetail)){
                        if( Math.pow(10,a)*(b/10) >= state.freqRange.high){break;}
                        locationArray.push( Math.log10(Math.pow(10,a)*b) );
                        frequencyArray.push( Math.pow(10,a)*(b/10) );
                    }
                }
                return {frequency:frequencyArray, location:_canvas_.library.math.normalizeStretchArray(locationArray)};
            }
            function updateGraph(){
                var temp = getFrequencyAndLocationArray();
                object.elements.grapher_static.graph.draw( object.filterCircuit_R.measureFrequencyResponse_values(temp.frequency)[0], temp.location );
            };
        
        //wiring
            object.elements.dial_continuous.Q_dial.onchange = function(value){
                object.filterCircuit_R.Q(value*10);
                object.filterCircuit_L.Q(value*10);
                updateGraph();
            };
            object.elements.dial_continuous.gain_dial.onchange = function(value){
                object.filterCircuit_R.gain(value*10);
                object.filterCircuit_L.gain(value*10);
                updateGraph();
            };
            object.elements.dial_continuous.frequency_dial.onchange = function(value){
                object.filterCircuit_R.frequency( _canvas_.library.math.curvePoint.exponential(value,0,20000,10.5866095) );
                object.filterCircuit_L.frequency( _canvas_.library.math.curvePoint.exponential(value,0,20000,10.5866095) );
                updateGraph();
            };
            object.elements.dial_discrete.type_dial.onchange = function(value){
                object.filterCircuit_R.type(['lowpass','highpass','bandpass','lowshelf','highshelf','peaking','notch','allpass'][value]);
                object.filterCircuit_L.type(['lowpass','highpass','bandpass','lowshelf','highshelf','peaking','notch','allpass'][value]);
                updateGraph();
            };

    //setup
        var arrays = getFrequencyAndLocationArray();
        arrays.frequency = arrays.frequency.filter(function(a,i){return i%Math.pow(2,state.graphDetail)==0;});
        arrays.location = arrays.location.filter(function(a,i){return i%Math.pow(2,state.graphDetail)==0;});
        object.elements.grapher_static.graph.viewbox({bottom:0, top:2, left:0, right:1});
        object.elements.grapher_static.graph.horizontalMarkings({points:[0.25,0.5,0.75,1,1.25,1.5,1.75],textPosition:{x:0.005,y:0.075},printText:true});
        object.elements.grapher_static.graph.verticalMarkings({
            points:arrays.location,
            printingValues:arrays.frequency.map(a => Math.log10(a)%1 == 0 ? a :'').slice(0,arrays.frequency.length-1).concat(''), //only print the factors of 10, leaving everything else as an empty string
            textPosition:{x:-0.0025,y:1.99},
            printText:true,
        });

        object.elements.dial_discrete.type_dial.set(0);
        object.elements.dial_continuous.Q_dial.set(0);
        object.elements.dial_continuous.gain_dial.set(0.1);
        object.elements.dial_continuous.frequency_dial.set(0.5);
        setTimeout(updateGraph,100);

    return object;
};
this.filterUnit_stereo.metadata = {
    name:'Filter Unit - Stereo',
    category:'audioEffectUnits',
    helpURL:'https://curve.metasophiea.com/help/units/alpha/filterUnit/'
};