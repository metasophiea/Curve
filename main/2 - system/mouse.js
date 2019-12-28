//setup
    const mouse = this;

    this.tmp = {};
    this.functionList = {};
    this.functionList.onmousedown = [];
    this.functionList.onmousemove = [];
    this.functionList.onmouseup = [];
    this.functionList.onmouseleave = [];
    this.functionList.onmouseenter = [];
    this.functionList.onwheel = [];
    this.functionList.onclick = [];
    this.functionList.ondblclick = [];

//save the listener functions of the canvas
    _canvas_.core.go.add( function(){
        _canvas_.system.mouse.original = {
            onmousemove: _canvas_.onmousemove,
            onmouseleave: _canvas_.onmouseleave,
            onmouseup: _canvas_.onmouseup,
        };
        _canvas_.system.mouseReady = true;
    } );

//utility functions
    this.mouseInteractionHandler = function(moveCode, stopCode){
        //replace listener code
            //movement code
                _canvas_.onmousemove = function(event){ 
                    if(moveCode!=undefined){
                        event.X = event.offsetX; event.Y = event.offsetY;
                        const XY = _canvas_.core.viewport.adapter.windowPoint2workspacePoint(event.X,event.Y);
                        moveCode(XY.x,XY.y,event);
                    }
                };
            //stopping code
                _canvas_.onmouseup = function(event){
                    if(stopCode != undefined){ 
                        event.X = event.offsetX; event.Y = event.offsetY;
                        const XY = _canvas_.core.viewport.adapter.windowPoint2workspacePoint(event.X,event.Y);
                        stopCode(XY.x,XY.y,event);
                    }

                    _canvas_.onmousemove = mouse.original.onmousemove;
                    _canvas_.onmouseleave = mouse.original.onmouseleave;
                    _canvas_.onmouseup = mouse.original.onmouseup;
                    _canvas_.onmouseup(event);
                };
                _canvas_.onmouseleave = _canvas_.onmouseup;
    };

    this.forceMouseUp = function(){ _canvas_.onmouseup(); };

//connect callbacks to mouse function lists
    this.setUpCallbacks = function(){
        [ 'onmousedown', 'onmouseup', 'onmousemove', 'onmouseenter', 'onmouseleave', 'onwheel', 'onclick', 'ondblclick', 'onmouseenterelement', 'onmouseleaveelement' ].forEach(callback => {
            _canvas_.core.callback.functions[callback] = function(x,y,event,elementIds){
                if(elementIds.relevant.length == 0){
                    _canvas_.library.structure.functionListRunner( mouse.functionList[callback], _canvas_.system.keyboard.pressedKeys )({x:event.X,y:event.Y,event:event}); 
                }
            }
        });
    }
    this.setUpCallbacks();