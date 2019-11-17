//dialing in
    //meta
        communicationModule.function['areYouReady'] = function(){
            dev.log.interface('.areYouReady()'); //#development
            return true;
        };
        communicationModule.delayedFunction['refresh'] = function(responseFunction){
            dev.log.interface('.refresh('+responseFunction+')'); //#development
            render.refresh(() => {
                viewport.refresh();
                responseFunction();
            });
        };
        communicationModule.function['createSetAppend'] = function(type,name,setList,appendingGroup){
            dev.log.interface('.createSetAppend('+type+','+name+','+JSON.stringify(setList)+','+appendingGroup+')'); //#development

            const newElement = element.create(type,name);
            const elementId = element.getIdFromElement(newElement);
            newElement.unifiedAttribute(setList);
            if(appendingGroup == -1 || appendingGroup == undefined){ arrangement.append(newElement); }
            else{ element.getElementFromId(appendingGroup).interface['append'](elementId); }
            return elementId;
        };

    //_dump
        communicationModule.function['_dump.element'] = function(){
            dev.log.interface('._dump.element()'); //#development
            element._dump();
        };
        communicationModule.function['_dump.arrangement'] = function(){
            dev.log.interface('._dump.arrangement()'); //#development
            arrangement._dump();
        };
        communicationModule.function['_dump.render'] = function(){
            dev.log.interface('._dump.render()'); //#development
            render._dump();
        };
        communicationModule.function['_dump.viewport'] = function(){
            dev.log.interface('._dump.viewport()'); //#development
            viewport._dump();
        };
        communicationModule.function['_dump.callback'] = function(){
            dev.log.interface('._dump.callback()'); //#development
            callback._dump();
        };

    //boatload
        communicationModule.function['boatload.element.executeMethod'] = function(containers){
            dev.log.interface('.boatload.element.executeMethod('+JSON.stringify(containers)+')'); //#development
            containers.forEach(container => { 
                communicationModule.function['element.executeMethod'](container.id,container.method,container.argumentList); 
            });
        };

    //element
        communicationModule.function['element.getAvailableElements'] = function(){
            dev.log.interface('.element.getAvailableElements()'); //#development
            return element.getAvailableElements();
        };
        communicationModule.function['element.installElement'] = function(elementName,serializedCreatorMethod){
            dev.log.interface('.element.installElement()'); //#development
            return element.installElement(elementName,library.misc.unserialize(serializedCreatorMethod));
        };
        communicationModule.function['element.getCreatedElements'] = function(){
            dev.log.interface('.element.getCreatedElements()'); //#development
            return element.getCreatedElements().map(ele => element.getIdFromElement(ele));
        };
        communicationModule.function['element.create'] = function(type,name){
            dev.log.interface('.element.create('+type+','+name+')'); //#development
            return element.getIdFromElement(element.create(type,name));
        };
        communicationModule.function['element.delete'] = function(id){
            dev.log.interface('.element.delete('+id+')'); //#development
            element.delete(element.getElementFromId(id));
        };
        communicationModule.function['element.deleteAllCreated'] = function(){
            dev.log.interface('.element.deleteAllCreated()'); //#development
            element.deleteAllCreated();
        };
        communicationModule.function['element.getTypeById'] = function(id){
            dev.log.interface('.element.getTypeById('+id+')'); //#development
            return element.getTypeById(element.getElementFromId(id));
        };
        communicationModule.function['element.executeMethod'] = function(id,method,argumentList=[]){
            dev.log.interface('.element.executeMethod('+id+','+method+','+JSON.stringify(argumentList)+')'); //#development
            return element.getElementFromId(id).interface[method](...argumentList);
        };

    //arrangement
        communicationModule.function['arrangement.new'] = function(){
            dev.log.interface('.arrangement.new()'); //#development
            arrangement.new();
        };
        communicationModule.function['arrangement.prepend'] = function(id){
            dev.log.interface('.arrangement.prepend('+id+')'); //#development
            arrangement.prepend(element.getElementFromId(id));
        };
        communicationModule.function['arrangement.append'] = function(id){
            dev.log.interface('.arrangement.append('+id+')'); //#development
            arrangement.append(element.getElementFromId(id));
        };
        communicationModule.function['arrangement.remove'] = function(id){
            dev.log.interface('.arrangement.remove('+id+')'); //#development
            arrangement.remove(element.getElementFromId(id));
        };
        communicationModule.function['arrangement.clear'] = function(){
            dev.log.interface('.arrangement.clear()'); //#development
            arrangement.clear();
        };
        communicationModule.function['arrangement.getElementAddress'] = function(id){
            dev.log.interface('.arrangement.getElementAddress('+id+')'); //#development
            return element.getElementFromId(id).getAddress();
        };
        communicationModule.function['arrangement.getElementByAddress'] = function(address){
            dev.log.interface('.arrangement.getElementByAddress('+address+')'); //#development
            return element.getIdFromElement(arrangement.getElementByAddress(address));
        };
        communicationModule.function['arrangement.getElementsUnderPoint'] = function(x,y){
            dev.log.interface('.arrangement.getElementsUnderPoint('+x+','+y+')'); //#development
            return arrangement.getElementsUnderPoint(x,y).map(ele => element.getIdFromElement(ele));
        };
        communicationModule.function['arrangement.getElementsUnderArea'] = function(points){
            dev.log.interface('.arrangement.getElementsUnderArea('+points+')'); //#development
            return arrangement.getElementsUnderArea(points).map(ele => element.getIdFromElement(ele));
        };
        communicationModule.function['arrangement.printTree'] = function(mode){
            dev.log.interface('.arrangement.printTree('+mode+')'); //#development
            arrangement.printTree(mode);
        };
        communicationModule.function['arrangement.areParents'] = function(elementId,potentialParents){
            dev.log.interface('.arrangement.areParents('+elementId+','+potentialParents+')'); //#development
            return arrangement.areParents(elementId,potentialParents);
        };

    //render
        communicationModule.delayedFunction['render.refresh'] = function(responseFunction){
            dev.log.interface('.render.refresh('+responseFunction+')'); //#development
            render.refresh(responseFunction);
        };
        communicationModule.function['render.clearColour'] = function(colour){
            dev.log.interface('.render.clearColour('+colour+')'); //#development
            return render.clearColour(colour);
        };
        communicationModule.function['render.adjustCanvasSize'] = function(newWidth, newHeight){
            dev.log.interface('.render.adjustCanvasSize('+newWidth+','+newHeight+')'); //#development
            render.adjustCanvasSize(newWidth, newHeight);
        };
        communicationModule.function['render.getCanvasSize'] = function(){
            dev.log.interface('.render.getCanvasSize()'); //#development
            return render.getCanvasSize();
        };
        communicationModule.function['render.activeLimitToFrameRate'] = function(active){
            dev.log.interface('.render.activeLimitToFrameRate('+active+')'); //#development
            return render.activeLimitToFrameRate(active);
        };
        communicationModule.function['render.frameRateLimit'] = function(rate){
            dev.log.interface('.render.frameRateLimit('+rate+')'); //#development
            return render.frameRateLimit(rate);
        };
        communicationModule.function['render.frame'] = function(){
            dev.log.interface('.render.frame()'); //#development
            render.frame();
        };
        communicationModule.function['render.active'] = function(active){
            dev.log.interface('.render.active('+active+')'); //#development
            return render.active(active);
        };

    //viewport
        communicationModule.function['viewport.refresh'] = function(){
            dev.log.interface('.viewport.refresh()'); //#development
            viewport.refresh();
        };
        communicationModule.function['viewport.position'] = function(x,y){
            dev.log.interface('.viewport.position('+x+','+y+')'); //#development
            return viewport.position(x,y);
        };
        communicationModule.function['viewport.scale'] = function(s){
            dev.log.interface('.viewport.scale('+s+')'); //#development
            return viewport.scale(s);
        };
        communicationModule.function['viewport.angle'] = function(a){
            dev.log.interface('.viewport.angle('+a+')'); //#development
            return viewport.angle(a);
        };
        communicationModule.function['viewport.getElementsUnderPoint'] = function(x,y){
            dev.log.interface('.viewport.getElementsUnderPoint('+x+','+y+')'); //#development
            return viewport.getElementsUnderPoint(x,y);
        };
        communicationModule.function['viewport.getElementsUnderArea'] = function(points){
            dev.log.interface('.viewport.getElementsUnderArea('+points+')'); //#development
            return viewport.getElementsUnderArea(points);
        };
        communicationModule.function['viewport.getMousePosition'] = function(){
            dev.log.interface('.viewport.getMousePosition()'); //#development
            return viewport.mousePosition();
        };
        communicationModule.function['viewport.getBoundingBox'] = function(){
            dev.log.interface('.viewport.getBoundingBox()'); //#development
            return viewport.getBoundingBox();
        };
        communicationModule.function['viewport.stopMouseScroll'] = function(bool){
            dev.log.interface('.viewport.stopMouseScroll('+bool+')'); //#development
            return viewport.stopMouseScroll(bool);
        };

    //stats
        communicationModule.function['stats.active'] = function(active){
            dev.log.interface('.stats.active('+active+')'); //#development
            return stats.active(active);
        };
        communicationModule.function['stats.getReport'] = function(){
            dev.log.interface('.stats.getReport()'); //#development
            return stats.getReport();
        };

    //callback
        communicationModule.function['callback.listCallbackTypes'] = function(){
            dev.log.interface('.callback.listCallbackTypes()'); //#development
            return callback.listCallbackTypes();
        };
        communicationModule.function['callback.getCallbackTypeState'] = function(type){
            dev.log.interface('.callback.getCallbackTypeState('+type+')'); //#development
            return callback.getCallbackTypeState(type);
        };
        communicationModule.function['callback.activateCallbackType'] = function(type){
            dev.log.interface('.callback.activateCallbackType('+type+')'); //#development
            callback.activateCallbackType(type);
        };
        communicationModule.function['callback.disactivateCallbackType'] = function(type){
            dev.log.interface('.callback.disactivateCallbackType('+type+')'); //#development
            callback.disactivateCallbackType(type);
        };
        communicationModule.function['callback.activateAllCallbackTypes'] = function(){
            dev.log.interface('.callback.activateAllCallbackTypes()'); //#development
            callback.activateAllCallbackTypes();
        };
        communicationModule.function['callback.disactivateAllCallbackTypes'] = function(){
            dev.log.interface('.callback.disactivateAllCallbackTypes()'); //#development
            callback.disactivateAllCallbackTypes();
        };
        communicationModule.function['callback.attachCallback'] = function(id, callbackType){
            dev.log.interface('.callback.attachCallback('+id+','+callbackType+')'); //#development
            callback.attachCallback(element.getElementFromId(id),callbackType);
        };
        communicationModule.function['callback.removeCallback'] = function(id, callbackType){
            dev.log.interface('.callback.removeCallback('+id+','+callbackType+')'); //#development
            callback.removeCallback(element.getElementFromId(id),callbackType);
        };
        callback.listCallbackTypes().forEach(callbackName => {
            //for accepting the callback signals from the window's canvas
            communicationModule.function['callback.coupling.'+callbackName] = function(event){
                dev.log.interface('.callback.coupling.'+callbackName+'('+JSON.stringify(event)+')'); //#development
                callback.coupling[callbackName](event);
            };
        });

//dialing out
    const interface = new function(){
        this.go = function(){
            dev.log.interface('.go()'); //#development
            communicationModule.run('go');
        };
        this.printToScreen = function(imageData){
            dev.log.interface('.printToScreen(-imageData-)'); //#development
            communicationModule.run('printToScreen',[imageData],undefined,[imageData]);
        };
        this.onViewportAdjust = function(state){
            dev.log.interface('.onViewportAdjust('+state+')'); //#development
            communicationModule.run('onViewportAdjust',[state]);
        };
        this.getCanvasAttributes = function(attributeNames=[],prefixActiveArray=[]){
            dev.log.interface('.getCanvasAttributes('+JSON.stringify(attributeNames)+','+JSON.stringify(prefixActiveArray)+')'); //#development
            return new Promise((resolve, reject) => {
                communicationModule.run('getCanvasAttributes',[attributeNames,prefixActiveArray],resolve);
            });
        };
        this.setCanvasAttributes = function(attributeNames=[],values=[],prefixActiveArray=[]){
            dev.log.interface('.setCanvasAttributes('+JSON.stringify(attributeNames)+','+JSON.stringify(values)+','+JSON.stringify(prefixActiveArray)+')'); //#development
            communicationModule.run('setCanvasAttributes',[attributeNames,values,prefixActiveArray]);
        };
        this.getCanvasParentAttributes = function(attributeNames=[],prefixActiveArray=[]){
            dev.log.interface('.getCanvasParentAttributes('+JSON.stringify(attributeNames)+','+JSON.stringify(prefixActiveArray)+')'); //#development
            return new Promise((resolve, reject) => {
                communicationModule.run('getCanvasParentAttributes',[attributeNames,prefixActiveArray],resolve);
            });
        };
        this.getDocumentAttributes = function(attributeNames=[]){
            dev.log.interface('.getDocumentAttributes('+JSON.stringify(attributeNames)+')'); //#development
            return new Promise((resolve, reject) => {
                communicationModule.run('getDocumentAttributes',[attributeNames],resolve);
            });
        };
        this.setDocumentAttributes = function(attributeNames=[],values=[]){
            dev.log.interface('.setDocumentAttributes('+JSON.stringify(attributeNames)+','+JSON.stringify(values)+')'); //#development
            communicationModule.run('setDocumentAttributes',[attributeNames,values]);
        };
        this.getWindowAttributes = function(attributeNames=[]){
            dev.log.interface('.getWindowAttributes('+JSON.stringify(attributeNames)+')'); //#development
            return new Promise((resolve, reject) => {
                communicationModule.run('getWindowAttributes',[attributeNames],resolve);
            });
        };
        this.setWindowAttributes = function(attributeNames=[],values=[]){
            dev.log.interface('.setWindowAttributes('+JSON.stringify(attributeNames)+','+JSON.stringify(values)+')'); //#development
            communicationModule.run('setWindowAttributes',[attributeNames,values]);
        };
    };
    callback.listCallbackTypes().forEach(callbackName => {
        //for sending core's callbacks back out
        callback.functions[callbackName] = function(x, y, event, elements){
            dev.log.interface('.callback.functions.'+callbackName+'('+x+','+y+','+JSON.stringify(event)+','+JSON.stringify(elements)+')'); //#development
            communicationModule.run('callback.'+callbackName,[x, y, event, elements.map(ele => element.getIdFromElement(ele))]);
        };
    });