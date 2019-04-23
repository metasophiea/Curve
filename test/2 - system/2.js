var rect = _canvas_.core.shape.create('rectangle');
    rect.name = 'testRectangle_background';
    rect.x(0); rect.y = 0;
    rect.width(60); rect.height(60);
    rect.colour = {r:1,g:0,b:0,a:0.3};
    rect.dotFrame = true;
    _canvas_.system.pane.b.append(rect);

var rect = _canvas_.core.shape.create('rectangle');
    rect.name = 'testRectangle_middlegroud_back';
    rect.x(10); rect.y(60);
    rect.width(60); rect.height(60);
    rect.colour = {r:0,g:1,b:0,a:0.3};
    rect.dotFrame = true;
    _canvas_.system.pane.mb.append(rect);
var rect = _canvas_.core.shape.create('rectangle');
    rect.name = 'testRectangle_middlegroud_middle';
    rect.x(80); rect.y(60);
    rect.width(60); rect.height(60);
    rect.colour = {r:0,g:1,b:0,a:0.6};
    rect.dotFrame = true;
    _canvas_.system.pane.mm.append(rect);
var rect = _canvas_.core.shape.create('rectangle');
    rect.name = 'testRectangle_middlegroud_front';
    rect.x(150); rect.y(60);
    rect.width(60); rect.height(60);
    rect.colour = {r:0,g:1,b:0,a:0.9};
    rect.dotFrame = true;
    _canvas_.system.pane.mf.append(rect);

var rect = _canvas_.core.shape.create('rectangle');
    rect.name = 'testRectangle_foreground';
    rect.x(160); rect.y(120);
    rect.width(60); rect.height(60);
    rect.colour = {r:0,g:0,b:1,a:0.6};
    rect.dotFrame = true;
    _canvas_.system.pane.f.append(rect);

_canvas_.core.render.active(true);