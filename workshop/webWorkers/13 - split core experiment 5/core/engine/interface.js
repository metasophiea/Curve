communicationModule.function.getAllFunctions = function(){
    return Object.keys(communicationModule.function);  
};

const interface = new function(){
    this['document.body.style.overflow'] = function(value){
        return new Promise((resolve, reject) => {
            communicationModule.run('document.body.style.overflow',[value],resolve);
        });
    };
    this['window.devicePixelRatio'] = function(state){
        return new Promise((resolve, reject) => {
            communicationModule.run('window.devicePixelRatio',[state],resolve);
        });
    };
    this.setCanvasAttributes = function(attributes=[]){
        communicationModule.run('setCanvasAttributes',[attributes]);
    };
    this.getCanvasAttributes = function(attributeNames,prefixActiveArray=[]){
        return new Promise((resolve, reject) => {
            communicationModule.run('getCanvasAttributes',[attributeNames,prefixActiveArray],resolve);
        });
    };
    this.getCanvasParentAttributes = function(attributeNames,prefixActiveArray=[]){
        return new Promise((resolve, reject) => {
            communicationModule.run('getCanvasParentAttributes',[attributeNames,prefixActiveArray],resolve);
        });
    };
};

//element
    communicationModule.function['element.getAvailableElements'] = function(){
        return element.getAvailableElements();
    };
    communicationModule.function['element.getCreatedElements'] = function(){
        return element.getCreatedElements().map(ele => element.getIdFromElement(ele));
    };
    communicationModule.function['element.create'] = function(type,name){
        return element.getIdFromElement(element.create(type,name));
    };
    communicationModule.function['element.delete'] = function(id){
        element.delete(element.getElementFromId(id));
    };
    communicationModule.function['element.deleteAllCreated'] = function(){
        element.deleteAllCreated();
    };
    communicationModule.function['element.getTypeById'] = function(id){
        return element.getTypeById(element.getElementFromId(id));
    };
    communicationModule.function['element.executeMethod'] = function(id,method,argumentList=[]){
        return element.getElementFromId(id).interface[method](...argumentList);
    };
    communicationModule.function['element.boatload_executeMethod'] = function(containers){
        containers.forEach(container => { communicationModule.function['element.executeMethod'](container.id,container.method,container.argumentList); });
    };
    communicationModule.function['element._dump'] = function(){
        element._dump();
    };

//arrangement
    communicationModule.function['arrangement.new'] = function(){
        arrangement.new();
    };
    communicationModule.function['arrangement.prepend'] = function(id){
        arrangement.prepend(element.getElementFromId(id));
    };
    communicationModule.function['arrangement.append'] = function(id){
        arrangement.append(element.getElementFromId(id));
    };
    communicationModule.function['arrangement.remove'] = function(id){
        arrangement.remove(element.getElementFromId(id));
    };
    communicationModule.function['arrangement.clear'] = function(){
        arrangement.clear();
    };
    communicationModule.function['arrangement.getElementByAddress'] = function(address){
        return element.getIdFromElement(arrangement.getElementByAddress(address));
    };
    communicationModule.function['arrangement.getElementsUnderPoint'] = function(x,y){
        return arrangement.getElementsUnderPoint(x,y).map(ele => element.getIdFromElement(ele));
    };
    communicationModule.function['arrangement.getElementsUnderArea'] = function(points){
        return arrangement.getElementsUnderArea(points).map(ele => element.getIdFromElement(ele));
    };
    communicationModule.function['arrangement.printTree'] = function(mode){
        arrangement.printTree(mode);
    };
    communicationModule.function['arrangement._dump'] = function(){
        arrangement._dump();
    };

//render
    communicationModule.function['render.clearColour'] = function(colour){
        return render.clearColour(colour);
    };
    communicationModule.function['render.adjustCanvasSize'] = function(newWidth, newHeight){
        render.adjustCanvasSize(newWidth, newHeight);
    };
    communicationModule.function['render.refreshCoordinates'] = function(){
        render.refreshCoordinates();
    };
    communicationModule.function['render.refresh'] = function(){
        render.refresh();
    };
    communicationModule.function['render.activeLimitToFrameRate'] = function(active){
        return render.activeLimitToFrameRate(active);
    };
    communicationModule.function['render.frameRateLimit'] = function(rate){
        return render.frameRateLimit(rate);
    };
    communicationModule.function['render.frame'] = function(){
        render.frame();
    };
    communicationModule.function['render.active'] = function(active){
        return render.active(active);
    };
    communicationModule.function['render.getCanvasDimensions'] = function(){
        return render.getCanvasDimensions();
    };
    communicationModule.function['render.drawDot'] = function(x,y,r,colour){
        render.drawDot(x,y,r,colour);
    };
    communicationModule.function['render._dump'] = function(){
        render._dump();
    };

//viewport
    communicationModule.function['viewport.position'] = function(x,y){
        return viewport.position(x,y);
    };
    communicationModule.function['viewport.scale'] = function(s){
        return viewport.scale(s);
    };
    communicationModule.function['viewport.angle'] = function(a){
        return viewport.angle(a);
    };
    communicationModule.function['viewport.getElementUnderCanvasPoint'] = function(x,y){
        return viewport.getElementUnderCanvasPoint(x,y);
    };
    communicationModule.function['viewport.getElementsUnderCanvasArea'] = function(points){
        return viewport.getElementsUnderCanvasArea(points);
    };
    communicationModule.function['viewport.calculateViewportExtremities'] = function(){
        viewport.calculateViewportExtremities();
    };
    communicationModule.function['viewport.refresh'] = function(){
        viewport.refresh();
    };
    communicationModule.function['viewport.getBoundingBox'] = function(){
        return viewport.getBoundingBox();
    };
    communicationModule.function['viewport.mousePosition'] = function(x,y){
        return viewport.mousePosition(x,y);
    };
    communicationModule.function['viewport.stopMouseScroll'] = function(bool){
        return viewport.stopMouseScroll(bool);
    };
    communicationModule.function['viewport.clickVisibility'] = function(bool){
        return viewport.clickVisibility(bool);
    };
    communicationModule.function['viewport.getHeight'] = function(){
        return viewport.getHeight();
    };
    communicationModule.function['viewport.getWidth'] = function(){
        return viewport.getWidth();
    };
    communicationModule.function['viewport._dump'] = function(){
        viewport._dump();
    };
    viewport.onCameraAdjust = function(state){
        communicationModule.run('viewport.onCameraAdjust',[state]);
    };

//stats
    communicationModule.function['stats.active'] = function(active){
        return stats.active(active);
    };
    communicationModule.function['stats.getReport'] = function(){
        return stats.getReport();
    };

//callback
    communicationModule.function['callback.listCallbackTypes'] = function(){
        return callback.listCallbackTypes();
    };
    communicationModule.function['callback.getShapeCallbackState'] = function(type){
        return callback.getShapeCallbackState(type);
    };
    communicationModule.function['callback.activateShapeCallback'] = function(type){
        callback.activateShapeCallback(type);
    };
    communicationModule.function['callback.disactivateShapeCallback'] = function(type){
        callback.disactivateShapeCallback(type);
    };
    communicationModule.function['callback.activateAllShapeCallbacks'] = function(){
        callback.activateAllShapeCallbacks();
    };
    communicationModule.function['callback.disactivateAllShapeCallbacks'] = function(){
        callback.disactivateAllShapeCallbacks();
    };

    callback.listCallbackTypes().forEach(callbackName => {
        communicationModule.function['callback.coupling.'+callbackName] = function(event){
            callback.coupling[callbackName](event);
        };
        callback.functions[callbackName] = function(x, y, event, elements){
            communicationModule.run('callback.'+callbackName,[x, y, event, elements.map(ele => element.getIdFromElement(ele))]);
        };
    });