__globals.objects.make_audioSink = function(x,y){
    //set numbers
        var type = 'audioSink';
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

    //connection nodes
        _mainObject.io = {};

        //audio
            shape.connections.audio.forEach(function(data){
                _mainObject.io[data.name] = parts.dynamic.connectionNode_audio(data.name, data.type, data.x, data.y, data.width, data.height, __globals.audio.context);
                _mainObject.prepend(_mainObject.io[data.name]);
            });

            _mainObject.io['audioSink.io.audio.in:right'].out().connect(audioMeter_right.audioIn());
            _mainObject.io['audioSink.io.audio.in:right'].out().connect(pan_right);
            _mainObject.io['audioSink.io.audio.in:left'].out().connect(audioMeter_left.audioIn());
            _mainObject.io['audioSink.io.audio.in:left'].out().connect(pan_left);

    return _mainObject;
};