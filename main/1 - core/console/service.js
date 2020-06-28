communicationModule.function.go = function(){
    dev.log.service('.go()'); //#development
    _canvas_.layers.declareLayerAsLoaded("core");
};
communicationModule.function.printToScreen = function(imageData){
    dev.log.service('.printToScreen(',imageData); //#development
    _canvas_.getContext("bitmaprenderer").transferFromImageBitmap(imageData);
};
// communicationModule.function.onViewportAdjust = function(state){
//     dev.log.service('.onViewportAdjust('+JSON.stringify(state)+')'); //#development
//     console.log('onViewportAdjust -> ',state); /* callback */
// };

communicationModule.function.updateElement = function(elem, data={}){
    dev.log.service('.updateElement(',elem,data); //#development
    const proxyElement = _canvas_.core.meta.getElementFromId(elem);
    if(proxyElement.__updateValues != undefined){ proxyElement.__updateValues(data); }
};
communicationModule.function.runElementCallback = function(elem, data={}){
    dev.log.service('.runElementCallback(',elem,data); //#development
    const proxyElement = _canvas_.core.meta.getElementFromId(elem);
    if(proxyElement.__runCallback != undefined){ proxyElement.__runCallback(data); }
};

communicationModule.function.getCanvasAttributes = function(attributeNames=[],prefixActiveArray=[]){
    dev.log.service('.getCanvasAttributes(',attributeNames,prefixActiveArray); //#development
    return attributeNames.map((name,index) => {
        return _canvas_.getAttribute((prefixActiveArray[index]?__canvasPrefix:'')+name);
    });    
};
communicationModule.function.setCanvasAttributes = function(attributes=[],prefixActiveArray=[]){
    dev.log.service('.setCanvasAttributes(',attributes,prefixActiveArray); //#development
    attributes.map((attribute,index) => {
        _canvas_.setAttribute((prefixActiveArray[index]?__canvasPrefix:'')+attribute.name,attribute.value);
    });
};
communicationModule.function.getCanvasParentAttributes = function(attributeNames=[],prefixActiveArray=[]){
    dev.log.service('.getCanvasParentAttributes(',attributeNames,prefixActiveArray); //#development
    return attributeNames.map((name,index) => {
        return _canvas_.parentElement[(prefixActiveArray[index]?__canvasPrefix:'')+name];
    });
};

communicationModule.function.getDocumentAttributes = function(attributeNames=[]){
    dev.log.service('.getDocumentAttributes(',attributeNames); //#development
    return attributeNames.map(attribute => {
        return eval('document.'+attribute);
    });
};
communicationModule.function.setDocumentAttributes = function(attributeNames=[],values=[]){
    dev.log.service('.setDocumentAttributes(',attributeNames,values); //#development
    return attributeNames.map((attribute,index) => {
        eval('document.'+attribute+' = "'+values[index]+'"');
    });
};
communicationModule.function.getWindowAttributes = function(attributeNames=[]){
    dev.log.service('.getWindowAttributes(',attributeNames); //#development
    return attributeNames.map(attribute => {
        return eval('window.'+attribute);
    });
};
communicationModule.function.setWindowAttributes = function(attributes=[]){
    dev.log.service('.setWindowAttributes(',attributes); //#development
    attributes.map((attribute,index) => {
        eval('window.'+attribute.name+' = "'+attribute.value+'"');
    });
};