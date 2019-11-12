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
const communicationModule = new communicationModuleMaker(this,'core_engine');

const dev = {
    prefix:'core_engine',

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
    //meta
        communicationModule.function['areYouReady'] = function(){
            dev.log.render('areYouReady()'); //#development
            return true;
        };
        communicationModule.delayedFunction['refresh'] = function(responseFunction){
            dev.log.render('refresh('+responseFunction+')'); //#development
            render.refresh(() => {
                viewport.refresh();
                responseFunction();
            });
        };

    //_dump
        communicationModule.function['elememt._dump'] = function(){
            dev.log.render('elememt._dump()'); //#development
            elememt._dump();
        };
        communicationModule.function['arrangement._dump'] = function(){
            dev.log.render('arrangement._dump()'); //#development
            arrangement._dump();
        };
        communicationModule.function['render._dump'] = function(){
            dev.log.render('elememt._dump()'); //#development
            render._dump();render
        };
        communicationModule.function['viewport._dump'] = function(){
            dev.log.render('viewport._dump()'); //#development
            viewport._dump();
        };
        communicationModule.function['callback._dump'] = function(){
            dev.log.render('callback._dump()'); //#development
            callback._dump();
        };

    //boatload
        communicationModule.function['boatload.element.executeMethod'] = function(containers){
            dev.log.render('boatload.element.executeMethod('+containers+')'); //#development
            containers.forEach(container => { 
                communicationModule.function['element.executeMethod'](container.id,container.method,container.argumentList); 
            });
        };

    //element
        communicationModule.function['element.getAvailableElements'] = function(){
            dev.log.render('element.getAvailableElements()'); //#development
            return element.getAvailableElements();
        };
        communicationModule.function['element.getCreatedElements'] = function(){
            dev.log.render('element.getCreatedElements()'); //#development
            return element.getCreatedElements().map(ele => element.getIdFromElement(ele));
        };
        communicationModule.function['element.create'] = function(type,name){
            dev.log.render('element.create('+type+','+name+')'); //#development
            return element.getIdFromElement(element.create(type,name));
        };
        communicationModule.function['element.delete'] = function(id){
            dev.log.render('element.delete('+id+')'); //#development
            element.delete(element.getElementFromId(id));
        };
        communicationModule.function['element.deleteAllCreated'] = function(){
            dev.log.render('element.deleteAllCreated()'); //#development
            element.deleteAllCreated();
        };
        communicationModule.function['element.getTypeById'] = function(id){
            dev.log.render('element.getTypeById('+id+')'); //#development
            return element.getTypeById(element.getElementFromId(id));
        };
        communicationModule.function['element.executeMethod'] = function(id,method,argumentList=[]){
            dev.log.render('element.executeMethod('+id+','+method+','+argumentList+')'); //#development
            return element.getElementFromId(id).interface[method](...argumentList);
        };

    //arrangement
        communicationModule.function['arrangement.new'] = function(){
            dev.log.render('arrangement.new()'); //#development
            arrangement.new();
        };
        communicationModule.function['arrangement.prepend'] = function(id){
            dev.log.render('arrangement.prepend('+id+')'); //#development
            arrangement.prepend(element.getElementFromId(id));
        };
        communicationModule.function['arrangement.append'] = function(id){
            dev.log.render('arrangement.append('+id+')'); //#development
            arrangement.append(element.getElementFromId(id));
        };
        communicationModule.function['arrangement.remove'] = function(id){
            dev.log.render('arrangement.remove('+id+')'); //#development
            arrangement.remove(element.getElementFromId(id));
        };
        communicationModule.function['arrangement.clear'] = function(){
            dev.log.render('arrangement.clear()'); //#development
            arrangement.clear();
        };
        communicationModule.function['arrangement.getElementAddress'] = function(id){
            dev.log.render('arrangement.getElementAddress('+id+')'); //#development
            return element.getElementFromId(id).getAddress();
        };
        communicationModule.function['arrangement.getElementByAddress'] = function(address){
            dev.log.render('arrangement.getElementByAddress('+address+')'); //#development
            return element.getIdFromElement(arrangement.getElementByAddress(address));
        };
        communicationModule.function['arrangement.getElementsUnderPoint'] = function(x,y){
            dev.log.render('arrangement.getElementsUnderPoint('+x+','+y+')'); //#development
            return arrangement.getElementsUnderPoint(x,y).map(ele => element.getIdFromElement(ele));
        };
        communicationModule.function['arrangement.getElementsUnderArea'] = function(points){
            dev.log.render('arrangement.getElementsUnderArea('+points+')'); //#development
            return arrangement.getElementsUnderArea(points).map(ele => element.getIdFromElement(ele));
        };
        communicationModule.function['arrangement.printTree'] = function(mode){
            dev.log.render('arrangement.printTree('+mode+')'); //#development
            arrangement.printTree(mode);
        };

    //render
        communicationModule.delayedFunction['render.refresh'] = function(responseFunction){
            dev.log.render('render.refresh('+responseFunction+')'); //#development
            render.refresh(responseFunction);
        };
        communicationModule.function['render.clearColour'] = function(colour){
            dev.log.render('render.clearColour('+colour+')'); //#development
            return render.clearColour(colour);
        };
        communicationModule.function['render.adjustCanvasSize'] = function(newWidth, newHeight){
            dev.log.render('render.adjustCanvasSize('+newWidth+','+newHeight+')'); //#development
            render.adjustCanvasSize(newWidth, newHeight);
        };
        communicationModule.function['render.getCanvasSize'] = function(){
            dev.log.render('render.getCanvasSize()'); //#development
            return render.getCanvasSize();
        };
        communicationModule.function['render.activeLimitToFrameRate'] = function(active){
            dev.log.render('render.activeLimitToFrameRate('+active+')'); //#development
            return render.activeLimitToFrameRate(active);
        };
        communicationModule.function['render.frameRateLimit'] = function(rate){
            dev.log.render('render.frameRateLimit('+rate+')'); //#development
            return render.frameRateLimit(rate);
        };
        communicationModule.function['render.frame'] = function(){
            dev.log.render('render.frame()'); //#development
            render.frame();
        };
        communicationModule.function['render.active'] = function(active){
            dev.log.render('render.active('+active+')'); //#development
            return render.active(active);
        };

    //viewport
        communicationModule.function['viewport.refresh'] = function(){
            dev.log.render('viewport.refresh()'); //#development
            viewport.refresh();
        };
        communicationModule.function['viewport.position'] = function(x,y){
            dev.log.render('viewport.position('+x+','+y+')'); //#development
            return viewport.position(x,y);
        };
        communicationModule.function['viewport.scale'] = function(s){
            dev.log.render('viewport.scale('+s+')'); //#development
            return viewport.scale(s);
        };
        communicationModule.function['viewport.angle'] = function(a){
            dev.log.render('viewport.angle('+a+')'); //#development
            return viewport.angle(a);
        };
        communicationModule.function['viewport.getElementsUnderPoint'] = function(x,y){
            dev.log.render('viewport.getElementsUnderPoint('+x+','+y+')'); //#development
            return viewport.getElementsUnderPoint(x,y);
        };
        communicationModule.function['viewport.getElementsUnderArea'] = function(points){
            dev.log.render('viewport.getElementsUnderArea('+points+')'); //#development
            return viewport.getElementsUnderArea(points);
        };
        communicationModule.function['viewport.getMousePosition'] = function(){
            dev.log.render('viewport.getMousePosition()'); //#development
            return viewport.mousePosition();
        };
        communicationModule.function['viewport.getBoundingBox'] = function(){
            dev.log.render('viewport.getBoundingBox()'); //#development
            return viewport.getBoundingBox();
        };
        communicationModule.function['viewport.stopMouseScroll'] = function(bool){
            dev.log.render('viewport.stopMouseScroll('+bool+')'); //#development
            return viewport.stopMouseScroll(bool);
        };

    //stats
        communicationModule.function['stats.active'] = function(active){
            dev.log.render('stats.active('+active+')'); //#development
            return stats.active(active);
        };
        communicationModule.function['stats.getReport'] = function(){
            dev.log.render('stats.getReport()'); //#development
            return stats.getReport();
        };

    //callback
        communicationModule.function['callback.listCallbackTypes'] = function(){
            dev.log.render('callback.listCallbackTypes()'); //#development
            return callback.listCallbackTypes();
        };
        communicationModule.function['callback.getCallbackTypeState'] = function(type){
            dev.log.render('callback.getCallbackTypeState('+type+')'); //#development
            return callback.getCallbackTypeState(type);
        };
        communicationModule.function['callback.activateCallbackType'] = function(type){
            dev.log.render('callback.activateCallbackType('+type+')'); //#development
            callback.activateCallbackType(type);
        };
        communicationModule.function['callback.disactivateCallbackType'] = function(type){
            dev.log.render('callback.disactivateCallbackType('+type+')'); //#development
            callback.disactivateCallbackType(type);
        };
        communicationModule.function['callback.activateAllCallbackTypes'] = function(){
            dev.log.render('callback.activateAllCallbackTypes()'); //#development
            callback.activateAllCallbackTypes();
        };
        communicationModule.function['callback.disactivateAllCallbackTypes'] = function(){
            dev.log.render('callback.disactivateAllCallbackTypes()'); //#development
            callback.disactivateAllCallbackTypes();
        };
        communicationModule.function['callback.attachCallback'] = function(id, callbackType){
            dev.log.render('callback.attachCallback('+id+','+callbackType+')'); //#development
            callback.attachCallback(element.getElementFromId(id),callbackType);
        };
        communicationModule.function['callback.removeCallback'] = function(id, callbackType){
            dev.log.render('callback.removeCallback('+id+','+callbackType+')'); //#development
            callback.removeCallback(element.getElementFromId(id),callbackType);
        };
        callback.listCallbackTypes().forEach(callbackName => {
            //for accepting the callback signals from the window's canvas
            communicationModule.function['callback.coupling.'+callbackName] = function(event){
                dev.log.render('callback.coupling.'+callbackName+'('+event+')'); //#development
                callback.coupling[callbackName](event);
            };
        });

//dialing out
    const interface = new function(){
        this.go = function(){
            dev.log.render('go()'); //#development
            communicationModule.run('go');
        };
        this.printToScreen = function(imageData){
            dev.log.render('printToScreen('+imageData+')'); //#development
            communicationModule.run('printToScreen',[imageData],undefined,[imageData]);
        };
        this.onViewportAdjust = function(state){
            dev.log.render('onViewportAdjust('+state+')'); //#development
            communicationModule.run('onViewportAdjust',[state]);
        };
        this.getCanvasAttributes = function(attributeNames=[],prefixActiveArray=[]){
            dev.log.render('getCanvasAttributes('+attributeNames+','+prefixActiveArray+')'); //#development
            return new Promise((resolve, reject) => {
                communicationModule.run('getCanvasAttributes',[attributeNames,prefixActiveArray],resolve);
            });
        };
        this.setCanvasAttributes = function(attributeNames=[],values=[],prefixActiveArray=[]){
            dev.log.render('setCanvasAttributes('+attributeNames+','+values+','+prefixActiveArray+')'); //#development
            communicationModule.run('setCanvasAttributes',[attributeNames,values,prefixActiveArray],resolve);
        };
        this.getCanvasParentAttributes = function(attributeNames=[],prefixActiveArray=[]){
            dev.log.render('getCanvasParentAttributes('+attributeNames+','+prefixActiveArray+')'); //#development
            return new Promise((resolve, reject) => {
                communicationModule.run('getCanvasParentAttributes',[attributeNames,prefixActiveArray],resolve);
            });
        };
        this.getDocumentAttributes = function(attributeNames=[]){
            dev.log.render('getDocumentAttributes('+attributeNames+')'); //#development
            return new Promise((resolve, reject) => {
                communicationModule.run('getDocumentAttributes',[attributeNames],resolve);
            });
        };
        this.setDocumentAttributes = function(attributeNames=[],values=[]){
            dev.log.render('setDocumentAttributes('+attributeNames+','+values+')'); //#development
            communicationModule.run('setDocumentAttributes',[attributeNames,values]);
        };
        this.getWindowAttributes = function(attributeNames=[]){
            dev.log.render('getWindowAttributes('+attributeNames+')'); //#development
            return new Promise((resolve, reject) => {
                communicationModule.run('getWindowAttributes',[attributeNames],resolve);
            });
        };
        this.setWindowAttributes = function(attributeNames=[],values=[]){
            dev.log.render('setWindowAttributes('+attributeNames+','+values+')'); //#development
            communicationModule.run('setWindowAttributes',[attributeNames,values]);
        };
    };
    callback.listCallbackTypes().forEach(callbackName => {
        //for sending core's callbacks back out
        callback.functions[callbackName] = function(x, y, event, elements){
            dev.log.render('callback.functions.'+callbackName+'('+x+','+y+','+event+','+elements+')'); //#development
            communicationModule.run('callback.'+callbackName,[x, y, event, elements.map(ele => element.getIdFromElement(ele))]);
        };
    });

