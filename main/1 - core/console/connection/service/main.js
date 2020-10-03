communicationModule.function.frame = function(data){
    dev.log.service(' -> frame(',data); //#development
    _canvas_.getContext("bitmaprenderer").transferFromImageBitmap(data);
};
communicationModule.function.ready = function(){
    dev.log.service(' -> ready()'); //#development
    core.ready();
};
communicationModule.function.setCanvasSize = function(width,height){
    dev.log.service(' -> setCanvasSize(',width,height); //#development
    _canvas_.setAttribute('width',width);
    _canvas_.setAttribute('height',height);
}

communicationModule.function.updateElement = function(ele_id, data={}){
    dev.log.service(' -> updateElement(',ele_id,data); //#development
    const proxyElement = _canvas_.core.element.getElementById(ele_id);
    if(proxyElement.__updateValues != undefined){ proxyElement.__updateValues(data); }
};
communicationModule.function.runElementCallback = function(ele_id, data={}){
    dev.log.service(' -> runElementCallback(',ele_id,data); //#development
    const proxyElement = _canvas_.core.element.getElementById(ele_id);
    if(proxyElement.__runCallback != undefined){ proxyElement.__runCallback(data); }
};

communicationModule.function.getCanvasAttributes = function(attributeNames=[],prefixActiveArray=[]){
    dev.log.service(' -> getCanvasAttributes(',attributeNames,prefixActiveArray); //#development
    return attributeNames.map((name,index) => {
        return _canvas_.getAttribute((prefixActiveArray[index]?__canvasPrefix:'')+name);
    });    
};
communicationModule.function.setCanvasAttributes = function(attributeNames=[],values=[],prefixActiveArray=[]){
    dev.log.service(' -> setCanvasAttributes(',attributeNames,values,prefixActiveArray); //#development
    attributeNames.map((name,index) => {
        _canvas_.setAttribute((prefixActiveArray[index]?__canvasPrefix:'')+name, values[index]);
    });
};

communicationModule.function.getCanvasParentAttributes = function(attributeNames=[],prefixActiveArray=[]){
    dev.log.service(' -> getCanvasParentAttributes(',attributeNames,prefixActiveArray); //#development
    return attributeNames.map((name,index) => {
        return _canvas_.parentElement[(prefixActiveArray[index]?__canvasPrefix:'')+name];
    });
};

communicationModule.function.getDocumentAttributes = function(attributeNames=[]){
    dev.log.service(' -> getDocumentAttributes(',attributeNames); //#development
    return attributeNames.map(attribute => {
        return eval('document.'+attribute);
    });
};
communicationModule.function.setDocumentAttributes = function(attributeNames=[],values=[]){
    dev.log.service(' -> setDocumentAttributes(',attributeNames,values); //#development
    return attributeNames.map((attribute,index) => {
        eval('document.'+attribute+' = "'+values[index]+'"');
    });
};
communicationModule.function.getWindowAttributes = function(attributeNames=[]){
    dev.log.service(' -> getWindowAttributes(',attributeNames); //#development
    return attributeNames.map(attribute => {
        return eval('window.'+attribute);
    });
};
communicationModule.function.setWindowAttributes = function(attributes=[]){
    dev.log.service(' -> setWindowAttributes(',attributes); //#development
    attributes.map((attribute,index) => {
        eval('window.'+attribute.name+' = "'+attribute.value+'"');
    });
};