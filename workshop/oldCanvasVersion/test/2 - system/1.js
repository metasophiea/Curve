var rect = workspace.core.arrangement.createElement('rectangle');
    rect.name = 'testRectangle1';
    rect.x = 0; rect.y = 0;
    rect.width = 30; rect.height = 30;
    rect.style.fill = 'rgba(0,255,0,0.3)';
    workspace.system.pane.mm.append(rect);
var rect = workspace.core.arrangement.createElement('rectangle');
    rect.name = 'testRectangle2';
    rect.x = 200; rect.y = 0;
    rect.width = 30; rect.height = 30;
    rect.angle = 0.2;
    rect.anchor = {x:0.5,y:0.5};
    rect.style.fill = 'rgba(0,255,0,0.3)';
    workspace.system.pane.mm.append(rect);

var img = workspace.core.arrangement.createElement('image');
    img.name = 'testImage1';
    img.x = 50; img.y = 10;
    img.width = 100; img.height = 100;
    img.angle = -0.2;
    img.url = 'https://t2.genius.com/unsafe/300x300/https%3A%2F%2Fimages.genius.com%2F72ee0b753f056baa410c17a6ad9fea70.588x588x1.jpg';
    workspace.system.pane.mm.append(img);

var g = workspace.core.arrangement.createElement('group');
    g.name = 'testGroup1';
    g.x = 50; g.y = 10;
    g.angle = 0.2;
    workspace.system.pane.mm.append(g);
var rect = workspace.core.arrangement.createElement('rectangle');
    rect.name = 'testRectangle1';
    rect.x = 0; rect.y = 0;
    rect.width = 30; rect.height = 30;
    rect.style.fill = 'rgba(0,255,0,0.9)';
    g.append(rect);
var rect = workspace.core.arrangement.createElement('rectangle');
    rect.name = 'testRectangle2';
    rect.x = 40; rect.y = 0;
    rect.width = 30; rect.height = 30;
    rect.style.fill = 'rgba(0,255,0,0.9)';
    g.append(rect);
var poly = workspace.core.arrangement.createElement('polygon');
    poly.name = 'testPolygon1';
    poly.points = [{x:0,y:0}, {x:50,y:0}, {x:50,y:50}, {x:40,y:50}, {x:40,y:20}, {x:20,y:20}, {x:20,y:50}, {x:0,y:50}];
    g.append(poly);

var circ = workspace.core.arrangement.createElement('circle');
    circ.name = 'testCircle1';
    circ.x = 100; circ.y = 30;
    circ.r = 15;
    workspace.system.pane.mm.append(circ);

var text = workspace.core.arrangement.createElement('text');
    text.name = 'testText1';
    text.x = 200; text.y = 50;
    text.angle = 0.4;
    workspace.system.pane.mm.append(text);


workspace.core.render.active(true);