//dialing out
    this.meta = new function(){
        this.areYouReady = function(){
            dev.log.interface('.areYouReady()'); //#development
            return new Promise((resolve, reject) => {
                communicationModule.run('areYouReady',[],resolve);
            });
        };
        this.refresh = function(){
            dev.log.interface('.refresh()'); //#development
            return new Promise((resolve, reject) => {
                communicationModule.run('refresh',[],resolve);
            });
        };
        this.createSetAppend = function(type,name,setList,appendingGroup){
            dev.log.interface('.createSetAppend('+type+','+name+','+JSON.stringify(setList)+','+appendingGroup+')'); //#development
            return new Promise((resolve, reject) => {
                communicationModule.run('createSetAppend',[type,name,setList,appendingGroup],resolve);
            });
        };
    };

    this._dump = new function(){
        this.elememt = function(){
            return new Promise((resolve, reject) => {
                communicationModule.run('_dump.element',[],resolve);
            });
        };
        this.arrangement = function(){
            return new Promise((resolve, reject) => {
                communicationModule.run('_dump.arrangement',[],resolve);
            });
        };
        this.render = function(){
            return new Promise((resolve, reject) => {
                communicationModule.run('_dump.render',[],resolve);
            });
        };
        this.viewport = function(){
            return new Promise((resolve, reject) => {
                communicationModule.run('_dump.viewport',[],resolve);
            });
        };
        this.callback = function(){
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
                    containers.push(container);
                };
                this.ship = function(){
                    communicationModule.run('boatload.element.executeMethod',[containers]);
                    containers = [];
                };
            };
        };
    };

    this.element = new function(){
        this.getAvailableElements = function(){
            return new Promise((resolve, reject) => {
                communicationModule.run('element.getAvailableElements',[],resolve);
            });
        };
        this.getCreatedElements = function(){
            return new Promise((resolve, reject) => {
                communicationModule.run('element.getCreatedElements',[],resolve);
            });
        };
        this.create = function(type,name){
            return new Promise((resolve, reject) => {
                communicationModule.run('element.create',[type,name],resolve);
            });
        };
        this.delete = function(id){
            communicationModule.run('element.delete',[id],resolve);
        };
        this.deleteAllCreated = function(){
            communicationModule.run('element.deleteAllCreated',[],resolve);
        };
        this.getTypeById = function(id){
            return new Promise((resolve, reject) => {
                communicationModule.run('element.getTypeById',[id],resolve);
            });
        };
        this.executeMethod = function(id,method,argumentList=[],transferableArguments){
            return new Promise((resolve, reject) => {
                communicationModule.run('element.executeMethod',[id,method,argumentList],resolve,transferableArguments);
            });
        };
    };

    this.arrangement = new function(){
        this.new = function(){
            communicationModule.run('arrangement.new');
        };
        this.prepend = function(id){
            communicationModule.run('arrangement.prepend',[id]);
        };
        this.append = function(id){
            communicationModule.run('arrangement.append',[id]);
        };
        this.remove = function(id){
            communicationModule.run('arrangement.remove',[id]);
        };
        this.clear = function(){
            communicationModule.run('arrangement.clear');
        };
        this.getElementAddress = function(id){
            return new Promise((resolve, reject) => {
                communicationModule.run('arrangement.getElementAddress',[id],resolve);
            });
        };
        this.getElementByAddress = function(address){
            return new Promise((resolve, reject) => {
                communicationModule.run('arrangement.getElementByAddress',[address],resolve);
            });
        };
        this.getElementsUnderPoint = function(x,y){
            return new Promise((resolve, reject) => {
                communicationModule.run('arrangement.getElementsUnderPoint',[x,y],resolve);
            });
        };
        this.getElementsUnderArea = function(points){
            return new Promise((resolve, reject) => {
                communicationModule.run('arrangement.getElementsUnderArea',[points],resolve);
            });
        };
        this.printTree = function(mode){
            communicationModule.run('arrangement.printTree',[mode]);
        };
    };

    this.render = new function(){
        this.refresh = function(){
            return new Promise((resolve, reject) => {
                communicationModule.run('render.refresh',[],resolve);
            });
        };
        this.clearColour = function(colour){
            return new Promise((resolve, reject) => {
                communicationModule.run('render.clearColour',[colour],resolve);
            });
        };
        this.adjustCanvasSize = function(newWidth, newHeight){
            communicationModule.run('render.adjustCanvasSize',[newWidth, newHeight]);
        };
        this.getCanvasSize = function(){
            return new Promise((resolve, reject) => {
                communicationModule.run('render.getCanvasSize',[],resolve);
            });
        };
        this.activeLimitToFrameRate = function(active){
            return new Promise((resolve, reject) => {
                communicationModule.run('render.activeLimitToFrameRate',[active],resolve);
            });
        };
        this.frameRateLimit = function(rate){
            return new Promise((resolve, reject) => {
                communicationModule.run('render.frameRateLimit',[rate],resolve);
            });
        };
        this.frame = function(){
            communicationModule.run('render.frame',[]);
        };
        this.active = function(active){
            return new Promise((resolve, reject) => {
                communicationModule.run('render.active',[active],resolve);
            });
        };
    };

    this.viewport = new function(){
        this.refresh = function(){
            communicationModule.run('viewport.refresh',[]);
        };
        this.position = function(x,y){
            return new Promise((resolve, reject) => {
                communicationModule.run('viewport.position',[x,y],resolve);
            });
        };
        this.scale = function(s){
            return new Promise((resolve, reject) => {
                communicationModule.run('viewport.scale',[s],resolve);
            });
        };
        this.angle = function(a){
            return new Promise((resolve, reject) => {
                communicationModule.run('viewport.angle',[a],resolve);
            });
        };
        this.getElementsUnderPoint = function(x,y){
            return new Promise((resolve, reject) => {
                communicationModule.run('viewport.getElementsUnderPoint',[x,y],resolve);
            });
        };
        this.getElementsUnderArea = function(points){
            return new Promise((resolve, reject) => {
                communicationModule.run('viewport.getElementsUnderArea',[points],resolve);
            });
        };
        this.getMousePosition = function(x,y){
            return new Promise((resolve, reject) => {
                communicationModule.run('viewport.getMousePosition',[x,y],resolve);
            });
        };
        this.getBoundingBox = function(){
            return new Promise((resolve, reject) => {
                communicationModule.run('viewport.getBoundingBox',[],resolve);
            });
        };
        this.stopMouseScroll = function(bool){
            return new Promise((resolve, reject) => {
                communicationModule.run('viewport.stopMouseScroll',[bool],resolve);
            });
        };
    };

    this.stats = new function(){
        this.active = function(active){
            return new Promise((resolve, reject) => {
                communicationModule.run('stats.active',[active],resolve);
            });
        };
        this.getReport = function(){
            return new Promise((resolve, reject) => {
                communicationModule.run('stats.getReport',[],resolve);
            });
        };
    };

    this.callback = new function(){
        this.listCallbackTypes = function(){
            return new Promise((resolve, reject) => {
                communicationModule.run('callback.listCallbackTypes',[],resolve);
            });
        };
        this.getCallbackTypeState = function(type){
            return new Promise((resolve, reject) => {
                communicationModule.run('callback.getCallbackTypeState',[type],resolve);
            });
        };
        this.activateCallbackType = function(type){
            communicationModule.run('callback.activateCallbackType',[type]);
        };
        this.disactivateCallbackType = function(type){
            communicationModule.run('callback.disactivateCallbackType',[type]);
        };
        this.activateAllCallbackTypes = function(){
            communicationModule.run('callback.activateAllCallbackTypes',[]);
        };
        this.disactivateAllCallbackTypes = function(){
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
            callbackRegistry.register(id, callbackType, callback);
            communicationModule.run('callback.attachCallback',[id,callbackType]);
        };
        this.removeCallback = function(id, callbackType){
            callbackRegistry.remove(id, callbackType);
            communicationModule.run('callback.removeCallback',[id,callbackType]);
        };

        let allowDeepElementCallback = false;
        this.allowDeepElementCallback = function(bool){
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

//dialing in
    communicationModule.function.go = function(){
        if(self.meta.go){self.meta.go();} /* callback */
    };
    communicationModule.function.printToScreen = function(imageData){
        _canvas_.getContext("bitmaprenderer").transferFromImageBitmap(imageData);
    };
    communicationModule.function.onViewportAdjust = function(state){
        console.log('onViewportAdjust -> ',state); /* callback */
    };

    communicationModule.function.getCanvasAttributes = function(attributeNames=[],prefixActiveArray=[]){
        return attributeNames.map((name,index) => {
            return _canvas_.getAttribute((prefixActiveArray[index]?__canvasPrefix:'')+name);
        });    
    };
    communicationModule.function.setCanvasAttributes = function(attributes=[],prefixActiveArray=[]){
        attributes.map((attribute,index) => {
            _canvas_.setAttribute((prefixActiveArray[index]?__canvasPrefix:'')+attribute.name,attribute.value);
        });
    };
    communicationModule.function.getCanvasParentAttributes = function(attributeNames=[],prefixActiveArray=[]){
        return attributeNames.map((name,index) => {
            return _canvas_.parentElement[(prefixActiveArray[index]?__canvasPrefix:'')+name];
        });
    };

    communicationModule.function.getDocumentAttributes = function(attributeNames=[]){
        return attributeNames.map(attribute => {
            return eval('document.'+attribute);
        });
    };
    communicationModule.function.setDocumentAttributes = function(attributeNames=[],values=[]){
        return attributeNames.map((attribute,index) => {
            eval('document.'+attribute+' = "'+values[index]+'"');
        });
    };
    communicationModule.function.getWindowAttributes = function(attributeNames=[]){
        return attributeNames.map(attribute => {
            return eval('window.'+attribute);
        });
    };
    communicationModule.function.setWindowAttributes = function(attributes=[]){
        attributes.map((attribute,index) => {
            eval('window.'+attribute.name+' = "'+attribute.value+'"');
        });
    };