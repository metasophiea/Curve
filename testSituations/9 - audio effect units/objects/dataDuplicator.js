__globals.objects.make_dataDuplicator = function(x,y){
    //set numbers
    var type = 'dataDuplicator';
    var shape = {
        base: [{x:0,y:0},{x:55,y:0},{x:55,y:55},{x:0,y:55}],
        littleConnector: { width: 20, height: 20 },
        markings:{
            rect:[
                //flow lines
                {x:(20/4), y:(20*0.25 + 20/2), width:45, height:2, angle:0}, //top horizontal
                {x:(55*0.5), y:(20*0.25 + 20/2), width:2, height:25, angle:0}, //vertical
                {x:(55*0.5), y:(20*1.5  + 20/2), width:22.5, height:2, angle:0} //bottom horizontal
            ],
            path:[
                [{x:(55-10), y:(20*0 + 20/2)+1},{x:(55-2.5),y:(20*0.25 + 20/2)+1},{x:(55-10), y:(20*0.5 + 20/2)+1}], //upper arrow
                [{x:(55-10), y:(20*1.25 + 20/2)+1},{x:(55-2.5),y:(20*1.5 + 20/2)+1},{x:(55-10), y:(20*1.75 + 20/2)+1}] //lower arrow
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

        _mainObject.io.in = parts.dynamic.connectionNode_data('_mainObject.io.in', -shape.littleConnector.width/2, shape.littleConnector.height*0.25, shape.littleConnector.width, shape.littleConnector.height);
            _mainObject.prepend(_mainObject.io.in);
            _mainObject.io.in.receive = function(address,data){
                _mainObject.io.out_1.send(address,data);
                _mainObject.io.out_2.send(address,data);
            };
        _mainObject.io.out_1 = parts.dynamic.connectionNode_data('_mainObject.io.out_1', shape.base[2].x-shape.littleConnector.width/2, shape.littleConnector.height*0.25, shape.littleConnector.width, shape.littleConnector.height);
            _mainObject.prepend(_mainObject.io.out_1);
        _mainObject.io.out_2 = parts.dynamic.connectionNode_data('_mainObject.io.out_2', shape.base[2].x-shape.littleConnector.width/2, shape.littleConnector.height*1.5, shape.littleConnector.width, shape.littleConnector.height);
            _mainObject.prepend(_mainObject.io.out_2);
    

    return _mainObject;
};

//Operation Instructions
//  Data signals that are sent into the in port, are duplicated and sent out the two out ports
//  Note: they are not sent out at the same time; signals are produced from the 1st out port
//        first and then the 2nd port. 