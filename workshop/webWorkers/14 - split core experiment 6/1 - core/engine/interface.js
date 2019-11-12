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