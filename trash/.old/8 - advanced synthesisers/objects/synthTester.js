__globals.objects.make_synthTester = function(x,y, synth){
    //set numbers
    var type = 'synthTester';
    var attributes = {};
    var style = {
        background: 'fill:rgba(200,200,200,1); stroke:none;'
    };
    var shape = {
        base: [{x:0,y:0},{x:140,y:0},{x:140,y:40},{x:100,y:80},{x:0,y:80}],
        connector: {
            audio:{
                audioOut:{ type: 1, x: -15, y: 5, width: 30, height: 30 },
            },
            data:{
                midiNote:{ x: 117.5, y: 37.5, width: 30, height: 30, angle: Math.PI/4, receive: function(address,data){  if(address != 'midiNumber'){return;} _mainObject.__synthesizer.perform(data); } },
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
        _mainObject.__synthesizer = new synth(__globals.audio.context);
        _mainObject.__synthesizer.out().connect( _mainObject.io.audioOut.in() );

    return _mainObject;
};