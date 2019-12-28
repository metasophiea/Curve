const interface = new function(){
    this.go = function(){
        dev.log.interface('.go()'); //#development
        dev.count('interface.go'); //#development
        communicationModule.run('go');
    };
    this.printToScreen = function(imageData){
        dev.log.interface('.printToScreen(',imageData); //#development
        dev.count('interface.printToScreen'); //#development
        communicationModule.run('printToScreen',[imageData],undefined,[imageData]);
    };

    // this.onViewportAdjust = function(state){
    //     dev.log.interface('.onViewportAdjust(',state); //#development
    //     communicationModule.run('onViewportAdjust',[state]);
    // };

    this.updateElement = function(elem, data={}){
        dev.log.interface('.updateElement(',elem,data); //#development
        dev.count('interface.updateElement'); //#development
        communicationModule.run('updateElement',[element.getIdFromElement(elem), data]);
    };
    this.runElementCallback = function(elem, data={}){
        dev.log.interface('.runElementCallback(',elem,data); //#development
        dev.count('interface.runElementCallback'); //#development
        communicationModule.run('runElementCallback',[element.getIdFromElement(elem), data]);
    };

    this.getCanvasAttributes = function(attributeNames=[],prefixActiveArray=[]){
        dev.log.interface('.getCanvasAttributes(',attributeNames,prefixActiveArray); //#development
        dev.count('interface.getCanvasAttributes'); //#development
        return new Promise((resolve, reject) => {
            communicationModule.run('getCanvasAttributes',[attributeNames,prefixActiveArray],resolve);
        });
    };
    this.setCanvasAttributes = function(attributeNames=[],values=[],prefixActiveArray=[]){
        dev.log.interface('.setCanvasAttributes(',attributeNames,values,prefixActiveArray); //#development
        dev.count('interface.setCanvasAttributes'); //#development
        communicationModule.run('setCanvasAttributes',[attributeNames,values,prefixActiveArray]);
    };

    this.getCanvasParentAttributes = function(attributeNames=[],prefixActiveArray=[]){
        dev.log.interface('.getCanvasParentAttributes(',attributeNames,prefixActiveArray); //#development
        dev.count('interface.getCanvasParentAttributes'); //#development
        return new Promise((resolve, reject) => {
            communicationModule.run('getCanvasParentAttributes',[attributeNames,prefixActiveArray],resolve);
        });
    };

    this.getDocumentAttributes = function(attributeNames=[]){
        dev.log.interface('.getDocumentAttributes(',attributeNames); //#development
        dev.count('interface.getDocumentAttributes'); //#development
        return new Promise((resolve, reject) => {
            communicationModule.run('getDocumentAttributes',[attributeNames],resolve);
        });
    };
    this.setDocumentAttributes = function(attributeNames=[],values=[]){
        dev.log.interface('.setDocumentAttributes(',attributeNames,values); //#development
        dev.count('interface.setDocumentAttributes'); //#development
        communicationModule.run('setDocumentAttributes',[attributeNames,values]);
    };

    this.getWindowAttributes = function(attributeNames=[]){
        dev.log.interface('.getWindowAttributes(',attributeNames); //#development
        dev.count('interface.getWindowAttributes'); //#development
        return new Promise((resolve, reject) => {
            communicationModule.run('getWindowAttributes',[attributeNames],resolve);
        });
    };
    this.setWindowAttributes = function(attributeNames=[],values=[]){
        dev.log.interface('.setWindowAttributes(',attributeNames,values); //#development
        dev.count('interface.setWindowAttributes'); //#development
        communicationModule.run('setWindowAttributes',[attributeNames,values]);
    };
};
callback.listCallbackTypes().forEach(callbackName => {
    //for sending core's callbacks back out
    callback.coupling_out[callbackName] = function(x, y, event, elements){
        dev.log.interface('.callback.coupling_out.'+callbackName+'(',x,y,event,elements); //#development
        dev.count('interface.callback.coupling_out.'+callbackName); //#development
        communicationModule.run('callback.'+callbackName,[x, y, event, {
            all: elements.all.map(ele => element.getIdFromElement(ele)),
            relevant: elements.relevant ? elements.relevant.map(ele => element.getIdFromElement(ele)) : undefined,
        }]);
    };
});