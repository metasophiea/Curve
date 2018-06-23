function makeAudioCombiner(x,y){

    var _mainObject = parts.basic.g('dataDuplicator', x, y);
        __globals.utility.element.makeUnselectable(_mainObject);

    var backing = parts.basic.rect(null, 0, 0, 75, 55, 0, 'fill:rgba(200,200,200,1)');
        _mainObject.append(backing);
        backing = parts.modifier.bestowMovement(backing, backing.parentElement);
        

    var connectionNode_audio_in_1 = parts.dynamic.connectionNode_audio('connectionNode_audio_in_1',0,5,55-30/2,30,30,__globals.audio.context);
        _mainObject.append(connectionNode_audio_in_1);
    var connectionNode_audio_in_2 = parts.dynamic.connectionNode_audio('connectionNode_audio_in_2',0,75-30-5,55-30/2,30,30,__globals.audio.context);
        _mainObject.append(connectionNode_audio_in_2);

    var connectionNode_audio_out_1 = parts.dynamic.connectionNode_audio('connectionNode_audio_out_1',1,75/2-30/2,-30/2,30,30,__globals.audio.context);
        _mainObject.append(connectionNode_audio_out_1);


    connectionNode_audio_in_1.out().connect(connectionNode_audio_out_1.in());
    connectionNode_audio_in_2.out().connect(connectionNode_audio_out_1.in());


    _mainObject.movementRedraw = function(){
        connectionNode_audio_in_1.redraw();
        connectionNode_audio_in_2.redraw();
        connectionNode_audio_out_1.redraw();
    };

    _mainObject.io = {};
    _mainObject.io.in_1 = connectionNode_audio_in_1;
    _mainObject.io.in_2 = connectionNode_audio_in_2;
    _mainObject.io.out = connectionNode_audio_out_1;

    return _mainObject;
}