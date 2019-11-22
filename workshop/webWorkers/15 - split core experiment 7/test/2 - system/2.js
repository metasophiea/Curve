_canvas_.system.go = function(){
    let testRectangle_middlegroud_back;
    let testRectangle_middlegroud_middle;
    let testRectangle_middlegroud_front;

    _canvas_.system.mouse.functionList.onmousedown.push(
        {
            requiredKeys:[['shift']],
            function:function(data){
                console.log('onmousedown with shift!',data.x,data.y,data.event);
                return true;
            }
        }
    );
    _canvas_.system.mouse.functionList.onmousedown.push(
        {
            requiredKeys:[],
            function:function(data){
                console.log('onmousedown!',data.x,data.y,data.event);
            }
        }
    );

    _canvas_.core.element.create('rectangle','testRectangle_background').then(rectangle => {
        rectangle.unifiedAttribute({
            x:0, y:0, width:60, height:60, 
            colour:{r:1,g:0,b:0,a:0.3},
        });
        _canvas_.system.pane.b.append(rectangle);
    });

    _canvas_.core.element.create('rectangle','testRectangle_middlegroud_back').then(rectangle => {
        testRectangle_middlegroud_back = rectangle;
        rectangle.unifiedAttribute({
            x:10, y:60, width:60, height:60, 
            colour:{r:0,g:1,b:0,a:0.3},
        });
        _canvas_.system.pane.mb.append(rectangle);
    });
    _canvas_.core.element.create('rectangle','testRectangle_middlegroud_middle').then(rectangle => {
        testRectangle_middlegroud_middle = rectangle;
        rectangle.unifiedAttribute({
            x:80, y:60, width:60, height:60, 
            colour:{r:0,g:1,b:0,a:0.6},
        });
        _canvas_.system.pane.mm.append(rectangle);

        _canvas_.core.callback.attachCallback(rectangle,'onmousemove',(x,y,event) => {
            console.log('rectangle::testRectangle_middlegroud_middle::onmousemove',x,y,event);
        });
        _canvas_.core.callback.attachCallback(rectangle,'onmouseenterelement',(x,y,event) => {
            console.log('rectangle::testRectangle_middlegroud_middle::onmouseenterelement',x,y,event);
        });
        _canvas_.core.callback.attachCallback(rectangle,'onmouseleaveelement',(x,y,event) => {
            console.log('rectangle::testRectangle_middlegroud_middle::onmouseleaveelement',x,y,event);
        });
    });
    _canvas_.core.element.create('rectangle','testRectangle_middlegroud_front').then(rectangle => {
        testRectangle_middlegroud_front = rectangle;
        rectangle.unifiedAttribute({
            x:150, y:60, width:60, height:60, 
            colour:{r:0,g:1,b:0,a:0.8},
        });
        _canvas_.system.pane.mf.append(rectangle);
    });

    _canvas_.core.element.create('rectangle','testRectangle_foreground').then(rectangle => {
        rectangle.unifiedAttribute({
            x:160, y:120, width:60, height:60, 
            colour:{r:0,g:0,b:1,a:0.6}
        });
        _canvas_.system.pane.f.append(rectangle);
    });

    setTimeout(_canvas_.core.render.frame,500);
    setTimeout(_canvas_.core.arrangement.printTree,500);

    setTimeout(() => {
        _canvas_.system.pane.getMiddlegroundPane(_canvas_.system.pane.b).then(result => { if(result){ console.log(result.getName()); } });
        _canvas_.system.pane.getMiddlegroundPane(testRectangle_middlegroud_back).then(result => { if(result){ console.log(result.getName()); } });
        _canvas_.system.pane.getMiddlegroundPane(testRectangle_middlegroud_middle).then(result => { if(result){ console.log(result.getName()); } });
        _canvas_.system.pane.getMiddlegroundPane(testRectangle_middlegroud_front).then(result => { if(result){ console.log(result.getName()); } });
        _canvas_.system.pane.getMiddlegroundPane(_canvas_.system.pane.f).then(result => { if(result){ console.log(result.getName()); } });
    },1000);
};