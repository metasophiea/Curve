__globals.keyboardInteraction = {};
__globals.keyboardInteraction.pressedKeys = {};

// keycapture
__globals.keyboardInteraction.declareKeycaptureObject = function(object,desiredKeys={none:[],shift:[],control:[],meta:[],alt:[]}){
    var connectionObject = new function(){
        this.keyPress = function(key,modifiers={}){};
        this.keyRelease = function(key,modifiers={}){};
    };

    //connectionObject function runners
    //if for any reason the object using the connectionObject isn't interested in the
    //key, return 'false' otherwise return 'true'
    function keyProcessor(type,event){
        if(!connectionObject[type]){return false;}

        modifiers = {
            shift:event.shiftKey,
            control:event[__globals.super.keys.ctrl],
            meta:event.metaKey,
            alt:event[__globals.super.keys.alt]
        };

        if( 
            (event.control  && desiredKeys.control && ( desiredKeys.control=='all' || (Array.isArray(desiredKeys.control) && desiredKeys.control.includes(event.key)) )) ||
            (event.shiftKey && desiredKeys.shift   && ( desiredKeys.shift=='all'   || (Array.isArray(desiredKeys.shift)   && desiredKeys.shift.includes(event.key))   )) ||
            (event.metaKey  && desiredKeys.meta    && ( desiredKeys.meta=='all'    || (Array.isArray(desiredKeys.meta)    && desiredKeys.meta.includes(event.key))    )) ||
            (event.alt      && desiredKeys.alt     && ( desiredKeys.alt=='all'     || (Array.isArray(desiredKeys.alt)     && desiredKeys.alt.includes(event.key))     )) ||
            (                  desiredKeys.none    && ( desiredKeys.none=='all'    || (Array.isArray(desiredKeys.none)    && desiredKeys.none.includes(event.key))    ))
        ){
            connectionObject[type](event.key,modifiers);
            return true;
        }

        return false;
    }
    object.onkeydown = function(event){ return keyProcessor('keyPress',event); };
    object.onkeyup = function(event){ return keyProcessor('keyRelease',event); };

    return connectionObject;
};



// onkeydown functions
    __globals.keyboardInteraction.onkeydown_functionList = {};
    document.onkeydown = function(event){
        //if key is already pressed, don't press it again
        if(__globals.keyboardInteraction.pressedKeys[event.code]){return;}
        __globals.keyboardInteraction.pressedKeys[event.code] = true;

        //discover what the mouse is pointing at; if it's pointing at something that can accept
        //keyboard input, direct the keyboard input to it. If the object doesn't care about this
        //key or if input is not accepted; use the global functions
        var temp = [__globals.mouseInteraction.currentPosition[0], __globals.mouseInteraction.currentPosition[1]];
        if(!__globals.utility.object.requestInteraction(temp[0],temp[1],'onkeydown','workspace')){
            if(__globals.utility.workspace.objectUnderPoint(temp[0],temp[1]).onkeydown(event)){ return; }
        }

        //global function
        if( __globals.keyboardInteraction.onkeydown_functionList[event.key] ){
            __globals.keyboardInteraction.onkeydown_functionList[event.key](event);
        }
    };

    __globals.keyboardInteraction.onkeydown_functionList.Delete = function(event){
        console.log('delete!');
        __globals.selection.delete();
    };
    __globals.keyboardInteraction.onkeydown_functionList.Backspace = function(event){
        console.log('backspace!');
        __globals.keyboardInteraction.onkeydown_functionList.Delete(event);
    };
    __globals.keyboardInteraction.onkeydown_functionList.x = function(event){
        if(!event[__globals.super.keys.ctrl]){return;}
        console.log('cut!');
        __globals.selection.cut();
    };
    __globals.keyboardInteraction.onkeydown_functionList.c = function(event){
        if(!event[__globals.super.keys.ctrl]){return;}
        console.log('copy!');
        __globals.selection.copy();
    };
    __globals.keyboardInteraction.onkeydown_functionList.b = function(event){
        if(!event[__globals.super.keys.ctrl]){return;}
        console.log('duplicate!');
        __globals.selection.duplicate();
    };
    __globals.keyboardInteraction.onkeydown_functionList.v = function(event){
        if(!event[__globals.super.keys.ctrl]){return;}
        console.log('paste!');
        __globals.selection.paste();
    };
    __globals.keyboardInteraction.onkeydown_functionList.F1 = function(event){
        console.log('help!');
        var temp = __globals.utility.workspace.objectUnderPoint(__globals.mouseInteraction.currentPosition[0], __globals.mouseInteraction.currentPosition[1]);
        if(temp){ window.open('https://metasophiea.com/curve/help/object/'+temp.id, '_blank'); }
    };
    __globals.keyboardInteraction.onkeydown_functionList.F2 = function(event){
        console.log('save!');
    };
    __globals.keyboardInteraction.onkeydown_functionList.F3 = function(event){
        console.log('open!');
    };

// onkeyup functions
    __globals.keyboardInteraction.onkeyup_functionList = {};
    document.onkeyup = function(event){
        //if key isn't pressed, don't release it
        if(!__globals.keyboardInteraction.pressedKeys[event.code]){return;}
        delete __globals.keyboardInteraction.pressedKeys[event.code];

        //discover what the mouse is pointing at; if it's pointing at something that can accept
        //keyboard input, direct the keyboard input to it. If the object doesn't care about this
        //key or if input is not accepted; use the global functions
        var temp = [__globals.mouseInteraction.currentPosition[0], __globals.mouseInteraction.currentPosition[1]];
        if(!__globals.utility.object.requestInteraction(temp[0],temp[1],'onkeyup','workspace')){
            if(__globals.utility.workspace.objectUnderPoint(temp[0],temp[1]).onkeyup(event)){ return; }
        }
                            
        //global function
        if( __globals.keyboardInteraction.onkeyup_functionList[event.key] ){
            __globals.keyboardInteraction.onkeyup_functionList[event.key](event);
        }
    };