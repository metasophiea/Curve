//utility functions
    function activateShapeFunctions(listenerName, x,y,event,shape){
        //starting with the shape under this point and climbing through all it's parents; look
        //for 'listenerName' listeners. If one is found, activate it, stop climbing and return 'true'
        //if no shape has a listener, return 'false'

            var tmp = shape;
            if(tmp == undefined){return false;}
            do{
                if( tmp[listenerName] != undefined ){ tmp[listenerName](x,y,event); return true; }
            }while( (tmp = tmp.parent) != undefined )

            return false;
    }
    function customKeyInterpreter(event,press){
        var pressedKeys = workspace.system.keyboard.pressedKeys;
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


workspace.core.callback.onkeydown = function(x,y,event,shape){
    //if key is already pressed, don't press it again
        if(workspace.system.keyboard.pressedKeys[event.code]){ return; }
        workspace.system.keyboard.pressedKeys[event.code] = true;
        customKeyInterpreter(event,true);
    
    //perform action
        if(activateShapeFunctions('onkeydown',x,y,event,shape)){return;}
        workspace.library.structure.functionListRunner(workspace.system.keyboard.functionList.onkeydown)({event:event,x:x,y:y});
};
workspace.core.callback.onkeyup = function(x,y,event,shape){
    //if key isn't pressed, don't release it
        if(!workspace.system.keyboard.pressedKeys[event.code]){return;}
        delete workspace.system.keyboard.pressedKeys[event.code];
        customKeyInterpreter(event,false);
    
    //perform action
        if(activateShapeFunctions('onkeyup',x,y,event,shape)){return;}
        workspace.library.structure.functionListRunner(workspace.system.keyboard.functionList.onkeyup)({event:event,x:x,y:y});
};

this.releaseAll = function(){
    for(var a = 0; a < this.pressedKeys.length; a++){
        this.releaseKey(this.pressedKeys[a]);
    }
};
this.releaseKey = function(code){
    workspace.onkeyup( new KeyboardEvent('keyup',{code:code}) );
}

this.pressedKeys = {
    control:false,
    alt:false,
    meta:false,
};

this.functionList = {};
this.functionList.onkeydown = [];
this.functionList.onkeyup = [];