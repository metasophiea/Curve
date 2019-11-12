const core = new function(){
    const core_engine = new Worker("docs/core_engine.js");
    const dev = {
        element:{active:true,fontStyle:'color:rgb(161, 145, 80); font-style:italic;'},
        elementLibrary:{active:true,fontStyle:'color:rgb(129, 80, 161); font-style:italic;'},
        arrangement:{active:true,fontStyle:'color:rgb(80, 161, 141); font-style:italic;'},
        render:{active:true,fontStyle:'color:rgb(161, 84, 80); font-style:italic;'},
        stats:{active:true,fontStyle:''},
        log:function(section){ 
            if(dev[section].active){
                console.log('%c'+'core_engine.'+section+(new Array(...arguments).slice(1).join(' ')),dev[section].fontStyle );
            }
        },
    };
    
    const self = this;
    
    const __canvasPrefix = 'core';
    const canvasElement = document.getElementById('theCanvas');
    canvasElement.setAttribute('tabIndex',1);
    
    const communicationModuleMaker = function(communicationObject,callerName){
        const self = this;
        const devMode = false;
        this.log = function(){
            if(!devMode){return;}
            let prefix = 'communicationModule['+callerName+']';
            console.log('%c'+prefix+(new Array(...arguments).join(' ')),'color:rgb(235, 52, 131); font-style:italic;' );
        };
        this.function = {};
        this.delayedFunction = {};
    
        let messageId = 0;
        const messagingCallbacks = {};
    
        function generateMessageID(){
            self.log('::generateMessageID()'); //#development
            return messageId++;
        }
    
        communicationObject.onmessage = function(encodedPacket){
            self.log('::communicationObject.onmessage('+JSON.stringify(encodedPacket)+')'); //#development
            let message = encodedPacket.data;
    
            if(message.outgoing){
                self.log('::communicationObject.onmessage -> message is an outgoing one'); //#development
                if(message.cargo.function in self.function){
                    self.log('::communicationObject.onmessage -> function "'+message.cargo.function+'" found'); //#development
                    self.log('::communicationObject.onmessage -> function arguments: '+JSON.stringify(message.cargo.arguments)); //#development
                    if(message.cargo.arguments == undefined){message.cargo.arguments = [];}
                    if(message.id == null){
                        self.log('::communicationObject.onmessage -> message ID missing; will not return any data'); //#development
                        self.function[message.cargo.function](...message.cargo.arguments);
                    }else{
                        self.log('::communicationObject.onmessage -> message ID found; "'+message.id+'", will return any data'); //#development
                        communicationObject.postMessage({
                            id:message.id,
                            outgoing:false,
                            cargo:self.function[message.cargo.function](...message.cargo.arguments),
                        });
                    }
                }else if(message.cargo.function in self.delayedFunction){
                    self.log('::communicationObject.onmessage -> delayed function "'+message.cargo.function+'" found'); //#development
                    self.log('::communicationObject.onmessage -> delayed function arguments: '+JSON.stringify(message.cargo.arguments)); //#development
                    if(message.cargo.arguments == undefined){message.cargo.arguments = [];}
                    if(message.id == null){
                        self.log('::communicationObject.onmessage -> message ID missing; will not return any data'); //#development
                        self.delayedFunction[message.cargo.function](...message.cargo.arguments);
                    }else{
                        self.log('::communicationObject.onmessage -> message ID found; "'+message.id+'", will return any data'); //#development
                        cargo:self.delayedFunction[message.cargo.function](...[function(returnedData){
                            communicationObject.postMessage({ id:message.id, outgoing:false, cargo:returnedData });
                        }].concat(message.cargo.arguments));
                    }
                }else{
                    self.log('::communicationObject.onmessage -> function "'+message.cargo.function+'" not found'); //#development
                }
            }else{
                self.log('::communicationObject.onmessage -> message is an incoming one'); //#development
                self.log('::communicationObject.onmessage -> message ID: '+message.id+' cargo: '+JSON.stringify(message.cargo)); //#development
                messagingCallbacks[message.id](message.cargo);
                delete messagingCallbacks[message.id];
            }
        };
        this.run = function(functionName,argumentList=[],callback,transferables){
            self.log('.run('+functionName+','+JSON.stringify(argumentList)+','+callback+','+JSON.stringify(transferables)+')'); //#development
            let id = null;
            if(callback != undefined){
                self.log('.run -> callback was defined; generating message ID'); //#development
                id = generateMessageID();
                self.log('.run -> message ID:',id); //#development
                messagingCallbacks[id] = callback;
            }
            communicationObject.postMessage({ id:id, outgoing:true, cargo:{function:functionName,arguments:argumentList} },transferables);
        };
    };
    const communicationModule = new communicationModuleMaker(core_engine,'core_console');
    
    
    
    //dialing in
        communicationModule.function.ready = function(){
            if(core.ready != undefined){core.ready();}
        };
        communicationModule.function.printToScreen = function(imageData){
            canvasElement.getContext("bitmaprenderer").transferFromImageBitmap(imageData);
        };
        communicationModule.function['document.body.style.overflow'] = function(state){
            if(state == undefined){ return document.body.style.overflow; }
            document.body.style.overflow = state;
        };
        communicationModule.function['window.devicePixelRatio'] = function(state){
            if(state == undefined){ return window.devicePixelRatio; }
            window.devicePixelRatio = state;
        };
        communicationModule.function['setCanvasAttributes'] = function(attributes=[],prefixActiveArray=[]){
            attributes.forEach((attribute,index) => {
                canvasElement[(prefixActiveArray[index]?__canvasPrefix:'')+attribute.name] = attribute.value;
            });
        };
        communicationModule.function['getCanvasAttributes'] = function(attributeNames,prefixActiveArray=[]){
            return attributeNames.map((name,index) => {
                return canvasElement.getAttribute((prefixActiveArray[index]?__canvasPrefix:'')+name);
            });
        };
        communicationModule.function['getCanvasParentAttributes'] = function(attributeNames,prefixActiveArray=[]){
            return attributeNames.map((name,index) => {
                return canvasElement.parentElement[(prefixActiveArray[index]?__canvasPrefix:'')+name];
            });
        };
    //dialing out
        //overarch
            this.ready = function(){};
            this.refresh = function(){
                return new Promise((resolve, reject) => {
                    communicationModule.run('refresh',[],resolve);
                });
            };
    
        //element
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
                this.executeMethod = function(id,method,argumentList=[]){
                    return new Promise((resolve, reject) => {
                        communicationModule.run('element.executeMethod',[id,method,argumentList],resolve);
                    });
                };
                this.boatload_executeMethod = new function(){
                    let containers = [];
                    this.load = function(container){
                        containers.push(container);
                    };
                    this.ship = function(){
                        communicationModule.run('element.boatload_executeMethod',[containers]);
                        containers = [];
                    };
                };
    
                this._dump = function(){
                    communicationModule.run('element._dump');
                };
            };
    
        //arrangement
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
                this._dump = function(){
                    communicationModule.run('arrangement._dump');
                };
            };
            
        //render
            this.render = new function(){
                this.clearColour = function(colour){
                    return new Promise((resolve, reject) => {
                        communicationModule.run('render.clearColour',[colour],resolve);
                    });
                };
                this.adjustCanvasSize = function(newWidth, newHeight){
                    communicationModule.run('render.adjustCanvasSize',[newWidth, newHeight]);
                };
                this.refreshCoordinates = function(){
                    communicationModule.run('render.refreshCoordinates',[]);
                };
                this.refresh = function(){
                    return new Promise((resolve, reject) => {
                        communicationModule.run('render.refresh',[],resolve);
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
                this.getCanvasDimensions = function(){
                    return new Promise((resolve, reject) => {
                        communicationModule.run('render.getCanvasDimensions',[],resolve);
                    });
                };
                this.drawDot = function(x,y,r,colour){
                    communicationModule.run('render.drawDot',[x,y,r,colour]);
                };
                this._dump = function(){
                    communicationModule.run('render._dump',[]);
                };
            };
    
        //viewport
            this.viewport = new function(){
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
                this.getElementUnderCanvasPoint = function(x,y){
                    return new Promise((resolve, reject) => {
                        communicationModule.run('viewport.getElementUnderCanvasPoint',[x,y],resolve);
                    });
                };
                this.getElementsUnderCanvasArea = function(points){
                    return new Promise((resolve, reject) => {
                        communicationModule.run('viewport.getElementsUnderCanvasArea',[points],resolve);
                    });
                };
                this.calculateViewportExtremities = function(){
                    communicationModule.run('viewport.calculateViewportExtremities',[]);
                };
                this.refresh = function(){
                    communicationModule.run('viewport.refresh',[]);
                };
                this.getBoundingBox = function(){
                    return new Promise((resolve, reject) => {
                        communicationModule.run('viewport.getBoundingBox',[],resolve);
                    });
                };
                this.mousePosition = function(x,y){
                    return new Promise((resolve, reject) => {
                        communicationModule.run('viewport.mousePosition',[x,y],resolve);
                    });
                };
                this.stopMouseScroll = function(bool){
                    return new Promise((resolve, reject) => {
                        communicationModule.run('viewport.stopMouseScroll',[bool],resolve);
                    });
                };
                this.clickVisibility = function(bool){
                    return new Promise((resolve, reject) => {
                        communicationModule.run('viewport.clickVisibility',[bool],resolve);
                    });
                };
                this.getHeight = function(){
                    return new Promise((resolve, reject) => {
                        communicationModule.run('viewport.getHeight',[],resolve);
                    });
                };
                this.getWidth = function(){
                    return new Promise((resolve, reject) => {
                        communicationModule.run('viewport.getWidth',[],resolve);
                    });
                };
                this._dump = function(){
                    communicationModule.run('viewport._dump',[]);
                };
    
                this.onCameraAdjust = function(state){};
                communicationModule.function['viewport.onCameraAdjust'] = this.onCameraAdjust;
            };
    
        //stats
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
    
        //callback
            this.callback = new function(){
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
    
                this.listCallbackTypes = function(){
                    return new Promise((resolve, reject) => {
                        communicationModule.run('callback.listCallbackTypes',[],resolve);
                    });
                };
                this.getShapeCallbackState = function(type){
                    return new Promise((resolve, reject) => {
                        communicationModule.run('callback.getShapeCallbackState',[type],resolve);
                    });
                };
                this.activateShapeCallback = function(type){
                    communicationModule.run('callback.activateShapeCallback',[type]);
                };
                this.disactivateShapeCallback = function(type){
                    communicationModule.run('callback.disactivateShapeCallback',[type]);
                };
                this.activateAllShapeCallbacks = function(){
                    communicationModule.run('callback.activateAllShapeCallbacks',[]);
                };
                this.disactivateAllShapeCallbacks = function(){
                    communicationModule.run('callback.disactivateAllShapeCallbacks',[]);
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
                        canvasElement[callbackName] = function(event){
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
                                sudoEvent = { X: event.offsetX, Y: event.offsetY };
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
};

let dynamicGroup;


core.element.create('group','dynamicGroup').then(newId => {
    dynamicGroup = newId;
    core.arrangement.append(dynamicGroup);
    core.element.executeMethod(dynamicGroup,'heedCamera',[true]);

    core.element.create('rectangle','rectangle_1').then(newId => {
        core.element.executeMethod(dynamicGroup,'append',[newId]);
        core.element.executeMethod(newId,'unifiedAttribute',[{ x:30, y:30, width:200, height:200, colour:{r:0,g:0,b:0,a:1} }]);
        [
            'onmousedown', 'onmouseup', 'onmousemove', 'onmouseenter', 'onmouseleave', 'onwheel', 'onclick', 'ondblclick',
            'onmouseenterelement', 'onmouseleaveelement',
            'onkeydown', 'onkeyup',
        ].forEach(callbackType => {
            core.callback.attachCallback(newId,callbackType,(x,y,event)=>{console.log('rectangle_1 - '+callbackType,x,y,event);});
        });
    });
    core.element.create('rectangle','rectangle_2').then(newId => {
        core.element.executeMethod(dynamicGroup,'append',[newId]);
        core.element.executeMethod(newId,'unifiedAttribute',[{ x:60, y:30, width:200, height:200, colour:{r:1,g:1,b:0,a:1} }]);
        [
            'onmousedown', 'onmouseup', 'onmousemove', 'onmouseenter', 'onmouseleave', 'onwheel', 'onclick', 'ondblclick',
            'onmouseenterelement', 'onmouseleaveelement',
            'onkeydown', 'onkeyup',
        ].forEach(callbackType => {
            core.callback.attachCallback(newId,callbackType,(x,y,event)=>{console.log('rectangle_2 - '+callbackType,x,y,event);});
        });
    });
    core.element.create('rectangle','rectangle_3').then(newId => {
        core.element.executeMethod(dynamicGroup,'append',[newId]);
        core.element.executeMethod(newId,'unifiedAttribute',[{ x:90, y:30, width:200, height:200, colour:{r:1,g:0,b:1,a:1} }]);
        [
            'onmousedown', 'onmouseup', 'onmousemove', 'onmouseenter', 'onmouseleave', 'onwheel', 'onclick', 'ondblclick',
            'onmouseenterelement', 'onmouseleaveelement',
            'onkeydown', 'onkeyup',
        ].forEach(callbackType => {
            core.callback.attachCallback(newId,callbackType,(x,y,event)=>{console.log('rectangle_3 - '+callbackType,x,y,event);});
        });
    });
});


[
    'onmousedown', 'onmouseup', 'onmousemove', 'onmouseenter', 'onmouseleave', 'onwheel', 'onclick', 'ondblclick',
    'onmouseenterelement', 'onmouseleaveelement',
    'onkeydown', 'onkeyup',
].forEach(callbackType => {
    core.callback.functions[callbackType] = function(x,y,event,elements){console.log(callbackType+':',x,y,event,elements);}
});





setTimeout(()=>{core.render.frame();},250);


