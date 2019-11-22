communicationModule.function.go = function(){
    dev.log.service('.go()'); //#development
    _canvas_.layers.registerLayerLoaded('core',_canvas_.core);
    if(self.meta.go){self.meta.go();} /* callback */
};
communicationModule.function.printToScreen = function(imageData){
    dev.log.service('.printToScreen(-imageData-)'); //#development
    _canvas_.getContext("bitmaprenderer").transferFromImageBitmap(imageData);
};
communicationModule.function.onViewportAdjust = function(state){
    dev.log.service('.onViewportAdjust('+JSON.stringify(state)+')'); //#development
    console.log('onViewportAdjust -> ',state); /* callback */
};

communicationModule.function.getCanvasAttributes = function(attributeNames=[],prefixActiveArray=[]){
    dev.log.service('.getCanvasAttributes('+JSON.stringify(attributeNames)+','+JSON.stringify(prefixActiveArray)+')'); //#development
    return attributeNames.map((name,index) => {
        return _canvas_.getAttribute((prefixActiveArray[index]?__canvasPrefix:'')+name);
    });    
};
communicationModule.function.setCanvasAttributes = function(attributes=[],prefixActiveArray=[]){
    dev.log.service('.setCanvasAttributes('+JSON.stringify(attributes)+','+JSON.stringify(prefixActiveArray)+')'); //#development
    attributes.map((attribute,index) => {
        _canvas_.setAttribute((prefixActiveArray[index]?__canvasPrefix:'')+attribute.name,attribute.value);
    });
};
communicationModule.function.getCanvasParentAttributes = function(attributeNames=[],prefixActiveArray=[]){
    dev.log.service('.getCanvasParentAttributes('+JSON.stringify(attributeNames)+','+JSON.stringify(prefixActiveArray)+')'); //#development
    return attributeNames.map((name,index) => {
        return _canvas_.parentElement[(prefixActiveArray[index]?__canvasPrefix:'')+name];
    });
};

communicationModule.function.getDocumentAttributes = function(attributeNames=[]){
    dev.log.service('.getDocumentAttributes('+JSON.stringify(attributeNames)+')'); //#development
    return attributeNames.map(attribute => {
        return eval('document.'+attribute);
    });
};
communicationModule.function.setDocumentAttributes = function(attributeNames=[],values=[]){
    dev.log.service('.setDocumentAttributes('+JSON.stringify(attributeNames)+','+JSON.stringify(values)+')'); //#development
    return attributeNames.map((attribute,index) => {
        eval('document.'+attribute+' = "'+values[index]+'"');
    });
};
communicationModule.function.getWindowAttributes = function(attributeNames=[]){
    dev.log.service('.getWindowAttributes('+JSON.stringify(attributeNames)+')'); //#development
    return attributeNames.map(attribute => {
        return eval('window.'+attribute);
    });
};
communicationModule.function.setWindowAttributes = function(attributes=[]){
    dev.log.service('.setWindowAttributes('+JSON.stringify(attributes)+')'); //#development
    attributes.map((attribute,index) => {
        eval('window.'+attribute.name+' = "'+attribute.value+'"');
    });
};