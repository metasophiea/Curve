this.callback = new function(){
    const mouseData = { 
        x:undefined, 
        y:undefined, 
    };

    this.listCallbackTypes = function(){
        dev.log.callback('.listCallbackTypes()'); //#development
        return interface.operator.callback.listCallbackTypes();
    };
    this.listActivationModes = function(){
        dev.log.callback('.listActivationModes()'); //#development
        return interface.operator.callback.listActivationModes();
    };

    const callbackRegistry = new function(){
        const registeredShapes = {};

        this.getCallback = function(id,callbackType){
            if(id == undefined || registeredShapes[id] == undefined || registeredShapes[id][callbackType] == undefined){return;}
            return registeredShapes[id][callbackType];
        };
        this.register = function(id,callbackType,callback){
            if(!(id in registeredShapes)){ registeredShapes[id] = {}; }
            registeredShapes[id][callbackType] = callback;
        };
        this.remove = function(id,callbackType){
            registeredShapes[id][callbackType] = undefined;
            delete registeredShapes[id][callbackType];
        };
        this.call = function(id,callbackType,x,y,event){
            if(id == undefined || registeredShapes[id] == undefined || registeredShapes[id][callbackType] == undefined){return false;}
            registeredShapes[id][callbackType](x,y,event);
            return true;
        };
    };
    this.getCallback = function(element, callbackType){
        dev.log.callback('.getCallback(',element,callbackType); //#development
        callbackRegistry.getCallback(element.getId(), callbackType);
    };
    this.attachCallback = function(element, callbackType, callback){
        dev.log.callback('.attachCallback(',element,callbackType,callback); //#development
        callbackRegistry.register(element.getId(), callbackType, callback);
        interface.operator.callback.attachCallback(element.getId(),callbackType);
    };
    this.removeCallback = function(element, callbackType){
        dev.log.callback('.removeCallback(',element,callbackType); //#development
        callbackRegistry.remove(element.getId(), callbackType);
        interface.operator.callback.removeCallback(element.getId(),callbackType);
    };

    let callbackActivationMode = 'firstMatch'; //topMostOnly / firstMatch / allMatches
    this.callbackActivationMode = function(mode){
        if(mode == undefined){return callbackActivationMode;}
        dev.log.callback('.callbackActivationMode(',mode); //#development
        callbackActivationMode = mode;
        return interface.operator.callback.callbackActivationMode(callbackActivationMode);
    };

    this.functions = {};
    this.__attachCallbacks = function(){
        return new Promise((resolve, reject) => {
            this.listCallbackTypes().then(callbackNames => {
                dev.log.callback(' setting up outgoing message callbacks'); //#development
                callbackNames.forEach(callbackName => {
                    dev.log.callback(' ->',callbackName); //#development

                    //outgoing messages
                        _canvas_[callbackName] = function(event){
                            let sudoEvent = {};
                            if(event instanceof KeyboardEvent){
                                sudoEvent = {
                                    key: event.key,
                                    code: event.code,
                                    keyCode: event.keyCode,
                                    altKey: event.altKey,
                                    ctrlKey: event.ctrlKey,
                                    metaKey: event.metaKey,
                                    shiftKey: event.shiftKey,
                                };
                            }else if(event instanceof WheelEvent){
                                mouseData.x = event.offsetX;
                                mouseData.y = event.offsetY;
                                sudoEvent = { 
                                    x: event.offsetX,
                                    y: event.offsetY,
                                    wheelDelta: event.wheelDelta,
                                    wheelDeltaX: event.wheelDeltaX,
                                    wheelDeltaY: event.wheelDeltaY,
                                    altKey: event.altKey,
                                    ctrlKey: event.ctrlKey,
                                    metaKey: event.metaKey,
                                    shiftKey: event.shiftKey,
                                };
                            }else if(event instanceof MouseEvent){
                                mouseData.x = event.offsetX;
                                mouseData.y = event.offsetY;
                                sudoEvent = { 
                                    x: event.offsetX, 
                                    y: event.offsetY,
                                    altKey: event.altKey,
                                    ctrlKey: event.ctrlKey,
                                    metaKey: event.metaKey,
                                    shiftKey: event.shiftKey,
                                    buttons: event.buttons,
                                };
                            }else{
                                console.warn('unknown event type: ',event);
                            }
                            
                            communicationModule.run_withoutPromise('operator__callback__coupling_in__'+callbackName, [sudoEvent]);
                        };

                    //incoming messages
                        communicationModule.function['callback__'+callbackName] = function(xy,event,all_elements,relevant_elements){
                            dev.log.callback('.callback - engine has called: callback__'+callbackName+'(',xy,event,all_elements,relevant_elements); //#development
                            
                            if(core.callback.functions[callbackName]){
                                core.callback.functions[callbackName](xy.x,xy.y,event,{
                                    all: all_elements.map(core.element.getElementById),
                                    relevant: relevant_elements.map(core.element.getElementById),
                                });
                            }

                            relevant_elements.forEach(id => callbackRegistry.call(id,callbackName,xy.x,xy.y,event) );
                        };

                    resolve();
                });
            });
        });
    }

    this.mousePosition = function(){
        return mouseData;
    };
    this._dump = function(){
        dev.log.callback('._dump()'); //#development
        interface.operator.callback._dump();
    };
};