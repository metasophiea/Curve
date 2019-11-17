_canvas_.system.go = function(){
    _canvas_.core.meta.createSetAppend(
        'rectangle','test_rectangle_1', 
        { 
            x:0, y:0, width:30, height:30, 
            colour:{r:0,g:1,b:0,a:0.3},
        },
        _canvas_.system.pane.mm
    );
    _canvas_.core.meta.createSetAppend(
        'rectangle','test_rectangle_2', 
        { 
            x:200, y:0, width:30, height:30, angle:0.2, anchor:{x:0.5,y:0.5},
            colour:{r:0,g:1,b:0,a:0.3},
        },
        _canvas_.system.pane.mm
    );

    _canvas_.core.meta.createSetAppend(
        'image','test_image_1', 
        { 
            x:50, y:10, width:100, height:100, angle:-0.2,
        },
        _canvas_.system.pane.mm
    );

    _canvas_.core.meta.createSetAppend(
        'group','test_group_1', 
        { 
            x:50, y:10, angle:0.2,
        },
        _canvas_.system.pane.mm
    ).then(id => {
        _canvas_.core.meta.createSetAppend(
            'rectangle','test_rectangle_1', 
            { 
                x:0, y:0, width:30, height:30, 
                colour:{r:0,g:1,b:0,a:0.9},
            },
            id
        );
        _canvas_.core.meta.createSetAppend(
            'rectangle','test_rectangle_2', 
            { 
                x:40, y:0, width:30, height:30, 
                colour:{r:0,g:1,b:0,a:0.9},
            },
            id
        );
        _canvas_.core.meta.createSetAppend(
            'polygon','test_polygon_1', 
            { 
                pointsAsXYArray:[{x:0,y:0}, {x:50,y:0}, {x:50,y:50}, {x:40,y:50}, {x:40,y:20}, {x:20,y:20}, {x:20,y:50}, {x:0,y:50}],
            },
            id
        );
    });

    _canvas_.core.meta.createSetAppend(
        'circle','test_circle_1', 
        { 
            x:100, y:30, radius:15,
            colour: {r:0,g:0,b:1,a:1},
        },
        _canvas_.system.pane.mm
    );

    _canvas_.core.meta.createSetAppend(
        'characterString','test_characterString_1', 
        { 
            x:200, y:50, string:'Hello', angle:0.4,
        },
        _canvas_.system.pane.mm
    );


    setTimeout(_canvas_.core.render.frame,500);
    setTimeout(_canvas_.core.render.frame,1500);
};