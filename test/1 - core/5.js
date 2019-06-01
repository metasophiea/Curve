var dynamicGroup = _canvas_.core.shape.create('group');
dynamicGroup.name = 'dynamicGroup';
dynamicGroup.heedCamera = true;
_canvas_.core.arrangement.append(dynamicGroup);

    var tmp = _canvas_.core.shape.create('rectangle');
    tmp.name = 'topLeft';
    tmp.x(0); tmp.y(0); tmp.width(30); tmp.height(30);
    tmp.colour = {r:Math.random(),g:Math.random(),b:Math.random(),a:1};
    tmp.onmousemove = function(x,y,event,shapes){console.log('rectangle::topLeft::onmousemove');};
    dynamicGroup.append(tmp);

    var tmp = _canvas_.core.shape.create('rectangle');
    tmp.name = 'topRight';
    tmp.x(470); tmp.y(0); tmp.width(30); tmp.height(30);
    tmp.colour = {r:Math.random(),g:Math.random(),b:Math.random(),a:1};
    dynamicGroup.append(tmp);

    var tmp = _canvas_.core.shape.create('rectangle');
    tmp.name = 'bottomRight';
    tmp.x(470); tmp.y(470); tmp.width(30); tmp.height(30);
    tmp.colour = {r:Math.random(),g:Math.random(),b:Math.random(),a:1};
    dynamicGroup.append(tmp);

    var tmp = _canvas_.core.shape.create('rectangle');
    tmp.name = 'bottomLeft';
    tmp.x(0); tmp.y(470); tmp.width(30); tmp.height(30);
    tmp.colour = {r:Math.random(),g:Math.random(),b:Math.random(),a:1};
    dynamicGroup.append(tmp);
    
    var tmp = _canvas_.core.shape.create('rectangle');
    tmp.name = 'centre';
    tmp.x(30); tmp.y(30); tmp.width(440); tmp.height(440);
    tmp.colour = {r:Math.random(),g:Math.random(),b:Math.random(),a:1};
    tmp.onmousedown = function(x,y,event){console.log('rectangle::centre::onmousedown');};
    tmp.onmouseup = function(x,y,event){console.log('rectangle::centre::onmouseup');};
    tmp.onmousemove = function(x,y,event){console.log('rectangle::centre::onmousemove');};
    tmp.onmouseenter = function(x,y,event){console.log('rectangle::centre::onmouseenter');};
    tmp.onmouseleave = function(x,y,event){console.log('rectangle::centre::onmouseleave');};
    tmp.onwheel = function(x,y,event){console.log('rectangle::centre::onwheel');};
    tmp.onclick = function(x,y,event){console.log('rectangle::centre::onclick');};
    tmp.ondblclick = function(x,y,event){console.log('rectangle::centre::ondblclick');};
    tmp.onkeydown = function(x,y,event){console.log('rectangle::centre::onkeydown');};
    tmp.onkeyup = function(x,y,event){console.log('rectangle::centre::onkeyup');};
    dynamicGroup.append(tmp);

var staticGroup = _canvas_.core.shape.create('group');
staticGroup.name = 'staticGroup';
staticGroup.x(100);
staticGroup.y(200);
staticGroup.angle(0);
_canvas_.core.arrangement.append(staticGroup);

    var tmp = _canvas_.core.shape.create('circle');
    tmp.name = 'circle_1';
    tmp.x(150); tmp.y(150);
    tmp.radius(50)
    tmp.colour = {r:Math.random(),g:Math.random(),b:Math.random(),a:0.5};
    staticGroup.append(tmp);

    var tmp = _canvas_.core.shape.create('circle');
        tmp.name = 'circle_2';
        tmp.x(90); tmp.y(90);
        tmp.angle(Math.PI/2);
        tmp.radius(50);
        tmp.detail(6);
        tmp.colour = {r:Math.random(),g:Math.random(),b:Math.random(),a:0.5};
        tmp.onmousedown = function(x,y,event,shapes){console.log('polygon::polygon_1::onmousedown');};
        staticGroup.append(tmp);



// console.log( tmp.getAddress() );

// _canvas_.core.viewport.position(100,100);
// _canvas_.core.viewport.angle( Math.PI/3 );
// _canvas_.core.viewport.scale(1/2);


// console.log( _canvas_.core.arrangement.getElementUnderPoint(70,70) );
// console.log( _canvas_.core.arrangement.getElementsUnderArea([{x:0,y:0},{x:60,y:0},{x:0,y:60}]) );
// console.log( _canvas_.core.viewport.getElementUnderCanvasPoint(70,70) );
// console.log( _canvas_.core.viewport.getElementsUnderCanvasArea([{x:0,y:0},{x:60,y:0},{x:0,y:60}]) );



// document.getElementById("canvas").onmousedown = function(event){
//     console.log( _canvas_.core.arrangement.getElementUnderPoint(event.X,event.Y) );
// }

_canvas_.core.callback.functions.onmousedown   = function(x,y,event,shapes){ console.log('core.callback.functions.onmousedown',x,y,event,shapes); };
_canvas_.core.callback.functions.onmouseup     = function(x,y,event,shapes){ console.log('core.callback.functions.onmouseup',x,y,event,shapes); };
_canvas_.core.callback.functions.onmousemove   = function(x,y,event,shapes){ console.log('core.callback.functions.onmousemove',x,y,event,shapes); };
_canvas_.core.callback.functions.onmouseenter  = function(x,y,event,shapes){ console.log('core.callback.functions.onmouseenter',x,y,event,shapes); };
_canvas_.core.callback.functions.onmouseleave  = function(x,y,event,shapes){ console.log('core.callback.functions.onmouseleave',x,y,event,shapes); };
_canvas_.core.callback.functions.onwheel       = function(x,y,event,shapes){ console.log('core.callback.functions.onwheel',x,y,event,shapes); };
_canvas_.core.callback.functions.onclick       = function(x,y,event,shapes){ console.log('core.callback.functions.onclick',x,y,event,shapes); };
_canvas_.core.callback.functions.ondblclick    = function(x,y,event,shapes){ console.log('core.callback.functions.ondblclick',x,y,event,shapes); };
_canvas_.core.callback.functions.onkeydown     = function(x,y,event,shapes){ console.log('core.callback.functions.onkeydown',x,y,event,shapes); };
_canvas_.core.callback.functions.onkeyup       = function(x,y,event,shapes){ console.log('core.callback.functions.onkeyup',x,y,event,shapes); };

_canvas_.core.callback.disactivateAllShapeCallbacks();


_canvas_.core.render.frame();
// this.render.active(true);