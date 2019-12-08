this.element = new function(){
    this.getAvailableElements = function(){
        dev.log.interface('.element.getAvailableElements()'); //#development
        return Object.keys(elementLibrary);
    };

    this.create = function(type,name){
        dev.log.interface('.element.create('+type+','+name+')'); //#development

        if(elementLibrary[type] == undefined){
            console.warn('interface.element.create - unknown element type "'+type+'"');
            return;
        }

        const newElementProxy = new elementLibrary[type](name);
        communicationModule.run('element.create', [type,name], id => {
            newElementProxy.__id(id);
            elementRegistry[id] = newElementProxy;
        });
        return newElementProxy;
    };
    this.delete = function(ele){
        dev.log.interface('.element.delete('+JSON.stringify(ele)+')'); //#development
        communicationModule.run('element.delete',[ele.getId()]);
        elementRegistry[element.getId()] = undefined;
    };
    this.deleteAllCreated = function(){
        dev.log.interface('.element.deleteAllCreated()'); //#development
        communicationModule.run('element.deleteAllCreated',[]);
        elementRegistry = [];
    };

    this.__executeMethod = function(id,attribute,argumentList,callback,transferables){
        dev.log.interface('.element.__executeMethod('+id+','+attribute+','+JSON.stringify(argumentList)+')'); //#development
        communicationModule.run('element.executeMethod',[id,attribute,argumentList],callback,transferables);
    };
};