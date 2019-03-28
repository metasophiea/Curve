//setup
    var keyboard = this;
    this.pressedKeys = {
        control:false,
        alt:false,
        meta:false,
    };
    this.functionList = {};
    this.functionList.onkeydown = [];
    this.functionList.onkeyup = [];

//utility functions
    function customKeyInterpreter(event,press){
        var pressedKeys = _canvas_.system.keyboard.pressedKeys;
        if(event.code == 'ControlLeft' || event.code == 'ControlRight'){  pressedKeys.control = press; }
        else if(event.code == 'AltLeft' || event.code == 'AltRight'){     pressedKeys.alt = press;     }
        else if(event.code == 'MetaLeft' || event.code == 'MetaRight'){   pressedKeys.meta = press;    }
        else if(event.code == 'ShiftLeft' || event.code == 'ShiftRight'){ pressedKeys.shift = press;   }

        //adjustment for mac keyboards
            if( window.navigator.platform.indexOf('Mac') != -1 ){
                pressedKeys.option = pressedKeys.alt;
                pressedKeys.command = pressedKeys.meta;
            }
    }
    this.releaseAll = function(){
        Object.keys(this.pressedKeys).forEach(a => keyboard.releaseKey(a))
    };
    this.releaseKey = function(code){
        _canvas_.onkeyup( new KeyboardEvent('keyup',{code:code}) );
    }

//connect callbacks to keyboard function lists
    _canvas_.core.callback.onkeydown = function(event,shapes){        
        //if key is already pressed, don't press it again
            if(_canvas_.system.keyboard.pressedKeys[event.code]){ return; }
            _canvas_.system.keyboard.pressedKeys[event.code] = true;
            customKeyInterpreter(event,true);
        
        //perform action
            if(shapes.length > 0){ shapes[0].onkeydown(event,shapes); }
            else{ _canvas_.library.structure.functionListRunner( _canvas_.system.keyboard.functionList.onkeydown, _canvas_.system.keyboard.pressedKeys )({x:event.x,y:event.y,event:event}); }
    };

    _canvas_.core.callback.onkeyup = function(event,shapes){
        //if key isn't pressed, don't release it
            if(!_canvas_.system.keyboard.pressedKeys[event.code]){return;}
            delete _canvas_.system.keyboard.pressedKeys[event.code];
            customKeyInterpreter(event,false);
        
        //perform action
            if(shapes.length > 0){ shapes[0].onkeyup(event,shapes); }
            else{ _canvas_.library.structure.functionListRunner( _canvas_.system.keyboard.functionList.onkeyup, _canvas_.system.keyboard.pressedKeys )({x:event.x,y:event.y,event:event}); }
    };