_canvas_.layers.registerFunctionForLayer("system", function(){

    let rectangle_1 = _canvas_.core.element.create('rectangle','test_rectangle_1');
    rectangle_1.unifiedAttribute({ 
        x:0, y:0, width:30, height:30, 
        colour:{r:0,g:1,b:0,a:0.3},
    });
    _canvas_.system.pane.mm.append(rectangle_1);
    let rectangle_2 = _canvas_.core.element.create('rectangle','test_rectangle_2');
    rectangle_2.unifiedAttribute({ 
        x:200, y:0, width:30, height:30, angle:0.2, anchor:{x:0.5,y:0.5},
        colour:{r:0,g:1,b:0,a:0.3},
    });
    _canvas_.system.pane.mm.append(rectangle_2);

    let image_1 = _canvas_.core.element.create('image','test_image_1');
    image_1.unifiedAttribute({ 
        x:50, y:10, width:100, height:100, angle:-0.2,
    });
    _canvas_.system.pane.mm.append(image_1);

    let group_1 = _canvas_.core.element.create('group','background');
    group_1.unifiedAttribute({ x:50, y:10, angle:0.2 });
    _canvas_.system.pane.mm.append(group_1);
        let rectangle_3 = _canvas_.core.element.create('rectangle','test_rectangle_3');
        rectangle_3.unifiedAttribute({ 
            x:0, y:0, width:30, height:30, 
            colour:{r:0,g:1,b:0,a:0.9},
        });
        group_1.append(rectangle_3);
        let rectangle_4 = _canvas_.core.element.create('rectangle','test_rectangle_4');
        rectangle_4.unifiedAttribute({ 
            x:40, y:0, width:30, height:30, 
            colour:{r:0,g:1,b:0,a:0.9},
        });
        group_1.append(rectangle_4);
        let polygon_1 = _canvas_.core.element.create('polygon','test_polygon_1');
        polygon_1.unifiedAttribute({ 
            pointsAsXYArray:[{x:0,y:0}, {x:50,y:0}, {x:50,y:50}, {x:40,y:50}, {x:40,y:20}, {x:20,y:20}, {x:20,y:50}, {x:0,y:50}],
        });
        group_1.append(polygon_1);

    let circle_1 = _canvas_.core.element.create('circle','test_circle_1');
    circle_1.unifiedAttribute({ 
        x:100, y:30, radius:15,
        colour: {r:0,g:0,b:1,a:1},
    });
    group_1.append(circle_1);

    let characterString_1 = _canvas_.core.element.create('characterString','test_characterString_1');
    characterString_1.unifiedAttribute({ 
        x:200, y:50, string:'Hello', angle:0.4,
    });
    group_1.append(characterString_1);

    setTimeout(_canvas_.core.render.frame,500);
    setTimeout(_canvas_.core.render.frame,1500);
} )