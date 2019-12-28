this.meta = new function(){
    this.areYouReady = function(){
        dev.log.interface('.meta.areYouReady()'); //#development
        return new Promise((resolve, reject) => {
            communicationModule.run('areYouReady',[],resolve);
        });
    };
    this.refresh = function(){
        dev.log.interface('.meta.refresh()'); //#development
        return new Promise((resolve, reject) => {
            communicationModule.run('refresh',[],resolve);
        });
    };
    this.createSetAppend = function(type,name,setList,appendingGroup){
        dev.log.interface('.meta.createSetAppend('+type+','+name+','+JSON.stringify(setList)+','+appendingGroup+')'); //#development
        return new Promise((resolve, reject) => {
            communicationModule.run('createSetAppend',[type,name,setList,appendingGroup],resolve);
        });
    };
};

this._dump = new function(){
    this.elememt = function(){
        dev.log.interface('._dump.elememt()'); //#development
        return new Promise((resolve, reject) => {
            communicationModule.run('_dump.element',[],resolve);
        });
    };
    this.arrangement = function(){
        dev.log.interface('._dump.arrangement()'); //#development
        return new Promise((resolve, reject) => {
            communicationModule.run('_dump.arrangement',[],resolve);
        });
    };
    this.render = function(){
        dev.log.interface('._dump.render()'); //#development
        return new Promise((resolve, reject) => {
            communicationModule.run('_dump.render',[],resolve);
        });
    };
    this.viewport = function(){
        dev.log.interface('._dump.viewport()'); //#development
        return new Promise((resolve, reject) => {
            communicationModule.run('_dump.viewport',[],resolve);
        });
    };
    this.callback = function(){
        dev.log.interface('._dump.callback()'); //#development
        return new Promise((resolve, reject) => {
            communicationModule.run('_dump.callback',[],resolve);
        });
    };
};

this.boatload = new function(){
    this.element = new function(){
        this.executeMethod = new function(){
            let containers = [];
            this.load = function(container){
                dev.log.interface('.boatload.element.executeMethod.load('+JSON.stringify(container)+')'); //#development
                containers.push(container);
            };
            this.ship = function(){
                dev.log.interface('.boatload.element.executeMethod.ship()'); //#development
                communicationModule.run('boatload.element.executeMethod',[containers]);
                containers = [];
            };
        };
    };
};

this.element = new function(){
    this.getAvailableElements = function(){
        dev.log.interface('.element.getAvailableElements()'); //#development
        return new Promise((resolve, reject) => {
            communicationModule.run('element.getAvailableElements',[],resolve);
        });
    };
    this.installElement = function(elementName,creatorMethod){
        dev.log.interface('.element.installElement('+elementName+','+creatorMethod+')'); //#development
        return new Promise((resolve, reject) => {
            communicationModule.run('element.installElement',[elementName,_canvas_.library.misc.serialize(creatorMethod)],resolve);
        });
    };
    this.getCreatedElements = function(){
        dev.log.interface('.element.getCreatedElements()'); //#development
        return new Promise((resolve, reject) => {
            communicationModule.run('element.getCreatedElements',[],resolve);
        });
    };
    this.create = function(type,name){
        dev.log.interface('.element.create('+type+','+name+')'); //#development
        return new Promise((resolve, reject) => {
            communicationModule.run('element.create',[type,name],resolve);
        });
    };
    this.delete = function(id){
        dev.log.interface('.element.delete('+id+')'); //#development
        communicationModule.run('element.delete',[id]);
    };
    this.deleteAllCreated = function(){
        dev.log.interface('.element.deleteAllCreated()'); //#development
        communicationModule.run('element.deleteAllCreated',[]);
    };
    this.getTypeById = function(id){
        dev.log.interface('.element.getTypeById('+id+')'); //#development
        return new Promise((resolve, reject) => {
            communicationModule.run('element.getTypeById',[id],resolve);
        });
    };
    this.executeMethod = function(id,method,argumentList=[],transferableArguments){
        dev.log.interface('.element.executeMethod('+id+','+method+','+JSON.stringify(argumentList)+','+transferableArguments+')'); //#developments
        return new Promise((resolve, reject) => {
            communicationModule.run('element.executeMethod',[id,method,argumentList],resolve,transferableArguments);
        });
    };
};

this.arrangement = new function(){
    this.new = function(){
        dev.log.interface('.arrangement.new()'); //#development
        communicationModule.run('arrangement.new');
    };
    this.prepend = function(id){
        dev.log.interface('.arrangement.prepend('+id+')'); //#development
        communicationModule.run('arrangement.prepend',[id]);
    };
    this.append = function(id){
        dev.log.interface('.arrangement.append('+id+')'); //#development
        communicationModule.run('arrangement.append',[id]);
    };
    this.remove = function(id){
        dev.log.interface('.arrangement.remove('+id+')'); //#development
        communicationModule.run('arrangement.remove',[id]);
    };
    this.clear = function(){
        dev.log.interface('.arrangement.clear()'); //#development
        communicationModule.run('arrangement.clear');
    };
    this.getElementAddress = function(id){
        dev.log.interface('.arrangement.getElementAddress('+id+')'); //#development
        return new Promise((resolve, reject) => {
            communicationModule.run('arrangement.getElementAddress',[id],resolve);
        });
    };
    this.getElementByAddress = function(address){
        dev.log.interface('.arrangement.getElementByAddress('+address+')'); //#development
        return new Promise((resolve, reject) => {
            communicationModule.run('arrangement.getElementByAddress',[address],resolve);
        });
    };
    this.getElementsUnderPoint = function(x,y){
        dev.log.interface('.arrangement.getElementsUnderPoint('+x+','+y+')'); //#development
        return new Promise((resolve, reject) => {
            communicationModule.run('arrangement.getElementsUnderPoint',[x,y],resolve);
        });
    };
    this.getElementsUnderArea = function(points){
        dev.log.interface('.arrangement.getElementsUnderArea('+points+')'); //#development
        return new Promise((resolve, reject) => {
            communicationModule.run('arrangement.getElementsUnderArea',[points],resolve);
        });
    };
    this.printTree = function(mode){
        dev.log.interface('.arrangement.printTree('+mode+')'); //#development
        communicationModule.run('arrangement.printTree',[mode]);
    };
    this.areParents = function(elementId,potentialParents=[]){
        dev.log.interface('.arrangement.areParents('+elementId+','+JSON.stringify(potentialParents)+')'); //#development
        return new Promise((resolve, reject) => {
            communicationModule.run('arrangement.areParents',[elementId,potentialParents],resolve);
        });
    };
};

this.render = new function(){
    this.refresh = function(){
        dev.log.interface('.render.refresh()'); //#development
        return new Promise((resolve, reject) => {
            communicationModule.run('render.refresh',[],resolve);
        });
    };
    this.clearColour = function(colour){
        dev.log.interface('.render.clearColour('+JSON.stringify(colour)+')'); //#development
        return new Promise((resolve, reject) => {
            communicationModule.run('render.clearColour',[colour],resolve);
        });
    };
    this.adjustCanvasSize = function(newWidth, newHeight){
        dev.log.interface('.render.adjustCanvasSize('+newWidth+','+newHeight+')'); //#development
        communicationModule.run('render.adjustCanvasSize',[newWidth, newHeight]);
    };
    this.getCanvasSize = function(){
        dev.log.interface('.render.getCanvasSize()'); //#development
        return new Promise((resolve, reject) => {
            communicationModule.run('render.getCanvasSize',[],resolve);
        });
    };
    this.activeLimitToFrameRate = function(active){
        dev.log.interface('.render.activeLimitToFrameRate('+active+')'); //#development
        return new Promise((resolve, reject) => {
            communicationModule.run('render.activeLimitToFrameRate',[active],resolve);
        });
    };
    this.frameRateLimit = function(rate){
        dev.log.interface('.render.frameRateLimit('+rate+')'); //#development
        return new Promise((resolve, reject) => {
            communicationModule.run('render.frameRateLimit',[rate],resolve);
        });
    };
    this.frame = function(){
        dev.log.interface('.render.frame()'); //#development
        communicationModule.run('render.frame',[]);
    };
    this.active = function(active){
        dev.log.interface('.render.active('+active+')'); //#development
        return new Promise((resolve, reject) => {
            communicationModule.run('render.active',[active],resolve);
        });
    };
};

this.viewport = new function(){
    this.refresh = function(){
        dev.log.interface('.viewport.refresh()'); //#development
        communicationModule.run('viewport.refresh',[]);
    };
    this.position = function(x,y){
        dev.log.interface('.viewport.position('+x+','+y+')'); //#development
        return new Promise((resolve, reject) => {
            communicationModule.run('viewport.position',[x,y],resolve);
        });
    };
    this.scale = function(s){
        dev.log.interface('.viewport.scale('+s+')'); //#development
        return new Promise((resolve, reject) => {
            communicationModule.run('viewport.scale',[s],resolve);
        });
    };
    this.angle = function(a){
        dev.log.interface('.viewport.angle('+a+')'); //#development
        return new Promise((resolve, reject) => {
            communicationModule.run('viewport.angle',[a],resolve);
        });
    };
    this.getElementsUnderPoint = function(x,y){
        dev.log.interface('.viewport.getElementsUnderPoint('+x+','+y+')'); //#development
        return new Promise((resolve, reject) => {
            communicationModule.run('viewport.getElementsUnderPoint',[x,y],resolve);
        });
    };
    this.getElementsUnderArea = function(points){
        dev.log.interface('.viewport.getElementsUnderArea('+JSON.stringify(points)+')'); //#development
        return new Promise((resolve, reject) => {
            communicationModule.run('viewport.getElementsUnderArea',[points],resolve);
        });
    };
    this.getMousePosition = function(x,y){
        dev.log.interface('.viewport.getMousePosition('+x+','+y+')'); //#development
        return new Promise((resolve, reject) => {
            communicationModule.run('viewport.getMousePosition',[x,y],resolve);
        });
    };
    this.getBoundingBox = function(){
        dev.log.interface('.viewport.getBoundingBox()'); //#development
        return new Promise((resolve, reject) => {
            communicationModule.run('viewport.getBoundingBox',[],resolve);
        });
    };
    this.stopMouseScroll = function(bool){
        dev.log.interface('.viewport.stopMouseScroll('+bool+')'); //#development
        return new Promise((resolve, reject) => {
            communicationModule.run('viewport.stopMouseScroll',[bool],resolve);
        });
    };
};

this.stats = new function(){
    this.active = function(active){
        dev.log.interface('.stats.active('+active+')'); //#development
        return new Promise((resolve, reject) => {
            communicationModule.run('stats.active',[active],resolve);
        });
    };
    this.getReport = function(){
        dev.log.interface('.stats.getReport()'); //#development
        return new Promise((resolve, reject) => {
            communicationModule.run('stats.getReport',[],resolve);
        });
    };
};

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
    this.attachCallback = function(id, callbackType, callback){
        dev.log.interface('.callback.attachCallback('+id+','+callbackType+','+callback+')'); //#development
        callbackRegistry.register(id, callbackType, callback);
        communicationModule.run('callback.attachCallback',[id,callbackType]);
    };
    this.removeCallback = function(id, callbackType){
        dev.log.interface('.callback.removeCallback('+id+','+callbackType+')'); //#development
        callbackRegistry.remove(id, callbackType);
        communicationModule.run('callback.removeCallback',[id,callbackType]);
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