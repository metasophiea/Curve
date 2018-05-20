__globals.objects.make_basicSynth1_wobblingGain = function(x,y){
    //set numbers
    var type = 'basicWobbleSynth';
    var attributes = {
        detuneLimits: {min:-100, max:100}
    };
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
    var shape = {
        base: [{x:0,y:0},{x:240,y:0},{x:240,y:40},{x:190,y:90},{x:0,y:90}],
        connector: {
            audio:{
                audioOut:{ type: 1, x: -15, y: 5, width: 30, height: 30 },
            },
            data:{
                gain:    { x: 12.5+(40*0), y: -7.5, width: 15, height: 15, receive: function(address,data){
                    switch(address){
                        case '%': _mainObject.dial.continuous.gain.set(data); break;
                        case '%t': 
                            _mainObject.__synthesizer.gain(data.target,data.time,data.curve);
                            _mainObject.dial.continuous.gain.smoothSet(data.target,data.time,data.curve,false);
                        break;
                        default: break;
                    }
                }},
                attack:  { x: 12.5+(40*1), y: -7.5, width: 15, height: 15, receive: function(address,data){ if(address != '%'){return;} _mainObject.dial.continuous.attack.set(data); } },
                release: { x: 12.5+(40*2), y: -7.5, width: 15, height: 15, receive: function(address,data){ if(address != '%'){return;} _mainObject.dial.continuous.release.set(data); } },
                detune:  { x: 12.5+(40*3), y: -7.5, width: 15, height: 15, receive: function(address,data){ 
                    switch(address){
                        case '%': _mainObject.dial.continuous.detune.set(data); break;
                        case '%t': 
                            _mainObject.__synthesizer.detune((data.target*(attributes.detuneLimits.max-attributes.detuneLimits.min) + attributes.detuneLimits.min),data.time,data.curve);
                            _mainObject.dial.continuous.detune.smoothSet(data.target,data.time,data.curve,false);
                        break;
                        default: break;
                    }
                }},
                octave:  { x: 12.5+(40*4), y: -7.5, width: 15, height: 15, receive: function(address,data){ if(address != 'discrete'){return;} _mainObject.dial.discrete.octave.select(data); } },
                waveType:{ x: 12.5+(40*5), y: -7.5, width: 15, height: 15, receive: function(address,data){ if(address != 'discrete'){return;} _mainObject.dial.discrete.waveType.select(data); } },
                periodicWave:{ x: 232.5, y: 12.5, width: 15, height: 15, receive: function(address,data){ if(address != 'periodicWave'){return;} _mainObject.__synthesizer.periodicWave(data); } },
                midiNote:{ x: 217.5, y: 37.5, width: 30, height: 30, angle: Math.PI/4, receive: function(address,data){  if(address != 'midiNumber'){return;} _mainObject.__synthesizer.perform(data); } },
                wobblePeriod:{ x: 12.5+(40*0), y: 90-7.5, width: 15, height: 15, receive: function(address,data){ if(address != '%'){return;} _mainObject.dial.continuous.wobblePeriod.set(data); } },
                wobbleDepth:{ x: 12.5+(40*1), y: 90-7.5, width: 15, height: 15, receive: function(address,data){ if(address != '%'){return;} _mainObject.dial.continuous.wobbleDepth.set(data); } },
            }
        },
        button:{
            panicButton:{
                x: 197.5, y: 47.5,
                width: 20, height: 20,
                angle: Math.PI/4,
                upStyle: 'fill:rgba(175,175,175,1)',
                hoverStyle: 'fill:rgba(220,220,220,1)',
                downStyle: 'fill:rgba(150,150,150,1)',
                glowStyle: 'fill:rgba(220,200,220,1)',
                onclick: function(){_mainObject.__synthesizer.panic();}
            }
        },
        dial:{
            gain:{
                type: 'continuous',
                x: (40*0)+20, y: (3)+20, r: 12,
                startAngle: (3*Math.PI)/4, maxAngle: 1.5*Math.PI,
                handleStyle: style.handle,
                slotStyle: style.slot,
                needleStyle: style.needle,
                arcDistance: 1.2,
                outerArcStyle: style.markings,
                labels:[
                    { name: null, x: (40*0)+11,   y: (3)+40, text: 'gain', style: style.h1 },
                    { name: null, x: (40*0)+7,    y: (3)+34, text: '0',    style: style.h2 },
                    { name: null, x: (40*0)+16.5, y: (3)+5,  text: '1/2',  style: style.h2 },
                    { name: null, x: (40*0)+30,   y: (3)+34, text: '1',    style: style.h2 },
                ],
                onchange: function(value){ _mainObject.__synthesizer.gain( value ); },
            },
            attack:{
                type: 'continuous',
                x: (40*1)+20, y: 3+20, r: 12,
                startAngle: (3*Math.PI)/4, maxAngle: 1.5*Math.PI,
                handleStyle: style.handle,
                slotStyle: style.slot,
                needleStyle: style.needle,
                arcDistance: 1.2,
                outerArcStyle: style.markings,
                labels:[
                    { name: null, x: (40*1)+7,    y: (3)+40, text: 'attack', style: style.h1 },
                    { name: null, x: (40*1)+7,    y: (3)+34, text: '0',      style: style.h2 },
                    { name: null, x: (40*1)+18.5, y: (3)+4,  text: '5',      style: style.h2 },
                    { name: null, x: (40*1)+30,   y: (3)+34, text: '10',     style: style.h2 },
                ],
                onchange: function(value){ _mainObject.__synthesizer.attack( value ); },
            },
            release:{
                type: 'continuous',
                x: (40*2)+20, y: 3+20, r: 12,
                startAngle: (3*Math.PI)/4, maxAngle: 1.5*Math.PI,
                handleStyle: style.handle,
                slotStyle: style.slot,
                needleStyle: style.needle,
                arcDistance: 1.2,
                outerArcStyle: style.markings,
                labels:[
                    { name: null, x: (40*2)+5,    y: (3)+40, text: 'release', style: style.h1 },
                    { name: null, x: (40*2)+5,    y: (3)+34, text: '0',       style: style.h2 },
                    { name: null, x: (40*2)+18.5, y: (3)+4,  text: '5',       style: style.h2 },
                    { name: null, x: (40*2)+30,   y: (3)+34, text: '10',      style: style.h2 },
                ],
                onchange: function(value){ _mainObject.__synthesizer.release( value ); },
            },
            detune:{
                type: 'continuous',
                x: (40*3)+20, y: 3+20, r: 12,
                startAngle: (3*Math.PI)/4, maxAngle: 1.5*Math.PI,
                handleStyle: style.handle,
                slotStyle: style.slot,
                needleStyle: style.needle,
                arcDistance: 1.2,
                outerArcStyle: style.markings,
                labels:[
                    { name: null, x: (40*3)+7,     y: (3)+40, text: 'detune', style: style.h1 },
                    { name: null, x: (40*3)+2,     y: (3)+34, text: '0',      style: style.h2 },
                    { name: null, x: (40*3)+18.75, y: (3)+4,  text: '5',      style: style.h2 },
                    { name: null, x: (40*3)+28,    y: (3)+34, text: '10',     style: style.h2 },
                ],
                onchange: function(value){ _mainObject.__synthesizer.detune( value*(attributes.detuneLimits.max-attributes.detuneLimits.min) + attributes.detuneLimits.min ); },
            },
            octave:{
                type: 'discrete',
                x: (40*4)+20, y: 3+20, r: 12,
                optionCount: 7,
                startAngle: (3*Math.PI)/4, maxAngle: 1.5*Math.PI,
                handleStyle: style.handle,
                slotStyle: style.slot,
                needleStyle: style.needle,
                arcDistance: 1.2,
                outerArcStyle: undefined,
                labels:[
                    { name: null, x: (40*4)+7,     y: (3)+40, text: 'octave', style: style.h1 },
                    { name: null, x: (40*4)+4,     y: (3)+32, text: '-3',     style: style.h2 },
                    { name: null, x: (40*4)+0,     y: (3)+21, text: '-2',     style: style.h2 },
                    { name: null, x: (40*4)+4,     y: (3)+10, text: '-1',     style: style.h2 },
                    { name: null, x: (40*4)+18.75, y: (3)+5,  text: '0',      style: style.h2 },
                    { name: null, x: (40*4)+30,    y: (3)+10, text: '1',      style: style.h2 },
                    { name: null, x: (40*4)+35,    y: (3)+21, text: '2',      style: style.h2 },
                    { name: null, x: (40*4)+30,    y: (3)+32, text: '3',      style: style.h2 },
                ],
                onchange: function(value){ _mainObject.__synthesizer.octave(value-3); },
            },
            waveType:{
                type: 'discrete',
                x: (40*5)+20, y: 3+20, r: 12,
                optionCount: 5,
                startAngle: (3*Math.PI)/4, maxAngle: (5*Math.PI)/4,
                handleStyle: style.handle,
                slotStyle: style.slot,
                needleStyle: style.needle,
                arcDistance: 1.2,
                outerArcStyle: undefined,
                labels:[
                    { name: null, x: (40*5)+11, y: (3)+40, text: 'wave', style: style.h1 },
                    { name: null, x: (40*5)+0,  y: (3)+32, text: 'sine', style: style.h2 },
                    { name: null, x: (40*5)+0,  y: (3)+18, text: 'tri',  style: style.h2 },
                    { name: null, x: (40*5)+10, y: (3)+6,  text: 'squ',  style: style.h2 },
                    { name: null, x: (40*5)+27, y: (3)+7,  text: 'saw',  style: style.h2 },
                ],
                onchange: function(value){ _mainObject.__synthesizer.waveType(['sine','triangle','square','sawtooth','custom'][value]); },
            },
            wobblePeriod: {
                type: 'continuous',
                x: (40*0)+20, y: 3+62, r: 12,
                startAngle: (3*Math.PI)/4, maxAngle: 1.5*Math.PI,
                handleStyle: style.handle,
                slotStyle: style.slot,
                needleStyle: style.needle,
                arcDistance: 1.2,
                outerArcStyle: style.markings,
                labels:[
                    { name: null, x: (40*0)+7,     y: (3+42)+40, text: 'period', style: style.h1 },
                    { name: null, x: (40*0)+2,     y: (3+42)+34, text: '0.0',    style: style.h2 },
                    { name: null, x: (40*0)+16,    y: (3+42)+4,  text: '0.5',    style: style.h2 },
                    { name: null, x: (40*0)+30,    y: (3+42)+34, text: '1.0',    style: style.h2 },
                ],
                onchange: function(value){ _mainObject.__synthesizer.wobblePeriod(value); },
            },
            wobbleDepth: {
                type: 'continuous',
                x: (40*1)+20, y: 3+62, r: 12,
                startAngle: (3*Math.PI)/4, maxAngle: 1.5*Math.PI,
                handleStyle: style.handle,
                slotStyle: style.slot,
                needleStyle: style.needle,
                arcDistance: 1.2,
                outerArcStyle: style.markings,
                labels:[
                    { name: null, x: (40*1)+9,     y: (3+42)+40, text: 'depth',style: style.h1 },
                    { name: null, x: (40*1)+5,     y: (3+42)+34, text: '0',    style: style.h2 },
                    { name: null, x: (40*1)+16,    y: (3+42)+4,  text: '1/2',  style: style.h2 },
                    { name: null, x: (40*1)+32,    y: (3+42)+34, text: '1',    style: style.h2 },
                ],
                onchange: function(value){ _mainObject.__synthesizer.wobbleDepth(value); },
            }
        }
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
        _mainObject.__synthesizer = new parts.audio.synthesizer1_gainWobble(__globals.audio.context);
        _mainObject.__synthesizer.out().connect( _mainObject.io.audioOut.in() );

    //setup
        _mainObject.dial.continuous.gain.set(0.25);
        _mainObject.dial.continuous.detune.set(0.5);
        _mainObject.dial.discrete.octave.select(3);
        _mainObject.dial.continuous.wobblePeriod.set(0.1);
        _mainObject.dial.continuous.wobbleDepth.set(0.75);

    return _mainObject;
};