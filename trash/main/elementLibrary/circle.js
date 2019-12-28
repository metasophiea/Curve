this.circle = function(_id,_name){
    dev.log.elementLibrary(' - new circle('+_id+')'); //#development

    const id = _id;
    this.getId = function(){return id;};
    const name = _name;
    this.getName = function(){return name;};
    this.getType = function(){return 'circle';};

    const useCache_default = true;
    const cashedAttributes = {
        ignored: false,
        colour: {r:1,g:0,b:0,a:1},
        x: 0,
        y: 0,
        radius: 10,
        scale: 1,
        static: false,
    };
    function executeMethod(method,argumentList,postProcessing){
        return new Promise((resolve, reject) => { 
            communicationModule.run('element.executeMethod',[id,method,argumentList],result => {
                if(postProcessing){resolve(postProcessing(result));}else{resolve(result);}
            });
        });
    }

    this.ignored = function(bool,useCache=useCache_default){
        dev.log.elementLibrary(' - circle.ignored('+bool+')'); //#development
        if(useCache && bool == undefined){ return cashedAttributes.ignored; } cashedAttributes.ignored = bool;
        return executeMethod('ignored',[bool]);
    };
    this.colour = function(colour,useCache=useCache_default){
        dev.log.elementLibrary(' - circle.colour('+JSON.stringify(colour)+')'); //#development
        if(useCache && colour == undefined){ return cashedAttributes.colour; } cashedAttributes.colour = colour;
        return executeMethod('colour',[colour]);
    };
    this.x = function(number,useCache=useCache_default){
        dev.log.elementLibrary(' - circle.x('+number+')'); //#development
        if(useCache && number == undefined){ return cashedAttributes.x; } cashedAttributes.x = number;
        return executeMethod('x',[number]);
    };
    this.y = function(number,useCache=useCache_default){
        dev.log.elementLibrary(' - circle.y('+number+')'); //#development
        if(useCache && number == undefined){ return cashedAttributes.y; } cashedAttributes.y = number;
        return executeMethod('y',[number]);
    };
    this.radius = function(number,useCache=useCache_default){
        dev.log.elementLibrary(' - circle.radius('+number+')'); //#development
        if(useCache && number == undefined){ return cashedAttributes.radius; } cashedAttributes.radius = number;
        return executeMethod('radius',[number]);
    };
    this.scale = function(number,useCache=useCache_default){
        dev.log.elementLibrary(' - circle.scale('+number+')'); //#development
        if(useCache && number == undefined){ return cashedAttributes.scale; } cashedAttributes.scale = number;
        return executeMethod('scale',[number]);
    };
    this.static = function(bool,useCache=useCache_default){
        dev.log.elementLibrary(' - circle.static('+bool+')'); //#development
        if(useCache && bool == undefined){ return cashedAttributes.static; } cashedAttributes.static = bool;
        return executeMethod('static',[bool]);
    };
    this.unifiedAttribute = function(attributes,useCache=useCache_default){
        dev.log.elementLibrary(' - circle.unifiedAttribute('+JSON.stringify(attributes)+')'); //#development
        if(useCache && attributes == undefined){ return cashedAttributes; } 
        Object.keys(attributes).forEach(key => { cashedAttributes[key] = attributes[key]; });
        return executeMethod('unifiedAttribute',[attributes]);
    };
    this.getAddress = function(){
        dev.log.elementLibrary(' - circle.getAddress()'); //#development
        return executeMethod('getAddress',[]);
    };

    this._dump = function(){
        dev.log.elementLibrary(' - circle._dump()'); //#development
        return executeMethod('_dump',[]);
    };
};