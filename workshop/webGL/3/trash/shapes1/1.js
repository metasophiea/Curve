var tmp = _canvas_.core.shape.create('image');
tmp.name = 'image_1';
tmp.x(160); tmp.y(0);
tmp.width(250);
tmp.height(250);
tmp.imageURL('http://0.0.0.0:8000/testImages/mikeandbrian.jpg');
_canvas_.core.arrangement.append(tmp);
var tmp = _canvas_.core.shape.create('image');
tmp.name = 'image_2';
tmp.x(-50); tmp.y(100);
tmp.width(160);
tmp.height(215);
tmp.angle(-0.5);
tmp.imageURL('http://0.0.0.0:8000/testImages/Dore-munchausen-illustration.jpg');
_canvas_.core.arrangement.append(tmp);

var tmp = _canvas_.core.shape.create('rectangle');
tmp.name = 'rectangle_1';
tmp.x(0); tmp.y(0);
tmp.width(30);
tmp.height(30);
tmp.colour = {r:Math.random(),g:Math.random(),b:Math.random(),a:1};
_canvas_.core.arrangement.append(tmp);

var tmp = _canvas_.core.shape.create('rectangle');
tmp.name = 'rectangle_2';
tmp.x(50); tmp.y(0);
tmp.width(30);
tmp.height(30);
tmp.colour = {r:Math.random(),g:Math.random(),b:Math.random(),a:1};
_canvas_.core.arrangement.append(tmp);

var tmp = _canvas_.core.shape.create('polygon');
tmp.name = 'polygon_1';
tmp.points([
    50,    50,
    50+30, 50,
    50+30, 50+30,
    50,    50+30,
]);
tmp.colour = {r:Math.random(),g:Math.random(),b:Math.random(),a:1};
_canvas_.core.arrangement.append(tmp);

var tmp = _canvas_.core.shape.create('rectangle');
tmp.name = 'rectangle_3';
tmp.x(0); tmp.y(50);
tmp.width(30);
tmp.height(30);
tmp.colour = {r:Math.random(),g:Math.random(),b:Math.random(),a:1};
_canvas_.core.arrangement.append(tmp);

var tmp = _canvas_.core.shape.create('rectangle');
tmp.name = 'rectangle_4';
tmp.x = _canvas_.core.render.getCanvasDimensions().width/2 - 15;
tmp.y = _canvas_.core.render.getCanvasDimensions().height/2 - 15;
tmp.width(30);
tmp.height(30);
tmp.colour = {r:Math.random(),g:Math.random(),b:Math.random(),a:1};
_canvas_.core.arrangement.append(tmp);

var tmp = _canvas_.core.shape.create('rectangle');
tmp.name = 'rectangle_5';
tmp.x(0); tmp.y(400);
tmp.width(500);
tmp.height(30);
tmp.colour = {r:Math.random(),g:Math.random(),b:Math.random(),a:1};
_canvas_.core.arrangement.append(tmp);

var tmp = _canvas_.core.shape.create('circle');
tmp.name = 'circle_1';
tmp.x(200); tmp.y(200);
tmp.radius(50)
tmp.colour = {r:Math.random(),g:Math.random(),b:Math.random(),a:1};
_canvas_.core.arrangement.append(tmp);

var tmp = _canvas_.core.shape.create('path');
tmp.name = 'path_1';
tmp.points([
    110, 150,
    100, 120,
    200, 100,
    250, 100,
    300, 100,
    275, 200,
    400, 100,
    500, 100,
    500, 200,
    400, 250,
]);
tmp.thickness(10);
tmp.colour = {r:Math.random(),g:Math.random(),b:Math.random(),a:1};
_canvas_.core.arrangement.append(tmp);





var group_1 = _canvas_.core.shape.create('group');
group_1.name = 'group_1';
group_1.x(100);
group_1.y(200);
group_1.angle(0);
_canvas_.core.arrangement.append(group_1);

var tmp = _canvas_.core.shape.create('rectangle');
tmp.name = 'rectangle_6';
tmp.x(30); tmp.y(30);
tmp.width(30);
tmp.height(30);
tmp.colour = {r:Math.random(),g:Math.random(),b:Math.random(),a:1};
group_1.append(tmp);

var tmp = _canvas_.core.shape.create('polygon');
tmp.name = 'polygon_2';
tmp.points([
    0,    0,
    0+30, 0,
    0,    0+30,
    0+30, 0+30,
    0+15, 0+40,
]);
tmp.colour = {r:Math.random(),g:Math.random(),b:Math.random(),a:1};
group_1.append(tmp);

var tick = 0;
var tickStep = 0.02;
setInterval(function(){
    var s_1 = ( 1 + Math.sin( Math.PI*tick ) );
    var s_2 = ( 1 + Math.sin( Math.PI*0.5 + Math.PI*tick ) );

    group_1.scale( 0.5 + (s_1+0.001)/2 );

    tick+=tickStep;
},1000/40);

setInterval(function(){
    group_1.angle( group_1.angle() + 0.05 );
},1000/40);







var tmp = _canvas_.core.shape.create('canvas');
tmp.name = 'canvas_1';
tmp.x(100); tmp.y(200);
tmp.width(200);
tmp.height(200);
_canvas_.core.arrangement.append(tmp);
    tmp.resolution(5);
    tmp._.fillStyle = 'rgb(0,0,0)';
    tmp._.fillRect(tmp.$(20),tmp.$(20),tmp.$(160),tmp.$(160));

    tmp._.fillStyle = 'rgba(255,0,255,0.75)';
    tmp._.fillRect(tmp.$(5),tmp.$(5),tmp.$(20),tmp.$(20));
    tmp._.fillRect(tmp.$(175),tmp.$(5),tmp.$(20),tmp.$(20));
    tmp._.fillRect(tmp.$(175),tmp.$(175),tmp.$(20),tmp.$(20));
    tmp._.fillRect(tmp.$(5),tmp.$(175),tmp.$(20),tmp.$(20));
    var points = [
        {x:30,y:30},
        {x:170, y:30},
        {x:30, y:170},
        {x:170, y:170},
    ];

    tmp._.strokeStyle = 'rgb(255,255,255)';
    tmp._.lineWidth = tmp.$(1);
    tmp._.beginPath(); 
    tmp._.moveTo(tmp.$(points[0].x),tmp.$(points[0].y));
    for(var a = 1; a < points.length; a++){
        tmp._.lineTo(tmp.$(points[a].x),tmp.$(points[a].y));
    }
    tmp._.stroke();



var group_2 = _canvas_.core.shape.create('group');
group_2.name = 'group_2';
group_2.x(300);
group_2.y(50);
group_2.angle(0);
group_2.clipActive(true);
_canvas_.core.arrangement.append(group_2);
var tmp = _canvas_.core.shape.create('rectangle');
tmp.name = 'rectangle_2';
tmp.x(30); tmp.y(15);
tmp.anchor({x:0.5,y:0.5});
tmp.angle(0.5);
tmp.width(30);
tmp.height(30);
tmp.colour = {r:Math.random(),g:Math.random(),b:Math.random(),a:1};
group_2.stencil(tmp);
var tmp = _canvas_.core.shape.create('rectangle');
tmp.name = 'rectangle_1';
tmp.x(0); tmp.y(0);
tmp.width(30);
tmp.height(30);
tmp.colour = {r:Math.random(),g:Math.random(),b:Math.random(),a:1};
group_2.append(tmp);
var tmp = _canvas_.core.shape.create('rectangle');
tmp.name = 'rectangle_2';
tmp.x(30); tmp.y(0);
tmp.width(30);
tmp.height(30);
tmp.colour = {r:Math.random(),g:Math.random(),b:Math.random(),a:1};
group_2.append(tmp);
var tmp = _canvas_.core.shape.create('rectangle');
tmp.name = 'rectangle_3';
tmp.x(-30); tmp.y(0);
tmp.width(30);
tmp.height(30);
tmp.colour = {r:Math.random(),g:Math.random(),b:Math.random(),a:1};
group_2.append(tmp);






// _canvas_.core.render.frame(); 
//setTimeout(function(){core.render.frame();},1);
// core.render.drawDot(100,100);

_canvas_.core.render.active(true);
// _canvas_.core.stats.active(true);
// setInterval(function(){console.log(core.stats.getReport());},1000);