function makeNoteName2midiNumber(x,y){
    var width = 75;
    var height = 55;

    //elements
        //main
            var _mainObject = parts.basic.g('noteName2midiNumber', x, y);

            var backing = parts.basic.rect(null, 0, 0, width, height, 0, 'fill:rgba(200,200,200,1)');
                _mainObject.append(backing);
                __globals.mouseInteraction.declareObjectGrapple(backing, _mainObject, makeNoteName2midiNumber);

            _mainObject.append(parts.display.label(null, 2, 8, 'noteName','fill:rgba(0,0,0,1); font-size:8px; font-family:Courier New; pointer-events: none;'));
            _mainObject.append(parts.display.label(null, 27.5, 32.5, '->','fill:rgba(0,0,0,1); font-size:15px; font-family:Courier New; pointer-events: none;'));
            _mainObject.append(parts.display.label(null, 25, 52.5, 'midiNumber','fill:rgba(0,0,0,1); font-size:8px; font-family:Courier New; pointer-events: none;'));

        // connection ports
            _mainObject.io = {};
            _mainObject.io.in = parts.dynamic.connectionNode_data('io.in',-30/2,height/2-30/2,30,30);
                _mainObject.append(_mainObject.io.in);
                _mainObject.io.in.receive = function(address,data){
                    if(address == 'noteName'){
                        _mainObject.io.out.send('midiNumber', {'num': __globals.audio.names_midinumbers[data.name], 'velocity': data.velocity} );
                    }
                };
            _mainObject.io.out = parts.dynamic.connectionNode_data('io.out',width-30/2,height/2-30/2,30,30);
                _mainObject.append(_mainObject.io.out);

        //generate selection area        
            _mainObject.selectionArea = {};
            _mainObject.selectionArea.box = [];
            _mainObject.selectionArea.points = [];
            _mainObject.updateSelectionArea = function(){
                //the main shape we want to use
                var temp = __globals.utility.element.getBoundingBox(backing);
                _mainObject.selectionArea.points = [
                    [temp.x,temp.y],
                    [temp.x+temp.width,temp.y],
                    [temp.x+temp.width,temp.y+temp.height],
                    [temp.x,temp.y+temp.height]
                ];
                _mainObject.selectionArea.box = __globals.utility.math.boundingBoxFromPoints(_mainObject.selectionArea.points);

                //adjusting it for the object's position in space
                temp = __globals.utility.element.getTransform(_mainObject);
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