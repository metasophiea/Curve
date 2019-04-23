var group1 = workspace.core.arrangement.createElement('group');
    group1.name = 'root';
    group1.x = 100;
    workspace.core.arrangement.append(group1);

var group2 = workspace.core.arrangement.createElement('group');
    group2.name = 'pane';
    group1.append(group2);
    
var group3 = workspace.core.arrangement.createElement('group');
    group3.name = 'subPane';
    group2.append(group3);

var group4 = workspace.core.arrangement.createElement('group');
    group4.name = 'objectGroup';
    group4.x = 10; group4.y = 120;
    group3.append(group4);

var group5 = workspace.core.arrangement.createElement('group');
    group5.name = 'objectSubGroup';
    group5.angle = -0.3;
    group4.append(group5);

var group6 = workspace.core.arrangement.createElement('group');
    group6.name = 'partGroup';
    group6.x = 100;
    group5.append(group6);

var group7 = workspace.core.arrangement.createElement('group');
    group7.name = 'shapeGroup';
    group7.dotFrame = true;
    group6.append(group7);

var rectangle1 = workspace.core.arrangement.createElement('rectangle');
    rectangle1.name = 'baseShape';
    rectangle1.width = 10; rectangle1.height = 95;
    group7.append(rectangle1);
var circle1 = workspace.core.arrangement.createElement('circle');
    circle1.name = 'circle1';
    circle1.r = 20;
    circle1.x = 100; circle1.y = 0;
    circle1.dotFrame = true;
    group7.append(circle1);





workspace.core.render.frame();