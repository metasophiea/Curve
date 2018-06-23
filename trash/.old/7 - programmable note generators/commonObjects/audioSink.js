__globals.objects.make_audioSink = function(x,y){
    //set numbers
        var type = 'audioSink';
        var size = {
            base: { width: 100, height: 50 },
            connector: { width: 30, height: 30 }
        };
        var style = {
            background: 'fill:rgba(200,200,200,1)',
            text: 'fill:rgba(0,0,0,1); font-size:10px; font-family:Courier New; pointer-events: none;'
        };



    //main
    var _mainObject = parts.basic.g(type, x, y);
        _mainObject._type = type;

    //circuitry
    _mainObject._destination = __globals.audio.context;

    //elements
        //backing
        var backing = parts.basic.rect(null, 0, 0, size.base.width, size.base.height, 0, style.background);
            _mainObject.append(backing);
            __globals.mouseInteraction.declareObjectGrapple(backing, _mainObject, arguments.callee);

        _mainObject.append(parts.display.label(null, 20, 22.5, 'audio sink',style.text));
            
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


    //connection nodes
        _mainObject.io = {};
        _mainObject.io.audio_in = parts.dynamic.connectionNode_audio('connectionNode_audio', 0, size.base.width/2 - size.connector.width/2, size.base.height-size.connector.height/2, size.connector.width, size.connector.height, __globals.audio.context);
            _mainObject.io.audio_in.out().connect(__globals.audio.context.destination);
            _mainObject.append(_mainObject.io.audio_in);

    return _mainObject;
}