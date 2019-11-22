this.callback = new function(){
    this.listCallbackTypes = function(){
        dev.log.interface('.callback.listCallbackTypes()'); //#development
        return new Promise((resolve, reject) => {
            communicationModule.run('callback.listCallbackTypes',[],resolve);
        });
    };
    this.getCallbackTypeState = function(type){
        dev.log.interface('.callback.getCallbackTypeState('+type+')'); //#development
        return new Promise((resolve, reject) => {
            communicationModule.run('callback.getCallbackTypeState',[type],resolve);
        });
    };
    this.activateCallbackType = function(type){
        dev.log.interface('.callback.activateCallbackType('+type+')'); //#development
        communicationModule.run('callback.activateCallbackType',[type]);
    };
    this.disactivateCallbackType = function(type){
        dev.log.interface('.callback.disactivateCallbackType('+type+')'); //#development
        communicationModule.run('callback.disactivateCallbackType',[type]);
    };
    this.activateAllCallbackTypes = function(){
        dev.log.interface('.callback.activateAllCallbackTypes()'); //#development
        communicationModule.run('callback.activateAllCallbackTypes',[]);
    };
    this.disactivateAllCallbackTypes = function(){
        dev.log.interface('.callback.disactivateAllCallbackTypes()'); //#development
        communicationModule.run('callback.disactivateAllCallbackTypes',[]);
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
            if(id == undefined || registeredShapes[id] == undefined || registeredShapes[id][callbackType] == undefined){return;}
            registeredShapes[id][callbackType](x,y,event);
        };
    };
    this.getCallback = function(element, callbackType){
        dev.log.interface('.callback.getCallback('+element+','+callbackType+')'); //#development
        callbackRegistry.getCallback(element.getId(), callbackType);
    };
    this.attachCallback = function(element, callbackType, callback){
        dev.log.interface('.callback.attachCallback('+element+','+callbackType+','+callback+')'); //#development
        callbackRegistry.register(element.getId(), callbackType, callback);
        communicationModule.run('callback.attachCallback',[element.getId(),callbackType]);
    };
    this.removeCallback = function(element, callbackType){
        dev.log.interface('.callback.removeCallback('+element+','+callbackType+')'); //#development
        callbackRegistry.remove(element.getId(), callbackType);
        communicationModule.run('callback.removeCallback',[element.getId(),callbackType]);
    };

    let allowDeepElementCallback = false;
    this.allowDeepElementCallback = function(bool){
        dev.log.interface('.callback.allowDeepElementCallback('+bool+')'); //#development
        if(bool==undefined){return allowDeepElementCallback;}
        allowDeepElementCallback = bool;
    };

    this.functions = {};
    this.listCallbackTypes().then(callbackNames => {
        callbackNames.forEach(callbackName => {
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
                    sudoEvent = { 
                        X: event.offsetX,
                        Y: event.offsetY,
                        wheelDelta: event.wheelDelta,
                        wheelDeltaX: event.wheelDeltaX,
                        wheelDeltaY: event.wheelDeltaY,
                    };
                }else if(event instanceof MouseEvent){
                    sudoEvent = { 
                        X: event.offsetX, 
                        Y: event.offsetY,
                    };
                }else{
                    console.warn('unknown event type: ',event);
                }

                communicationModule.run('callback.coupling.'+callbackName,[sudoEvent]);
            };
            communicationModule.function['callback.'+callbackName] = function(x,y,event,elements){
                if(allowDeepElementCallback){
                    elements.forEach(id => { callbackRegistry.call(id,callbackName,x,y,event); });
                }else{
                    callbackRegistry.call(elements[0],callbackName,x,y,event);
                }
                if(self.callback.functions[callbackName]){
                    self.callback.functions[callbackName](x,y,event,elements);
                }
            };
        });
    });
};