_canvas_.core.render.active(true);

var tmp = _canvas_.core.shape.create('rectangle');
    tmp.name = 'rectangle_1';
    tmp.x(10); tmp.y(10);
    tmp.width(60);
    tmp.height(60);
    tmp.colour = {r:Math.random(),g:Math.random(),b:Math.random(),a:1};
    _canvas_.core.arrangement.append(tmp);

var tmp = _canvas_.core.shape.create('rectangleWithOutline');
    tmp.name = 'rectangleWithOutline_1';
    tmp.x(10); tmp.y(150);
    tmp.width(60);
    tmp.height(60);
    tmp.thickness(5);
    tmp.colour = {r:Math.random(),g:Math.random(),b:Math.random(),a:1};
    tmp.lineColour = {r:Math.random(),g:Math.random(),b:Math.random(),a:1};
    _canvas_.core.arrangement.append(tmp);

var tmp = _canvas_.core.shape.create('polygon');
    tmp.name = 'polygon_1';
    tmp.points([
        80+0,  10+0,
        80+30, 10+10,
        80+60, 10+0,
        80+60, 10+60,
        80+0,  10+60,
    ]);
    tmp.colour = {r:Math.random(),g:Math.random(),b:Math.random(),a:0.5};
    _canvas_.core.arrangement.append(tmp);

var tmp = _canvas_.core.shape.create('path');
    tmp.name = 'path_1';
    tmp.points([
        150+0,  10+00,
        150+0,  10+60,
        150+30, 10+10,
        150+60, 10+60,
        150+60, 10+0,
    ]);
    tmp.colour = {r:Math.random(),g:Math.random(),b:Math.random(),a:1};
    _canvas_.core.arrangement.append(tmp);

var tmp = _canvas_.core.shape.create('loopedPath');
    tmp.name = 'loopedPath_1';
    tmp.points([
        150+0,  80+00,
        150+0,  80+60,
        150+30, 80+10,
        150+60, 80+60,
        150+60, 80+0,
    ]);
    tmp.thickness(5);
    tmp.colour = {r:Math.random(),g:Math.random(),b:Math.random(),a:1};
    _canvas_.core.arrangement.append(tmp);
    
var tmp = _canvas_.core.shape.create('circle');
    tmp.name = 'circle_1';
    tmp.x(250); tmp.y(40);
    tmp.radius(30)
    tmp.colour = {r:Math.random(),g:Math.random(),b:Math.random(),a:1};
    _canvas_.core.arrangement.append(tmp);

var tmp = _canvas_.core.shape.create('image');
    tmp.name = 'image_1';
    tmp.x(290); tmp.y(10);
    tmp.width(60);
    tmp.height(60);
    tmp.imageURL('http://0.0.0.0:8000/testImages/mikeandbrian.jpg');
    _canvas_.core.arrangement.append(tmp);

var tmp = _canvas_.core.shape.create('canvas');
    tmp.name = 'canvas_1';
    tmp.x(360); tmp.y(10);
    tmp.width(60);
    tmp.height(60);
    _canvas_.core.arrangement.append(tmp);
        tmp.resolution(5);
        tmp._.fillStyle = 'rgb(0,0,0)';
        tmp._.fillRect(tmp.$(5),tmp.$(5),tmp.$(160),tmp.$(160));
        tmp._.fillStyle = 'rgba(255,0,255,0.75)';
        tmp._.fillRect(tmp.$(0),tmp.$(0),tmp.$(20),tmp.$(20));