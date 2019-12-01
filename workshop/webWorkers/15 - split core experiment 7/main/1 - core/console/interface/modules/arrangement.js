this.arrangement = new function(){
    this.new = function(){
        dev.log.interface('.arrangement.new()'); //#development
        communicationModule.run('arrangement.new');
    };
    this.prepend = function(element){
        dev.log.interface('.arrangement.prepend('+JSON.stringify(element)+')'); //#development
        if(element.getId() == -1){
            dev.log.interface('.arrangement.prepend -> element ID is -1'); //#development
            setTimeout(() => {this.prepend(element);},1);
        }else{
            dev.log.interface('.arrangement.prepend -> element ID is '+element.getId()); //#development
            communicationModule.run('arrangement.prepend',[element.getId()]);
        }
    };
    this.append = function(element){
        dev.log.interface('.arrangement.append('+JSON.stringify(element)+')'); //#development
        if(element.getId() == -1){
            dev.log.interface('.arrangement.append -> element ID is -1'); //#development
            setTimeout(() => {this.append(element);},1);
        }else{
            dev.log.interface('.arrangement.append -> element ID is '+element.getId()); //#development
            communicationModule.run('arrangement.append',[element.getId()]);
        }
    };
    this.remove = function(element){
        dev.log.interface('.arrangement.remove('+JSON.stringify(element)+')'); //#development
        if(element.getId() == -1){
            dev.log.interface('.arrangement.remove -> element ID is -1'); //#development
            setTimeout(() => {this.remove(element);},1);
        }else{
            dev.log.interface('.arrangement.remove -> element ID is '+element.getId()); //#development
            communicationModule.run('arrangement.remove',[element.getId()]);
        }
    };
    this.clear = function(){
        dev.log.interface('.arrangement.clear()'); //#development
        communicationModule.run('arrangement.clear');
    };
    this.getElementByAddress = function(address){
        dev.log.interface('.arrangement.getElementByAddress('+address+')'); //#development
        return new Promise((resolve, reject) => {
            communicationModule.run('arrangement.getElementByAddress',[address],result => {
                resolve(elementRegistry[result]);
            });
        });
    };
    this.getElementsUnderPoint = function(x,y){
        dev.log.interface('.arrangement.getElementsUnderPoint('+x+','+y+')'); //#development
        return new Promise((resolve, reject) => {
            communicationModule.run('arrangement.getElementsUnderPoint',[x,y],results => {
                resolve(results.map(result => elementRegistry[result]));
            });
        });
    };
    this.getElementsUnderArea = function(points){
        dev.log.interface('.arrangement.getElementsUnderArea('+points+')'); //#development
        return new Promise((resolve, reject) => {
            communicationModule.run('arrangement.getElementsUnderArea',[points],results => {
                resolve(results.map(result => elementRegistry[result]));
            });
        });
    };
    this.printTree = function(mode){
        dev.log.interface('.arrangement.printTree('+mode+')'); //#development
        communicationModule.run('arrangement.printTree',[mode]);
    };
    this.areParents = function(element,potentialParents=[]){
        dev.log.interface('.arrangement.areParents('+JSON.stringify(element)+','+JSON.stringify(potentialParents)+')'); //#development
        return new Promise((resolve, reject) => {
            communicationModule.run('arrangement.areParents',[element.getId(),potentialParents.map(parent => parent.getId())],resolve);
        });
    };
};