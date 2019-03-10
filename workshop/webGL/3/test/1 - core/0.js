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

var width = 30; var height = 30;
var characters = [
    {char:'A', x:10+width*0, y:150+height*0},
    {char:'B', x:10+width*1, y:150+height*0},
    {char:'C', x:10+width*2, y:150+height*0},
    {char:'D', x:10+width*3, y:150+height*0},
    {char:'E', x:10+width*4, y:150+height*0},
    {char:'F', x:10+width*5, y:150+height*0},
    {char:'G', x:10+width*6, y:150+height*0},
    {char:'H', x:10+width*7, y:150+height*0},
    {char:'I', x:10+width*0, y:150+height*1},
    {char:'J', x:10+width*1, y:150+height*1},
    {char:'K', x:10+width*2, y:150+height*1},
    {char:'L', x:10+width*3, y:150+height*1},
    {char:'M', x:10+width*4, y:150+height*1},
    {char:'N', x:10+width*5, y:150+height*1},
    {char:'O', x:10+width*6, y:150+height*1},
    {char:'P', x:10+width*7, y:150+height*1},
    {char:'Q', x:10+width*0, y:150+height*2},
    {char:'R', x:10+width*1, y:150+height*2},
    {char:'S', x:10+width*2, y:150+height*2},
    {char:'T', x:10+width*3, y:150+height*2},
    {char:'U', x:10+width*4, y:150+height*2},
    {char:'V', x:10+width*5, y:150+height*2},
    {char:'W', x:10+width*6, y:150+height*2},
    {char:'X', x:10+width*7, y:150+height*2},
    {char:'Y', x:10+width*0, y:150+height*3},
    {char:'Z', x:10+width*1, y:150+height*3},

    {char:'a', x:10+width*0, y:150+height*4},
    {char:'b', x:10+width*1, y:150+height*4},
    {char:'c', x:10+width*2, y:150+height*4},
    {char:'d', x:10+width*3, y:150+height*4},
    {char:'e', x:10+width*4, y:150+height*4},
    {char:'f', x:10+width*5, y:150+height*4},
    {char:'g', x:10+width*6, y:150+height*4},
    {char:'h', x:10+width*7, y:150+height*4},
    {char:'i', x:10+width*0, y:150+height*5},
    {char:'j', x:10+width*1, y:150+height*5},
    {char:'k', x:10+width*2, y:150+height*5},
    {char:'l', x:10+width*3, y:150+height*5},
    {char:'m', x:10+width*4, y:150+height*5},
    {char:'n', x:10+width*5, y:150+height*5},
    {char:'o', x:10+width*6, y:150+height*5},
    {char:'p', x:10+width*7, y:150+height*5},
    {char:'q', x:10+width*0, y:150+height*6},
    {char:'r', x:10+width*1, y:150+height*6},
    {char:'s', x:10+width*2, y:150+height*6},
    {char:'t', x:10+width*3, y:150+height*6},
    {char:'u', x:10+width*4, y:150+height*6},
    {char:'v', x:10+width*5, y:150+height*6},
    {char:'w', x:10+width*6, y:150+height*6},
    {char:'x', x:10+width*7, y:150+height*6},
    {char:'y', x:10+width*0, y:150+height*7},
    {char:'z', x:10+width*1, y:150+height*7},

    {char:'0', x:10+width*0, y:150+height*8},
    {char:'1', x:10+width*1, y:150+height*8},
    {char:'2', x:10+width*2, y:150+height*8},
    {char:'3', x:10+width*3, y:150+height*8},
    {char:'4', x:10+width*4, y:150+height*8},
    {char:'5', x:10+width*5, y:150+height*8},
    {char:'6', x:10+width*6, y:150+height*8},
    {char:'7', x:10+width*7, y:150+height*8},
    {char:'8', x:10+width*0, y:150+height*9},
    {char:'9', x:10+width*1, y:150+height*9},

    {char:'.',  x:10+width*0, y:150+height*10},
    {char:',',  x:10+width*1, y:150+height*10},
    {char:':',  x:10+width*2, y:150+height*10},
    {char:';',  x:10+width*3, y:150+height*10},
    {char:'?',  x:10+width*4, y:150+height*10},
    {char:'!',  x:10+width*5, y:150+height*10},
    {char:'/',  x:10+width*6, y:150+height*10},
    {char:'\\', x:10+width*7, y:150+height*10},
    {char:'(',  x:10+width*0, y:150+height*11},
    {char:')',  x:10+width*1, y:150+height*11},
    {char:'[',  x:10+width*2, y:150+height*11},
    {char:']',  x:10+width*3, y:150+height*11},
    {char:'#',  x:10+width*4, y:150+height*11},
    {char:'-',  x:10+width*5, y:150+height*11},
    {char:'_',  x:10+width*6, y:150+height*11},
    {char:'\'', x:10+width*7, y:150+height*11},
    {char:'"',  x:10+width*0, y:150+height*12},
    {char:'|',  x:10+width*1, y:150+height*12},
    {char:'>',  x:10+width*2, y:150+height*12},
    {char:'<',  x:10+width*3, y:150+height*12},
    {char:'+',  x:10+width*4, y:150+height*12},
    {char:'=',  x:10+width*5, y:150+height*12},
    {char:'&',  x:10+width*6, y:150+height*12},
    {char:'*',  x:10+width*7, y:150+height*12},
    {char:'~',  x:10+width*0, y:150+height*13},
    {char:'%',  x:10+width*1, y:150+height*13},

    {char:'unknownCharacter', x:10+width*0, y:150+height*14},
];
for(var a = 0; a < characters.length; a++){
    var tmp = _canvas_.core.shape.create('character');
        tmp.name = 'character_'+a;
        tmp.character(characters[a].char);
        tmp.x(characters[a].x + width*tmp.offset().x); 
        tmp.y(characters[a].y + height*tmp.offset().y);
        tmp.width(width*tmp.ratio().x);
        tmp.height(height*tmp.ratio().y);
        tmp.colour = {r:Math.random(),g:Math.random(),b:Math.random(),a:1};
        _canvas_.core.arrangement.append(tmp);
}

var tmp = _canvas_.core.shape.create('rectangle');
    tmp.name = 'characterString_1_backing';
    tmp.x(10); tmp.y(610);
    tmp.width(200);
    tmp.height(50);
    tmp.colour = {r:Math.random(),g:Math.random(),b:Math.random(),a:1};
    _canvas_.core.arrangement.append(tmp);
var tmp = _canvas_.core.shape.create('characterString');
    tmp.name = 'characterString_1';
    tmp.string('AaBbCcDdEe');
    tmp.x(10); tmp.y(610);
    tmp.width(200);
    tmp.height(50);
    tmp.colour({r:Math.random(),g:Math.random(),b:Math.random(),a:1});
    _canvas_.core.arrangement.append(tmp);
var tmp = _canvas_.core.shape.create('rectangle');
    tmp.name = 'characterString_2_backing';
    tmp.x(10); tmp.y(660);
    tmp.width(200);
    tmp.height(50);
    tmp.colour = {r:Math.random(),g:Math.random(),b:Math.random(),a:1};
    _canvas_.core.arrangement.append(tmp);
var tmp = _canvas_.core.shape.create('characterString');
    tmp.name = 'characterString_2';
    tmp.string('Oo');
    tmp.x(10); tmp.y(660);
    tmp.width(200);
    tmp.height(50);
    tmp.colour({r:Math.random(),g:Math.random(),b:Math.random(),a:1});
    _canvas_.core.arrangement.append(tmp);

var tmp = _canvas_.core.shape.create('rectangle');
    tmp.name = 'characterString_3_backing';
    tmp.x(10); tmp.y(710);
    tmp.width(200);
    tmp.height(50);
    tmp.colour = {r:Math.random(),g:Math.random(),b:Math.random(),a:1};
    _canvas_.core.arrangement.append(tmp);
var tmp = _canvas_.core.shape.create('characterString');
    tmp.name = 'characterString_3';
    tmp.calculationMode(1);
    tmp.string('io');
    tmp.x(10); tmp.y(710);
    tmp.width(200);
    tmp.height(50);
    tmp.colour({r:Math.random(),g:Math.random(),b:Math.random(),a:1});
    _canvas_.core.arrangement.append(tmp);

_canvas_.core.render.frame();