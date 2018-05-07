__globals.objects.make_audioToPercentage = function(x,y){
    //set numbers
        var type = 'audioToPercentage';
        var shape = {};
            shape.base = [{x:0,y:0},{x:50,y:0},{x:50,y:50},{x:0,y:50}];
            shape.connector = { width: 20, height: 20 };
            shape.connections = {};
                shape.connections.audio = [];
                    shape.connections.audio.push(
                        {
                            name: 'io.audio.in:sourceWave',
                            type: 0,
                            x:shape.base[2].x-shape.connector.width/2, 
                            y:shape.connector.height*0.25, 
                            width:shape.connector.width, 
                            height:shape.connector.height
                        }
                    );
                shape.connections.data = [];
                    shape.connections.data.push(
                        {
                            name: 'io.data.out:%',
                            x:-shape.connector.width/2, 
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
        var converter = parts.audio.audio2percentage()
            converter.newValue = function(val){_mainObject.io['io.data.out:%'].send('%',val);};
            converter.start();

    //elements
        //backing
        var backing = parts.basic.path(null, shape.base, 'L', style.background);
        _mainObject.append(backing);
        __globals.mouseInteraction.declareObjectGrapple(backing, _mainObject, arguments.callee);

        //level
        var audioMeter = parts.display.audio_meter_level('audioMeter', 30, 5, 0, 15, 40);
        _mainObject.append(audioMeter);
        audioMeter.start();

    //connection nodes
    _mainObject.io = {};
        //audio
        shape.connections.audio.forEach(function(data){
            _mainObject.io[data.name] = parts.dynamic.connectionNode_audio(data.name, data.type, data.x, data.y, data.width, data.height, __globals.audio.context);
            _mainObject.prepend(_mainObject.io[data.name]);
        });
        //data
        shape.connections.data.forEach(function(data){
            _mainObject.io[data.name] = parts.dynamic.connectionNode_data(data.name, data.x, data.y, data.width, data.height);
            _mainObject.prepend(_mainObject.io[data.name]);
        });

        _mainObject.io['io.audio.in:sourceWave'].out().connect(audioMeter.audioIn());
        _mainObject.io['io.audio.in:sourceWave'].out().connect(converter.audioIn());

    return _mainObject;
};