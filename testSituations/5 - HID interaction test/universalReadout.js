function makeUniversalReadout(x,y){

    //elements
        //main
            var _mainObject = parts.basic.g('universalReadout', x, y);

            var backing = parts.basic.rect(null, 0, 0, 75, 55, 0, 'fill:rgba(200,200,200,1)');
                _mainObject.append(backing);
                __globals.mouseInteraction.declareObjectGrapple(backing, _mainObject, makeUniversalReadout);

            _mainObject.append(parts.display.label(null, 10, 30, 'universal','fill:rgba(0,0,0,1); font-size:10px; font-family:Courier New; pointer-events: none;'));
            _mainObject.append(parts.display.label(null, 10, 40, 'readout','fill:rgba(0,0,0,1); font-size:10px; font-family:Courier New; pointer-events: none;'));

        // connection ports
            _mainObject.io = {};
            _mainObject.io.in = parts.dynamic.connectionNode_data('io.in',75/2-30/2,-30/2,30,30);
                _mainObject.append(_mainObject.io.in);
                _mainObject.io.in.receive = function(address,data){
                    console.log(address,data);
                };

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

            };
            _mainObject.updateSelectionArea();
        
    return _mainObject;
}