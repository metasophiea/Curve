core.element.create('group','mainGroup').then( mainGroupId => {
    core.element.executeMethod(mainGroupId,'heedCamera',[true]);
    core.arrangement.append(mainGroupId);

    let randomRectangleCount = 5000;
    promiseArray = [];
    for(let a = 0; a < randomRectangleCount; a++){
        let tmp = core.element.create('rectangle','rect_'+a);
        promiseArray.push(tmp);
        tmp.then( rectangleId => {
            promiseArray.push( core.element.executeMethod(rectangleId,'unifiedAttribute',[
                {
                    x:800*Math.random(),
                    y:600*Math.random(),
                    width:Math.random()*50,
                    height:Math.random()*50,
                    anchor:{x:Math.random(),y:Math.random()},
                    angle:Math.PI*2*Math.random(),
                    colour:{r:Math.random(),g:Math.random(),b:Math.random(),a:1}
                }
            ]) );
            promiseArray.push( core.element.executeMethod(mainGroupId,'append',[rectangleId]) );
        });        
    }
    Promise.all(promiseArray).then( () => {core.render.frame();} );
});