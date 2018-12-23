//rectangle clipping
    var group1 = canvas.core.arrangement.createElement('group');
        group1.name = 'rectangleClippingGroup';
        group1.x = 10; group1.y = 10;
        group1.width = 100; group1.height = 100;
        canvas.core.arrangement.append(group1);

    var rectangle1 = canvas.core.arrangement.createElement('rectangle');
        rectangle1.name = 'baseShape';
        rectangle1.width = 100; rectangle1.height = 100;
        group1.append(rectangle1);

    var rectangle2 = canvas.core.arrangement.createElement('rectangle');
        rectangle2.name = 'clipShape';
        rectangle2.x = 0; rectangle2.y = 0;
        rectangle2.width = 100; rectangle2.height = 100;
        group1.stencile(rectangle2);
        group1.clip(true);

    var rectangle3 = canvas.core.arrangement.createElement('rectangle');
        rectangle3.name = 'clippedShape';
        rectangle3.x = -20; rectangle3.y = -20;
        rectangle3.width = 50; rectangle3.height = 50;
        rectangle3.style.fill = 'rgba(255,0,0,1)';
        group1.append(rectangle3);

//circle clipping
    var group1 = canvas.core.arrangement.createElement('group');
        group1.name = 'circleClippingGroup';
        group1.x = 115; group1.y = 10;
        group1.width = 100; group1.height = 100;
        canvas.core.arrangement.append(group1);

    var rectangle1 = canvas.core.arrangement.createElement('rectangle');
        rectangle1.name = 'baseShape';
        rectangle1.width = 100; rectangle1.height = 100;
        group1.append(rectangle1);

    var circle1 = canvas.core.arrangement.createElement('circle');
        circle1.name = 'clipShape';
        circle1.x = 50; circle1.y = 50; circle1.r = 50;
        group1.stencile(circle1);
        group1.clip(true);

    var rectangle3 = canvas.core.arrangement.createElement('rectangle');
        rectangle3.name = 'clippedShape';
        rectangle3.x = -20; rectangle3.y = -20;
        rectangle3.width = 50; rectangle3.height = 50;
        rectangle3.style.fill = 'rgba(255,0,0,1)';
        group1.append(rectangle3);

//polygon clipping
    var group1 = canvas.core.arrangement.createElement('group');
    group1.name = 'polygonClippingGroup';
    group1.x = 200; group1.y = 10;
    group1.width = 100; group1.height = 100;
    canvas.core.arrangement.append(group1);

    var rectangle1 = canvas.core.arrangement.createElement('rectangle');
    rectangle1.name = 'baseShape';
    rectangle1.width = 100; rectangle1.height = 100;
    group1.append(rectangle1);

    var polygon1 = canvas.core.arrangement.createElement('polygon');
    polygon1.name = 'clipShape';
    polygon1.points = [{x:0,y:0}, {x:100,y:0}, {x:50,y:100}];
    group1.stencile(polygon1);
    group1.clip(true);

    var rectangle3 = canvas.core.arrangement.createElement('rectangle');
    rectangle3.name = 'clippedShape';
    rectangle3.x = -20; rectangle3.y = -20;
    rectangle3.width = 50; rectangle3.height = 50;
    rectangle3.style.fill = 'rgba(255,0,0,1)';
    group1.append(rectangle3);


canvas.core.render.frame();