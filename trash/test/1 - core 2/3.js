let rectangle_tl;
let rectangle_tr;
let rectangle_bl;
let rectangle_br;

_canvas_.core.meta.go = function(){
    _canvas_.core.render.getCanvasSize().then(dimensions => {
        _canvas_.core.element.create('rectangle','rectangle_tl').then(rectangle => {
            rectangle_tl = rectangle;
            rectangle.unifiedAttribute({ width:30, height:30, colour:{r:1,g:0,b:0,a:1} });
            _canvas_.core.arrangement.append(rectangle);
        });
        _canvas_.core.element.create('rectangle','rectangle_tr').then(rectangle => {
            rectangle_tr = rectangle;
            rectangle.unifiedAttribute({  x:dimensions.width-30, width:30, height:30, colour:{r:1,g:0,b:0,a:1} });
            _canvas_.core.arrangement.append(rectangle);
        });
        _canvas_.core.element.create('rectangle','rectangle_bl').then(rectangle => {
            rectangle_bl = rectangle;
            rectangle.unifiedAttribute({ y:dimensions.height-30, width:30, height:30, colour:{r:1,g:0,b:0,a:1}  });
            _canvas_.core.arrangement.append(rectangle);
        });
        _canvas_.core.element.create('rectangle','rectangle_br').then(rectangle => {
            rectangle_br = rectangle;
            rectangle.unifiedAttribute({ x:dimensions.width-30, y:dimensions.height-30, width:30, height:30, colour:{r:1,g:0,b:0,a:1} });
            _canvas_.core.arrangement.append(rectangle);
        });
    });
};

window.onresize = function(){
    _canvas_.core.meta.refresh().then(() => {
        _canvas_.core.render.getCanvasSize().then(dimensions => {
            rectangle_tl.unifiedAttribute({ x:0, y:0 });
            rectangle_tr.unifiedAttribute({ x:dimensions.width-30, y:0 });
            rectangle_bl.unifiedAttribute({ x:0, y:dimensions.height-30 });
            rectangle_br.unifiedAttribute({ x:dimensions.width-30, y:dimensions.height-30 });
            _canvas_.core.render.frame();
        });
    });
};

setTimeout(window.onresize,500);