core.arrangement.getAvailableShapes().then(names => {
    console.log('');
    console.log('- get all available shapes');
    console.log(names);
});
core.arrangement.getAvailableShapes().then((names) => {
    Promise.all(names.map(name => core.arrangement.getProxyableMethodsForShape(name))).then(values => {
        console.log('');
        console.log('- get all methods for all available shapes');
        for(let a = 0; a < names.length; a++){
            console.log(names[a],values[a]);
        }
    });
});

Promise.all([
    core.arrangement.createShape('group'),
    core.arrangement.createShape('group'),
    core.arrangement.createShape('group'),
    core.arrangement.createShape('element'),
    core.arrangement.createShape('element'),
    core.arrangement.createShape('element'),
    core.arrangement.createShape('element'),
    core.arrangement.createShape('element'),
    core.arrangement.createShape('element'),
    core.arrangement.createShape('element'),
    core.arrangement.createShape('element'),
]).then(values => {
    Promise.all([
        core.arrangement.executeShapeMethod(0,'addChild',[1]),
        core.arrangement.executeShapeMethod(0,'addChild',[2]),
        core.arrangement.executeShapeMethod(1,'addChild',[3]),
        core.arrangement.executeShapeMethod(1,'addChild',[4]),
        core.arrangement.executeShapeMethod(1,'addChild',[5]),
        core.arrangement.executeShapeMethod(2,'addChild',[6]),
        core.arrangement.executeShapeMethod(2,'addChild',[7]),
        core.arrangement.executeShapeMethod(2,'addChild',[8]),
        core.arrangement.executeShapeMethod(2,'addChild',[9]),
        core.arrangement.executeShapeMethod(0,'addChild',[10]),
    ]).then( () => {
        core.arrangement.executeShapeMethod(0,'getChildren').then(result => {
            console.log('');
            console.log('- put together some shapes');
            console.log('-- shapes created');
            console.log('0 - group');
            console.log('1 - group');
            console.log('2 - group');
            console.log('3 - element');
            console.log('4 - element');
            console.log('5 - element');
            console.log('6 - element');
            console.log('7 - element');
            console.log('8 - element');
            console.log('9 - element');
            console.log('10 - element');
            console.log('--assembled shapes');
            console.log(JSON.stringify(result));
        })
    });
});