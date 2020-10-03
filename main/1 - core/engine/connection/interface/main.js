self.interface = new function(){
    this.ready = function(){
        dev.log.interface('.operator.element.getAvailableElements()'); //#development
        communicationModule.run_withoutPromise('ready');
    };
    this.getCanvasAttributes = function(attributeNames=[],prefixActiveArray=[]){
        dev.log.interface('.getCanvasAttributes(',attributeNames,prefixActiveArray); //#development
        return communicationModule.run_withPromise('getCanvasAttributes',[attributeNames,prefixActiveArray]);
    };
    this.setCanvasAttributes = function(attributeNames=[],values=[],prefixActiveArray=[]){
        dev.log.interface('.setCanvasAttributes(',attributeNames,values,prefixActiveArray); //#development
        communicationModule.run_withoutPromise('setCanvasAttributes',[attributeNames,values,prefixActiveArray]);
    };

    this.getCanvasParentAttributes = function(attributeNames=[],prefixActiveArray=[]){
        dev.log.interface('.getCanvasParentAttributes(',attributeNames,prefixActiveArray); //#development
        return communicationModule.run_withPromise('getCanvasParentAttributes',[attributeNames,prefixActiveArray]);
    };

    this.getDocumentAttributes = function(attributeNames=[]){
        dev.log.interface('.getDocumentAttributes(',attributeNames); //#development
        return communicationModule.run_withPromise('getDocumentAttributes',[attributeNames,prefixActiveArray]);
    };
    this.setDocumentAttributes = function(attributeNames=[],values=[]){
        dev.log.interface('.setDocumentAttributes(',attributeNames,values); //#development
        communicationModule.run_withoutPromise('setDocumentAttributes',[attributeNames,values]);
    };

    this.getWindowAttributes = function(attributeNames=[]){
        dev.log.interface('.getWindowAttributes(',attributeNames); //#development
        return communicationModule.run_withPromise('getWindowAttributes',[attributeNames]);
    };
    this.setWindowAttributes = function(attributeNames=[],values=[]){
        dev.log.interface('.setWindowAttributes(',attributeNames,values); //#development
        communicationModule.run_withoutPromise('setWindowAttributes',[attributeNames,values]);
    };
};
