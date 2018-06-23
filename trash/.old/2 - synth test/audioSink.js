function makeAudioSink(x,y){
    var _mainObject = parts.basic.g('audioSink', x, y);
        _mainObject._destination = __globals.audio.context;

    var width = 100;
    var height = 50;
    var backing = parts.basic.rect(null, 0, 0, width, height, 0, 'fill:rgba(200,200,200,0.75)');
        _mainObject.append(backing);
        backing = parts.modifier.bestowMovement(backing, backing.parentElement);

    var audioConnection_width = 35;
    var audioConnection_height = 35;
    var connectionNode_audio = parts.dynamic.connectionNode_audio('connectionNode_audio', 0, width/2 - audioConnection_width/2, 30, audioConnection_width, audioConnection_height, __globals.audio.context);
        connectionNode_audio.out().connect(__globals.audio.context.destination);
        _mainObject.append(connectionNode_audio);
        _mainObject.movementRedraw = function(){ connectionNode_audio.redraw(); };

    _mainObject.io = {};
    _mainObject.io.in = connectionNode_audio;
    
    return _mainObject;
}