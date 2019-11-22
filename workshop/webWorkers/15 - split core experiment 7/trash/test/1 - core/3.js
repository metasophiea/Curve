let rectangle_tl;
let rectangle_tr;
let rectangle_bl;
let rectangle_br;

_canvas_.core.meta.go = function(){
    _canvas_.core.render.getCanvasSize().then(dimensions => {
        _canvas_.core.meta.createSetAppend(
            'rectangle','rectangle_tl', 
            { width:30, height:30, colour:{r:1,g:0,b:0,a:1} }
        ).then(id => rectangle_tl = id);
        _canvas_.core.meta.createSetAppend(
            'rectangle','rectangle_tr', 
            { x:dimensions.width-30, width:30, height:30, colour:{r:1,g:0,b:0,a:1} }
        ).then(id => rectangle_tr = id);
        _canvas_.core.meta.createSetAppend(
            'rectangle','rectangle_bl', 
            { y:dimensions.height-30, width:30, height:30, colour:{r:1,g:0,b:0,a:1} }
        ).then(id => rectangle_bl = id);
        _canvas_.core.meta.createSetAppend(
            'rectangle','rectangle_br', 
            { x:dimensions.width-30, y:dimensions.height-30, width:30, height:30, colour:{r:1,g:0,b:0,a:1} }
        ).then(id => rectangle_br = id);
    });
};

window.onresize = function(){
    _canvas_.core.meta.refresh().then(() => {
        _canvas_.core.render.getCanvasSize().then(dimensions => {
            _canvas_.core.boatload.element.executeMethod.load({
                id:rectangle_tl, method:'unifiedAttribute',
                argumentList:[{ x:0, y:0 }],
            });
            _canvas_.core.boatload.element.executeMethod.load({
                id:rectangle_tr, method:'unifiedAttribute',
                argumentList:[{ x:dimensions.width-30, y:0 }],
            });
            _canvas_.core.boatload.element.executeMethod.load({
                id:rectangle_bl, method:'unifiedAttribute',
                argumentList:[{ x:0, y:dimensions.height-30 }],
            });
            _canvas_.core.boatload.element.executeMethod.load({
                id:rectangle_br, method:'unifiedAttribute',
                argumentList:[{ x:dimensions.width-30, y:dimensions.height-30 }],
            });
            _canvas_.core.boatload.element.executeMethod.ship();
            _canvas_.core.render.frame();
        });
    });
};

setTimeout(window.onresize,500);