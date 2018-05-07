__globals.objects.make_audioSink = function(x,y){
    //set numbers
        var type = 'audioSink';
        var style = {
            h1: 'fill:rgba(0,0,0,1); font-size:7px; font-family:Courier New;',
            h2: 'fill:rgba(0,0,0,1); font-size:4px; font-family:Courier New;',
        
            handle: 'fill:rgba(220,220,220,1)',
            slot: 'fill:rgba(50,50,50,1)',
            needle: 'fill:rgba(250,150,150,1)'
        };
        var shape = {};
            shape.base = [{x:0,y:0},{x:100,y:0},{x:100,y:55},{x:0,y:55}];
            shape.connector = { width: 20, height: 20 };
            shape.connections = {};
                shape.connections.audio = [];
                    shape.connections.audio.push(
                        {
                            name: type+'.io.audio.in:right',
                            type: 0,
                            x:shape.base[2].x-shape.connector.width/2, 
                            y:shape.connector.height*0.25, 
                            width:shape.connector.width, 
                            height:shape.connector.height
                        },
                        {
                            name: type+'.io.audio.in:left',
                            type: 0,
                            x:shape.base[2].x-shape.connector.width/2, 
                            y:shape.base[2].y-shape.connector.height*1.25, 
                            width:shape.connector.width, 
                            height:shape.connector.height
                        }
                    );
            shape.button = {
                power:{
                    x: 20, y: 5,
                    width: 20, height: 20,
                    angle: 0,
                    upStyle: 'fill:rgba(175,175,175,1)',
                    hoverStyle: 'fill:rgba(220,220,220,1)',
                    downStyle: 'fill:rgba(150,150,150,1)',
                    glowStyle: 'fill:rgba(220,200,220,1)',
                    onclick: function(){ __globals.audio.context.resume(); }
                }
            };
            shape.dial = {
                gain:{
                    type: 'continuous',
                    x: shape.base[2].x-20, y: 20, r: 12,
                    startAngle: (3*Math.PI)/4, maxAngle: 1.5*Math.PI,
                    handleStyle: style.handle,
                    slotStyle: style.slot,
                    needleStyle: style.needle,
                    arcDistance: 1.2,
                    outerArcStyle: style.markings,
                    labels:[
                        { name: null, x: shape.base[2].x-29,   y: (3)+37, text: 'gain', style: style.h1 },
                        { name: null, x: shape.base[2].x-32,   y: (3)+31, text: '0',    style: style.h2 },
                        { name: null, x: shape.base[2].x-23.5, y: (3)+2,  text: '1/2',  style: style.h2 },
                        { name: null, x: shape.base[2].x-10,   y: (3)+31, text: '1',    style: style.h2 },
                    ],
                    onChange: function(value){
                        gain_right.gain.setTargetAtTime(value, __globals.audio.context.currentTime, 0);
                        gain_left.gain.setTargetAtTime(value, __globals.audio.context.currentTime, 0);
                    },
                },
            };

        var style = {
            background: 'fill:rgba(200,200,200,1)',
            text: 'fill:rgba(0,0,0,1); font-size:10px; font-family:Courier New; pointer-events: none;'
        };

    //main
    var _mainObject = parts.basic.g(type, x, y);
        _mainObject._type = type;

    //circuitry
        //audio destination
            _mainObject._destination = __globals.audio.context.destination;

        //panning nodes
            var pan_right = __globals.audio.context.createStereoPanner();
                pan_right.pan.setValueAtTime(1, __globals.audio.context.currentTime);
                pan_right.connect(_mainObject._destination);
            var pan_left  = __globals.audio.context.createStereoPanner();
                pan_left.pan.setValueAtTime(-1, __globals.audio.context.currentTime);
                pan_left.connect(_mainObject._destination);

        //input gain nodes
            var gain_right = __globals.audio.context.createGain();
                gain_right.gain.setTargetAtTime(0, __globals.audio.context.currentTime, 0);
                gain_right.connect(pan_right);
            var gain_left = __globals.audio.context.createGain();
                gain_left.gain.setTargetAtTime(0, __globals.audio.context.currentTime, 0);
                gain_left.connect(pan_left);

    //elements
        //backing
            var backing = parts.basic.path(null, shape.base, 'L', style.background);
            _mainObject.append(backing);
            __globals.mouseInteraction.declareObjectGrapple(backing, _mainObject, arguments.callee);
   
        //generate selection area
            __globals.utility.object.generateSelectionArea(shape.base, _mainObject);

        //levels
            var audioMeter_right = parts.display.audio_meter_level('audioMeter_right', 10, 5, 0, 5, 45);
            _mainObject.append(audioMeter_right);
            audioMeter_right.start();
            var audioMeter_left = parts.display.audio_meter_level('audioMeter_left', 5, 5, 0, 5, 45);
            _mainObject.append(audioMeter_left);
            audioMeter_left.start();

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

                dial.onChange = data.onChange;
                _mainObject.append(dial);
            }

    //connection nodes
        _mainObject.io = {};

        //audio
            shape.connections.audio.forEach(function(data){
                _mainObject.io[data.name] = parts.dynamic.connectionNode_audio(data.name, data.type, data.x, data.y, data.width, data.height, __globals.audio.context);
                _mainObject.prepend(_mainObject.io[data.name]);
            });

            _mainObject.io['audioSink.io.audio.in:right'].out().connect(gain_right);
            _mainObject.io['audioSink.io.audio.in:left'].out().connect(gain_left);
            gain_right.connect(audioMeter_left.audioIn());
            gain_left.connect(audioMeter_right.audioIn());

    //setup
        _mainObject.dial.continuous.gain.set(1);

    return _mainObject;
};