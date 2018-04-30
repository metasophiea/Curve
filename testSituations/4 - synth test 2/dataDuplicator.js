function makeDataDuplicator(x,y){

    var _mainObject = parts.basic.g('dataDuplicator', x, y);
        __globals.utility.element.makeUnselectable(_mainObject);

    var backing = parts.basic.rect(null, 0, 0, 75, 55, 0, 'fill:rgba(200,200,200,1)');
        _mainObject.append(backing);
        __globals.mouseInteraction.declareObjectGrapple(backing, backing.parentElement, makeDataDuplicator);

        //generate selection area        
        _mainObject.selectionArea = {};
        _mainObject.selectionArea.box = [];
        _mainObject.selectionArea.points = [];
        function updateSelectionArea(){
            //the main shape we want to use
            var temp = __globals.utility.element.getBoundingBox(backing);
            _mainObject.selectionArea.box = [
                [temp.x,temp.y],
                [temp.x+temp.width,temp.y+temp.height]
            ];
            _mainObject.selectionArea.points = [
                [temp.x,temp.y],
                [temp.x+temp.width,temp.y],
                [temp.x+temp.width,temp.y+temp.height],
                [temp.x,temp.y+temp.height]
            ];

            //adjusting it for the object's position in space
            temp = __globals.utility.element.getTransform(_mainObject);
            for(var a = 0; a < _mainObject.selectionArea.box.length; a++){
                _mainObject.selectionArea.box[a][0] += temp.x;
                _mainObject.selectionArea.box[a][1] += temp.y;
            }
            for(var a = 0; a < _mainObject.selectionArea.points.length; a++){
                _mainObject.selectionArea.points[a][0] += temp.x;
                _mainObject.selectionArea.points[a][1] += temp.y;
            }
        }
        updateSelectionArea();
        


        
        _mainObject.select = function(){
            console.log('I\'ve been selected!');
            __globals.utility.element.setStyle(backing, 'fill:rgba(220,220,220,1)');
        };
        _mainObject.deselect = function(){
            console.log('I\'ve been deselected!');
            __globals.utility.element.setStyle(backing, 'fill:rgba(200,200,200,1)');
        };
        _mainObject.delete = function(){
            console.log('I\'ve been deleted!');
        };
        _mainObject.copy = function(original=false){
            console.log('I\'ve been copied!', original?'- original object ':'- new object');
        };






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
        updateSelectionArea();
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