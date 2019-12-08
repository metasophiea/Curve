_canvas_.core.go.add( function(){
    
    //rectangle
        let rectangle_1 = _canvas_.core.element.create('rectangle','test_rectangle_1');
        rectangle_1.unifiedAttribute({ 
            x:10, y:10, width:60, height:60, 
            colour:{r:0.732,g:0.756,b:0.859,a:1}
        });
        _canvas_.core.arrangement.append(rectangle_1);
    //rectangleWithOutline
        let rectangleWithOutline_1 = _canvas_.core.element.create('rectangleWithOutline','test_rectangleWithOutline_1');
        rectangleWithOutline_1.unifiedAttribute({ 
            x:80, y:10, width:60, height:60, thickness:5,
            colour:{r:0.732,g:0.756,b:0.859,a:1},
            lineColour:{r:0.5,g:0.5,b:0.859,a:1}  });
        _canvas_.core.arrangement.append(rectangleWithOutline_1);

    //circle
        let circle_1 = _canvas_.core.element.create('circle','test_circle_1');
        circle_1.unifiedAttribute({
            x:180, y:40, radius:30,
            colour:{r:0.5,g:0.859,b:0.5,a:1}
        });
        _canvas_.core.arrangement.append(circle_1);
    //circleWithOutline
        let circleWithOutline_1 = _canvas_.core.element.create('circleWithOutline','test_circleWithOutline_1');
        circleWithOutline_1.unifiedAttribute({
            x:250, y:40, radius:30, thickness:5,
            colour:{r:0.5,g:0.859,b:0.5,a:1},
            lineColour:{r:0.456,g:0.732,b:0.259,a:1},
        });
        _canvas_.core.arrangement.append(circleWithOutline_1);

    //polygon
        let polygon_1 = _canvas_.core.element.create('polygon','test_polygon_1');
        polygon_1.unifiedAttribute({
            pointsAsXYArray:[ {x:290,y:10}, {x:340,y:10}, {x:350,y:20}, {x:350,y:70}, {x:290,y:70} ],
            colour:{r:0.859,g:0.732,b:0.756,a:1}
        });
        _canvas_.core.arrangement.append(polygon_1);
    //polygonWithOutline
        let polygonWithOutline_1 = _canvas_.core.element.create('polygonWithOutline','test_polygonWithOutline_1');
        polygonWithOutline_1.unifiedAttribute({
            pointsAsXYArray:[ {x:360,y:10}, {x:410,y:10}, {x:420,y:20}, {x:420,y:70}, {x:360,y:70} ],
            thickness:5,
            colour:{r:0.859,g:0.732,b:0.756,a:1},
            lineColour:{r:0.859,g:0.5,b:0.5,a:1}
        });
        _canvas_.core.arrangement.append(polygonWithOutline_1);

    //path
        let path_1 = _canvas_.core.element.create('path','test_path_1');
        path_1.unifiedAttribute({
            pointsAsXYArray:[ {x:80,y:80}, {x:130,y:80}, {x:140,y:90}, {x:140,y:140}, {x:80,y:140} ],
            thickness:5,
            capType:'round',
            colour:{r:0.859,g:0.2,b:0.756,a:1} 
        });
        _canvas_.core.arrangement.append(path_1);

    //character
        let character_1 = _canvas_.core.element.create('character','test_character_1');
        character_1.unifiedAttribute({
            character:'a',
            x:150, y:140, width:60, height:60, 
            colour:{r:0.859,g:0.5,b:0.756,a:1} 
        });
        _canvas_.core.arrangement.append(character_1);
    //characterString
        let characterString_1 = _canvas_.core.element.create('characterString','test_characterString_1');
        characterString_1.unifiedAttribute({
            string:'Hello',
            x:220, y:140, width:60, height:60, 
            colour:{r:0.5,g:0.5,b:0.8,a:1} 
        });
        _canvas_.core.arrangement.append(characterString_1);

    //image
        let image_1 = _canvas_.core.element.create('image','test_image_1');
        image_1.unifiedAttribute({ 
            x:10, y:150, width:60, height:60, url:'/images/testImages/Dore-munchausen-illustration.jpg',
        });
        _canvas_.core.arrangement.append(image_1);

    //canvas
        //this is a method of using the image element as a destination for canvas data
            let image_2 = _canvas_.core.element.create('image','test_image_2');
            image_2.unifiedAttribute({ x:80, y:150, width:60, height:60 });
            _canvas_.core.arrangement.append(image_2);
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
                    image_2.bitmap(bitmap);
                });

        let canvas_1 = _canvas_.core.element.create('canvas','test_canvas_1');
        canvas_1.unifiedAttribute({ x:150, y:150, width:60, height:60 });
        _canvas_.core.arrangement.append(canvas_1);
            canvas_1._.fillStyle = _canvas_.library.math.convertColour.obj2rgba({r:0.732,g:0.756,b:0.892,a:1});
            canvas_1._.fillRect(canvas_1.$(5),canvas_1.$(5),canvas_1.$(60),canvas_1.$(60));
            canvas_1._.fillStyle = _canvas_.library.math.convertColour.obj2rgba({r:0.107,g:0.722,b:0.945,a:1});
            canvas_1._.fillRect(canvas_1.$(0),canvas_1.$(0),canvas_1.$(20),canvas_1.$(20));
            canvas_1._.fillStyle = _canvas_.library.math.convertColour.obj2rgba({r:0.859,g:0.573,b:0.754,a:1});
            canvas_1._.fillRect(canvas_1.$(0),canvas_1.$(15),canvas_1.$(40),canvas_1.$(20));
            canvas_1.requestUpdate();

    //clipping
        let clippingGroup = _canvas_.core.element.create('group','test_clippingGroup_1');
        clippingGroup.unifiedAttribute({ x:10, y:80, clipActive:true });
        _canvas_.core.arrangement.append(clippingGroup);

            let test_clippingGroup_rectangle_1 = _canvas_.core.element.create('rectangle','test_clippingGroup_rectangle_1');
            test_clippingGroup_rectangle_1.unifiedAttribute({ x:0, y:0, width:60, height:60, colour:{r:0.732,g:0.756,b:0.892,a:1} });
            clippingGroup.append(test_clippingGroup_rectangle_1);

            let test_clippingGroup_rectangle_2 = _canvas_.core.element.create('rectangle','test_clippingGroup_rectangle_2');
            test_clippingGroup_rectangle_2.unifiedAttribute({ x:30, y:30, width:60, height:60, colour:{r:0.107,g:0.722,b:0.945,a:1} });
            clippingGroup.append(test_clippingGroup_rectangle_2);

            let test_clippingGroup_rectangle_3 = _canvas_.core.element.create('rectangle','test_clippingGroup_rectangle_3');
            test_clippingGroup_rectangle_3.unifiedAttribute({ x:40, y:-10, width:60, height:60, colour:{r:0.859,g:0.573,b:0.754,a:1} });
            clippingGroup.append(test_clippingGroup_rectangle_3);

            let test_clippingGroup_rectangle_stencil = _canvas_.core.element.create('rectangle','test_clippingGroup_rectangle_stencil');
            test_clippingGroup_rectangle_stencil.unifiedAttribute({ width:60, height:60 });
            clippingGroup.stencil(test_clippingGroup_rectangle_stencil);

    setTimeout(_canvas_.core.render.frame,100);
    setTimeout(_canvas_.core.render.frame,1100);
} );