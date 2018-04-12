function makeDataDuplicator(x,y){

    var _mainObject = parts.basic.g('dataDuplicator', x, y);

    var backing = parts.basic.rect(null, 0, 0, 75, 55, 0, 'fill:rgba(200,200,200,1)');
        _mainObject.append(backing);
        __globals.mouseInteraction.declareObjectGrapple(backing, _mainObject, makeDataDuplicator);

    //generate selection area        
        _mainObject.selectionArea = {};
        _mainObject.selectionArea.box = [];
        _mainObject.selectionArea.points = [];
        _mainObject.updateSelectionArea = function(){
            //the main shape we want to use
            var temp = __globals.utility.getBoundingBox(backing);
            _mainObject.selectionArea.points = [
                [temp.x,temp.y],
                [temp.x+temp.width,temp.y],
                [temp.x+temp.width,temp.y+temp.height],
                [temp.x,temp.y+temp.height]
            ];
            _mainObject.selectionArea.box = __globals.utility.getBoundingBoxFromPoints(_mainObject.selectionArea.points);

            //adjusting it for the object's position in space
            temp = __globals.utility.getTransform(_mainObject);
            _mainObject.selectionArea.box.forEach(function(element) {
                element[0] += temp[0];
                element[1] += temp[1];
            });
            _mainObject.selectionArea.points.forEach(function(element) {
                element[0] += temp[0];
                element[1] += temp[1];
            });

            // //print points to foreground
            // for(var a = 0; a < _mainObject.selectionArea.box.length; a++){
            //     __globals.utility.dotMaker(
            //         _mainObject.selectionArea.box[a][0],
            //         _mainObject.selectionArea.box[a][1],
            //         '['+_mainObject.selectionArea.box[a][0]+','+_mainObject.selectionArea.box[a][1]+']',
            //         2.5,
            //         'fill:rgba(255,100,100,0.75); font-size:3; font-family:Helvetica;'
            //     );
            // }
            // for(var a = 0; a < _mainObject.selectionArea.points.length; a++){
            //     __globals.utility.dotMaker(
            //         _mainObject.selectionArea.points[a][0],
            //         _mainObject.selectionArea.points[a][1],
            //         '['+_mainObject.selectionArea.points[a][0]+','+_mainObject.selectionArea.points[a][1]+']',
            //         2,
            //         'fill:rgba(255,100,255,0.75); font-size:3; font-family:Helvetica;'
            //     );
            // }

        };
        _mainObject.updateSelectionArea();
        


        
    _mainObject.onSelect = function(){
        console.log('I\'ve been selected!');
        __globals.utility.setStyle(backing, 'fill:rgba(220,220,220,1)');
    };
    _mainObject.onDeselect = function(){
        console.log('I\'ve been deselected!');
        __globals.utility.setStyle(backing, 'fill:rgba(200,200,200,1)');
    };
    _mainObject.onDelete = function(){
        console.log('I\'ve been deleted!');
    };
    _mainObject.onCopy = function(original=false){
        console.log('I\'ve been copied!', original?'- original object ':'- new object');
    };

    _mainObject.importData = function(data){
        console.log('importing data', data);
    };
    _mainObject.exportData = function(){
        console.log('exporting data');
        return {'like settings and stuff':'settin\'s' };
    };




    _mainObject.io = {};
    _mainObject.io.in = parts.dynamic.connectionNode_data('io.in',75/2-30/2,-30/2,30,30);
        _mainObject.append(_mainObject.io.in);
    _mainObject.io.out_1 = parts.dynamic.connectionNode_data('io.out_1',5,55-30/2,30,30);
        _mainObject.append(_mainObject.io.out_1);
    _mainObject.io.out_2 = parts.dynamic.connectionNode_data('io.out_2',75-30-5,55-30/2,30,30);
        _mainObject.append(_mainObject.io.out_2);

    _mainObject.io.in.receive = function(address,data){
        _mainObject.io.out_1.send(address,data);
        _mainObject.io.out_2.send(address,data);
    };

    return _mainObject;
}