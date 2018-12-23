var canvas1 = workspace.core.arrangement.createElement('canvas');
canvas1.name = 'canvas1';
canvas1.x = 50; canvas1.y = 50;
canvas1.parameter.width(50); canvas1.parameter.height(50);
canvas1.dotFrame = true;
workspace.core.arrangement.append(canvas1);

canvas1._.fillStyle = 'rgb(255,0,0)';
canvas1._.fillRect(0,0,25,25);

workspace.core.render.active(true);








var canvas2 = workspace.core.arrangement.createElement('canvas');
canvas2.name = 'canvas2';
canvas2.x = 150; canvas2.y = 50;
canvas2.parameter.width(200); canvas2.parameter.height(200);
canvas2.dotFrame = true;
workspace.core.arrangement.append(canvas2);
canvas2.resolution(0.5);

canvas2._.fillStyle = 'rgb(255,255,255)';
canvas2._.fillRect(canvas2.$(5),canvas2.$(5),canvas2.$(20),canvas2.$(20));
canvas2._.fillRect(canvas2.$(175),canvas2.$(5),canvas2.$(20),canvas2.$(20));
canvas2._.fillRect(canvas2.$(175),canvas2.$(175),canvas2.$(20),canvas2.$(20));
canvas2._.fillRect(canvas2.$(5),canvas2.$(175),canvas2.$(20),canvas2.$(20));

var points = [
    {x:30,y:30},
    {x:170, y:30},
    {x:30, y:170},
    {x:170, y:170},
];

canvas2._.strokeStyle = 'rgb(255,255,255)';
canvas2._.lineWidth = canvas2.$(1);
canvas2._.beginPath(); 
canvas2._.moveTo(canvas2.$(points[0].x),canvas2.$(points[0].y));
for(var a = 1; a < points.length; a++){
    canvas2._.lineTo(canvas2.$(points[a].x),canvas2.$(points[a].y));
}
canvas2._.stroke();








var canvas3 = workspace.core.arrangement.createElement('canvas');
canvas3.name = 'canvas3';
canvas3.x = 360; canvas3.y = 50;
canvas3.parameter.width(200); canvas3.parameter.height(200);
canvas3.dotFrame = true;
workspace.core.arrangement.append(canvas3);
canvas3.resolution(2);

canvas3._.fillStyle = 'rgb(255,255,255)';
canvas3._.fillRect(canvas3.$(5),canvas3.$(5),canvas3.$(20),canvas3.$(20));
canvas3._.fillRect(canvas3.$(175),canvas3.$(5),canvas3.$(20),canvas3.$(20));
canvas3._.fillRect(canvas3.$(175),canvas3.$(175),canvas3.$(20),canvas3.$(20));
canvas3._.fillRect(canvas3.$(5),canvas3.$(175),canvas3.$(20),canvas3.$(20));

var points = [
    {x:30,y:30},
    {x:170, y:30},
    {x:30, y:170},
    {x:170, y:170},
];

canvas3._.strokeStyle = 'rgb(255,255,255)';
canvas3._.lineWidth = canvas3.$(1);
canvas3._.beginPath(); 
canvas3._.moveTo(canvas3.$(points[0].x),canvas3.$(points[0].y));
for(var a = 1; a < points.length; a++){
    canvas3._.lineTo(canvas3.$(points[a].x),canvas3.$(points[a].y));
}
canvas3._.stroke();
