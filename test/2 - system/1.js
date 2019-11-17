var rect = _canvas_.core.shape.create('rectangle');
    rect.name = 'testRectangle1';
    rect.x(0); rect.y(0);
    rect.width(30); rect.height(30);
    rect.colour = {r:0,g:1,b:0,a:0.3};
    _canvas_.system.pane.mm.append(rect);
var rect = _canvas_.core.shape.create('rectangle');
    rect.name = 'testRectangle2';
    rect.x(200); rect.y(0);
    rect.width(30); rect.height(30);
    rect.angle(0.2);
    rect.anchor({x:0.5,y:0.5});
    rect.colour = {r:0,g:1,b:0,a:0.3};
    _canvas_.system.pane.mm.append(rect);

var img = _canvas_.core.shape.create('image');
    img.name = 'testImage1';
    img.x(50); img.y(10);
    img.width(100); img.height(100);
    img.angle(-0.2);
    _canvas_.system.pane.mm.append(img);

var g = _canvas_.core.shape.create('group');
    g.name = 'testGroup1';
    g.x(50); g.y(10);
    g.angle(0.2);
    _canvas_.system.pane.mm.append(g);
var rect = _canvas_.core.shape.create('rectangle');
    rect.name = 'testRectangle1';
    rect.x(0); rect.y(0);
    rect.width(30); rect.height(30);
    rect.colour = {r:0,g:1,b:0,a:0.9};
    g.append(rect);
var rect = _canvas_.core.shape.create('rectangle');
    rect.name = 'testRectangle2';
    rect.x(40); rect.y(0);
    rect.width(30); rect.height(30);
    rect.colour = {r:0,g:1,b:0,a:0.9};
    g.append(rect);
var poly = _canvas_.core.shape.create('polygon');
    poly.name = 'testPolygon1';
    poly.pointsAsXYArray([{x:0,y:0}, {x:50,y:0}, {x:50,y:50}, {x:40,y:50}, {x:40,y:20}, {x:20,y:20}, {x:20,y:50}, {x:0,y:50}]);
    g.append(poly);

var circ = _canvas_.core.shape.create('circle');
    circ.name = 'testCircle1';
    circ.x(100); circ.y(30);
    circ.radius(15);
    circ.colour = {r:0,g:0,b:1,a:1};
    _canvas_.system.pane.mm.append(circ);

var text = _canvas_.core.shape.create('characterString');
    text.name = 'testText1';
    text.string('Hello');
    text.x(200); text.y(50);
    text.angle(0.4);
    _canvas_.system.pane.mm.append(text);


_canvas_.core.render.active(true);