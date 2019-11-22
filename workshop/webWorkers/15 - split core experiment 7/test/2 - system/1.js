_canvas_.system.go = function(){

    _canvas_.core.element.create('rectangle','test_rectangle_1').then(rectangle => {
        rectangle.unifiedAttribute({
            x:0, y:0, width:30, height:30, 
            colour:{r:0,g:1,b:0,a:0.3},
        });
        _canvas_.system.pane.mm.append(rectangle);
    });
    _canvas_.core.element.create('rectangle','test_rectangle_2').then(rectangle => {
        rectangle.unifiedAttribute({
            x:200, y:0, width:30, height:30, angle:0.2, anchor:{x:0.5,y:0.5},
            colour:{r:0,g:1,b:0,a:0.3},
        });
        _canvas_.system.pane.mm.append(rectangle);
    });

    _canvas_.core.element.create('image','test_image_1').then(image => {
        image.unifiedAttribute({
            x:50, y:10, width:100, height:100, angle:-0.2,
        });
        _canvas_.system.pane.mm.append(image);
    });

    _canvas_.core.element.create('group','background').then(group => {
        _canvas_.system.pane.mm.append(group);
        group.unifiedAttribute({ x:50, y:10, angle:0.2 });

        _canvas_.core.element.create('rectangle','test_rectangle_1').then(rectangle => {
            rectangle.unifiedAttribute({
                x:0, y:0, width:30, height:30, 
                colour:{r:0,g:1,b:0,a:0.9},
            });
            group.append(rectangle);
        });
        _canvas_.core.element.create('rectangle','test_rectangle_2').then(rectangle => {
            rectangle.unifiedAttribute({
                x:40, y:0, width:30, height:30, 
                colour:{r:0,g:1,b:0,a:0.9},
            });
            group.append(rectangle);
        });
        _canvas_.core.element.create('polygon','test_polygon_1').then(polygon => {
            polygon.unifiedAttribute({
                pointsAsXYArray:[{x:0,y:0}, {x:50,y:0}, {x:50,y:50}, {x:40,y:50}, {x:40,y:20}, {x:20,y:20}, {x:20,y:50}, {x:0,y:50}],
            });
            group.append(polygon);
        });
    });

    _canvas_.core.element.create('circle','test_circle_1').then(circle => {
        circle.unifiedAttribute({
            x:100, y:30, radius:15,
            colour: {r:0,g:0,b:1,a:1},
        });
        _canvas_.system.pane.mm.append(circle);
    });

    _canvas_.core.element.create('characterString','test_characterString_1').then(characterString => {
        characterString.unifiedAttribute({
            x:200, y:50, string:'Hello', angle:0.4,
        });
        _canvas_.system.pane.mm.append(characterString);
    });

    setTimeout(_canvas_.core.render.frame,500);
    setTimeout(_canvas_.core.render.frame,1500);
};