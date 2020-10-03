_canvas_.layers.registerFunctionForLayer("system", function(){
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

    let testRectangle_background = _canvas_.core.element.create('Rectangle','testRectangle_background');
    testRectangle_background.unifiedAttribute({ 
        x:0, y:0, width:60, height:60, 
        colour:{r:1,g:0,b:0,a:0.3},
    });
    _canvas_.system.pane.b.append(testRectangle_background);

    let testRectangle_middleground_back = _canvas_.core.element.create('Rectangle','testRectangle_middleground_back');
    testRectangle_middleground_back.unifiedAttribute({ 
        x:10, y:60, width:60, height:60, 
        colour:{r:0,g:1,b:0,a:0.3},
    });
    _canvas_.system.pane.mb.append(testRectangle_middleground_back);

    let testRectangle_middleground_middle = _canvas_.core.element.create('Rectangle','testRectangle_middleground_middle');
    testRectangle_middleground_middle.unifiedAttribute({ 
        x:80, y:60, width:60, height:60, 
        colour:{r:0,g:1,b:0,a:0.6},
    });
    _canvas_.system.pane.mm.append(testRectangle_middleground_middle);

    testRectangle_middleground_middle.attachCallback('onmousemove',(x,y,event) => {
        console.log('rectangle::testRectangle_middleground_middle::onmousemove',x,y,event);
    });
    testRectangle_middleground_middle.attachCallback('onmouseenterelement',(x,y,event) => {
        console.log('rectangle::testRectangle_middleground_middle::onmouseenterelement',x,y,event);
    });
    testRectangle_middleground_middle.attachCallback('onmouseleaveelement',(x,y,event) => {
        console.log('rectangle::testRectangle_middleground_middle::onmouseleaveelement',x,y,event);
    });

    let testRectangle_middleground_front = _canvas_.core.element.create('Rectangle','testRectangle_middleground_front');
    testRectangle_middleground_front.unifiedAttribute({ 
        x:150, y:60, width:60, height:60, 
        colour:{r:0,g:1,b:0,a:0.8},
    });
    _canvas_.system.pane.mf.append(testRectangle_middleground_front);

    let testRectangle_foreground = _canvas_.core.element.create('Rectangle','testRectangle_foreground');
    testRectangle_foreground.unifiedAttribute({ 
        x:160, y:120, width:60, height:60, 
        colour:{r:0,g:0,b:1,a:0.6}
    });
    _canvas_.system.pane.f.append(testRectangle_foreground);

    setTimeout(_canvas_.core.render.frame,500);
    setTimeout(() => {_canvas_.core.arrangement.printTree('address');},500);



    setTimeout(() => {
        console.log( _canvas_.system.pane.getMiddlegroundPane(_canvas_.system.pane.b) );
        console.log( _canvas_.system.pane.getMiddlegroundPane(testRectangle_middleground_back) );
        console.log( _canvas_.system.pane.getMiddlegroundPane(testRectangle_middleground_middle) );
        console.log( _canvas_.system.pane.getMiddlegroundPane(testRectangle_middleground_front) );
        console.log( _canvas_.system.pane.getMiddlegroundPane(_canvas_.system.pane.f) );
    },1000);
} );