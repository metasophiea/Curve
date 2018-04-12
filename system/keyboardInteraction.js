__globals.keyboardInteraction = {};
__globals.keyboardInteraction.pressedKeys = {};

// keycapture
__globals.keyboardInteraction.declareKeycaptureObject = function(object){
    var connectionObject = new function(){
        this.keyPress = function(key){};
        this.keyRelease = function(key){};
    };

    object.onkeydown = function(event){
        if(connectionObject.keyPress){connectionObject.keyPress(event.key);}
    };
    object.onkeyup = function(event){
        if(connectionObject.keyPress){connectionObject.keyRelease(event.key);}
    };
    return connectionObject;
};



// onkeydown functions
    __globals.keyboardInteraction.onkeydown_functionList = {};
    document.onkeydown = function(event){
        //if key is already pressed, don't press it again
        if(__globals.keyboardInteraction.pressedKeys[event.code]){return;}
        __globals.keyboardInteraction.pressedKeys[event.code] = true;

        //discover what the mouse is pointing at; if it's pointing at something that can accept
        //keyboard input, direct the keyboard input to it, otherwise use the global functions
        var temp = [__globals.mouseInteraction.currentPosition[0], __globals.mouseInteraction.currentPosition[1]];
        if(!__globals.utility.requestInteraction(temp[0],temp[1],'onkeydown')){
            __globals.utility.getObjectUnderPoint(temp[0],temp[1]).onkeydown(event);
            return;
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
        if(!event.ctrlKey){return;}
        console.log('cut!');
        __globals.selection.cut();
    };
    __globals.keyboardInteraction.onkeydown_functionList.c = function(event){
        if(!event.ctrlKey){return;}
        console.log('copy!');
        __globals.selection.copy();
    };
    __globals.keyboardInteraction.onkeydown_functionList.b = function(event){
        if(!event.ctrlKey){return;}
        console.log('duplicate!');
        __globals.selection.duplicate();
    };
    __globals.keyboardInteraction.onkeydown_functionList.v = function(event){
        if(!event.ctrlKey){return;}
        console.log('paste!');
        __globals.selection.paste();
    };



// onkeyup functions
    __globals.keyboardInteraction.onkeyup_functionList = {};
    document.onkeyup = function(event){
        //if key isn't pressed, don't release it
        if(!__globals.keyboardInteraction.pressedKeys[event.code]){return;}
        delete __globals.keyboardInteraction.pressedKeys[event.code];

        //discover what the mouse is pointing at; if it's pointing at something that can accept
        //keyboard input, direct the keyboard input to it, otherwise use the global functions
        var temp = [__globals.mouseInteraction.currentPosition[0], __globals.mouseInteraction.currentPosition[1]];
        if(!__globals.utility.requestInteraction(temp[0],temp[1],'onkeyup')){
            __globals.utility.getObjectUnderPoint(temp[0],temp[1]).onkeyup(event);
            return;
        }
                            
        //global function
        if( __globals.keyboardInteraction.onkeyup_functionList[event.key] ){
            __globals.keyboardInteraction.onkeyup_functionList[event.key](event);
        }
    };