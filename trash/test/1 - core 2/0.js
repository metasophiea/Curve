_canvas_.core.meta.go = function(){

    //rectangle
        _canvas_.core.element.create('rectangle','test_rectangle_1').then(rectangle => {
            rectangle.unifiedAttribute({
                x:10, y:10,
                width:60, height:60,
                colour:{r:0.732,g:0.756,b:0.859,a:1}
            });
            _canvas_.core.arrangement.append(rectangle);
        });
    //rectangleWithOutline
        _canvas_.core.element.create('rectangleWithOutline','test_rectangleWithOutline_1').then(rectangleWithOutline => {
            rectangleWithOutline.unifiedAttribute({
                x:80, y:10, width:60, height:60, 
                thickness:5,
                colour:{r:0.732,g:0.756,b:0.859,a:1},
                lineColour:{r:0.5,g:0.5,b:0.859,a:1} 
            });
            _canvas_.core.arrangement.append(rectangleWithOutline);
        });
    
    //circle
        _canvas_.core.element.create('circle','test_circle_1').then(circle => {
            circle.unifiedAttribute({
                x:180, y:40, radius:30,
                colour:{r:0.5,g:0.859,b:0.5,a:1},
            });
            _canvas_.core.arrangement.append(circle);
        });
    //circleWithOutline
        _canvas_.core.element.create('circleWithOutline','test_circleWithOutline_1').then(circleWithOutline => {
            circleWithOutline.unifiedAttribute({
                x:250, y:40, radius:30,
                thickness:5,
                colour:{r:0.5,g:0.859,b:0.5,a:1},
                lineColour:{r:0.456,g:0.732,b:0.259,a:1},
            });
            _canvas_.core.arrangement.append(circleWithOutline);
        });

    //polygon
        _canvas_.core.element.create('polygon','test_polygon_1').then(polygon => {
            polygon.unifiedAttribute({
                pointsAsXYArray:[ {x:290,y:10}, {x:340,y:10}, {x:350,y:20}, {x:350,y:70}, {x:290,y:70} ],
                colour:{r:0.859,g:0.732,b:0.756,a:1} 
            });
            _canvas_.core.arrangement.append(polygon);
        });
    //polygonWithOutline
        _canvas_.core.element.create('polygonWithOutline','test_polygonWithOutline_1').then(polygonWithOutline => {
            polygonWithOutline.unifiedAttribute({
                pointsAsXYArray:[ {x:360,y:10}, {x:410,y:10}, {x:420,y:20}, {x:420,y:70}, {x:360,y:70} ],
                thickness:5,
                colour:{r:0.859,g:0.732,b:0.756,a:1},
                lineColour:{r:0.859,g:0.5,b:0.5,a:1}
            });
            _canvas_.core.arrangement.append(polygonWithOutline);
        });

    //path
        _canvas_.core.element.create('path','test_path_1').then(path => {
            path.unifiedAttribute({
                pointsAsXYArray:[ {x:80,y:80}, {x:130,y:80}, {x:140,y:90}, {x:140,y:140}, {x:80,y:140} ],
                thickness:5,
                capType:'round',
                colour:{r:0.859,g:0.2,b:0.756,a:1} 
            });
            _canvas_.core.arrangement.append(path);
        });
    
    //character
        _canvas_.core.element.create('character','test_character_1').then(character => {
            character.unifiedAttribute({
                character:'a',
                x:150, y:140, width:60, height:60, 
                colour:{r:0.859,g:0.5,b:0.756,a:1} 
            });
            _canvas_.core.arrangement.append(character);
        });
    //characterString
        _canvas_.core.element.create('characterString','test_characterString_1').then(characterString => {
            characterString.unifiedAttribute({
                string:'Hello',
                x:220, y:140, width:60, height:60, 
                colour:{r:0.5,g:0.5,b:0.8,a:1} 
            });
            _canvas_.core.arrangement.append(characterString);
        });

    //image
        _canvas_.core.element.create('image','test_image_1').then(image => {
            image.unifiedAttribute({
                x:10, y:150, width:60, height:60, 
            });
            _canvas_.core.arrangement.append(image);
        });
        setTimeout(_canvas_.core.render.frame,1100);
    //canvas
        //this is a method of using the image element as a destination for canvas data
        _canvas_.core.element.create('image','test_image_2').then(image => {
            image.unifiedAttribute({
                x:80, y:150, width:60, height:60, 
            });
            _canvas_.core.arrangement.append(image);

            let canvas = document.createElement('canvas');
            canvas.width = 60;
            canvas.height = 60;
            let canvasContext = canvas.getContext("2d");
            canvasContext.fillStyle = _canvas_.library.math.convertColour.obj2rgba({r:0.732,g:0.756,b:0.892,a:1});
            canvasContext.fillRect(5,5,60,60);
            canvasContext.fillStyle = _canvas_.library.math.convertColour.obj2rgba({r:0.107,g:0.722,b:0.945,a:1});
            canvasContext.fillRect(0,0,20,20);
            canvasContext.fillStyle = _canvas_.library.math.convertColour.obj2rgba({r:0.859,g:0.573,b:0.754,a:1});
            canvasContext.fillRect(0,15,40,20);

            createImageBitmap(canvas).then(bitmap => { image.imageBitmap(bitmap); }).then(() => { _canvas_.core.render.frame(); });
        });
        _canvas_.core.element.create('canvas','test_canvas_1').then(canvas => {
            _canvas_.core.arrangement.append(canvas);
            canvas.unifiedAttribute({
                x:150, y:150, width:60, height:60, 
            }).then(() => {
                canvas._.fillStyle = _canvas_.library.math.convertColour.obj2rgba({r:0.732,g:0.756,b:0.892,a:1});
                canvas._.fillRect(canvas.$(5),canvas.$(5),canvas.$(60),canvas.$(60));
                canvas._.fillStyle = _canvas_.library.math.convertColour.obj2rgba({r:0.107,g:0.722,b:0.945,a:1});
                canvas._.fillRect(canvas.$(0),canvas.$(0),canvas.$(20),canvas.$(20));
                canvas._.fillStyle = _canvas_.library.math.convertColour.obj2rgba({r:0.859,g:0.573,b:0.754,a:1});
                canvas._.fillRect(canvas.$(0),canvas.$(15),canvas.$(40),canvas.$(20));
                canvas.requestUpdate();
            });
        });
    //clipping
        _canvas_.core.element.create('group','test_clippingGroup_1').then(clippingGroup => {
            clippingGroup.unifiedAttribute({ x:10, y:80, clipActive:true });
            _canvas_.core.arrangement.append(clippingGroup);

            _canvas_.core.element.create('rectangle','test_clippingGroup_rectangle_1').then(rectangle => {
                rectangle.unifiedAttribute({ x:0, y:0, width:60, height:60, colour:{r:0.732,g:0.756,b:0.892,a:1} });
                clippingGroup.append(rectangle);
            });
            _canvas_.core.element.create('rectangle','test_clippingGroup_rectangle_2').then(rectangle => {
                rectangle.unifiedAttribute({ x:30, y:30, width:60, height:60, colour:{r:0.107,g:0.722,b:0.945,a:1} });
                clippingGroup.append(rectangle);
            });
            _canvas_.core.element.create('rectangle','test_clippingGroup_rectangle_3').then(rectangle => {
                rectangle.unifiedAttribute({ x:40, y:-10, width:60, height:60, colour:{r:0.859,g:0.573,b:0.754,a:1} });
                clippingGroup.append(rectangle);
            });
            _canvas_.core.element.create('rectangle','test_clippingGroup_rectangle_stencil').then(rectangle => {
                rectangle.unifiedAttribute({ width:60, height:60 });
                clippingGroup.stencil(rectangle);
            });
        });

    setTimeout(_canvas_.core.render.frame,100);
};