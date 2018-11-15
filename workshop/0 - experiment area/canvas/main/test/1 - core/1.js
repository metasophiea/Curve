var grou1 = canvas.core.arrangement.createElement('group');
    grou1.name = 'testGroup1';
    grou1.x = 50; grou1.y = 50;
    grou1.angle = 0.3;
    canvas.core.arrangement.append(grou1);

var rect = canvas.core.arrangement.createElement('rectangle');
    rect.name = 'testRectangle1';
    rect.x = 0; rect.y = 0;
    rect.width = 30; rect.height = 30;
    rect.style.fill = 'rgba(0,255,0,0.3)';
    grou1.children.push(rect);
    rect.parent = grou1;
    canvas.core.arrangement.forceRefresh(rect);

var rect = canvas.core.arrangement.createElement('rectangle');
    rect.name = 'testRectangle2';
    rect.x = 30; rect.y = 30;
    rect.width = 30; rect.height = 30;
    rect.style.fill = 'rgba(0,255,0,0.3)';
    grou1.children.push(rect);
    rect.parent = grou1;
    canvas.core.arrangement.forceRefresh(rect);

var rect = canvas.core.arrangement.createElement('rectangle');
    rect.name = 'testRectangle2';
    rect.x = 10; rect.y = 100;
    rect.width = 30; rect.height = 30;
    rect.style.fill = 'rgba(255,0,0,0.4)';
    grou1.children.push(rect);
    rect.parent = grou1;
    canvas.core.arrangement.forceRefresh(rect);
var text = canvas.core.arrangement.createElement('text');
    text.name = 'testText1';
    text.x = 10; text.y = 100;
    grou1.children.push(text);
    text.parent = grou1;
    canvas.core.arrangement.forceRefresh(text);


canvas.core.render.frame();