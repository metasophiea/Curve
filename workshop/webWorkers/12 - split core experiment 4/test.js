setTimeout(() => {
    console.log('- create rectangle and set its attributes');
    core.shape.createShape('rectangle','rect_1').then(shapeId => {
        core.shape.executeShapeMethod(shapeId,"unifiedAttribute",[{x:10,y:10,width:30,height:30}]);
    });
},100);

setTimeout(() => {
    console.log('');
    console.log('- append rectangle to scene');
    core.arrangement.append(0);
},200);

setTimeout(() => {
    console.log('');
    console.log('- render frame');
    core.render.frame();
},300);

setTimeout(() => {
    console.log('');
    console.log('- get elements under point');
    core.arrangement.getElementsUnderPoint(15,15).then(console.log)
},400);

setTimeout(() => {
    console.log('- create another rectangle, set its attributes and append to scene');
    core.shape.createShape('rectangle','rect_2').then(shapeId => {
        core.shape.executeShapeMethod(shapeId,"unifiedAttribute",[{x:25,y:25,width:30,height:30,colour:{r:0,g:1,b:0,a:1}}]).then(() => {
            core.arrangement.append(shapeId);
        });
    });
},500);

setTimeout(() => {
    console.log('');
    console.log('- render frame');
    core.render.frame();
},600);

setTimeout(() => {
    console.log('');
    console.log('- print tree');
    core.arrangement.printTree('address');
},700);

setTimeout(() => {
    console.log('');
    console.log('- get element\'s address');
    core.shape.executeShapeMethod(0,'getAddress').then(console.log);
},800);

setTimeout(() => {
    console.log('');
    console.log('- get element by address');
    core.arrangement.getElementByAddress('/root/rect_1').then(console.log);
},900);