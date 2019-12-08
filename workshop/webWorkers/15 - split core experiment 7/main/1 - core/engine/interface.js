const interface = new function(){
    this.go = function(){
        dev.log.interface('.go()'); //#development
        communicationModule.run('go');
    };
    this.printToScreen = function(imageData){
        dev.log.interface('.printToScreen(-imageData-)'); //#development
        communicationModule.run('printToScreen',[imageData],undefined,[imageData]);
    };

    // this.onViewportAdjust = function(state){
    //     dev.log.interface('.onViewportAdjust('+state+')'); //#development
    //     communicationModule.run('onViewportAdjust',[state]);
    // };

    this.updateElement = function(elem, data={}){
        dev.log.interface('.updateElement('+JSON.stringify(elem)+','+JSON.stringify(data)+')'); //#development
        communicationModule.run('updateElement',[element.getIdFromElement(elem), data]);
    };
    this.runElementCallback = function(elem, data={}){
        dev.log.interface('.runElementCallback('+JSON.stringify(elem)+','+JSON.stringify(data)+')'); //#development
        communicationModule.run('runElementCallback',[element.getIdFromElement(elem), data]);
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
    callback.coupling_out[callbackName] = function(x, y, event, elements){
        dev.log.interface('.callback.coupling_out.'+callbackName+'('+x+','+y+','+JSON.stringify(event)+','+JSON.stringify(elements)+')'); //#development
        communicationModule.run('callback.'+callbackName,[x, y, event, {
            all: elements.all.map(ele => element.getIdFromElement(ele)),
            relevant: elements.relevant ? elements.relevant.map(ele => element.getIdFromElement(ele)) : undefined,
        }]);
    };
});