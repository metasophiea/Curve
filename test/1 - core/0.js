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

var tmp = _canvas_.core.shape.create('circleWithOutline');
    tmp.name = 'circleWithOutline_1';
    tmp.stopAttributeStartedExtremityUpdate = true;
    tmp.x(260);
    tmp.y(40);
    tmp.radius(30);
    tmp.thickness(8);
    tmp.stopAttributeStartedExtremityUpdate = false;
    tmp.colour = {r:Math.random(),g:Math.random(),b:Math.random(),a:1};
    tmp.lineColour = {r:Math.random(),g:Math.random(),b:Math.random(),a:1};
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
    tmp.pointsAsXYArray([ {x:50,y:300}, {x:50,y:400}, {x:600,y:400}, {x:600,y:50}, {x:50,y:50}, {x:300,y:600}, {x:500,y:600}, {x:500,y:300} ].reverse().map(a => ({x:150+a.x/10,y:80+a.y/10})));
    // tmp.pointsAsXYArray([ {x:250,y:600}, {x:250,y:100}, {x:500,y:100}, {x:50,y:400}]);
    // tmp.pointsAsXYArray(
    //     (function(){
    //         var count = 100/4;
    //         var outputArray = [];
    //         for(var a = 0; a < count; a++){ outputArray.push({x:Math.sin(Math.PI * a/count)*500 ,y:Math.cos(Math.PI * a/count)*500}); }
    //         return outputArray;
    //     })()
    // );
    tmp.thickness(8);
    tmp.colour = {r:Math.random(),g:Math.random(),b:Math.random(),a:0.5};
    _canvas_.core.arrangement.append(tmp);
    console.log('');

var tmp = _canvas_.core.shape.create('path');
    tmp.name = 'path_2';
    tmp.pointsAsXYArray([ {x:230,y:80}, {x:230,y:140}, {x:260,y:90}, {x:290,y:140}, {x:290,y:80} ]);
    tmp.thickness(8);
    tmp.capType('round');
    tmp.jointType('round');
    tmp.colour = {r:Math.random(),g:Math.random(),b:Math.random(),a:0.5};
    _canvas_.core.arrangement.append(tmp);
    console.log('');

var tmp = _canvas_.core.shape.create('path');
    tmp.name = 'path_3';
    tmp.pointsAsXYArray([ {x:150,y:160}, {x:210,y:160}, {x:150,y:160}, ]);
    tmp.thickness(8);
    tmp.colour = {r:Math.random(),g:Math.random(),b:Math.random(),a:1};
    _canvas_.core.arrangement.append(tmp);
    console.log('');

var tmp = _canvas_.core.shape.create('path');
    tmp.name = 'path_4';
    tmp.pointsAsXYArray([ {x:150,y:180}, {x:210,y:180}, {x:250,y:180.1}, {x:190,y:180.1} ]);
    tmp.thickness(8);
    tmp.colour = {r:Math.random(),g:Math.random(),b:Math.random(),a:1};
    _canvas_.core.arrangement.append(tmp);
    console.log('');

var tmp = _canvas_.core.shape.create('path');
    tmp.name = 'path_5';
    tmp.pointsAsXYArray([ {x:150,y:200}, {x:210,y:200}, {x:150,y:210}, ]);
    tmp.thickness(8);
    tmp.capType('round');
    tmp.jointType('round');
    tmp.colour = {r:Math.random(),g:Math.random(),b:Math.random(),a:1};
    _canvas_.core.arrangement.append(tmp);
    console.log('');

var tmp = _canvas_.core.shape.create('path');
    tmp.name = 'path_6';
    tmp.pointsAsXYArray([ {x:150,y:220}, {x:210,y:220}, {x:150,y:220}, ]);
    tmp.thickness(8);
    tmp.capType('round');
    tmp.jointType('round');
    // tmp.pointsAsXYArray([ {x:50,y:50}, {x:600,y:50}, {x:200,y:75} ]);
    // tmp.thickness(80);
    tmp.colour = {r:Math.random(),g:Math.random(),b:Math.random(),a:0.5};
    _canvas_.core.arrangement.append(tmp);
    console.log('');

var tmp = _canvas_.core.shape.create('path');
    tmp.name = 'loopedPath_1';
    tmp.pointsAsXYArray([ {x:310,y:80}, {x:310,y:140}, {x:340,y:90}, {x:370,y:140}, {x:370,y:80} ]);
    tmp.thickness(8);
    tmp.looping(true);
    tmp.sharpLimit(8*4);
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
    tmp.thickness(8);
    tmp.stopAttributeStartedExtremityUpdate = false;
    tmp.colour = {r:Math.random(),g:Math.random(),b:Math.random(),a:1};
    tmp.lineColour = {r:Math.random(),g:Math.random(),b:Math.random(),a:1};
    _canvas_.core.arrangement.append(tmp);
    console.log('');

var tmp = _canvas_.core.shape.create('polygonWithOutline');
    tmp.name = 'polygonWithOutline_1';
    tmp.stopAttributeStartedExtremityUpdate = true;
    tmp.pointsAsXYArray([ {x:80,y:150}, {x:110,y:150}, {x:110,y:170}, {x:140,y:210}, {x:80,y:210}, ]);
    tmp.thickness(8);
    tmp.stopAttributeStartedExtremityUpdate = false;
    tmp.colour = {r:Math.random(),g:Math.random(),b:Math.random(),a:1};
    tmp.lineColour = {r:Math.random(),g:Math.random(),b:Math.random(),a:1};
    _canvas_.core.arrangement.append(tmp);
    console.log('');

var tmp = _canvas_.core.shape.create('character');
    tmp.name = 'character_1';
    tmp.stopAttributeStartedExtremityUpdate = true;
    tmp.character('a');
    tmp.x(400); 
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
    tmp.x(460);
    tmp.y(150);
    tmp.width(60);
    tmp.height(60);
    tmp.stopAttributeStartedExtremityUpdate = false;
    tmp.colour({r:Math.random(),g:Math.random(),b:Math.random(),a:1});
    _canvas_.core.arrangement.append(tmp);
    console.log('');

var clippingGroup_1 = _canvas_.core.shape.create('group');
    clippingGroup_1.name = 'clippingGroup_1';
    clippingGroup_1.stopAttributeStartedExtremityUpdate = true;
    clippingGroup_1.x(220);
    clippingGroup_1.y(220);
    clippingGroup_1.stopAttributeStartedExtremityUpdate = false;
    clippingGroup_1.clipActive(true);
    _canvas_.core.arrangement.append(clippingGroup_1);

    var tmp = _canvas_.core.shape.create('rectangle');
    tmp.name = 'stencil';
    tmp.stopAttributeStartedExtremityUpdate = true;
    tmp.width(100);
    tmp.height(100);
    tmp.stopAttributeStartedExtremityUpdate = false;
    clippingGroup_1.stencil(tmp);

    var tmp = _canvas_.core.shape.create('rectangle');
    tmp.name = 'clippingGroup_1::rectangle_1';
    tmp.stopAttributeStartedExtremityUpdate = true;
    tmp.width(1000);
    tmp.height(1000);
    tmp.stopAttributeStartedExtremityUpdate = false;
    tmp.colour = {r:Math.random(),g:Math.random(),b:Math.random(),a:1};
    clippingGroup_1.append(tmp);

var clippingGroup_2 = _canvas_.core.shape.create('group');
    clippingGroup_2.name = 'clippingGroup_2';
    clippingGroup_2.stopAttributeStartedExtremityUpdate = true;
    clippingGroup_2.x(320);
    clippingGroup_2.y(220);
    clippingGroup_2.stopAttributeStartedExtremityUpdate = false;
    clippingGroup_2.clipActive(true);
    _canvas_.core.arrangement.append(clippingGroup_2);

    var tmp = _canvas_.core.shape.create('rectangle');
    tmp.name = 'stencil';
    tmp.stopAttributeStartedExtremityUpdate = true;
    tmp.width(100);
    tmp.height(100);
    tmp.stopAttributeStartedExtremityUpdate = false;
    clippingGroup_2.stencil(tmp);

    var tmp = _canvas_.core.shape.create('rectangle');
    tmp.name = 'clippingGroup_2::rectangle_1';
    tmp.stopAttributeStartedExtremityUpdate = true;
    tmp.x(-500);
    tmp.y(-500);
    tmp.width(1000);
    tmp.height(1000);
    tmp.stopAttributeStartedExtremityUpdate = false;
    tmp.colour = {r:Math.random(),g:Math.random(),b:Math.random(),a:1};
    clippingGroup_2.append(tmp);


_canvas_.core.render.frame();
setTimeout(_canvas_.core.render.frame,1000);