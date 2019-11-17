let dynamicGroup;
const callbackNames = [
    // 'onmousedown', 'onmouseup', 'onmousemove', 'onmouseenter', 'onmouseleave', 'onwheel', 'onclick', 'ondblclick',
    'onmouseenterelement', 'onmouseleaveelement',
    // 'onkeydown', 'onkeyup',
];

_canvas_.core.meta.go = function(){
    _canvas_.core.meta.createSetAppend( 'group','dynamicGroup', {heedCamera:true} ).then(id => {
        dynamicGroup = id;

        _canvas_.core.meta.createSetAppend( 'rectangle','rectangle_1', {x:30, y:30, width:200, height:200, colour:{r:0,g:0,b:0,a:1}}, dynamicGroup ).then(id => {
            callbackNames.forEach(callbackType => {
                _canvas_.core.callback.attachCallback(id,callbackType,(x,y,event)=>{console.log('rectangle_1 - '+callbackType,x,y,event);});
            });
        });
        _canvas_.core.meta.createSetAppend( 'rectangle','rectangle_2', {x:60, y:60, width:200, height:200, colour:{r:1,g:1,b:0,a:1}}, dynamicGroup ).then(id => {
            callbackNames.forEach(callbackType => {
                _canvas_.core.callback.attachCallback(id,callbackType,(x,y,event)=>{console.log('rectangle_2 - '+callbackType,x,y,event);});
            });
        });
        _canvas_.core.meta.createSetAppend( 'rectangle','rectangle_3', {x:90, y:90, width:200, height:200, colour:{r:1,g:0,b:1,a:1}}, dynamicGroup ).then(id => {
            callbackNames.forEach(callbackType => {
                _canvas_.core.callback.attachCallback(id,callbackType,(x,y,event)=>{console.log('rectangle_3 - '+callbackType,x,y,event);});
            });
        });        
    });
};

callbackNames.forEach(callbackType => {
    _canvas_.core.callback.functions[callbackType] = function(x,y,event,elements){console.log(callbackType+':',x,y,event,elements);}
});

setTimeout(()=>{_canvas_.core.render.frame();},500);