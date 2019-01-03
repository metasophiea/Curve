// var rect1 = workspace.core.arrangement.createElement('rectangle');
//     rect1.name = 'rectangle1';
//     rect1.x = 10; rect1.y = 10;
//     rect1.width = 30; rect1.height = 30;
//     rect1.angle = 0;
//     workspace.core.arrangement.append(rect1);


// var grou1 = workspace.core.arrangement.createElement('group');
//     grou1.name = 'group1';
//     grou1.x = 100; grou1.y = 50;
//     grou1.angle = 0.3;
//     workspace.core.arrangement.append(grou1);
// var rect1 = workspace.core.arrangement.createElement('rectangle');
//     rect1.name = 'rectangle1';
//     rect1.x = 0; rect1.y = 0;
//     rect1.width = 30; rect1.height = 30;
//     grou1.append(rect1);
// var rect2 = workspace.core.arrangement.createElement('rectangle');
//     rect2.name = 'rectangle2';
//     rect2.x = 60; rect2.y = 0;
//     rect2.width = 30; rect2.height = 30;
//     rect2.angle = -0.3;
//     grou1.append(rect2);




// var grou2 = workspace.core.arrangement.createElement('group');
//     grou2.name = 'group2';
//     grou2.x = 300; grou2.y = 50;
//     grou2.angle = -Math.PI/2;
//     workspace.core.arrangement.append(grou2);
// var rect1 = workspace.core.arrangement.createElement('rectangle');
//     rect1.name = 'rectangle1';
//     rect1.x = 0; rect1.y = 0;
//     rect1.width = 30; rect1.height = 90;
//     rect1.dotFrame = true;
//     grou2.append(rect1);
// var grou3 = workspace.core.arrangement.createElement('group');
//     grou3.name = 'group3';
//     grou3.x = 0; grou3.y = 0;
//     grou2.append(grou3);
// var rect2 = workspace.core.arrangement.createElement('rectangle');
//     rect2.name = 'rectangle2';
//     rect2.x = 7.5; rect2.y = 7.5;
//     rect2.width = 15; rect2.height = 82.5;
//     rect2.style.fill = 'rgb(0,0,255)';
//     rect2.dotFrame = true;
//     grou3.append(rect2);






var group1 = workspace.core.arrangement.createElement('group');
    group1.name = 'group3';
    group1.x = 0; group1.y = 50;
    workspace.core.arrangement.append(group1);

var group2 = workspace.core.arrangement.createElement('group');
    group2.name = 'group4';
    group2.x = 10; group2.y = 10;
    group2.angle = -Math.PI/3;
    group1.append(group2);

var group3 = workspace.core.arrangement.createElement('group');
    group3.name = 'group5';
    group3.x = 10; group3.y = 10;
    group2.append(group3);

var rect2 = workspace.core.arrangement.createElement('rectangle');
    rect2.name = 'rectangle2';
    rect2.x = 0; rect2.y = 0;
    rect2.width = 20; rect2.height = 100;
    rect2.style.fill = 'rgb(0,0,255)';
    rect2.dotFrame = true;
    group2.append(rect2);








// workspace.core.render.active(true);
workspace.core.render.frame();