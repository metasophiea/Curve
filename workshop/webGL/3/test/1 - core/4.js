var group_1 = _canvas_.core.shape.create('group');
group_1.name = 'group_1';
group_1.x( _canvas_.core.render.getCanvasDimensions().width/2 );
group_1.y( _canvas_.core.render.getCanvasDimensions().height/2 );
_canvas_.core.arrangement.append(group_1);


var tmp = _canvas_.core.shape.create('circle');
    tmp.name = 'circle_1';
    tmp.x(0); tmp.y(0);
    tmp.radius(100);
    tmp.detail(5);
    tmp.colour = {r:Math.random(),g:Math.random(),b:Math.random(),a:1};
    group_1.append(tmp);


_canvas_.core.render.active(true);
// _canvas_.core.arrangement.get().scale = 1;

setInterval(function(){ group_1.angle( group_1.angle() + 0.025 ); },1000/40);