this.callback = new function(){
    this.listCallbackTypes = function(){
        dev.log.interface('.callback.listCallbackTypes()'); //#development
        return new Promise((resolve, reject) => {
            communicationModule.run('callback.listCallbackTypes',[],resolve);
        });
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
        dev.log.interface('.callback.getCallback(',element,callbackType); //#development
        callbackRegistry.getCallback(element.getId(), callbackType);
    };
    this.attachCallback = function(element, callbackType, callback){
        dev.log.interface('.callback.attachCallback(',element,callbackType,callback); //#development
        callbackRegistry.register(element.getId(), callbackType, callback);
        communicationModule.run('callback.attachCallback',[element.getId(),callbackType]);
    };
    this.removeCallback = function(element, callbackType){
        dev.log.interface('.callback.removeCallback(',element,callbackType); //#development
        callbackRegistry.remove(element.getId(), callbackType);
        communicationModule.run('callback.removeCallback',[element.getId(),callbackType]);
    };

    let callbackActivationMode = 'firstMatch'; //topMostOnly / firstMatch / allMatches
    this.callbackActivationMode = function(mode){
        if(mode==undefined){return callbackActivationMode;}
        dev.log.interface('.callback.callbackActivationMode(',mode); //#development
        callbackActivationMode = mode;
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
                        altKey: event.altKey,
                        ctrlKey: event.ctrlKey,
                        metaKey: event.metaKey,
                        shiftKey: event.shiftKey,
                    };
                }else if(event instanceof MouseEvent){
                    sudoEvent = { 
                        X: event.offsetX, 
                        Y: event.offsetY,
                        altKey: event.altKey,
                        ctrlKey: event.ctrlKey,
                        metaKey: event.metaKey,
                        shiftKey: event.shiftKey,
                        buttons: event.buttons,
                    };
                    if(callbackName == 'onmousemove'){
                        _canvas_.core.viewport.getMousePosition(sudoEvent.X,sudoEvent.Y);
                    }
                }else{
                    console.warn('unknown event type: ',event);
                }

                communicationModule.run('callback.coupling_in.'+callbackName,[sudoEvent]);
            };

            //service
                communicationModule.function['callback.'+callbackName] = function(x,y,event,elements){
                    if(self.callback.functions[callbackName]){
                        self.callback.functions[callbackName](x,y,event,{
                            all: elements.all.map(id => elementRegistry[id]),
                            relevant: elements.relevant ? elements.relevant.map(id => elementRegistry[id]) : undefined,
                        });
                    }

                    elements.relevant.forEach(id => callbackRegistry.call(id,callbackName,x,y,event) );
                };

        });
    });
};