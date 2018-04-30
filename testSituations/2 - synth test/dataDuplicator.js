function makeDataDuplicator(x,y){

    var _mainObject = parts.basic.g('dataDuplicator', x, y);
        __globals.utility.element.makeUnselectable(_mainObject);

    var backing = parts.basic.rect(null, 0, 0, 75, 55, 0, 'fill:rgba(200,200,200,1)');
        _mainObject.append(backing);
        backing = parts.modifier.bestowMovement(backing, backing.parentElement);


    var connectionNode_data_in = parts.dynamic.connectionNode_data('connectionNode_data_in',75/2-30/2,-30/2,30,30);
        _mainObject.append(connectionNode_data_in);

    var connectionNode_data_out_1 = parts.dynamic.connectionNode_data('connectionNode_data_out_1',5,55-30/2,30,30);
        _mainObject.append(connectionNode_data_out_1);
    var connectionNode_data_out_2 = parts.dynamic.connectionNode_data('connectionNode_data_out_2',75-30-5,55-30/2,30,30);
        _mainObject.append(connectionNode_data_out_2);


    connectionNode_data_in.receive = function(address,data){
        connectionNode_data_out_1.send(address,data);
        connectionNode_data_out_2.send(address,data);
    };

    _mainObject.movementRedraw = function(){
        connectionNode_data_in.redraw();
        connectionNode_data_out_1.redraw();
        connectionNode_data_out_2.redraw();
    };

    _mainObject.io = {};
    _mainObject.io.in = connectionNode_data_in;
    _mainObject.io.out_1 = connectionNode_data_out_1;
    _mainObject.io.out_2 = connectionNode_data_out_2;

    return _mainObject;
}