const callbackNames = [
    // 'onmousedown', 'onmouseup', 'onmousemove', 'onmouseenter', 'onmouseleave', 'onwheel', 'onclick', 'ondblclick',
    'onmouseenterelement', 'onmouseleaveelement',
    // 'onkeydown', 'onkeyup',
];

_canvas_.core.meta.go = function(){

    let rectangle_1 = _canvas_.core.element.create('rectangle','test_rectangle_1');
    _canvas_.core.arrangement.append(rectangle_1);
    rectangle_1.unifiedAttribute({ x:30, y:30, width:200, height:200, colour:{r:0,g:0,b:0,a:1} });
    rectangle_1.attachCallback(
        'onmouseenterelement',
        () => {
            rectangle_1.colour({r:0.75,g:0.75,b:0.75,a:1});
            _canvas_.core.render.frame();
        }
    );
    rectangle_1.attachCallback(
        'onmouseleaveelement',
        () => {
            rectangle_1.colour({r:0,g:0,b:0,a:1});
            _canvas_.core.render.frame();
        }
    );

    let rectangle_2 = _canvas_.core.element.create('rectangle','test_rectangle_2');
    _canvas_.core.arrangement.append(rectangle_2);
    rectangle_2.unifiedAttribute({ x:60, y:60, width:200, height:200, colour:{r:1,g:1,b:0,a:1} });
    rectangle_2.attachCallback(
        'onmouseenterelement',
        () => {
            rectangle_2.colour({r:0.25,g:0.25,b:0,a:1});
            _canvas_.core.render.frame();
        }
    );
    rectangle_2.attachCallback(
        'onmouseleaveelement',
        () => {
            rectangle_2.colour({r:1,g:1,b:0,a:1});
            _canvas_.core.render.frame();
        }
    );

    let rectangle_3 = _canvas_.core.element.create('rectangle','test_rectangle_3');
    _canvas_.core.arrangement.append(rectangle_3);
    rectangle_3.unifiedAttribute({ x:90, y:90, width:200, height:200, colour:{r:1,g:0,b:1,a:1} });
    rectangle_3.attachCallback(
        'onmouseenterelement',
        () => {
            rectangle_3.colour({r:1,g:0.75,b:1,a:1,a:1});
            _canvas_.core.render.frame();
        }
    );
    rectangle_3.attachCallback(
        'onmouseleaveelement',
        () => {
            rectangle_3.colour({r:1,g:0,b:1,a:1});
            _canvas_.core.render.frame();
        }
    );
    
};

callbackNames.forEach(callbackType => {
    _canvas_.core.callback.functions[callbackType] = function(x,y,event,elements){console.log(callbackType+':',x,y,event,elements);}
});

setTimeout(()=>{_canvas_.core.render.frame();},500);