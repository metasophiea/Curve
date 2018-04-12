function makeMidiTestProducer(x,y){
    var _mainObject = parts.basic.g('noteTestProducer', x, y);
        parts.modifier.makeUnselectable(_mainObject);

    var backing = parts.basic.rect(null, 0, 0, 100, 100, 0, 'fill:rgba(200,200,200,1)');
        _mainObject.append(backing);
        backing = parts.modifier.bestowMovement(backing, backing.parentElement);

    var connectionNode_data = parts.dynamic.connectionNode_data('connectionNode_data',100-30/2,50-30/2,30,30);
        _mainObject.append(connectionNode_data);

    _mainObject.movementRedraw = function(){
        connectionNode_data.redraw();
    };






    var midiSender = new parts.dynamic.midiSender();
    midiSender.noteOn = function(data){ connectionNode_data.send('midiNote',data); };
    midiSender.noteOff = function(data){ connectionNode_data.send('midiNote',data); };
    midiSender.endOfTrack = function(){};
    midiSender.setTempo = function(data){};
    midiSender.text = function(data){};
    midiSender.trackName = function(data){};
    midiSender.timeSignature = function(data){};
    midiSender.programChange = function(data){};
    midiSender.controlChange = function(data){};
    midiSender.test_2();







    _mainObject.io = {};
    _mainObject.io.out = connectionNode_data;

    return _mainObject;
}