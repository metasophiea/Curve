_canvas_.system.go = function(){
    _canvas_.core.meta.createSetAppend(
        'rectangle','testRectangle_background', 
        { 
            x:0, y:0, width:60, height:60, 
            colour:{r:1,g:0,b:0,a:0.3},
        },
        _canvas_.system.pane.b
    );

    _canvas_.core.meta.createSetAppend(
        'rectangle','testRectangle_middlegroud_back', 
        { 
            x:10, y:60, width:60, height:60, 
            colour:{r:0,g:1,b:0,a:0.3},
        },
        _canvas_.system.pane.mb
    );
    _canvas_.core.meta.createSetAppend(
        'rectangle','testRectangle_middlegroud_middle', 
        { 
            x:80, y:60, width:60, height:60, 
            colour:{r:0,g:1,b:0,a:0.6},
        },
        _canvas_.system.pane.mm
    ).then(id => {
        _canvas_.core.callback.attachCallback(id,'onmousemove',(x,y,event) => {
            console.log('rectangle::testRectangle_middlegroud_middle::onmousemove',x,y,event);
        });
        _canvas_.core.callback.attachCallback(id,'onmouseenterelement',(x,y,event) => {
            console.log('rectangle::testRectangle_middlegroud_middle::onmouseenterelement',x,y,event);
        });
        _canvas_.core.callback.attachCallback(id,'onmouseleaveelement',(x,y,event) => {
            console.log('rectangle::testRectangle_middlegroud_middle::onmouseleaveelement',x,y,event);
        });
    });
    _canvas_.core.meta.createSetAppend(
        'rectangle','testRectangle_middlegroud_front', 
        { 
            x:150, y:60, width:60, height:60, 
            colour:{r:0,g:1,b:0,a:0.8},
        },
        _canvas_.system.pane.mf
    );

    _canvas_.core.meta.createSetAppend(
        'rectangle','testRectangle_foreground', 
        { 
            x:160, y:120, width:60, height:60, 
            colour:{r:0,g:0,b:1,a:0.6}
        },
        _canvas_.system.pane.f
    );


    setTimeout(_canvas_.core.render.frame,500);
    setTimeout(_canvas_.core.arrangement.printTree,500);

    setTimeout(() => {
        _canvas_.system.pane.getMiddlegroundPane(3).then(console.log);
        _canvas_.system.pane.getMiddlegroundPane(7).then(console.log);
        _canvas_.system.pane.getMiddlegroundPane(8).then(console.log);
        _canvas_.system.pane.getMiddlegroundPane(9).then(console.log);
        _canvas_.system.pane.getMiddlegroundPane(10).then(console.log);
    },1000);
};