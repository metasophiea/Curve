this.element = new function(){
    this.getAvailableElements = function(){
        dev.log.interface('.element.getAvailableElements()'); //#development
        return Object.keys(elementLibrary);
    };
    this.installElement = function(elementName,creatorMethod,interfaceProxyObject,allowOverwrite=false){
        dev.log.interface('.element.installElement('+elementName+','+creatorMethod+','+interfaceProxyObject+')'); //#development

        if(!allowOverwrite && elementName in elementLibrary){
            dev.log.interface('.element.installElement -> element "'+elementName+'" is already in the elementLibrary'); //#development
            return false
        }

        return new Promise((resolve, reject) => {
            communicationModule.run('element.installElement',[elementName,_canvas_.library.misc.serialize(creatorMethod)],result => {
                elementLibrary[elementName] = interfaceProxyObject;
                resolve(result);
            });
        });
    };
    this.getCreatedElements = function(){
        dev.log.interface('.element.getCreatedElements()'); //#development
        return elementRegistry;
    };

    this.create = function(type,name){
        dev.log.interface('.element.create('+type+','+name+')'); //#development
        return new Promise((resolve, reject) => {
            if(elementLibrary[type] == undefined){
                console.warn('interface.element.create - unknown element type "'+type+'"');
                resolve();
                return;
            }
            communicationModule.run('element.create',[type,name],id => {
                resolve( elementRegistry[id] = new elementLibrary[type](id,name,communicationModule,dev) )
            });
        });
    };
    this.delete = function(element){
        dev.log.interface('.element.delete('+JSON.stringify(element)+')'); //#development
        communicationModule.run('element.delete',[element.getId()]);
        elementRegistry[element.getId()] = undefined;
    };
    this.deleteAllCreated = function(){
        dev.log.interface('.element.deleteAllCreated()'); //#development
        communicationModule.run('element.deleteAllCreated',[]);
        elementRegistry = [];
    };
};