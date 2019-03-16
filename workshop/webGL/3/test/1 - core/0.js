var tmp = _canvas_.core.shape.create('rectangle');
    tmp.name = 'rectangle_1';
    tmp.stopAttributeStartedExtremityUpdate = true;
    tmp.x(10); 
    tmp.y(10);
    tmp.width(60);
    tmp.height(60);
    tmp.stopAttributeStartedExtremityUpdate = false;
    tmp.colour = {r:Math.random(),g:Math.random(),b:Math.random(),a:1};
    _canvas_.core.arrangement.append(tmp);
    console.log('');

var tmp = _canvas_.core.shape.create('circle');
    tmp.name = 'circle_1';
    tmp.stopAttributeStartedExtremityUpdate = true;
    tmp.x(110);
    tmp.y(40);
    tmp.radius(30)
    tmp.stopAttributeStartedExtremityUpdate = false;
    tmp.colour = {r:Math.random(),g:Math.random(),b:Math.random(),a:1};
    _canvas_.core.arrangement.append(tmp);
    console.log('');

var tmp = _canvas_.core.shape.create('polygon');
    tmp.name = 'polygon_1';
    tmp.stopAttributeStartedExtremityUpdate = true;
    tmp.pointsAsXYArray([ {x:10,y:80}, {x:50,y:80}, {x:20,y:100}, {x:70,y:140}, {x:10,y:140} ]);
    tmp.stopAttributeStartedExtremityUpdate = false;
    tmp.colour = {r:Math.random(),g:Math.random(),b:Math.random(),a:0.5};
    _canvas_.core.arrangement.append(tmp);
    console.log('');

var tmp = _canvas_.core.shape.create('image');
    tmp.name = 'image_1';
    tmp.stopAttributeStartedExtremityUpdate = true;
    tmp.x(80);
    tmp.y(80);
    tmp.width(60);
    tmp.height(60);
    tmp.stopAttributeStartedExtremityUpdate = false;
    _canvas_.core.arrangement.append(tmp);
    console.log('');

var tmp = _canvas_.core.shape.create('canvas');
    tmp.name = 'canvas_1';
    tmp.stopAttributeStartedExtremityUpdate = true;
    tmp.x(160);
    tmp.y(10);
    tmp.width(60);
    tmp.height(60);
    tmp.stopAttributeStartedExtremityUpdate = false;
    _canvas_.core.arrangement.append(tmp);
        tmp.resolution(5);
        tmp._.fillStyle = 'rgb(100,100,100)';
        tmp._.fillRect(tmp.$(5),tmp.$(5),tmp.$(160),tmp.$(160));
        tmp._.fillStyle = 'rgba(255,0,255,0.5)';
        tmp._.fillRect(tmp.$(0),tmp.$(0),tmp.$(20),tmp.$(20));
        console.log('');

var tmp = _canvas_.core.shape.create('path');
    tmp.name = 'path_1';
    tmp.pointsAsXYArray([ {x:150,y:80}, {x:150,y:140}, {x:180,y:90}, {x:210,y:140}, {x:210,y:80} ]);
    tmp.colour = {r:Math.random(),g:Math.random(),b:Math.random(),a:1};
    _canvas_.core.arrangement.append(tmp);
    console.log('');

var tmp = _canvas_.core.shape.create('loopedPath');
    tmp.name = 'loopedPath_1';
    tmp.pointsAsXYArray([ {x:230,y:80}, {x:230,y:140}, {x:260,y:90}, {x:290,y:140}, {x:290,y:80} ]);
    tmp.colour = {r:Math.random(),g:Math.random(),b:Math.random(),a:1};
    _canvas_.core.arrangement.append(tmp);
    console.log('');

var tmp = _canvas_.core.shape.create('rectangleWithOutline');
    tmp.name = 'rectangleWithOutline_1';
    tmp.stopAttributeStartedExtremityUpdate = true;
    tmp.x(10);
    tmp.y(150);
    tmp.width(60);
    tmp.height(60);
    tmp.thickness(2.5);
    tmp.stopAttributeStartedExtremityUpdate = false;
    tmp.colour = {r:Math.random(),g:Math.random(),b:Math.random(),a:1};
    tmp.lineColour = {r:Math.random(),g:Math.random(),b:Math.random(),a:1};
    _canvas_.core.arrangement.append(tmp);
    console.log('');

var tmp = _canvas_.core.shape.create('polygonWithOutline');
    tmp.name = 'polygonWithOutline_1';
    tmp.stopAttributeStartedExtremityUpdate = true;
    tmp.pointsAsXYArray([ {x:80,y:150}, {x:110,y:150}, {x:110,y:170}, {x:140,y:210}, {x:80,y:210}, ]);
    tmp.thickness(2.5);
    tmp.stopAttributeStartedExtremityUpdate = false;
    tmp.colour = {r:Math.random(),g:Math.random(),b:Math.random(),a:0.5};
    tmp.lineColour = {r:Math.random(),g:Math.random(),b:Math.random(),a:1};
    _canvas_.core.arrangement.append(tmp);
    console.log('');

var tmp = _canvas_.core.shape.create('character');
    tmp.name = 'character_1';
    tmp.stopAttributeStartedExtremityUpdate = true;
    tmp.character('a');
    tmp.x(150); 
    tmp.y(150);
    tmp.width(60);
    tmp.height(60);
    tmp.stopAttributeStartedExtremityUpdate = false;
    tmp.colour = {r:Math.random(),g:Math.random(),b:Math.random(),a:1};
    _canvas_.core.arrangement.append(tmp);
    console.log('');

var tmp = _canvas_.core.shape.create('characterString');
    tmp.name = 'characterString_1';
    tmp.stopAttributeStartedExtremityUpdate = true;
    tmp.string('Hello!');
    tmp.x(220);
    tmp.y(150);
    tmp.width(200);
    tmp.height(60);
    tmp.stopAttributeStartedExtremityUpdate = true;
    tmp.colour({r:Math.random(),g:Math.random(),b:Math.random(),a:1});
    _canvas_.core.arrangement.append(tmp);

_canvas_.core.render.frame();