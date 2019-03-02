var dynamicGroup = _canvas_.core.shape.create('group');
    dynamicGroup.name = 'dynamicGroup';
    dynamicGroup.heedCamera = true;
    _canvas_.core.arrangement.append(dynamicGroup);

var tmp = _canvas_.core.shape.create('rectangle');
    tmp.name = 'rectangle_1';
    tmp.width(200);
    tmp.height(20);
    tmp.colour = {r:Math.random(),g:Math.random(),b:Math.random(),a:1};
    dynamicGroup.append(tmp);
var tmp = _canvas_.core.shape.create('circle');
    tmp.name = 'circle_1';
    tmp.x(100); tmp.y(100);
    tmp.radius(100);
    tmp.detail(5);
    tmp.colour = {r:Math.random(),g:Math.random(),b:Math.random(),a:1};
    dynamicGroup.append(tmp);
var tmp = _canvas_.core.shape.create('rectangle');
    tmp.name = 'rectangle_2';
    tmp.width(30);
    tmp.height(30);
    tmp.colour = {r:Math.random(),g:Math.random(),b:Math.random(),a:1};
    dynamicGroup.append(tmp);
var tmp = _canvas_.core.shape.create('rectangle');
    tmp.name = 'rectangle_3';
    tmp.x(30); tmp.y(30);
    tmp.width(30);
    tmp.height(30);
    tmp.colour = {r:Math.random(),g:Math.random(),b:Math.random(),a:1};
    dynamicGroup.append(tmp);
var tmp = _canvas_.core.shape.create('rectangle');
    tmp.name = 'rectangle_4';
    tmp.x(60); tmp.y(60);
    tmp.width(30);
    tmp.height(30);
    tmp.colour = {r:Math.random(),g:Math.random(),b:Math.random(),a:1};
dynamicGroup.append(tmp);
var tmp = _canvas_.core.shape.create('rectangle');
    tmp.name = 'rectangle_5';
    tmp.x(90); tmp.y(90);
    tmp.width(30);
    tmp.height(30);
    tmp.colour = {r:Math.random(),g:Math.random(),b:Math.random(),a:1};
    dynamicGroup.append(tmp);
var tmp = _canvas_.core.shape.create('rectangle');
    tmp.name = 'rectangle_6';
    tmp.x(120); tmp.y(120);
    tmp.width(30);
    tmp.height(30);
    tmp.colour = {r:Math.random(),g:Math.random(),b:Math.random(),a:1};
    dynamicGroup.append(tmp);





_canvas_.core.viewport.position(15,15);

var tick = 0;
var tickStep = 0.02/4;

setInterval(function(){
    var s_1 = ( 1 + Math.sin( Math.PI*tick ) );
    var s_2 = ( 1 + Math.sin( Math.PI*0.5 + Math.PI*tick ) );

    _canvas_.core.viewport.scale( 1 + (s_1-0.5) );
    _canvas_.core.viewport.position(s_1*50,s_1*250);
    _canvas_.core.viewport.angle(-s_1);

    tick+=tickStep;
},1000/40);
_canvas_.core.viewport.angle(-Math.PI/4);

_canvas_.core.render.active(true);
