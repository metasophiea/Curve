objects.distortionUnit = function(x,y){
    //set numbers
        var type = 'distortionUnit';
        var style = {
            background: 'fill:rgba(200,200,200,1); stroke:none;',
            h1: 'fill:rgba(0,0,0,1); font-size:7px; font-family:Courier New;',
            h2: 'fill:rgba(0,0,0,1); font-size:4px; font-family:Courier New;',
            text: 'fill:rgba(0,0,0,1); font-size:10px; font-family:Courier New; pointer-events: none;',
    
            markings: 'fill:none; stroke:rgb(150,150,150); stroke-width:1;',
    
            handle: 'fill:rgba(220,220,220,1)',
            slot: 'fill:rgba(50,50,50,1)',
            needle: 'fill:rgba(250,150,150,1)'
        };
        var shape = {};
            shape.width = 102.5;
            shape.height = 95;
            shape.base = [
                {x:0,y:0+10},
                {x:0+10,y:0},

                {x:shape.width/3,y:0},
                {x:shape.width*0.45,y:10},
                {x:shape.width*0.55,y:10},
                {x:2*(shape.width/3),y:0},

                {x:shape.width-10,y:0},
                {x:shape.width,y:0+10},

                {x:shape.width,y:shape.height-10},
                {x:shape.width-10,y:shape.height},

                {x:2*(shape.width/3),y:shape.height},
                {x:shape.width*0.55,y:shape.height-10},
                {x:shape.width*0.45,y:shape.height-10},
                {x:shape.width/3,y:shape.height},

                {x:0+10,y:shape.height},
                {x:0,y:shape.height-10}
            ];
            shape.connector = {
                audio: {
                    audioIn: { type: 0, x: 105-10, y: 95*0.7-5, width: 20, height: 20 },
                    audioOut: { type: 1, x: -10, y: 95*0.7-5, width: 20, height: 20 },
                },
                data: {}
            };
            shape.dial = {
                outGain:{
                    type: 'continuous',
                    x: (40*0)+20, y: (50)+20, r: 12,
                    startAngle: (3*Math.PI)/4, maxAngle: 1.5*Math.PI,
                    handleStyle: style.handle,
                    slotStyle: style.slot,
                    needleStyle: style.needle,
                    arcDistance: 1.2,
                    outerArcStyle: style.markings,
                    labels:[
                        { name: null, x: (40*0)+13,   y: (50)+40, text: 'out', style: style.h1 },
                        { name: null, x: (40*0)+7,    y: (50)+34, text: '0',   style: style.h2 },
                        { name: null, x: (40*0)+16.5, y: (50)+4,  text: '1/2', style: style.h2 },
                        { name: null, x: (40*0)+30,   y: (50)+34, text: '1',   style: style.h2 },
                    ],
                    onchange:function(value){ _mainObject.__unit.outGain( value ); },
                },
                distortionAmount:{
                    type: 'continuous',
                    x: (40*0)+20, y: (3)+20, r: 12,
                    startAngle: (3*Math.PI)/4, maxAngle: 1.5*Math.PI,
                    handleStyle: style.handle,
                    slotStyle: style.slot,
                    needleStyle: style.needle,
                    arcDistance: 1.2,
                    outerArcStyle: style.markings,
                    labels:[
                        { name: null, x: (40*0)+11,   y: (3)+40, text: 'dist', style: style.h1 },
                        { name: null, x: (40*0)+7,    y: (3)+34, text: '0',    style: style.h2 },
                        { name: null, x: (40*0)+17.5, y: (3)+4,  text: '50',   style: style.h2 },
                        { name: null, x: (40*0)+30,   y: (3)+34, text: '100',  style: style.h2 },
                    ],
                    onchange: function(value){ _mainObject.__unit.distortionAmount(value*100); },
                },
                resolution:{
                    type: 'continuous',
                    x: (40*1)-10+20, y: (30)+20, r: 12,
                    startAngle: (3*Math.PI)/4, maxAngle: 1.5*Math.PI,
                    handleStyle: style.handle,
                    slotStyle: style.slot,
                    needleStyle: style.needle,
                    arcDistance: 1.2,
                    outerArcStyle: style.markings,
                    labels:[
                        { name: null, x: (40*1)-10+13,   y: (30)+40, text: 'res', style: style.h1 },
                        { name: null, x: (40*1)-10+7,    y: (30)+34, text: '2',   style: style.h2 },
                        { name: null, x: (40*1)-10+16.5, y: (30)+4,  text: '500', style: style.h2 },
                        { name: null, x: (40*1)-10+29,   y: (30)+34, text: '1000',style: style.h2 },
                    ],
                    onchange: function(value){ _mainObject.__unit.resolution( Math.round(value*1000) ); },
                },
                overSample:{
                    type: 'discrete',
                    x: (40*2)-18+20, y: 3+20, r: 12,
                    optionCount: 3,
                    startAngle: (1.25*Math.PI), maxAngle: 0.5*Math.PI,
                    handleStyle: style.handle,
                    slotStyle: style.slot,
                    needleStyle: style.needle,
                    arcDistance: 1.2,
                    outerArcStyle: undefined,
                    labels:[
                        { name: null, x: (40*2)-18+3,     y: (3)+40, text: 'overSamp', style: style.h1 },
                        { name: null, x: (40*2)-18+2,     y: (3)+10, text: 'none',     style: style.h2 },
                        { name: null, x: (40*2)-18+17.75, y: (3)+5,  text: '2x',       style: style.h2 },
                        { name: null, x: (40*2)-18+30,    y: (3)+10, text: '4x',       style: style.h2 },
                    ],
                    onchange: function(value){ _mainObject.__unit.oversample( ['none','2x','4x'][value] ); },
                },
                inGain:{
                    type: 'continuous',
                    x: (40*2)-18+20, y: (50)+20, r: 12,
                    startAngle: (3*Math.PI)/4, maxAngle: 1.5*Math.PI,
                    handleStyle: style.handle,
                    slotStyle: style.slot,
                    needleStyle: style.needle,
                    arcDistance: 1.2,
                    outerArcStyle: style.markings,
                    labels:[
                        { name: null, x: (40*2)-18+15,    y: (50)+40, text: 'in', style: style.h1 },
                        { name: null, x: (40*2)-18+7,     y: (50)+34, text: '0',  style: style.h2 },
                        { name: null, x: (40*2)-18+18.75, y: (50)+4,  text: '1',  style: style.h2 },
                        { name: null, x: (40*2)-18+30,    y: (50)+34, text: '2',  style: style.h2 },
                    ],
                    onchange: function(value){ _mainObject.__unit.inGain( 2*value ); },
                },
            };

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

                dial.onchange = data.onchange;
                dial.onrelease = data.onrelease;
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

    //circuitry
        _mainObject.__unit = new parts.audio.distortionUnit(__globals.audio.context);
        _mainObject.io.audioIn.out().connect( _mainObject.__unit.in() );
        _mainObject.__unit.out().connect( _mainObject.io.audioOut.in() );

    //setup
        _mainObject.dial.continuous.resolution.set(0.5);
        _mainObject.dial.continuous.inGain.set(0.5);
        _mainObject.dial.continuous.outGain.set(1);

    return _mainObject;
};