__globals.objects.make_audioDuplicator = function(x,y){
    //set numbers
    var type = 'audioDuplicator';
    var shape = {
        base: [[0,0],[55,0],[55,55],[0,55]],
        littleConnector: { width: 20, height: 20 },
        markings:{
            rect:[
                //flow lines
                {x:(20/4), y:(20*0.25 + 20/2), width:45, height:2, angle:0}, //top horizontal
                {x:(55*0.5), y:(20*0.25 + 20/2), width:2, height:25, angle:0}, //vertical
                {x:(55*0.5), y:(20*1.5  + 20/2), width:22.5, height:2, angle:0} //bottom horizontal
            ],
            path:[
                [[(55-10),(20*0 + 20/2)+1],[(55-2.5),(20*0.25 + 20/2)+1],[(55-10),(20*0.5 + 20/2)+1]], //upper arrow
                [[(55-10),(20*1.25 + 20/2)+1],[(55-2.5),(20*1.5 + 20/2)+1],[(55-10),(20*1.75 + 20/2)+1]] //lower arrow
            ]
        }
    };
    var style = {        
        background: 'fill:rgba(200,200,200,1); stroke:none;',
        markings: 'fill:rgba(150,150,150,1)',
    };


    //main
    var _mainObject = parts.basic.g(type, x, y);
        _mainObject._type = type;

    //elements
        //backing
        var backing = parts.basic.path(null, shape.base, 'L', style.background);
            _mainObject.append(backing);
            __globals.mouseInteraction.declareObjectGrapple(backing, _mainObject, arguments.callee);

        //generate selection area
        __globals.utility.generateSelectionArea(shape.base, _mainObject);

        //markings
            for(var a = 0; a < shape.markings.rect.length; a++){
                _mainObject.append(parts.basic.rect(null, shape.markings.rect[a].x,shape.markings.rect[a].y,shape.markings.rect[a].width,shape.markings.rect[a].height,shape.markings.rect[a].angle, style.markings));
            }
            for(var a = 0; a < shape.markings.path.length; a++){
                _mainObject.append(parts.basic.path(null, shape.markings.path[a], 'L', style.markings));
            }

    //connection nodes
        _mainObject.io = {};

        _mainObject.io.in = parts.dynamic.connectionNode_audio('_mainObject.io.in', 0, -shape.littleConnector.width/2, shape.littleConnector.height*0.25, shape.littleConnector.width, shape.littleConnector.height, __globals.audio.context);
            _mainObject.prepend(_mainObject.io.in);
        _mainObject.io.out_1 = parts.dynamic.connectionNode_audio('_mainObject.io.out_1', 1, shape.base[2][0]-shape.littleConnector.width/2, shape.littleConnector.height*0.25, shape.littleConnector.width, shape.littleConnector.height, __globals.audio.context);
            _mainObject.prepend(_mainObject.io.out_1);
        _mainObject.io.out_2 = parts.dynamic.connectionNode_audio('_mainObject.io.out_2', 1, shape.base[2][0]-shape.littleConnector.width/2, shape.littleConnector.height*1.5, shape.littleConnector.width, shape.littleConnector.height, __globals.audio.context);
            _mainObject.prepend(_mainObject.io.out_2);
    
        _mainObject.io.in.out().connect(_mainObject.io.out_1.in());
        _mainObject.io.in.out().connect(_mainObject.io.out_2.in());

    return _mainObject;
};