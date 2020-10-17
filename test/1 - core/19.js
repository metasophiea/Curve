_canvas_.layers.registerFunctionForLayer("core", function(){

    const group = _canvas_.core.element.create('Group','group');
    group.unifiedAttribute({ heedCamera:true });
    _canvas_.core.arrangement.append(group);

    const size = 10;
    const yCount = 75;
    const xCount = 75;

    const items = [];

    for(let y = 0; y < yCount; y++){
        for(let x = 0; x < xCount; x++){

            // const test_rectangle = _canvas_.core.element.create('Rectangle','test_rectangle_'+y+'_'+x);
            // test_rectangle.unifiedAttribute({ 
            //     x:10 + (size+1)*x, y:10 + (size+1)*y, width:size, height:size,
            // });
            // group.append(test_rectangle);

            const test_image = _canvas_.core.element.create('Image','test_image_'+y+'_'+x);
            test_image.unifiedAttribute({ 
                x:10 + (size+1)*x, y:10 + (size+1)*y, width:size, height:size, url:'/images/testImages/mikeandbrian.png',
            });
            group.append(test_image);
            items.push(test_image);
        }
    }

    // setTimeout(_canvas_.core.render.frame,1000);
    // setTimeout(_canvas_.core.render.frame,2000);

    _canvas_.core.render.activeLimitToFrameRate(true);
    _canvas_.core.render.frameRateLimit(5);

    _canvas_.core.render.active(true);
    _canvas_.core.stats.active(true);
    setInterval(() => {
        _canvas_.core.stats.getReport().then(console.log)
    }, 500);


    setInterval(() => {
        items[0].angle( Math.random() );
    }, 100);

});