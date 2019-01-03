this.pressedKeys = {};

//keycapture
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
    this.functionRunner = function(keyDirection,event){
        //discover what the mouse is pointing at and if that thing accepts keyboard input. First check whether the
        //object overall accepts input, and if it doesn't check if any element accepts it

        //perform functions only if the element in question ord all of it's parents have a "keyDirection" related function somewhere
             if(!system.utility.object.requestInteraction(system.mouse.currentPosition[0], system.mouse.currentPosition[1], keyDirection, 'workspace')){
                //if the object under the mouse pointer has been declared a keycapture object; run it's appropriate function
                //if it doesn't; inquire with the element under the pointer and all it's parents, running their functions as necessary
                    if( system.utility.workspace.objectUnderPoint(system.mouse.currentPosition[0], system.mouse.currentPosition[1])[keyDirection] != undefined ){
                        if(system.utility.workspace.objectUnderPoint(system.mouse.currentPosition[0], system.mouse.currentPosition[1])[keyDirection](event)){ return; }
                    }else{
                        //start from the most bottom element and work up until a pane is reached; checking for 
                        //"keyDirection" attributes. If one is found and it returns 'false', continue climbing. 
                        var element = document.elementFromPoint(system.mouse.currentPosition[0], system.mouse.currentPosition[1]);
                        while(!element.hasAttribute('pane')){
                            if( element[keyDirection] != undefined ){
                                if(element[keyDirection](event)){ return; }
                            }
                            element = element.parentElement;
                        }
                    }
            }
    };
    this.releaseAll = function(){
        for(var a = 0; a < this.pressedKeys.length; a++){
            document.onkeyup( new KeyboardEvent('keyup',{'key':this.pressedKeys[a]}) );
        }
    };
    this.releaseKey = function(keyCode){
        document.onkeyup( {code:keyCode} );
    };




// onkeydown functions
    document.onkeydown = function(event){
        //if key is already pressed, don't press it again
            if(system.keyboard.pressedKeys[event.code]){ return; }
            system.keyboard.pressedKeys[event.code] = true;

        //inform control of the key down
            control.keydown(event);
        
        //perform action
            system.keyboard.functionRunner('onkeydown',event);
    };
 

// onkeyup functions
    document.onkeyup = function(event){
        //if key isn't pressed, don't release it
            if(!system.keyboard.pressedKeys[event.code]){return;}
            delete system.keyboard.pressedKeys[event.code];

        //inform control of the key up
            control.keyup(event);
        
        //perform action
            system.keyboard.functionRunner('onkeyup',event);
    };