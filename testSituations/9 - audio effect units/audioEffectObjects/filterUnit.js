__globals.objects.make_filterUnit = function(x,y){
    //set numbers
        var type = 'filterUnit';
        var attributes = {};
        var style = {
            background: 'fill:rgba(200,200,200,1); stroke:none;',
<<<<<<< HEAD
            h1: 'fill:rgba(0,0,0,1); font-size:4px; font-family:Courier New;',
            h2: 'fill:rgba(0,0,0,1); font-size:3px; font-family:Courier New;',
            h3: 'fill:rgba(0,0,0,1); font-size:2px; font-family:Courier New;',
            text: 'fill:rgba(0,0,0,1); font-size:10px; font-family:Courier New; pointer-events: none;',
    
            markings: 'fill:none; stroke:rgb(150,150,150); stroke-width:0.5;',
=======
            h1: 'fill:rgba(0,0,0,1); font-size:7px; font-family:Courier New;',
            h2: 'fill:rgba(0,0,0,1); font-size:4px; font-family:Courier New;',
            text: 'fill:rgba(0,0,0,1); font-size:10px; font-family:Courier New; pointer-events: none;',
    
            markings: 'fill:none; stroke:rgb(150,150,150); stroke-width:1;',
>>>>>>> 51477d723dd2a28778dc9c3fc77f89b46ea1b27c
    
            handle: 'fill:rgba(220,220,220,1)',
            slot: 'fill:rgba(50,50,50,1)',
            needle: 'fill:rgba(250,150,150,1)'
        };
        var shape = {};
            shape.width = 102.5;
<<<<<<< HEAD
            shape.height = 100;
            shape.base = [
                {x:0+10,y:0},
                {x:shape.width-10,y:0},

                {x:shape.width,y:shape.height-30},
                {x:shape.width/2,y:shape.height},
                {x:0,y:shape.height-30},
=======
            shape.height = 50;
            shape.base = [
                {x:0,y:0+10},
                {x:shape.width/2,y:0},
                {x:shape.width,y:0+10},

                {x:shape.width,y:shape.height-10},
                {x:shape.width/2,y:shape.height},
                {x:0,y:shape.height-10},
>>>>>>> 51477d723dd2a28778dc9c3fc77f89b46ea1b27c
            ];
            shape.readouts = {};
            shape.button = {};
            shape.connector = {
                audio: {
                    audioIn: { type: 0, x: 105-10, y: 30*0.7-5, width: 20, height: 20 },
                    audioOut: { type: 1, x: -10, y: 30*0.7-5, width: 20, height: 20 },
                },
                data: {}
            };
<<<<<<< HEAD
            shape.dial = {
                Q:{
                    type: 'continuous',
                    x: 82.5, y: 67.5, r: 7,
                    startAngle: (3*Math.PI)/4, maxAngle: 1.5*Math.PI,
                    handleStyle: style.handle,
                    slotStyle: style.slot,
                    needleStyle: style.needle,
                    arcDistance: 1.2,
                    outerArcStyle: style.markings,
                    labels:[
                        { name: null, x: (82.5)-8.5, y: (70)+6,  text: '0',   style: style.h2 },
                        { name: null, x: (82.5)-3,   y: (70)-12, text: '1/2', style: style.h2 },
                        { name: null, x: (82.5)+6.5, y: (70)+6,  text: '1',   style: style.h2 },
                        { name: null, x: (82.5)-1.5, y: (70)+9,  text: 'Q',   style: style.h1 },
                    ],
                    onChange: function(value){_mainObject.__unit.Q(value*10);_mainObject.__updateGraph();},
                },
                gain:{
                    type: 'continuous',
                    x: 62.5, y: 77.5, r: 7,
                    startAngle: (3*Math.PI)/4, maxAngle: 1.5*Math.PI,
                    handleStyle: style.handle,
                    slotStyle: style.slot,
                    needleStyle: style.needle,
                    arcDistance: 1.2,
                    outerArcStyle: style.markings,
                    labels:[
                        { name: null, x: (62.5)-8.5, y: (80)+6,  text: '0',    style: style.h2 },
                        { name: null, x: (62.5)-1,   y: (80)-12, text: '5',    style: style.h2 },
                        { name: null, x: (62.5)+6.5, y: (80)+6,  text: '10',   style: style.h2 },
                        { name: null, x: (62.5)-4.5, y: (80)+9,  text: 'Gain', style: style.h1 },
                    ],
                    onChange: function(value){_mainObject.__unit.gain(value*10);_mainObject.__updateGraph();},
                },
                frequency:{
                    type: 'continuous',
                    x: 40, y: 77.5, r: 7,
                    startAngle: (3*Math.PI)/4, maxAngle: 1.5*Math.PI,
                    handleStyle: style.handle,
                    slotStyle: style.slot,
                    needleStyle: style.needle,
                    arcDistance: 1.2,
                    outerArcStyle: style.markings,
                    labels:[
                        { name: null, x: (40)-8.5, y: (80)+6,  text: '0',    style: style.h2 },
                        { name: null, x: (40)-2.5, y: (80)-12, text: '500',  style: style.h2 },
                        { name: null, x: (40)+4,   y: (80)+6,  text: '1000', style: style.h2 },
                        { name: null, x: (40)-4.5, y: (80)+9,  text: 'Freq', style: style.h1 },
                    ],
                    onChange: function(value){_mainObject.__unit.frequency(2000*value);_mainObject.__updateGraph();},
                },
                type:{
                    type: 'discrete',
                    x: 20, y: 67.5, r: 7,
                    optionCount: 8,
                    startAngle: (3*Math.PI)/4, maxAngle: 1.5*Math.PI,
                    handleStyle: style.handle,
                    slotStyle: style.slot,
                    needleStyle: style.needle,
                    arcDistance: 1.2,
                    outerArcStyle: undefined,
                    labels:[
                        { name: null, x: (20)-4.5,  y: (67.5)+11,  text: 'Type', style: style.h1 },
                        { name: null, x: (20)-10,   y: (67.5)+7.5, text: 'lowp',  style: style.h3 },
                        { name: null, x: (20)-15,   y: (67.5)+1.5, text: 'highp', style: style.h3 },
                        { name: null, x: (20)-12.5, y: (67.5)-4.5, text: 'band',  style: style.h3 },
                        { name: null, x: (20)-6,    y: (67.5)-8.5, text: 'lows',  style: style.h3 },
                        { name: null, x: (20)+2.5,  y: (67.5)-8,   text: 'highs', style: style.h3 },
                        { name: null, x: (20)+7.5,  y: (67.5)-4.5, text: 'peak',  style: style.h3 },
                        { name: null, x: (20)+9,    y: (67.5)+1.5, text: 'notch', style: style.h3 },
                        { name: null, x: (20)+5.5,  y: (67.5)+7,   text: 'all',   style: style.h3 },
                    ],
                    onChange: function(value){_mainObject.__unit.type(['lowpass','highpass','bandpass','lowshelf','highshelf','peaking','notch','allpass'][value]);_mainObject.__updateGraph();},
                }
            };
            shape.button = {};
=======
            shape.dial = {};
>>>>>>> 51477d723dd2a28778dc9c3fc77f89b46ea1b27c

    //main
        var _mainObject = parts.basic.g(type, x, y);
        _mainObject._type = type;

    //elements
        //backing
            var backing = parts.basic.path(null, shape.base, 'L', style.background);
            _mainObject.append(backing);
            __globals.mouseInteraction.declareObjectGrapple(backing, _mainObject, arguments.callee);

        //generate selection area
            __globals.utility.object.generateSelectionArea(shape.base, _mainObject);

<<<<<<< HEAD
        //grapher
        var grapher = parts.display.grapher(null, 15, 5, 72.5, 50);
            _mainObject.append(grapher);
            grapher.drawBackground();
            grapher.viewbox({'l':0,'h':2});

=======
>>>>>>> 51477d723dd2a28778dc9c3fc77f89b46ea1b27c
        //readout
            var keys = Object.keys(shape.readouts);
            for(var a = 0; a < keys.length; a++){
                data = shape.readouts[keys[a]];
<<<<<<< HEAD
                data.element = parts.display.sevenSegmentDisplay(keys[a], data.x, data.y, data.width, data.height);
=======
                data.element = parts.display.segmentDisplay(keys[a], data.x, data.y, data.width, data.height);
>>>>>>> 51477d723dd2a28778dc9c3fc77f89b46ea1b27c
                _mainObject.append(data.element);
            }

        //buttons
            var keys = Object.keys( shape.button );
            for(var a = 0; a < keys.length; a++){
                var data = shape.button[keys[a]];
                var temp = parts.control.button_rect(
                    keys[a], 
                    data.x, data.y, 
                    data.width, data.height, 
                    data.angle, 
                    data.upStyle, data.hoverStyle, data.downStyle, data.glowStyle
                );
                temp.onclick = data.onclick;
                _mainObject.append(temp);
            }

        //dials
            _mainObject.dial = {continuous:{}, discrete:{}};

            var keys = Object.keys(shape.dial);
            for(var a = 0; a < keys.length; a++){
                var data = shape.dial[keys[a]];
                var labelKeys = Object.keys(data.labels);
                for(var b = 0; b < labelKeys.length; b++){
                    var label = data.labels[labelKeys[b]];
                    _mainObject.append(parts.display.label(labelKeys[b], label.x, label.y, label.text, label.style));
                }

                if(data.type == 'continuous'){
                    var dial = parts.control.dial_continuous(
                        keys[a],
                        data.x, data.y, data.r,
                        data.startAngle, data.maxAngle,
                        data.handleStyle, data.slotStyle, data.needleStyle,
                        data.arcDistance, data.outerArcStyle
                    );
                    _mainObject.dial.continuous[keys[a]] = dial;
                }
                else if(data.type == 'discrete'){
                    var dial = parts.control.dial_discrete(
                        keys[a],
                        data.x, data.y, data.r,
                        data.optionCount,
                        data.startAngle, data.maxAngle,
                        data.handleStyle, data.slotStyle, data.needleStyle,
                        data.arcDistance, data.outerArcStyle
                    );
                    _mainObject.dial.discrete[keys[a]] = dial;
                }else{console.error('unknow dial type: "'+ data.type + '"'); var dial = null;}

                dial.onChange = data.onChange;
                dial.onRelease = data.onRelease;
                _mainObject.append(dial);
            }

        //connection nodes
            _mainObject.io = {};

            var keys = Object.keys(shape.connector.audio);
            for(var a = 0; a < keys.length; a++){
                var data = shape.connector.audio[keys[a]];
                _mainObject.io[keys[a]] = parts.dynamic.connectionNode_audio( keys[a], data.type, data.x, data.y, data.width, data.height, __globals.audio.context );
                _mainObject.prepend(_mainObject.io[keys[a]]);
            }

            var keys = Object.keys(shape.connector.data);
            for(var a = 0; a < keys.length; a++){
                var data = shape.connector.data[keys[a]];
                _mainObject.io[keys[a]] = parts.dynamic.connectionNode_data( keys[a], data.x, data.y, data.width, data.height, data.angle);
                _mainObject.io[keys[a]].receive = data.receive;
                _mainObject.prepend(_mainObject.io[keys[a]]);
            }

<<<<<<< HEAD
        //buttons
            _mainObject.button = {};

            var keys = Object.keys( shape.button );
            for(var a = 0; a < keys.length; a++){
                var data = shape.button[keys[a]];
                var temp = parts.control.button_rect(
                    keys[a], 
                    data.x, data.y, 
                    data.width, data.height, 
                    data.angle, 
                    data.upStyle, data.hoverStyle, data.downStyle, data.glowStyle
                );
                temp.onclick = data.onclick;
                _mainObject.button[keys[a]] = temp;
                _mainObject.append(temp);
            }

=======
>>>>>>> 51477d723dd2a28778dc9c3fc77f89b46ea1b27c
        //circuitry
            _mainObject.__unit = new parts.audio.filterUnit(__globals.audio.context);
            _mainObject.io.audioIn.out().connect( _mainObject.__unit.in() );
            _mainObject.__unit.out().connect( _mainObject.io.audioOut.in() );

<<<<<<< HEAD
            _mainObject.__updateGraph = function(){
                grapher.draw(_mainObject.__unit.measureFrequencyResponse(0,2000,10)[0]);
            };

        //setup
            _mainObject.dial.discrete['type'].select(0);
            _mainObject.dial.continuous.Q.set(0);
            _mainObject.dial.continuous.gain.set(0.1);
            _mainObject.dial.continuous.frequency.set(1);
            setTimeout(function(){_mainObject.__updateGraph();},50);
=======

        //setup
>>>>>>> 51477d723dd2a28778dc9c3fc77f89b46ea1b27c

        return _mainObject;
}