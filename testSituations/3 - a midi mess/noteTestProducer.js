function makeNoteTestProducer(x,y){
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


    _mainObject.index = 0;
    _mainObject.noteData = [
        {noteNumber: 70, velocity: 0.5433070866141733, channel: 0, delta: 0, totalDelta: 0},
        {noteNumber: 70, velocity: 0, channel: 0, delta: 0, totalDelta: 0}
    ];

    // setInterval(
    //     function(){
    //         connectionNode_data.send('midiNote',_mainObject.noteData[_mainObject.index]);
    //         _mainObject.index++;
    //         if(_mainObject.index>_mainObject.noteData.length-1){_mainObject.index=0;}
    //     },
    //     1000
    // );
    setTimeout( function(){
        connectionNode_data.send('midiNote',_mainObject.noteData[0]);
    },0 );
    setTimeout( function(){
        connectionNode_data.send('midiNote',_mainObject.noteData[1]);
    },1000 );
    
    _mainObject.io = {};
    _mainObject.io.out = connectionNode_data;

    return _mainObject;
}