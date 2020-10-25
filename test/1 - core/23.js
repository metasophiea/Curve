_canvas_.layers.registerFunctionForLayer("core", function(){


    const group_1 = _canvas_.core.element.create('Group','group_1');
    _canvas_.core.arrangement.append(group_1);
        let rectangle_1 = _canvas_.core.element.create('Rectangle','test_rectangle_1');
        group_1.append(rectangle_1);
        rectangle_1.unifiedAttribute({x:10, y:10, width:60, height:60, colour:{r:1, g:0, b:0, a:1}});

    const group_2 = _canvas_.core.element.create('Group','group_2');
    _canvas_.core.arrangement.append(group_2);
    group_2.framebufferActive(true);
        let rectangle_2 = _canvas_.core.element.create('Rectangle','test_rectangle_2');
        group_2.append(rectangle_2);
        rectangle_2.unifiedAttribute({x:80, y:10, width:60, height:60, colour:{r:0, g:1, b:0, a:1}});

    const group_3 = _canvas_.core.element.create('Group','group_3');
    _canvas_.core.arrangement.append(group_3);
    group_3.framebufferActive(true);
        let rectangle_3 = _canvas_.core.element.create('Rectangle','test_rectangle_3');
        group_3.append(rectangle_3);
        rectangle_3.unifiedAttribute({x:150, y:10, width:60, height:60, colour:{r:0, g:0, b:1, a:1}});
    


    setTimeout(() => {
        _canvas_.core.arrangement.printTree();
        _canvas_.core.render.frame();
    }, 100);
});