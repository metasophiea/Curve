__globals.objects.make_filterUnit = function(x,y){
    //set numbers
        var type = 'filterUnit';
        var attributes = {};
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
            shape.height = 50;
            shape.base = [
                {x:0,y:0+10},
                {x:shape.width/2,y:0},
                {x:shape.width,y:0+10},

                {x:shape.width,y:shape.height-10},
                {x:shape.width/2,y:shape.height},
                {x:0,y:shape.height-10},
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
            shape.dial = {};

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

        //readout
            var keys = Object.keys(shape.readouts);
            for(var a = 0; a < keys.length; a++){
                data = shape.readouts[keys[a]];
                data.element = parts.display.segmentDisplay(keys[a], data.x, data.y, data.width, data.height);
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

        //circuitry
            _mainObject.__unit = new parts.audio.filterUnit(__globals.audio.context);
            _mainObject.io.audioIn.out().connect( _mainObject.__unit.in() );
            _mainObject.__unit.out().connect( _mainObject.io.audioOut.in() );


        //setup

        return _mainObject;
}