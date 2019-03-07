// _canvas_.core.render.active(true);

var tmp = _canvas_.core.shape.create('rectangle');
    tmp.name = 'rectangle_1';
    tmp.x(10); tmp.y(10);
    tmp.width(60);
    tmp.height(60);
    tmp.colour = {r:Math.random(),g:Math.random(),b:Math.random(),a:1};
    _canvas_.core.arrangement.append(tmp);

var tmp = _canvas_.core.shape.create('rectangleWithOutline');
    tmp.name = 'rectangleWithOutline_1';
    tmp.x(10); tmp.y(80);
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

var characters = [
    {char:'A', x:10+60*0, y:150+60*0},
    {char:'B', x:10+60*1, y:150+60*0},
    {char:'C', x:10+60*2, y:150+60*0},
    {char:'D', x:10+60*3, y:150+60*0},
    {char:'E', x:10+60*4, y:150+60*0},
    {char:'F', x:10+60*5, y:150+60*0},
    {char:'G', x:10+60*6, y:150+60*0},
    {char:'H', x:10+60*7, y:150+60*0},
    {char:'I', x:10+60*0, y:150+60*1},
    {char:'J', x:10+60*1, y:150+60*1},
    {char:'K', x:10+60*2, y:150+60*1},
    {char:'L', x:10+60*3, y:150+60*1},
    {char:'M', x:10+60*4, y:150+60*1},
    {char:'N', x:10+60*5, y:150+60*1},
    {char:'O', x:10+60*6, y:150+60*1},
    {char:'P', x:10+60*7, y:150+60*1},
    {char:'Q', x:10+60*0, y:150+60*2},
    {char:'R', x:10+60*1, y:150+60*2},
    {char:'S', x:10+60*2, y:150+60*2},
    // {char:'T', x:10+60*3, y:150+60*2},
    // {char:'U', x:10+60*4, y:150+60*2},
    // {char:'V', x:10+60*5, y:150+60*2},
    // {char:'W', x:10+60*6, y:150+60*2},
    // {char:'H', x:10+60*7, y:150+60*2},
    // {char:'Y', x:10+60*0, y:150+60*3},
    // {char:'Z', x:10+60*1, y:150+60*3},
];
for(var a = 0; a < characters.length; a++){
    var tmp = _canvas_.core.shape.create('character');
        tmp.name = 'character_'+a;
        tmp.x(characters[a].x); tmp.y(characters[a].y);
        tmp.width(60);
        tmp.height(60);
        tmp.colour = {r:Math.random(),g:Math.random(),b:Math.random(),a:1};
        tmp.character(characters[a].char);
        _canvas_.core.arrangement.append(tmp);
}


_canvas_.core.render.frame();