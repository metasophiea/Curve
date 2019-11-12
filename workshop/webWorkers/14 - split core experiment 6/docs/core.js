const core = new function(){
    const core_engine = new Worker("docs/core_engine.js");
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
    
    const __canvasElementAttributePrefix = 'core';
    const canvasElement = document.getElementById('theCanvas');
    canvasElement.setAttribute('tabIndex',1);
    
    const dev = {
        prefix:'core_console',
    
        library:{active:!true,fontStyle:'color:rgb(87, 161, 80); font-style:italic;'},
        element:{active:!true,fontStyle:'color:rgb(161, 145, 80); font-style:italic;'},
        elementLibrary:{active:!true,fontStyle:'color:rgb(129, 80, 161); font-style:italic;'},
        arrangement:{active:!true,fontStyle:'color:rgb(80, 161, 141); font-style:italic;'},
        render:{active:!true,fontStyle:'color:rgb(161, 84, 80); font-style:italic;'},
        viewport:{active:!true,fontStyle:'color:rgb(80, 134, 161); font-style:italic;'},
        stats:{active:!true,fontStyle:'color:rgb(87, 80, 161); font-style:italic;'},
        callback:{active:!true,fontStyle:'color:rgb(122, 163, 82); font-style:italic;'},
        interface:{active:true,fontStyle:'color:rgb(171, 77, 77); font-style:italic;'},
    
        log:{
            library:function(subSection,data){
                if(!dev.library.active){return;}
                console.log('%c'+dev.prefix+'.library.'+subSection+(new Array(...arguments).slice(1).join(' ')), dev.library.fontStyle );
            },
            element:function(data){
                if(!dev.element.active){return;}
                console.log('%c'+dev.prefix+'e.element'+(new Array(...arguments).join(' ')), dev.element.fontStyle );
            },
            elementLibrary:function(elementType,address,data){
                if(!dev.elementLibrary.active){return;}
                console.log('%c'+dev.prefix+'.elementLibrary.'+elementType+'['+address+']'+(new Array(...arguments).slice(2).join(' ')), dev.elementLibrary.fontStyle );
            },
            arrangement:function(data){
                if(!dev.arrangement.active){return;}
                console.log('%c'+dev.prefix+'.arrangement'+(new Array(...arguments).join(' ')), dev.arrangement.fontStyle );
            },
            render:function(data){
                if(!dev.render.active){return;}
                console.log('%c'+dev.prefix+'.render'+(new Array(...arguments).join(' ')), dev.render.fontStyle );
            },
            viewport:function(data){
                if(!dev.viewport.active){return;}
                console.log('%c'+dev.prefix+'e.viewport'+(new Array(...arguments).join(' ')), dev.viewport.fontStyle );
            },
            stats:function(data){
                if(!dev.stats.active){return;}
                console.log('%c'+dev.prefix+'.stats'+(new Array(...arguments).join(' ')), dev.stats.fontStyle );
            },
            callback:function(data){
                if(!dev.callback.active){return;}
                console.log('%c'+dev.prefix+'.callback'+(new Array(...arguments).join(' ')), dev.callback.fontStyle );
            },
            interface:function(data){
                if(!dev.interface.active){return;}
                console.log('%c'+dev.prefix+'.interface'+(new Array(...arguments).join(' ')), dev.interface.fontStyle );
            },
        },
    };
    
    //dialing in
        communicationModule.function.go = function(){
            console.log('go'); /* callback */
        };
        communicationModule.function.printToScreen = function(imageData){
            canvasElement.getContext("bitmaprenderer").transferFromImageBitmap(imageData);
        };
        communicationModule.function.onViewportAdjust = function(state){
            console.log('onViewportAdjust -> ',state); /* callback */
        };
    
        communicationModule.function.getCanvasAttributes = function(attributeNames=[],prefixActiveArray=[]){
            return attributeNames.map((name,index) => {
                return canvasElement.getAttribute((prefixActiveArray[index]?__canvasElementAttributePrefix:'')+name);
            });    
        };
        communicationModule.function.setCanvasAttributes = function(attributeNames=[],values=[],prefixActiveArray=[]){
            attributeNames.map((name,index) => {
                canvasElement.setAttribute((prefixActiveArray[index]?__canvasElementAttributePrefix:'')+name,values[index]);
            });
        };
        communicationModule.function.getCanvasParentAttributes = function(attributeNames=[],prefixActiveArray=[]){
            return attributeNames.map((name,index) => {
                return canvasElement.parentElement[(prefixActiveArray[index]?__canvasElementAttributePrefix:'')+name];
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
        communicationModule.function.setWindowAttributes = function(attributeNames=[],values=[]){
            return attributeNames.map((attribute,index) => {
                eval('window.'+attribute+' = "'+values[index]+'"');
            });
        };
    
    //dialing out
        this.meta = new function(){
            this.areYouReady = function(){
                return new Promise((resolve, reject) => {
                    communicationModule.run('areYouReady',[],resolve);
                });
            };
            this.refresh = function(){
                communicationModule.run('refresh',[]);
            };
        };
    
        this._dump = new function(){
            this.elememt = function(){
                return new Promise((resolve, reject) => {
                    communicationModule.run('_dump.elememt',[],resolve);
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
    
        this,element = new function(){
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

};


