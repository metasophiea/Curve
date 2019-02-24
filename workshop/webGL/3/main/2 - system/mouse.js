//setup
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

//utility functions
    this.mouseInteractionHandler = function(moveCode, stopCode){
        //save the old listener functions of the canvas
            _canvas_.system.mouse.tmp.onmousemove_old = _canvas_.onmousemove;
            _canvas_.system.mouse.tmp.onmouseleave_old = _canvas_.onmouseleave;
            _canvas_.system.mouse.tmp.onmouseup_old = _canvas_.onmouseup;

        //replace listener code
            //movement code
                _canvas_.onmousemove = function(event){ if(moveCode!=undefined){moveCode(event);} };
            //stopping code
                _canvas_.onmouseup = function(event){
                    if(stopCode != undefined){ stopCode(event); }
                    _canvas_.onmousemove = _canvas_.system.mouse.tmp.onmousemove_old;
                    _canvas_.onmouseleave = _canvas_.system.mouse.tmp.onmouseleave_old;
                    _canvas_.onmouseup = _canvas_.system.mouse.tmp.onmouseup_old;
                };
                _canvas_.onmouseleave = _canvas_.onmouseup;
    };

//connect callbacks to mouse function lists
    [ 'onmousedown', 'onmouseup', 'onmousemove', 'onmouseenter', 'onmouseleave', 'onwheel', 'onclick', 'ondblclick' ].forEach(function(callback){
        _canvas_.core.callback[callback] = function(x,y,event,shapes){ 
            if(shapes.length > 0){ shapes[0][callback](x,y,event,shapes); }
            else{ _canvas_.library.structure.functionListRunner( _canvas_.system.mouse.functionList[callback], _canvas_.system.keyboard.pressedKeys )({x:x,y:y,event:event}); }
        }
    });