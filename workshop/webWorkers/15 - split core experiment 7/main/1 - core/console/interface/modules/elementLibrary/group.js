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
        children: [],
        stencil: undefined,
        clipActive: false,
    };
    function resolvedPromise(data){
        return new Promise((resolve,reject) => {resolve(data)});
    }
    function executeMethod(method,argumentList,postProcessing){
        return new Promise((resolve, reject) => { 
            communicationModule.run('element.executeMethod',[id,method,argumentList],result => {
                if(postProcessing){resolve(postProcessing(result));}else{resolve(result);}
            });
        });
    }

    this.ignored = function(bool,useCache=useCache_default){
        dev.log.elementLibrary(' - group.ignored('+bool+')'); //#development
        if(useCache && bool == undefined){ return resolvedPromise(cashedAttributes.ignored); } cashedAttributes.ignored = bool;
        return executeMethod('ignored',[bool]);
    };
    this.x = function(number,useCache=useCache_default){
        dev.log.elementLibrary(' - group.x('+number+')'); //#development
        if(useCache && number == undefined){ return resolvedPromise(cashedAttributes.x); } cashedAttributes.x = number;
        return executeMethod('x',[number]);
    };
    this.y = function(number,useCache=useCache_default){
        dev.log.elementLibrary(' - group.y('+number+')'); //#development
        if(useCache && number == undefined){ return resolvedPromise(cashedAttributes.y); } cashedAttributes.y = number;
        return executeMethod('y',[number]);
    };
    this.angle = function(number,useCache=useCache_default){
        dev.log.elementLibrary(' - group.angle('+number+')'); //#development
        if(useCache && number == undefined){ return resolvedPromise(cashedAttributes.angle); } cashedAttributes.angle = number;
        return executeMethod('angle',[number]);
    };
    this.scale = function(number,useCache=useCache_default){
        dev.log.elementLibrary(' - group.scale('+number+')'); //#development
        if(useCache && number == undefined){ return resolvedPromise(cashedAttributes.scale); } cashedAttributes.scale = number;
        return executeMethod('scale',[number]);
    };
    this.heedCamera = function(bool,useCache=useCache_default){ 
        dev.log.elementLibrary(' - group.heedCamera('+bool+')'); //#development
        if(useCache && bool == undefined){ return resolvedPromise(cashedAttributes.heedCamera); } cashedAttributes.heedCamera = bool;
        return executeMethod('heedCamera',[bool]);
    };
    this.static = function(bool,useCache=useCache_default){
        dev.log.elementLibrary(' - group.static('+bool+')'); //#development
        if(useCache && bool == undefined){ return resolvedPromise(cashedAttributes.static); } cashedAttributes.static = bool;
        return executeMethod('static',[bool]);
    };
    this.unifiedAttribute = function(attributes,useCache=useCache_default){
        dev.log.elementLibrary(' - group.unifiedAttribute('+JSON.stringify(attributes)+')'); //#development
        if(useCache && attributes == undefined){ return resolvedPromise(cashedAttributes); } 
        Object.keys(attributes).forEach(key => { cashedAttributes[key] = attributes[key]; });
        return executeMethod('unifiedAttribute',[attributes]);
    };
    this.getAddress = function(){
        dev.log.elementLibrary(' - group.getAddress()'); //#development
        return executeMethod('getAddress',[]);
    };
    this.children = function(useCache=useCache_default){ 
        dev.log.elementLibrary(' - group.children()'); //#development
        if(useCache){ return resolvedPromise(cashedAttributes.children); } 
        return executeMethod('children',[],result => result.map(result => elementRegistry[result]) );
    };
    this.getChildByName = function(name){
        dev.log.elementLibrary(' - group.getChildByName('+name+')'); //#development
        return executeMethod('getChildByName',[name],result => elementRegistry[result] );
    };
    this.getChildIndexByName = function(name){
        dev.log.elementLibrary(' - group.getChildIndexByName('+name+')'); //#development
        return executeMethod('getChildIndexByName',[name]);
    };
    this.contains = function(element,useCache=useCache_default){
        dev.log.elementLibrary(' - group.contains('+JSON.stringify(element)+')'); //#development
        if(useCache){ return resolvedPromise(cashedAttributes.children.indexOf(element) != -1); } 
        return executeMethod('contains',[element.getId()]);
    };
    this.append = function(element){
        dev.log.elementLibrary(' - group.append('+JSON.stringify(element)+')'); //#development
        return executeMethod('append',[element.getId()],result => {if(result){ cashedAttributes.children.push(element); }});
    };
    this.prepend = function(element){
        dev.log.elementLibrary(' - group.prepend('+JSON.stringify(element)+')'); //#development
        return executeMethod('prepend',[element.getId(),result => {if(result){ cashedAttributes.children.unshift(element); }}]);
    };
    this.remove = function(element){
        dev.log.elementLibrary(' - group.remove('+JSON.stringify(element)+')'); //#development
        cashedAttributes.children.splice(cashedAttributes.children.indexOf(element), 1);
        return executeMethod('remove',[element.getId()]);
    };
    this.clear = function(){
        dev.log.elementLibrary(' - group.clear()'); //#development
        cashedAttributes.children = [];
        return executeMethod('clear',[]);
    };
    this.getElementsUnderPoint = function(x,y){
        dev.log.elementLibrary(' - group.getElementsUnderPoint('+x+','+y+')'); //#development
        return executeMethod('getElementsUnderPoint',[x,y],result => result.map(result => elementRegistry[result]));
    };
    this.getElementsUnderArea = function(points){
        dev.log.elementLibrary(' - group.getElementsUnderArea('+JSON.stringify(points)+')'); //#development
        return executeMethod('getElementsUnderArea',[points],result => result.map(result => elementRegistry[result]));
    };
    this.getTree = function(){
        dev.log.elementLibrary(' - group.getTree()'); //#development
        return executeMethod('getTree',[]);
    };
    this.stencil = function(element,useCache=useCache_default){
        dev.log.elementLibrary(' - group.stencil('+JSON.stringify(element)+')'); //#development
        if(useCache && element == undefined){ return resolvedPromise(cashedAttributes.stencil); } cashedAttributes.stencil = element;
        return executeMethod('stencil',[element.getId()]);
    };
    this.clipActive = function(bool,useCache=useCache_default){ 
        dev.log.elementLibrary(' - group.clipActive('+bool+')'); //#development
        if(useCache && bool == undefined){ return resolvedPromise(cashedAttributes.clipActive); } cashedAttributes.clipActive = bool;
        return executeMethod('clipActive',[bool]);
    };

    this._dump = function(){
        dev.log.elementLibrary(' - group._dump()'); //#development
        return executeMethod('_dump',[]);
    };
};