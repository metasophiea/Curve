this.rectangle = function(_id,_name){
    dev.log.elementLibrary(' - new rectangle('+_id+')'); //#development

    const id = _id;
    this.getId = function(){return id;};
    const name = _name;
    this.getName = function(){return name;};
    this.getType = function(){return 'rectangle';};

    const useCache_default = true;
    const cashedAttributes = {
        ignored: false,
        colour: {r:1,g:0,b:0,a:1},
        x: 0,
        y: 0,
        angle: 0,
        anchor: {x:0,y:0},
        width: 10,
        height: 10,
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
        dev.log.elementLibrary(' - rectangle.ignored('+bool+')'); //#development
        if(useCache && bool == undefined){ return cashedAttributes.ignored; } cashedAttributes.ignored = bool;
        return executeMethod('ignored',[bool]);
    };
    this.colour = function(colour,useCache=useCache_default){
        dev.log.elementLibrary(' - rectangle.colour('+JSON.stringify(colour)+')'); //#development
        if(useCache && colour == undefined){ return cashedAttributes.colour; } cashedAttributes.colour = colour;
        return executeMethod('colour',[colour]);
    };
    this.x = function(number,useCache=useCache_default){
        dev.log.elementLibrary(' - rectangle.x('+number+')'); //#development
        if(useCache && number == undefined){ return cashedAttributes.x; } cashedAttributes.x = number;
        return executeMethod('x',[number]);
    };
    this.y = function(number,useCache=useCache_default){
        dev.log.elementLibrary(' - rectangle.y('+number+')'); //#development
        if(useCache && number == undefined){ return cashedAttributes.y; } cashedAttributes.y = number;
        return executeMethod('y',[number]);
    };
    this.angle = function(number,useCache=useCache_default){
        dev.log.elementLibrary(' - rectangle.angle('+number+')'); //#development
        if(useCache && number == undefined){ return cashedAttributes.angle; } cashedAttributes.angle = number;
        return executeMethod('angle',[number]);
    };
    this.anchor = function(newAnchor,useCache=useCache_default){
        dev.log.elementLibrary(' - rectangle.anchor('+anchor+')'); //#development
        if(useCache && newAnchor == undefined){ return cashedAttributes.anchor; } cashedAttributes.anchor = newAnchor;
        return executeMethod('anchor',[newAnchor]);
    };
    this.width = function(number,useCache=useCache_default){
        dev.log.elementLibrary(' - rectangle.width('+number+')'); //#development
        if(useCache && number == undefined){ return cashedAttributes.width; } cashedAttributes.width = number;
        return executeMethod('width',[number]);
    };
    this.height = function(number,useCache=useCache_default){
        dev.log.elementLibrary(' - rectangle.height('+number+')'); //#development
        if(useCache && number == undefined){ return cashedAttributes.height; } cashedAttributes.height = number;
        return executeMethod('height',[number]);
    };
    this.scale = function(number,useCache=useCache_default){
        dev.log.elementLibrary(' - rectangle.scale('+number+')'); //#development
        if(useCache && number == undefined){ return cashedAttributes.scale; } cashedAttributes.scale = number;
        return executeMethod('scale',[number]);
    };
    this.static = function(bool,useCache=useCache_default){
        dev.log.elementLibrary(' - rectangle.static('+bool+')'); //#development
        if(useCache && bool == undefined){ return cashedAttributes.static; } cashedAttributes.static = bool;
        return executeMethod('static',[bool]);
    };
    this.unifiedAttribute = function(attributes,useCache=useCache_default){
        dev.log.elementLibrary(' - rectangle.unifiedAttribute('+JSON.stringify(attributes)+')'); //#development
        if(useCache && attributes == undefined){ return cashedAttributes; } 
        Object.keys(attributes).forEach(key => { cashedAttributes[key] = attributes[key]; });
        return executeMethod('unifiedAttribute',[attributes]);
    };
    this.getAddress = function(){
        dev.log.elementLibrary(' - rectangle.getAddress()'); //#development
        return executeMethod('getAddress',[]);
    };

    this._dump = function(){
        dev.log.elementLibrary(' - rectangle._dump()'); //#development
        return executeMethod('_dump',[]);
    };
};