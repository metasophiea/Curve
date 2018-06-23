__globals.objects.make_audioIn = function(x,y){
    //set numbers
        var type = 'audioIn';
        var shape = {};
            shape.base = [{x:0,y:0},{x:20,y:0},{x:20,y:55},{x:0,y:55}];
            shape.connector = { width: 20, height: 20 };
            shape.connections = {};
                shape.connections.audio = [];
                    shape.connections.audio.push(
                        {
                            name: 'audioOut',
                            type: 1,
                            x:-shape.connector.width/2, 
                            y:shape.connector.height*0.25, 
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

    //elements
        //backing
            var backing = parts.basic.path(null, shape.base, 'L', style.background);
            _mainObject.append(backing);
            __globals.mouseInteraction.declareObjectGrapple(backing, _mainObject, arguments.callee);
   
        //generate selection area
            __globals.utility.object.generateSelectionArea(shape.base, _mainObject);

        //levels
            var audioMeter = parts.display.audio_meter_level('audioMeter', 5, 5, 0, 10, 45);
            _mainObject.append(audioMeter);
            audioMeter.start();

    //connection nodes
        _mainObject.io = {};

        //audio
            shape.connections.audio.forEach(function(data){
                _mainObject.io[data.name] = parts.dynamic.connectionNode_audio(data.name, data.type, data.x, data.y, data.width, data.height, __globals.audio.context);
                _mainObject.prepend(_mainObject.io[data.name]);
            });

    //circuitry
        _mainObject.__audioSource = new parts.audio.audioIn(__globals.audio.context);
        _mainObject.__audioSource.out().connect( _mainObject.io.audioOut.in() );

    return _mainObject;
};