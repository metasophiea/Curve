var partsCreated = {};

_canvas_.interface.go.add( function(){

    _canvas_.core.render.active(true);
    _canvas_.core.render.activeLimitToFrameRate(true);
    _canvas_.core.render.frameRateLimit(10);
    _canvas_.core.viewport.stopMouseScroll(true);

    const scale = 7;
    const position = {x:0, y:0};
    _canvas_.core.viewport.scale(scale);
    _canvas_.core.viewport.position(-(position.x)*scale,-(position.y)*scale);

    partsCreated.basic = {};
    partsCreated.basic.basicGroup = _canvas_.interface.part.builder( 'basic', 'group', 'basicGroup', { x:10, y:10 } );
    _canvas_.system.pane.mm.append(partsCreated.basic.basicGroup);

    //rectangle
        partsCreated.basic.rectangle = _canvas_.interface.part.builder('basic', 'rectangle','testRectangle', { x:5, y:5, width:30, height:30, colour:{r:1,g:0,b:0,a:1} });
        partsCreated.basic.basicGroup.append(partsCreated.basic.rectangle);
    //circle
        partsCreated.basic.circle = _canvas_.interface.part.builder('basic', 'circle','testCircle', { x:20, y:55, radius:15 });
        partsCreated.basic.basicGroup.append(partsCreated.basic.circle);
    //polygon
        partsCreated.basic.polygon = _canvas_.interface.part.builder('basic', 'polygon','testPolygon', { points:[55,5, 70,35, 40,35], colour:{r:0,g:1,b:0,a:1} });
        partsCreated.basic.basicGroup.append(partsCreated.basic.polygon);
    //path
        partsCreated.basic.path = _canvas_.interface.part.builder('basic', 'path','testPath', { points:[0,0, 0,90, 2.5,90, 2.5,72.5, 75,72.5], thickness:1.25, jointType:'round', capType:'round' });
        partsCreated.basic.basicGroup.append(partsCreated.basic.path);
    //image
        partsCreated.basic.image = _canvas_.interface.part.builder('basic', 'image','testImage', { x:40, y:40, width:30, height:30, url:'/images/testImages/Dore-munchausen-illustration.jpg' });
        partsCreated.basic.basicGroup.append(partsCreated.basic.image);
    //text
        partsCreated.basic.text = _canvas_.interface.part.builder('basic', 'text', 'testText', { x:5, y:75, text:'Hello', height:15, width:70, colour:{r:150/255,g:150/255,b:1,a:1} });
        partsCreated.basic.basicGroup.append(partsCreated.basic.text);
    //rectangleWithOutline
        partsCreated.basic.rectangleWithOutline = _canvas_.interface.part.builder('basic', 'rectangleWithOutline','testRectangleWithOutline', { x:105, y:60, width:30, height:30 });
        partsCreated.basic.basicGroup.append(partsCreated.basic.rectangleWithOutline);
    //circleWithOutline
        partsCreated.basic.circleWithOutline = _canvas_.interface.part.builder('basic', 'circleWithOutline','testCircleWithOutline', { x:90, y:70, radius:10 });
        partsCreated.basic.basicGroup.append(partsCreated.basic.circleWithOutline);
    //polygonWithOutline
        partsCreated.basic.polygonWithOutline = _canvas_.interface.part.builder('basic', 'polygonWithOutline','testPolygonWithOutline', { points:[75,15, 75,55, 115,55], thickness:1, colour:{r:1,g:0,b:0.5,a:1}, lineColour:{r:0,g:0,b:0,a:1} });
        partsCreated.basic.basicGroup.append(partsCreated.basic.polygonWithOutline);
    //canvas
        partsCreated.basic.canvas = _canvas_.interface.part.builder('basic', 'canvas','testCanvas', { x:130, y:5, width:30, height:30 });
        partsCreated.basic.basicGroup.append(partsCreated.basic.canvas);
            const $ = partsCreated.basic.canvas.$;
            partsCreated.basic.canvas._.fillStyle = _canvas_.library.math.convertColour.obj2rgba({r:0.9,g:0.9,b:0.9,a:1});
            partsCreated.basic.canvas._.fillRect($(0),$(0),$(30),$(30));
            partsCreated.basic.canvas._.fillStyle = _canvas_.library.math.convertColour.obj2rgba({r:0.732,g:0.756,b:0.892,a:1});
            partsCreated.basic.canvas._.fillRect($(0),$(0),$(10),$(10));
            partsCreated.basic.canvas._.fillStyle = _canvas_.library.math.convertColour.obj2rgba({r:0.107,g:0.722,b:0.945,a:1});
            partsCreated.basic.canvas._.fillRect($(20),$(0),$(10),$(10));
            partsCreated.basic.canvas._.fillStyle = _canvas_.library.math.convertColour.obj2rgba({r:0.859,g:0.573,b:0.754,a:1});
            partsCreated.basic.canvas._.fillRect($(0),$(20),$(10),$(10));
            partsCreated.basic.canvas._.fillStyle = _canvas_.library.math.convertColour.obj2rgba({r:0.754,g:0.859,b:0.573,a:1});
            partsCreated.basic.canvas._.fillRect($(20),$(20),$(10),$(10));
            partsCreated.basic.canvas.requestUpdate();
    //clipped group
        partsCreated.basic.clippingGroup = _canvas_.interface.part.builder( 'basic', 'group', 'clippingGroup', { x:75, y:5, clipActive:true } );
        _canvas_.system.pane.mm.append(partsCreated.basic.clippingGroup);
            const clippingPolygon = _canvas_.interface.part.builder('basic', 'polygon','testClippingPolygon', { points:[0,0, 50,0, 50,50] });
            partsCreated.basic.clippingGroup.stencil(clippingPolygon);
            const clippedImage = _canvas_.interface.part.builder('basic', 'image','clippedImage', { width:50, height:50, url:'/images/testImages/mikeandbrian.jpg' });
            partsCreated.basic.clippingGroup.append(clippedImage);

} );