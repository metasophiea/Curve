_canvas_.core.meta.go = function(){
    
    //rectangle
        _canvas_.core.meta.createSetAppend(
            'rectangle','test_rectangle_1', 
            { 
                x:10, y:10, width:60, height:60, 
                colour:{r:0.732,g:0.756,b:0.859,a:1},
            }
        );
    //rectangleWithOutline
        _canvas_.core.meta.createSetAppend(
            'rectangleWithOutline','test_rectangleWithOutline_1', 
            { 
                x:80, y:10, width:60, height:60, 
                thickness:5,
                colour:{r:0.732,g:0.756,b:0.859,a:1},
                lineColour:{r:0.5,g:0.5,b:0.859,a:1} 
            }
        );

    //circle
        _canvas_.core.meta.createSetAppend(
            'circle','test_circle_1', 
            { 
                x:180, y:40, radius:30,
                colour:{r:0.5,g:0.859,b:0.5,a:1},
            }
        );
    //circleWithOutline
        _canvas_.core.meta.createSetAppend(
            'circleWithOutline','test_circleWithOutline_1', 
            { 
                x:250, y:40, radius:30,
                thickness:5,
                colour:{r:0.5,g:0.859,b:0.5,a:1},
                lineColour:{r:0.456,g:0.732,b:0.259,a:1},
            }
        );

    //polygon
        _canvas_.core.meta.createSetAppend(
            'polygon','test_polygon_1', 
            { 
                pointsAsXYArray:[ {x:290,y:10}, {x:340,y:10}, {x:350,y:20}, {x:350,y:70}, {x:290,y:70} ],
                colour:{r:0.859,g:0.732,b:0.756,a:1} 
            }
        );
    //polygonWithOutline
        _canvas_.core.meta.createSetAppend(
            'polygonWithOutline','test_polygonWithOutline_1', 
            { 
                pointsAsXYArray:[ {x:360,y:10}, {x:410,y:10}, {x:420,y:20}, {x:420,y:70}, {x:360,y:70} ],
                thickness:5,
                colour:{r:0.859,g:0.732,b:0.756,a:1},
                lineColour:{r:0.859,g:0.5,b:0.5,a:1} 
            }
        );

    //path
        _canvas_.core.meta.createSetAppend(
            'path','test_path_1', 
            { 
                pointsAsXYArray:[ {x:80,y:80}, {x:130,y:80}, {x:140,y:90}, {x:140,y:140}, {x:80,y:140} ],
                thickness:5,
                capType:'round',
                colour:{r:0.859,g:0.2,b:0.756,a:1} 
            }
        );

    //character
        _canvas_.core.meta.createSetAppend(
            'character','test_character_1', 
            { 
                character:'a',
                x:150, y:140, width:60, height:60, 
                colour:{r:0.859,g:0.5,b:0.756,a:1} 
            }
       );
    //characterString
        _canvas_.core.meta.createSetAppend(
            'characterString','test_characterString_1', 
            { 
                string:'Hello',
                x:220, y:140, width:60, height:60, 
                colour:{r:0.5,g:0.5,b:0.8,a:1} 
            }
        );

    //image
        _canvas_.core.meta.createSetAppend(
            'image','test_image_1', 
            { 
                x:10, y:150, width:60, height:60, 
            }
        );
        setTimeout(_canvas_.core.render.frame,1100);
    //canvas
        _canvas_.core.meta.createSetAppend(
            'image','test_image_2', 
            { 
                x:80, y:150, width:60, height:60, 
            }
        ).then(id => {
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

            createImageBitmap(canvas).then(bitmap => { _canvas_.core.element.executeMethod(id, 'imageBitmap', [bitmap], [bitmap]); }).then(() => { _canvas_.core.render.frame(); });
        });
    
    //clipping
        _canvas_.core.meta.createSetAppend(
            'group','test_clippingGroup_1',
            {x:10, y:80, clipActive:true},
        ).then(test_clippingGroup_1 => {
            _canvas_.core.meta.createSetAppend(
                'rectangle','test_clippingGroup_rectangle_1', 
                {x:0, y:0, width:60, height:60, colour:{r:0.732,g:0.756,b:0.892,a:1}},
                test_clippingGroup_1
            );
            _canvas_.core.meta.createSetAppend(
                'rectangle','test_clippingGroup_rectangle_2', 
                {x:30, y:30, width:60, height:60, colour:{r:0.107,g:0.722,b:0.945,a:1}},
                test_clippingGroup_1
            );
            _canvas_.core.meta.createSetAppend(
                'rectangle','test_clippingGroup_rectangle_3', 
                {x:40, y:-10, width:60, height:60, colour:{r:0.859,g:0.573,b:0.754,a:1}},
                test_clippingGroup_1
            );
            _canvas_.core.element.create('rectangle','test_clippingGroup_rectangle_stencil').then(test_clippingGroup_rectangle_stencil => {
                _canvas_.core.element.executeMethod(test_clippingGroup_rectangle_stencil, 'width', [60]);
                _canvas_.core.element.executeMethod(test_clippingGroup_rectangle_stencil, 'height', [60]);
                _canvas_.core.element.executeMethod(test_clippingGroup_1,'stencil',[test_clippingGroup_rectangle_stencil]);
            });
        });

    setTimeout(_canvas_.core.render.frame,100);
};