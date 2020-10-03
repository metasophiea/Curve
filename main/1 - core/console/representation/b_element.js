this.element = new function(){
    const elementLibrary = new function(){
        {{include:elementLibrary/main.js}}
    };
    const elementRegistry = [];
    
    //element library
        this.getAvailableElements = function(){
            return Object.keys(elementLibrary);
        };
        this.getElementById = function(id){
            return elementRegistry[id];
        };
    //basic management
        this.__createLocalWithId = function(type,name,id){
            if( type == undefined || name == undefined || id == undefined ){
                console.error("core.element.__createLocalWithId(",type,name,id);
                console.error("missing arguments");
                return;
            }
            if( elementRegistry[id] != undefined ){
                console.error("core.element.__createLocalWithId(",type,name,id);
                console.error("proxy already present");
                return;
            }

            elementRegistry[id] = new elementLibrary[type](name);
            elementRegistry[id].__id(id);
            return elementRegistry[id];
        };
        this.create = function(type,name){
            if( ! (type in elementLibrary) ){
                console.error("core.element.create -> element type: \""+type+"\" is not a known type");
                return;
            }

            const newElementProxy = new elementLibrary[type](name);
            interface.operator.element.create(type,name).then(id => {
                    newElementProxy.__id(id);
                    elementRegistry[id] = newElementProxy;
                }
            );
            return newElementProxy;
        };
        this.delete = function(element){
            interface.operator.element.delete(element.getId());
            elementRegistry[element.getId()] = undefined;
        };
        this.deleteAllCreated = function(){
            interface.operator.element.deleteAllCreated();
            elementRegistry = [];
        };
    //misc
        this._dump = function(){
            console.log("┌─Console Element Dump─");
            console.log("│ elementRegistry:", elementRegistry);
            console.log("└──────────────────────");
            interface.operator.element._dump();
        };
};