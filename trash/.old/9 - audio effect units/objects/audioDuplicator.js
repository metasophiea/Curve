__globals.objects.make_audioDuplicator = function(x,y){
    //set numbers
    var type = 'audioDuplicator';
    var shape = {
        base: [{x:0,y:0},{x:55,y:0},{x:55,y:55},{x:0,y:55}],
        littleConnector: { width: 20, height: 20 },
        connection_audio_in:{x:55-20/2, y:20*0.25, width:20, height:20},
        connection_audio_out_1:{x:-(20/2), y:20*0.25, width:20, height:20},
        connection_audio_out_2:{x:-(20/2), y:20*1.5, width:20, height:20},
        markings:{
            rect:[
                //flow lines
                {x:(20/4), y:(20*0.25 + 20/2), width:45, height:2, angle:0}, //top horizontal
                {x:(55*0.5), y:(20*0.25 + 20/2), width:2, height:25.5, angle:0}, //vertical
                {x:(20/4), y:(20*1.5  + 20/2), width:24.5, height:2, angle:0} //bottom horizontal
            ],
            path:[
                [{x:10, y:(20*0 + 20/2)+1},   {x:2.5,y:(20*0.25 + 20/2)+1},{x:10, y:(20*0.5 + 20/2)+1}], //upper arrow
                [{x:10, y:(20*1.25 + 20/2)+1},{x:2.5,y:(20*1.5 + 20/2)+1}, {x:10, y:(20*1.75 + 20/2)+1}] //lower arrow
            ]
        }
    };
    var style = {        
        background: 'fill:rgba(200,200,200,1); stroke:none;',
        markings: 'fill:rgba(150,150,150,1); pointer-events: none;',
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
        __globals.utility.object.generateSelectionArea(shape.base, _mainObject);

        //markings
            for(var a = 0; a < shape.markings.rect.length; a++){
                _mainObject.append(parts.basic.rect(null, shape.markings.rect[a].x,shape.markings.rect[a].y,shape.markings.rect[a].width,shape.markings.rect[a].height,shape.markings.rect[a].angle, style.markings));
            }
            for(var a = 0; a < shape.markings.path.length; a++){
                _mainObject.append(parts.basic.path(null, shape.markings.path[a], 'L', style.markings));
            }

    //connection nodes
        _mainObject.io = {};

        _mainObject.io.in = parts.dynamic.connectionNode_audio('_mainObject.io.in', 0, shape.connection_audio_in.x, shape.connection_audio_in.y, shape.connection_audio_in.width, shape.connection_audio_in.height, __globals.audio.context);
            _mainObject.prepend(_mainObject.io.in);
        _mainObject.io.out_1 = parts.dynamic.connectionNode_audio('_mainObject.io.out_1', 1, shape.connection_audio_out_1.x, shape.connection_audio_out_1.y, shape.connection_audio_out_1.width, shape.connection_audio_out_1.height, __globals.audio.context);
            _mainObject.prepend(_mainObject.io.out_1);
        _mainObject.io.out_2 = parts.dynamic.connectionNode_audio('_mainObject.io.out_2', 1, shape.connection_audio_out_2.x, shape.connection_audio_out_2.y, shape.connection_audio_out_2.width, shape.connection_audio_out_2.height, __globals.audio.context);
            _mainObject.prepend(_mainObject.io.out_2);
    
        _mainObject.io.in.out().connect(_mainObject.io.out_1.in());
        _mainObject.io.in.out().connect(_mainObject.io.out_2.in());

    return _mainObject;
};