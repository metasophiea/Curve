function makeUniversalReadout(x,y){
    var _mainObject = parts.basic.g('universalReadout', x, y);
        parts.modifier.makeUnselectable(_mainObject);

    var connectionNode_data = parts.dynamic.connectionNode_data('connectionNode_data',-30/2,25-30/2,30,30);
        _mainObject.append(connectionNode_data);

    var backing = parts.basic.rect(null, 0, 0, 50, 50, 0, 'fill:rgba(200,200,200,1)');
        _mainObject.append(backing);
        backing = parts.modifier.bestowMovement(backing, backing.parentElement);

    _mainObject.movementRedraw = function(){
        connectionNode_data.redraw();
    };

    connectionNode_data.receive = function(address, data){
        if(address == 'musicalNote'){
            for(var a = 0; a < data.length; a++){
                console.log( 'note: ' + data[a].name() + ' frequency: ' + data[a].frequency() + 'Hz\tduration: ' + data[a].duration() + 's force: ' + data[a].force()*100 + '%\t' );
            }
        }else{
            console.log(address,data);
        }
    };

    _mainObject.io = {};
    _mainObject.io.in = connectionNode_data;

    return _mainObject;
}