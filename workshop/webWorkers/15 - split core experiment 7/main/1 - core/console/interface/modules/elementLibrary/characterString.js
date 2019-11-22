this.characterString = function(_id,_name){
    dev.log.elementLibrary(' - new characterString('+_id+')'); //#development

    const id = _id;
    this.getId = function(){return id;};
    const name = _name;
    this.getName = function(){return name;};
    this.getType = function(){return 'characterString';};

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
        font: 'defaultThin',
        string: '',
        spacing: 0.5,
        interCharacterSpacing: 0,
        printingMode: { widthCalculation:'absolute', horizontal:'left', vertical:'bottom' },
        scale: 1,
        static: false,
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
        dev.log.elementLibrary(' - characterString.ignored('+bool+')'); //#development
        if(useCache && bool == undefined){ return resolvedPromise(cashedAttributes.ignored); } cashedAttributes.ignored = bool;
        return executeMethod('ignored',[bool]);
    };
    this.colour = function(colour,useCache=useCache_default){
        dev.log.elementLibrary(' - characterString.colour('+JSON.stringify(colour)+')'); //#development
        if(useCache && colour == undefined){ return resolvedPromise(cashedAttributes.colour); } cashedAttributes.colour = colour;
        return executeMethod('colour',[colour]);
    };
    this.x = function(number,useCache=useCache_default){
        dev.log.elementLibrary(' - characterString.x('+number+')'); //#development
        if(useCache && number == undefined){ return resolvedPromise(cashedAttributes.x); } cashedAttributes.x = number;
        return executeMethod('x',[number]);
    };
    this.y = function(number,useCache=useCache_default){
        dev.log.elementLibrary(' - characterString.y('+number+')'); //#development
        if(useCache && number == undefined){ return resolvedPromise(cashedAttributes.y); } cashedAttributes.y = number;
        return executeMethod('y',[number]);
    };
    this.scale = function(number,useCache=useCache_default){
        dev.log.elementLibrary(' - characterString.scale('+number+')'); //#development
        if(useCache && number == undefined){ return resolvedPromise(cashedAttributes.scale); } cashedAttributes.scale = number;
        return executeMethod('scale',[number]);
    };
    this.angle = function(number,useCache=useCache_default){
        dev.log.elementLibrary(' - characterString.angle('+number+')'); //#development
        if(useCache && number == undefined){ return resolvedPromise(cashedAttributes.angle); } cashedAttributes.angle = number;
        return executeMethod('angle',[number]);
    };
    this.anchor = function(anchor,useCache=useCache_default){
        dev.log.elementLibrary(' - characterString.anchor('+anchor+')'); //#development
        if(useCache && newAnchor == undefined){ return resolvedPromise(cashedAttributes.anchor); } cashedAttributes.anchor = newAnchor;
        return executeMethod('anchor',[newAnchor]);
    };
    this.width = function(number,useCache=useCache_default){
        dev.log.elementLibrary(' - characterString.width('+number+')'); //#development
        if(useCache && number == undefined){ return resolvedPromise(cashedAttributes.width); } cashedAttributes.width = number;
        return executeMethod('width',[number]);
    };
    this.height = function(number,useCache=useCache_default){
        dev.log.elementLibrary(' - characterString.height('+number+')'); //#development
        if(useCache && number == undefined){ return resolvedPromise(cashedAttributes.height); } cashedAttributes.height = number;
        return executeMethod('height',[number]);
    };
    this.font = function(font,useCache=useCache_default){
        dev.log.elementLibrary(' - characterString.font('+font+')'); //#development
        if(useCache && font == undefined){ return resolvedPromise(cashedAttributes.font); } cashedAttributes.font = font;
        return executeMethod('font',[font]);
    };
    this.string = function(string,useCache=useCache_default){
        dev.log.elementLibrary(' - characterString.string('+string+')'); //#development
        if(useCache && string == undefined){ return resolvedPromise(cashedAttributes.string); } cashedAttributes.string = string;
        return executeMethod('string',[string]);
    };
    this.interCharacterSpacing = function(number,useCache=useCache_default){
        dev.log.elementLibrary(' - characterString.interCharacterSpacing('+number+')'); //#development
        if(useCache && number == undefined){ return resolvedPromise(cashedAttributes.interCharacterSpacing); } cashedAttributes.interCharacterSpacing = number;
        return executeMethod('interCharacterSpacing',[number]);
    };
    this.printingMode = function(printingMode,useCache=useCache_default){
        dev.log.elementLibrary(' - characterString.printingMode('+printingMode+')'); //#development
        if(useCache && printingMode == undefined){ return resolvedPromise(cashedAttributes.printingMode); } cashedAttributes.printingMode = printingMode;
        return executeMethod('printingMode',[printingMode]);
    };
    this.static = function(bool,useCache=useCache_default){
        dev.log.elementLibrary(' - characterString.static('+bool+')'); //#development
        if(useCache && bool == undefined){ return resolvedPromise(cashedAttributes.static); } cashedAttributes.static = bool;
        return executeMethod('static',[bool]);
    };
    this.unifiedAttribute = function(attributes,useCache=useCache_default){
        dev.log.elementLibrary(' - characterString.unifiedAttribute('+JSON.stringify(attributes)+')'); //#development
        if(useCache && attributes == undefined){ return resolvedPromise(cashedAttributes); } 
        Object.keys(attributes).forEach(key => { cashedAttributes[key] = attributes[key]; });
        return executeMethod('unifiedAttribute',[attributes]);
    };
    this.getAddress = function(){
        dev.log.elementLibrary(' - characterString.getAddress()'); //#development
        return executeMethod('getAddress',[]);
    };

    this._dump = function(){
        dev.log.elementLibrary(' - characterString._dump()'); //#development
        return executeMethod('_dump',[]);
    };
};