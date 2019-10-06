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
    _canvas_.core.callback.functions.onkeydown = function(x,y,event,shapes){
        //if key is already pressed, don't press it again
            if(_canvas_.system.keyboard.pressedKeys[event.code]){ return; }
            _canvas_.system.keyboard.pressedKeys[event.code] = true;
            customKeyInterpreter(event,true);

        //ESCAPE operation code
            if(event.key == 'Escape'){ console.log('%cEscape key pressed', 'color:White; background-color: Black;'); _canvas_.system.mouse.setUpCallbacks(); }
        
        //perform action
            for(var a = 0; a < shapes.length; a++){
                if(shapes[a].glyphs.includes(event.key)){
                    shapes[a].onkeydown(x,y,event);
                    return;
                }
            }
            _canvas_.library.structure.functionListRunner( _canvas_.system.keyboard.functionList.onkeydown, _canvas_.system.keyboard.pressedKeys )({x:event.X,y:event.Y,event:event});
    };

    _canvas_.core.callback.functions.onkeyup = function(x,y,event,shapes){
        //if key isn't pressed, don't release it
            if(!_canvas_.system.keyboard.pressedKeys[event.code]){return;}
            delete _canvas_.system.keyboard.pressedKeys[event.code];
            customKeyInterpreter(event,false);
        
        //perform action
            for(var a = 0; a < shapes.length; a++){
                if(shapes[a].glyphs.includes(event.key)){
                    shapes[a].onkeyup(x,y,event);
                    return;
                }
            }
            _canvas_.library.structure.functionListRunner( _canvas_.system.keyboard.functionList.onkeyup, _canvas_.system.keyboard.pressedKeys )({x:event.X,y:event.Y,event:event});
    };