//meta
    communicationModule.function['areYouReady'] = function(){
        dev.log.service('.areYouReady()'); //#development
        return true;
    };
    communicationModule.delayedFunction['refresh'] = function(responseFunction){
        dev.log.service('.refresh('+responseFunction+')'); //#development
        render.refresh(() => {
            viewport.refresh();
            responseFunction();
        });
    };
    communicationModule.function['createSetAppend'] = function(type,name,setList,appendingGroup){
        dev.log.service('.createSetAppend('+type+','+name+','+JSON.stringify(setList)+','+appendingGroup+')'); //#development

        const newElement = element.create(type,name);
        const elementId = element.getIdFromElement(newElement);
        newElement.unifiedAttribute(setList);
        if(appendingGroup == -1 || appendingGroup == undefined){ arrangement.append(newElement); }
        else{ element.getElementFromId(appendingGroup).interface['append'](elementId); }
        return elementId;
    };

//_dump
    communicationModule.function['_dump.element'] = function(){
        dev.log.service('._dump.element()'); //#development
        element._dump();
    };
    communicationModule.function['_dump.arrangement'] = function(){
        dev.log.service('._dump.arrangement()'); //#development
        arrangement._dump();
    };
    communicationModule.function['_dump.render'] = function(){
        dev.log.service('._dump.render()'); //#development
        render._dump();
    };
    communicationModule.function['_dump.viewport'] = function(){
        dev.log.service('._dump.viewport()'); //#development
        viewport._dump();
    };
    communicationModule.function['_dump.callback'] = function(){
        dev.log.service('._dump.callback()'); //#development
        callback._dump();
    };

//boatload
    communicationModule.function['boatload.element.executeMethod'] = function(containers){
        dev.log.service('.boatload.element.executeMethod('+JSON.stringify(containers)+')'); //#development
        containers.forEach(container => { 
            communicationModule.function['element.executeMethod'](container.id,container.method,container.argumentList); 
        });
    };

//element
    communicationModule.function['element.getAvailableElements'] = function(){
        dev.log.service('.element.getAvailableElements()'); //#development
        return element.getAvailableElements();
    };
    communicationModule.function['element.installElement'] = function(elementName,serializedCreatorMethod){
        dev.log.service('.element.installElement()'); //#development
        return element.installElement(elementName,library.misc.unserialize(serializedCreatorMethod));
    };
    communicationModule.function['element.getCreatedElements'] = function(){
        dev.log.service('.element.getCreatedElements()'); //#development
        return element.getCreatedElements().map(ele => element.getIdFromElement(ele));
    };
    communicationModule.function['element.create'] = function(type,name){
        dev.log.service('.element.create('+type+','+name+')'); //#development
        return element.getIdFromElement(element.create(type,name));
    };
    communicationModule.function['element.delete'] = function(id){
        dev.log.service('.element.delete('+id+')'); //#development
        element.delete(element.getElementFromId(id));
    };
    communicationModule.function['element.deleteAllCreated'] = function(){
        dev.log.service('.element.deleteAllCreated()'); //#development
        element.deleteAllCreated();
    };
    communicationModule.function['element.getTypeById'] = function(id){
        dev.log.service('.element.getTypeById('+id+')'); //#development
        return element.getTypeById(element.getElementFromId(id));
    };
    communicationModule.function['element.executeMethod'] = function(id,method,argumentList=[]){
        dev.log.service('.element.executeMethod('+id+','+method+','+JSON.stringify(argumentList)+')'); //#development
        if(id == -1){
            dev.log.service('.element.executeMethod -> id was -1, no action will be attempted'); //#development
            return null;
        }
        if(id == undefined){
            dev.log.service('.element.executeMethod -> id was undefined, no action will be attempted'); //#development
            return null;
        }
        return element.getElementFromId(id).interface[method](...argumentList);
    };

//arrangement
    communicationModule.function['arrangement.new'] = function(){
        dev.log.service('.arrangement.new()'); //#development
        arrangement.new();
    };
    communicationModule.function['arrangement.prepend'] = function(id){
        dev.log.service('.arrangement.prepend('+id+')'); //#development
        arrangement.prepend(element.getElementFromId(id));
    };
    communicationModule.function['arrangement.append'] = function(id){
        dev.log.service('.arrangement.append('+id+')'); //#development
        arrangement.append(element.getElementFromId(id));
    };
    communicationModule.function['arrangement.remove'] = function(id){
        dev.log.service('.arrangement.remove('+id+')'); //#development
        arrangement.remove(element.getElementFromId(id));
    };
    communicationModule.function['arrangement.clear'] = function(){
        dev.log.service('.arrangement.clear()'); //#development
        arrangement.clear();
    };
    communicationModule.function['arrangement.getElementAddress'] = function(id){
        dev.log.service('.arrangement.getElementAddress('+id+')'); //#development
        return element.getElementFromId(id).getAddress();
    };
    communicationModule.function['arrangement.getElementByAddress'] = function(address){
        dev.log.service('.arrangement.getElementByAddress('+address+')'); //#development
        return element.getIdFromElement(arrangement.getElementByAddress(address));
    };
    communicationModule.function['arrangement.getElementsUnderPoint'] = function(x,y){
        dev.log.service('.arrangement.getElementsUnderPoint('+x+','+y+')'); //#development
        return arrangement.getElementsUnderPoint(x,y).map(ele => element.getIdFromElement(ele));
    };
    communicationModule.function['arrangement.getElementsUnderArea'] = function(points){
        dev.log.service('.arrangement.getElementsUnderArea('+points+')'); //#development
        return arrangement.getElementsUnderArea(points).map(ele => element.getIdFromElement(ele));
    };
    communicationModule.function['arrangement.printTree'] = function(mode){
        dev.log.service('.arrangement.printTree('+mode+')'); //#development
        arrangement.printTree(mode);
    };
    communicationModule.function['arrangement.areParents'] = function(elementId,potentialParents){
        dev.log.service('.arrangement.areParents('+elementId+','+potentialParents+')'); //#development
        return arrangement.areParents(elementId,potentialParents);
    };

//render
    communicationModule.delayedFunction['render.refresh'] = function(responseFunction){
        dev.log.service('.render.refresh('+responseFunction+')'); //#development
        render.refresh(responseFunction);
    };
    communicationModule.function['render.clearColour'] = function(colour){
        dev.log.service('.render.clearColour('+colour+')'); //#development
        return render.clearColour(colour);
    };
    communicationModule.function['render.adjustCanvasSize'] = function(newWidth, newHeight){
        dev.log.service('.render.adjustCanvasSize('+newWidth+','+newHeight+')'); //#development
        render.adjustCanvasSize(newWidth, newHeight);
    };
    communicationModule.function['render.getCanvasSize'] = function(){
        dev.log.service('.render.getCanvasSize()'); //#development
        return render.getCanvasSize();
    };
    communicationModule.function['render.activeLimitToFrameRate'] = function(active){
        dev.log.service('.render.activeLimitToFrameRate('+active+')'); //#development
        return render.activeLimitToFrameRate(active);
    };
    communicationModule.function['render.frameRateLimit'] = function(rate){
        dev.log.service('.render.frameRateLimit('+rate+')'); //#development
        return render.frameRateLimit(rate);
    };
    communicationModule.function['render.frame'] = function(){
        dev.log.service('.render.frame()'); //#development
        render.frame();
    };
    communicationModule.function['render.active'] = function(active){
        dev.log.service('.render.active('+active+')'); //#development
        return render.active(active);
    };

//viewport
    communicationModule.function['viewport.refresh'] = function(){
        dev.log.service('.viewport.refresh()'); //#development
        viewport.refresh();
    };
    communicationModule.function['viewport.position'] = function(x,y){
        dev.log.service('.viewport.position('+x+','+y+')'); //#development
        return viewport.position(x,y);
    };
    communicationModule.function['viewport.scale'] = function(s){
        dev.log.service('.viewport.scale('+s+')'); //#development
        return viewport.scale(s);
    };
    communicationModule.function['viewport.angle'] = function(a){
        dev.log.service('.viewport.angle('+a+')'); //#development
        return viewport.angle(a);
    };
    communicationModule.function['viewport.getElementsUnderPoint'] = function(x,y){
        dev.log.service('.viewport.getElementsUnderPoint('+x+','+y+')'); //#development
        return viewport.getElementsUnderPoint(x,y);
    };
    communicationModule.function['viewport.getElementsUnderArea'] = function(points){
        dev.log.service('.viewport.getElementsUnderArea('+points+')'); //#development
        return viewport.getElementsUnderArea(points);
    };
    communicationModule.function['viewport.getMousePosition'] = function(){
        dev.log.service('.viewport.getMousePosition()'); //#development
        return viewport.mousePosition();
    };
    communicationModule.function['viewport.getBoundingBox'] = function(){
        dev.log.service('.viewport.getBoundingBox()'); //#development
        return viewport.getBoundingBox();
    };
    communicationModule.function['viewport.stopMouseScroll'] = function(bool){
        dev.log.service('.viewport.stopMouseScroll('+bool+')'); //#development
        return viewport.stopMouseScroll(bool);
    };

//stats
    communicationModule.function['stats.active'] = function(active){
        dev.log.service('.stats.active('+active+')'); //#development
        return stats.active(active);
    };
    communicationModule.function['stats.getReport'] = function(){
        dev.log.service('.stats.getReport()'); //#development
        return stats.getReport();
    };

//callback
    communicationModule.function['callback.listCallbackTypes'] = function(){
        dev.log.service('.callback.listCallbackTypes()'); //#development
        return callback.listCallbackTypes();
    };
    communicationModule.function['callback.getCallbackTypeState'] = function(type){
        dev.log.service('.callback.getCallbackTypeState('+type+')'); //#development
        return callback.getCallbackTypeState(type);
    };
    communicationModule.function['callback.activateCallbackType'] = function(type){
        dev.log.service('.callback.activateCallbackType('+type+')'); //#development
        callback.activateCallbackType(type);
    };
    communicationModule.function['callback.disactivateCallbackType'] = function(type){
        dev.log.service('.callback.disactivateCallbackType('+type+')'); //#development
        callback.disactivateCallbackType(type);
    };
    communicationModule.function['callback.activateAllCallbackTypes'] = function(){
        dev.log.service('.callback.activateAllCallbackTypes()'); //#development
        callback.activateAllCallbackTypes();
    };
    communicationModule.function['callback.disactivateAllCallbackTypes'] = function(){
        dev.log.service('.callback.disactivateAllCallbackTypes()'); //#development
        callback.disactivateAllCallbackTypes();
    };
    communicationModule.function['callback.attachCallback'] = function(id, callbackType){
        dev.log.service('.callback.attachCallback('+id+','+callbackType+')'); //#development
        callback.attachCallback(element.getElementFromId(id),callbackType);
    };
    communicationModule.function['callback.removeCallback'] = function(id, callbackType){
        dev.log.service('.callback.removeCallback('+id+','+callbackType+')'); //#development
        callback.removeCallback(element.getElementFromId(id),callbackType);
    };
    callback.listCallbackTypes().forEach(callbackName => {
        //for accepting the callback signals from the window's canvas
        communicationModule.function['callback.coupling.'+callbackName] = function(event){
            dev.log.service('.callback.coupling.'+callbackName+'('+JSON.stringify(event)+')'); //#development
            callback.coupling[callbackName](event);
        };
    });