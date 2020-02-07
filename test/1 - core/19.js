_canvas_.core.go.add( function(){

    const group = _canvas_.core.element.create('group','group');
    group.unifiedAttribute({ heedCamera:true });
    _canvas_.core.arrangement.append(group);

    const size = 10;
    const yCount = 75;
    const xCount = 75;

    for(let y = 0; y < yCount; y++){
        for(let x = 0; x < xCount; x++){



            
            // const tmp = _canvas_.core.element.create('rectangle','test_rectangle_'+y+'_'+x);
            // tmp.unifiedAttribute({ 
            //     x:10 + (size+1)*x, y:10 + (size+1)*y, width:size, height:size,
            // });
            // group.append(tmp);


            const tmp = _canvas_.core.element.create('image','test_image_'+y+'_'+x);
            tmp.unifiedAttribute({ 
                x:10 + (size+1)*x, y:10 + (size+1)*y, width:size, height:size, url:'/images/testImages/mikeandbrian.png',
            });
            group.append(tmp);



        }
    }

    // setTimeout(_canvas_.core.render.frame,100);
    // setTimeout(_canvas_.core.render.frame,1100);

    // _canvas_.core.render.activeLimitToFrameRate(true);
    // _canvas_.core.render.frameRateLimit(20);

    _canvas_.core.render.active(true);
    _canvas_.core.render.allowFrameSkipping(false);
    _canvas_.core.stats.active(true);
    setInterval(() => {
        _canvas_.core.stats.getReport().then(console.log)
    }, 500);
});