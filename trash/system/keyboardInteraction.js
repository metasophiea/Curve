system.keyboard = {};
system.keyboard.pressedKeys = {};

// keycapture
system.keyboard.declareKeycaptureObject = function(object,desiredKeys={none:[],shift:[],control:[],meta:[],alt:[]}){
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
            control:event[system.super.keys.ctrl],
            meta:event.metaKey,
            alt:event[system.super.keys.alt]
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
    // system.keyboard.onkeydown_functionList = {};
    document.onkeydown = function(event){
        //if key is already pressed, don't press it again
            if(system.keyboard.pressedKeys[event.code]){ return; }
            system.keyboard.pressedKeys[event.code] = true;

        //discover what the mouse is pointing at and if that thing accepts keyboard input. First check whether the
        //object overall accepts input, and if it doesn't check if any element accepts it. If neither do, or either
        //function returns 'false';  use the global functions
            var temp = [system.mouse.currentPosition[0], system.mouse.currentPosition[1]];
            if(!system.utility.object.requestInteraction(temp[0],temp[1],'onkeydown','workspace')){
                if( system.utility.workspace.objectUnderPoint(temp[0],temp[1]).onkeydown != undefined ){
                    if(system.utility.workspace.objectUnderPoint(temp[0],temp[1]).onkeydown(event)){ return; }
                }else{
                    //start from the most bottom element and work up until a pane is reached; checking for 
                    //onkeydown attributes. If one is found and it returns 'false', continue climbing. 
                    var element = document.elementFromPoint(temp[0],temp[1]);
                    while(!element.hasAttribute('pane')){
                        if( element.onkeydown != undefined ){
                            if(element.onkeydown(event)){ return; }
                        }
                        element = element.parentElement;
                    }
                }
            }

        // //global function
        // if( system.keyboard.onkeydown_functionList[event.key] ){
        //     system.keyboard.onkeydown_functionList[event.key](event);
        // }

        //control function
            control.keydown(event);
    };

    // system.keyboard.onkeydown_functionList.Delete = function(event){
    //     console.log('delete!');
    //     system.selection.delete();
    // };
    // system.keyboard.onkeydown_functionList.Backspace = function(event){
    //     console.log('backspace!');
    //     system.keyboard.onkeydown_functionList.Delete(event);
    // };
    // system.keyboard.onkeydown_functionList.x = function(event){
    //     if(!event[system.super.keys.ctrl]){return;}
    //     console.log('cut!');
    //     system.selection.cut();
    // };
    // system.keyboard.onkeydown_functionList.c = function(event){
    //     if(!event[system.super.keys.ctrl]){return;}
    //     console.log('copy!');
    //     system.selection.copy();
    // };
    // system.keyboard.onkeydown_functionList.b = function(event){
    //     if(!event[system.super.keys.ctrl]){return;}
    //     console.log('duplicate!');
    //     system.selection.duplicate();
    // };
    // system.keyboard.onkeydown_functionList.v = function(event){
    //     if(!event[system.super.keys.ctrl]){return;}
    //     console.log('paste!');
    //     system.selection.paste();
    // };
    // system.keyboard.onkeydown_functionList.F1 = function(event){
    //     var temp = system.utility.workspace.objectUnderPoint(system.mouse.currentPosition[0], system.mouse.currentPosition[1]);
    //     if(temp){
    //         if( objects[temp.id].metadata ){
    //             system.utility.misc.openURL(objects[temp.id].metadata.helpurl);
    //         }else{
    //             console.warn('bad help url, please add metadata to your object file ->',temp.id);
    //         }
    //         system.keyboard.releaseAll();
    //     }
    // };
    // system.keyboard.onkeydown_functionList.F2 = function(event){
    //     if(!event[system.super.keys.ctrl]){return;}
    //     console.log('load!');
    //     system.utility.workspace.saveload.load();
    // };
    // system.keyboard.onkeydown_functionList.F3 = function(event){
    //     if(!event[system.super.keys.ctrl]){return;}
    //     console.log('save!');
    //     system.utility.workspace.saveload.save();
    // };

// onkeyup functions
    // system.keyboard.onkeyup_functionList = {};
    document.onkeyup = function(event){
        //if key isn't pressed, don't release it
            if(!system.keyboard.pressedKeys[event.code]){return;}
            delete system.keyboard.pressedKeys[event.code];

        //discover what the mouse is pointing at and if that thing accepts keyboard input. First check whether the
        //object overall accepts input, and if it doesn't check if the element accepts it. If neither do, or either
        //function returns 'false';  use the global functions
            var temp = [system.mouse.currentPosition[0], system.mouse.currentPosition[1]];
            if(!system.utility.object.requestInteraction(temp[0],temp[1],'onkeyup','workspace')){
                if( system.utility.workspace.objectUnderPoint(temp[0],temp[1]).onkeyup != undefined ){
                    if(system.utility.workspace.objectUnderPoint(temp[0],temp[1]).onkeyup(event)){ return; }
                }else{
                    //start from the most bottom element and work up until a pane is reached; checking for 
                    //onkeyup attributes. If one is found and it returns 'false', continue climbing. 
                    var element = document.elementFromPoint(temp[0],temp[1]);
                    while(!element.hasAttribute('pane')){
                        if( element.onkeyup != undefined ){
                            if(element.onkeyup(event)){ return; }
                        }
                        element = element.parentElement;
                    }
                }
            }

        // //global function
        //     if( system.keyboard.onkeyup_functionList[event.key] ){
        //         system.keyboard.onkeyup_functionList[event.key](event);
        //     }

        //control function
            control.keyup(event);
    };

// additional utilities
    system.keyboard.releaseAll = function(){
        for(key in system.keyboard.pressedKeys){
            document.onkeyup( new KeyboardEvent('keyup',{'key':key}) );
        }
    };