_canvas_.layers.registerFunctionForLayer("core", function(){

    // const group_1 = _canvas_.core.element.create('Group','group_1');
    // const group_2 = _canvas_.core.element.create('Group','group_2');
    // const group_3 = _canvas_.core.element.create('Group','group_3');
    // _canvas_.core.arrangement.append(group_1);
    // _canvas_.core.arrangement.append(group_2);
    // _canvas_.core.arrangement.append(group_3);
    // group_2.framebufferActive(true);

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
            // items.push(test_rectangle);

            const test_image = _canvas_.core.element.create('Image','test_image_'+y+'_'+x);
            test_image.unifiedAttribute({ 
                // x:(size+1)*x + 10,
                // y:(size+1)*y + 10,
                x:(size+1)*x - 100,
                y:(size+1)*y - 100,
                width:size, 
                height:size, 
                url:'/images/testImages/mikeandbrian.png',
            });
            _canvas_.core.arrangement.append(test_image);
            // switch(x%3){
            //     case 0: group_1.append(test_image); break;
            //     case 1: group_2.append(test_image); break;
            //     case 2: group_3.append(test_image); break;
            // }
            items.push(test_image);

        }
    }

    _canvas_.core.render.activeLimitToFrameRate(true);
    _canvas_.core.render.frameRateLimit(5);
    _canvas_.core.render.active(true);
    _canvas_.core.stats.active(true);
    setInterval(() => {
        _canvas_.core.stats.getReport().then(console.log)
    }, 1000/2);
    setTimeout(() => {
        console.log("stopping render");
        _canvas_.core.render.active(false);
    }, 10000);


    setInterval(() => {
        items[0].angle( Math.random() );
        // items[4000].angle( Math.random() );
        // items[1].angle( Math.random() );
        // items[2].angle( Math.random() );
    }, 1000/10);
});




// _canvas_.layers.registerFunctionForLayer("core", function(){
//     group_1 = _canvas_.core.element.create('Group','group_1');
//     _canvas_.core.arrangement.append(group_1);
//     group_2 = _canvas_.core.element.create('Group','group_2');
//     group_2.unifiedAttribute({ x:0, y:-100 });
//     _canvas_.core.arrangement.append(group_2);
//     group_3 = _canvas_.core.element.create('Group','group_3');
//     group_3.unifiedAttribute({ x:100, y:0, heedCamera:true, heedCameraActive:true });
//     _canvas_.core.arrangement.append(group_3);

//     const rectangle_1 = _canvas_.core.element.create('Rectangle','rectangle_1');
//     rectangle_1.unifiedAttribute({ x:10, y:10, width:30, height:30 });
//     group_1.append(rectangle_1);

//     const rectangle_2 = _canvas_.core.element.create('Rectangle','rectangle_2');
//     rectangle_2.unifiedAttribute({ x:10, y:10, width:30, height:30 });
//     group_2.append(rectangle_2);

//     const rectangle_3 = _canvas_.core.element.create('Rectangle','rectangle_3');
//     rectangle_3.unifiedAttribute({ x:10, y:10, width:30, height:30 });
//     group_3.append(rectangle_3);
//     const rectangle_4 = _canvas_.core.element.create('Rectangle','rectangle_4');
//     rectangle_4.unifiedAttribute({ x:10, y:-40, width:30, height:30 });
//     group_3.append(rectangle_4);

//     setTimeout(_canvas_.core.render.frame, 1000);
//     setTimeout(() => {console.log("");}, 1250);
//     setTimeout(_canvas_.core.render.frame, 1500);
// });