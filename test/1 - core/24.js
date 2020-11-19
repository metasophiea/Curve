_canvas_.layers.registerFunctionForLayer("core", function(){
    _canvas_.core.render.active(true);

    let canvases = [];

    for(let y = 0; y < 5; y++){
        for(let x = 0; x < 5; x++){
            canvas = _canvas_.core.element.create('Canvas','test_canvas_'+y+'_'+x);
            canvas.unifiedAttribute({ x:10 + 70*x, y:10 + 70*y, width:60, height:60 });
            _canvas_.core.arrangement.append(canvas);
            canvases.push(canvas);
        }
    }

    let tick = 0;
    setInterval(() => {
        tick += 0.1;

        canvases.forEach((canvas,index) => {
            const length = Math.abs(Math.sin(tick*(1+(index/100))));
            canvas._.fillStyle = _canvas_.library.math.convertColour.obj2rgba({r:1,g:1,b:1,a:1});
            canvas._.fillRect(0,0,canvas.$(60),canvas.$(60));
            canvas._.fillStyle = _canvas_.library.math.convertColour.obj2rgba({r:0.732,g:0.756,b:0.892,a:1});
            canvas._.fillRect(canvas.$(0),canvas.$(0),canvas.$(60),canvas.$(length*60));
            canvas.requestUpdate();
        });
    }, 1);
});