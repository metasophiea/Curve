var elements = {};

_canvas_.layers.registerFunctionForLayer("core", function(){
    
    //rectangle
        elements.rectangle_1 = _canvas_.core.element.create('rectangle','test_rectangle_1');
        elements.rectangle_1.unifiedAttribute({ 
            x:10, y:10, width:60, height:60, 
            colour:{r:0.732,g:0.756,b:0.859,a:1}
        });
        _canvas_.core.arrangement.append(elements.rectangle_1);
    //rectangleWithOutline
        elements.rectangleWithOutline_1 = _canvas_.core.element.create('rectangleWithOutline','test_rectangleWithOutline_1');
        elements.rectangleWithOutline_1.unifiedAttribute({ 
            x:80, y:10, width:60, height:60, thickness:5,
            colour:{r:0.732,g:0.756,b:0.859,a:1},
            lineColour:{r:0.5,g:0.5,b:0.859,a:1}  });
        _canvas_.core.arrangement.append(elements.rectangleWithOutline_1);

    //circle
        elements.circle_1 = _canvas_.core.element.create('circle','test_circle_1');
        elements.circle_1.unifiedAttribute({
            x:180, y:40, radius:30,
            colour:{r:0.5,g:0.859,b:0.5,a:1}
        });
        _canvas_.core.arrangement.append(elements.circle_1);
    //circleWithOutline
        elements.circleWithOutline_1 = _canvas_.core.element.create('circleWithOutline','test_circleWithOutline_1');
        elements.circleWithOutline_1.unifiedAttribute({
            x:250, y:40, radius:30, thickness:5,
            colour:{r:0.5,g:0.859,b:0.5,a:1},
            lineColour:{r:0.456,g:0.732,b:0.259,a:1},
        });
        _canvas_.core.arrangement.append(elements.circleWithOutline_1);

    //polygon
        elements.polygon_1 = _canvas_.core.element.create('polygon','test_polygon_1');
        elements.polygon_1.unifiedAttribute({
            pointsAsXYArray:[ {x:290,y:10}, {x:340,y:10}, {x:350,y:20}, {x:350,y:70}, {x:290,y:70} ],
            colour:{r:0.859,g:0.732,b:0.756,a:1}
        });
        _canvas_.core.arrangement.append(elements.polygon_1);
    //polygonWithOutline
        elements.polygonWithOutline_1 = _canvas_.core.element.create('polygonWithOutline','test_polygonWithOutline_1');
        elements.polygonWithOutline_1.unifiedAttribute({
            pointsAsXYArray:[ {x:360,y:10}, {x:410,y:10}, {x:420,y:20}, {x:420,y:70}, {x:360,y:70} ],
            thickness:5,
            colour:{r:0.859,g:0.732,b:0.756,a:1},
            lineColour:{r:0.859,g:0.5,b:0.5,a:1}
        });
        _canvas_.core.arrangement.append(elements.polygonWithOutline_1);

    //path
        elements.path_1 = _canvas_.core.element.create('path','test_path_1');
        elements.path_1.unifiedAttribute({
            pointsAsXYArray:[ {x:80,y:80}, {x:130,y:80}, {x:140,y:90}, {x:140,y:140}, {x:80,y:140} ],
            thickness:5,
            capType:'round',
            colour:{r:0.859,g:0.2,b:0.756,a:1} 
        });
        _canvas_.core.arrangement.append(elements.path_1);

    //character
        elements.character_1 = _canvas_.core.element.create('character','test_character_1');
        elements.character_1.unifiedAttribute({
            character:'a',
            x:150, y:140, width:60, height:60, 
            colour:{r:0.859,g:0.5,b:0.756,a:1} 
        });
        _canvas_.core.arrangement.append(elements.character_1);
    //characterString
        elements.characterString_1 = _canvas_.core.element.create('characterString','test_characterString_1');
        elements.characterString_1.unifiedAttribute({
            string:'Hello',
            x:220, y:140, width:60, height:60, 
            colour:{r:0.5,g:0.5,b:0.8,a:1} 
        });
        _canvas_.core.arrangement.append(elements.characterString_1);

    //image
        elements.image_1 = _canvas_.core.element.create('image','test_image_1');
        elements.image_1.unifiedAttribute({ 
            x:10, y:150, width:60, height:60, url:'/images/testImages/Dore-munchausen-illustration.jpg',
        });
        _canvas_.core.arrangement.append(elements.image_1);
        elements.image_2 = _canvas_.core.element.create('image','test_image_2');
        elements.image_2.unifiedAttribute({ 
            x:10, y:220, width:60, height:60, url:'/images/testImages/opacityTestImage.png',
        });
        _canvas_.core.arrangement.append(elements.image_2);

    //canvas
        //this is a method of using the image element as a destination for canvas data
            elements.canvasImage_1 = _canvas_.core.element.create('image','test_canvasImage_1');
            elements.canvasImage_1.unifiedAttribute({ x:80, y:150, width:60, height:60 });
            _canvas_.core.arrangement.append(elements.canvasImage_1);
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
                createImageBitmap(canvas).then(bitmap => {
                    elements.canvasImage_1.bitmap(bitmap);
                });

        elements.canvas_1 = _canvas_.core.element.create('canvas','test_canvas_1');
        elements.canvas_1.unifiedAttribute({ x:150, y:150, width:60, height:60 });
        _canvas_.core.arrangement.append(elements.canvas_1);
            elements.canvas_1._.fillStyle = _canvas_.library.math.convertColour.obj2rgba({r:0.732,g:0.756,b:0.892,a:1});
            elements.canvas_1._.fillRect(elements.canvas_1.$(5),elements.canvas_1.$(5),elements.canvas_1.$(60),elements.canvas_1.$(60));
            elements.canvas_1._.fillStyle = _canvas_.library.math.convertColour.obj2rgba({r:0.107,g:0.722,b:0.945,a:1});
            elements.canvas_1._.fillRect(elements.canvas_1.$(0),elements.canvas_1.$(0),elements.canvas_1.$(20),elements.canvas_1.$(20));
            elements.canvas_1._.fillStyle = _canvas_.library.math.convertColour.obj2rgba({r:0.859,g:0.573,b:0.754,a:1});
            elements.canvas_1._.fillRect(elements.canvas_1.$(0),elements.canvas_1.$(15),elements.canvas_1.$(40),elements.canvas_1.$(20));
            elements.canvas_1.requestUpdate();

    //clipping
        elements.clippingGroup = _canvas_.core.element.create('group','test_clippingGroup_1');
        elements.clippingGroup.unifiedAttribute({ x:10, y:80, clipActive:true });
        _canvas_.core.arrangement.append(elements.clippingGroup);

            elements.test_clippingGroup_rectangle_1 = _canvas_.core.element.create('rectangle','test_clippingGroup_rectangle_1');
            elements.test_clippingGroup_rectangle_1.unifiedAttribute({ x:0, y:0, width:60, height:60, colour:{r:0.732,g:0.756,b:0.892,a:1} });
            elements.clippingGroup.append(elements.test_clippingGroup_rectangle_1);

            elements.test_clippingGroup_rectangle_2 = _canvas_.core.element.create('rectangle','test_clippingGroup_rectangle_2');
            elements.test_clippingGroup_rectangle_2.unifiedAttribute({ x:30, y:30, width:60, height:60, colour:{r:0.107,g:0.722,b:0.945,a:1} });
            elements.clippingGroup.append(elements.test_clippingGroup_rectangle_2);

            elements.test_clippingGroup_rectangle_3 = _canvas_.core.element.create('rectangle','test_clippingGroup_rectangle_3');
            elements.test_clippingGroup_rectangle_3.unifiedAttribute({ x:40, y:-10, width:60, height:60, colour:{r:0.859,g:0.573,b:0.754,a:1} });
            elements.clippingGroup.append(elements.test_clippingGroup_rectangle_3);

            elements.test_clippingGroup_rectangle_stencil = _canvas_.core.element.create('rectangle','test_clippingGroup_rectangle_stencil');
            elements.test_clippingGroup_rectangle_stencil.unifiedAttribute({ width:60, height:60 });
            elements.clippingGroup.stencil(elements.test_clippingGroup_rectangle_stencil);

    //transparency test
        elements.rectangle_2 = _canvas_.core.element.create('rectangle','test_rectangle_2');
        elements.rectangle_2.unifiedAttribute({ 
            x:40, y:40, width:60, height:60, 
            colour:{r:1,g:0,b:0,a:0}
        });
        _canvas_.core.arrangement.append(elements.rectangle_2);





    setTimeout(_canvas_.core.render.frame,100);
    setTimeout(_canvas_.core.render.frame,1100);
    // _canvas_.core.render.activeLimitToFrameRate(true);
    // _canvas_.core.render.frameRateLimit(20);
    // _canvas_.core.render.active(true);
    // _canvas_.core.stats.active(true);
    // setInterval(() => {
    //     _canvas_.core.stats.getReport().then(console.log)
    // }, 500);
} );