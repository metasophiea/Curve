const randomRectangleCount = 1_000;

_canvas_.layers.registerFunctionForLayer("core", function(){

    _canvas_.core.render.getCanvasSize().then(canvasSize => {

        for(let a = 0; a < randomRectangleCount; a++){
            let rectangle = _canvas_.core.element.create('Rectangle','rect_'+a);

            rectangle.unifiedAttribute({ 
                x:canvasSize.width*Math.random(), y:canvasSize.height*Math.random(),
                width:Math.random()*50, height:Math.random()*50,
                anchor:{x:Math.random(),y:Math.random()},
                angle:Math.PI*2*Math.random(),
                colour:{r:Math.random(),g:Math.random(),b:Math.random(),a:1}

                // x:canvasSize.width*(a/10), y:0,
                // width:50, height:50,
                // colour:{r:0.5+(a/10),g:0,b:0,a:1}
            });

            // const x = Math.random();
            // const y = Math.random();
            // rectangle.unifiedAttribute({
            //     x:canvasSize.width*x, y:canvasSize.height*y,
            //     width:50, height:50,
            //     anchor:{x:0.5,y:0.5},
            //     angle:Math.PI*2*Math.random(),
            //     colour:{r:x,g:y,b:Math.random(),a:1}
            // });

            _canvas_.core.arrangement.append(rectangle);
        }

        // setTimeout(_canvas_.core.render.frame,500);
        setTimeout(_canvas_.core.render.frame,2000);
    });


    // _canvas_.core.render.activeLimitToFrameRate(true);
    // _canvas_.core.render.frameRateLimit(1);
    // _canvas_.core.render.active(true);
    // _canvas_.core.stats.active(true);
    // setInterval(() => {
    //     _canvas_.core.stats.getReport().then(console.log)
    // }, 500);
} );