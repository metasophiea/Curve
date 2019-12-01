this.group = function(_id,_name){
    dev.log.elementLibrary(' - new group('+_id+')'); //#development

    const id = _id;
    this.getId = function(){return id;};
    const name = _name;
    this.getName = function(){return name;};
    this.getType = function(){return 'group';};

    const useCache_default = true;
    const cashedAttributes = {
        ignored: false,
        x: 0,
        y: 0,
        angle: 0,
        scale: 1,
        static: false,
        stencil: undefined,
        clipActive: false,
    };
    const children = [];
    const childRegistry = {};

    this.ignored = function(bool,useCache=useCache_default){
        dev.log.elementLibrary(' - group.ignored('+bool+')'); //#development
        if(useCache && bool == undefined){ return cashedAttributes.ignored; } cashedAttributes.ignored = bool;
        return executeMethod(id,'ignored',[bool]);
    };
    this.x = function(number,useCache=useCache_default){
        dev.log.elementLibrary(' - group.x('+number+')'); //#development
        if(useCache && number == undefined){ return cashedAttributes.x; } cashedAttributes.x = number;
        return executeMethod(id,'x',[number]);
    };
    this.y = function(number,useCache=useCache_default){
        dev.log.elementLibrary(' - group.y('+number+')'); //#development
        if(useCache && number == undefined){ return cashedAttributes.y; } cashedAttributes.y = number;
        return executeMethod(id,'y',[number]);
    };
    this.angle = function(number,useCache=useCache_default){
        dev.log.elementLibrary(' - group.angle('+number+')'); //#development
        if(useCache && number == undefined){ return cashedAttributes.angle; } cashedAttributes.angle = number;
        return executeMethod(id,'angle',[number]);
    };
    this.scale = function(number,useCache=useCache_default){
        dev.log.elementLibrary(' - group.scale('+number+')'); //#development
        if(useCache && number == undefined){ return cashedAttributes.scale; } cashedAttributes.scale = number;
        return executeMethod(id,'scale',[number]);
    };
    this.heedCamera = function(bool,useCache=useCache_default){ 
        dev.log.elementLibrary(' - group.heedCamera('+bool+')'); //#development
        if(useCache && bool == undefined){ return cashedAttributes.heedCamera; } cashedAttributes.heedCamera = bool;
        return executeMethod(id,'heedCamera',[bool]);
    };
    this.static = function(bool,useCache=useCache_default){
        dev.log.elementLibrary(' - group.static('+bool+')'); //#development
        if(useCache && bool == undefined){ return cashedAttributes.static; } cashedAttributes.static = bool;
        return executeMethod(id,'static',[bool]);
    };
    this.unifiedAttribute = function(attributes,useCache=useCache_default){
        dev.log.elementLibrary(' - group.unifiedAttribute('+JSON.stringify(attributes)+')'); //#development
        if(useCache && attributes == undefined){ return cashedAttributes; } 
        Object.keys(attributes).forEach(key => { cashedAttributes[key] = attributes[key]; });
        return executeMethod(id,'unifiedAttribute',[attributes]);
    };
    this.getAddress = function(){
        dev.log.elementLibrary(' - group.getAddress()'); //#development
        return executeMethod(id,'getAddress',[]);
    };
    this.children = function(useCache=useCache_default){ 
        dev.log.elementLibrary(' - group.children()'); //#development
        if(useCache){ return children; } 
        return executeMethod(id,'children',[],result => result.map(result => elementRegistry[result]) );
    };
    this.getChildByName = function(name,useCache=useCache_default){
        dev.log.elementLibrary(' - group.getChildByName('+name+')'); //#development
        if(useCache){ return childRegistry[name]; } 
        return executeMethod(id,'getChildByName',[name],result => elementRegistry[result] );
    };
    this.getChildIndexByName = function(name,useCache=useCache_default){
        dev.log.elementLibrary(' - group.getChildIndexByName('+name+')'); //#development
        if(useCache){ return children.indexOf(childRegistry[name]); } 
        return executeMethod(id,'getChildIndexByName',[name]);
    };
    this.contains = function(element,useCache=useCache_default){
        dev.log.elementLibrary(' - group.contains('+JSON.stringify(element)+')'); //#development
        if(useCache){ return children.indexOf(element) != -1; } 
        return executeMethod(id,'contains',[element.getId()]);
    };
    this.append = function(element){
        dev.log.elementLibrary(' - group.append('+JSON.stringify(element)+')'); //#development
        return executeMethod(id,'append',[element.getId()],result => {if(result){ 
            children.push(element);
            childRegistry[element.getName()] = element;
        }});
    };
    this.prepend = function(element){
        dev.log.elementLibrary(' - group.prepend('+JSON.stringify(element)+')'); //#development
        return executeMethod(id,'prepend',[element.getId()],result => {if(result){ 
            children.unshift(element);
            childRegistry[element.getName()] = element;
        }});
    };
    this.remove = function(element){
        dev.log.elementLibrary(' - group.remove('+JSON.stringify(element)+')'); //#development
        children.splice(children.indexOf(element), 1);
        return executeMethod(id,'remove',[element.getId()]);
    };
    this.clear = function(){
        dev.log.elementLibrary(' - group.clear()'); //#development
        children = [];
        return executeMethod(id,'clear',[]);
    };
    this.getElementsUnderPoint = function(x,y){
        dev.log.elementLibrary(' - group.getElementsUnderPoint('+x+','+y+')'); //#development
        return executeMethod(id,'getElementsUnderPoint',[x,y],result => result.map(result => elementRegistry[result]));
    };
    this.getElementsUnderArea = function(points){
        dev.log.elementLibrary(' - group.getElementsUnderArea('+JSON.stringify(points)+')'); //#development
        return executeMethod(id,'getElementsUnderArea',[points],result => result.map(result => elementRegistry[result]));
    };
    this.getTree = function(){
        dev.log.elementLibrary(' - group.getTree()'); //#development
        return executeMethod(id,'getTree',[]);
    };
    this.stencil = function(element,useCache=useCache_default){
        dev.log.elementLibrary(' - group.stencil('+JSON.stringify(element)+')'); //#development
        if(useCache && element == undefined){ return cashedAttributes.stencil; } cashedAttributes.stencil = element;
        return executeMethod(id,'stencil',[element.getId()]);
    };
    this.clipActive = function(bool,useCache=useCache_default){ 
        dev.log.elementLibrary(' - group.clipActive('+bool+')'); //#development
        if(useCache && bool == undefined){ return cashedAttributes.clipActive; } cashedAttributes.clipActive = bool;
        return executeMethod(id,'clipActive',[bool]);
    };

    this._dump = function(){
        dev.log.elementLibrary(' - group._dump()'); //#development
        return executeMethod(id,'_dump',[]);
    };
};