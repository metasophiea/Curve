this.pressedKeys = {};

// keycapture
this.declareKeycaptureObject = function(object,desiredKeys={none:[],shift:[],control:[],meta:[],alt:[]}){
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

        //control function
            control.keydown(event);
    };
 

// onkeyup functions
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

        //control function
            control.keyup(event);
    };

// additional utilities
    this.releaseAll = function(){
        for(key in this.pressedKeys){
            document.onkeyup( new KeyboardEvent('keyup',{'key':key}) );
        }
    };