let dynamicGroup;
const callbackNames = [
    // 'onmousedown', 'onmouseup', 'onmousemove', 'onmouseenter', 'onmouseleave', 'onwheel', 'onclick', 'ondblclick',
    'onmouseenterelement', 'onmouseleaveelement',
    // 'onkeydown', 'onkeyup',
];

_canvas_.core.meta.go = function(){

    _canvas_.core.element.create('group','dynamicGroup').then(dynamicGroup => {
        _canvas_.core.arrangement.append(dynamicGroup);

        _canvas_.core.element.create('rectangle','rectangle_1').then(rectangle => {
            rectangle.unifiedAttribute({ x:30, y:30, width:200, height:200, colour:{r:0,g:0,b:0,a:1} });
            dynamicGroup.append(rectangle);
            _canvas_.core.callback.attachCallback(rectangle,'onmouseenterelement',(x,y,event)=>{
                rectangle.colour({r:0.75,g:0.75,b:0.75,a:1});
                _canvas_.core.render.frame();
            });
            _canvas_.core.callback.attachCallback(rectangle,'onmouseleaveelement',(x,y,event)=>{
                rectangle.colour({r:0,g:0,b:0,a:1});
                _canvas_.core.render.frame();
            });
        });
        _canvas_.core.element.create('rectangle','rectangle_2').then(rectangle => {
            rectangle.unifiedAttribute({ x:60, y:60, width:200, height:200, colour:{r:1,g:1,b:0,a:1} });
            dynamicGroup.append(rectangle);
            _canvas_.core.callback.attachCallback(rectangle,'onmouseenterelement',(x,y,event)=>{
                rectangle.colour({r:0.25,g:0.25,b:0,a:1});
                _canvas_.core.render.frame();
            });
            _canvas_.core.callback.attachCallback(rectangle,'onmouseleaveelement',(x,y,event)=>{
                rectangle.colour({r:1,g:1,b:0,a:1});
                _canvas_.core.render.frame();
            });
        });
        _canvas_.core.element.create('rectangle','rectangle_3').then(rectangle => {
            rectangle.unifiedAttribute({ x:90, y:90, width:200, height:200, colour:{r:1,g:0,b:1,a:1} });
            dynamicGroup.append(rectangle);
            _canvas_.core.callback.attachCallback(rectangle,'onmouseenterelement',(x,y,event)=>{
                rectangle.colour({r:1,g:0.75,b:1,a:1,a:1});
                _canvas_.core.render.frame();
            });
            _canvas_.core.callback.attachCallback(rectangle,'onmouseleaveelement',(x,y,event)=>{
                rectangle.colour({r:1,g:0,b:1,a:1});
                _canvas_.core.render.frame();
            });
        });
    });
};

callbackNames.forEach(callbackType => {
    _canvas_.core.callback.functions[callbackType] = function(x,y,event,elements){console.log(callbackType+':',x,y,event,elements);}
});

setTimeout(()=>{_canvas_.core.render.frame();},500);