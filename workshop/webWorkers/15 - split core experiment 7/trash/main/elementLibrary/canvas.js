this.canvas = function(_id,_name){
    dev.log.elementLibrary(' - new canvas('+_id+')'); //#development

    const id = _id;
    this.getId = function(){return id;};
    const name = _name;
    this.getName = function(){return name;};
    this.getType = function(){return 'canvas';};

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
        resolution: 1,
    };
    function executeMethod(method,argumentList,postProcessing,transferables){
        return new Promise((resolve, reject) => { 
            communicationModule.run('element.executeMethod',[id,method,argumentList],result => {
                if(postProcessing){resolve(postProcessing(result));}else{resolve(result);}
            },transferables);
        });
    }

    //subCanvas
        const subCanvas = { object:document.createElement('canvas'), context:undefined, resolution:1 };
        subCanvas.context = subCanvas.object.getContext('2d');

        function updateDimentions(){
            subCanvas.object.setAttribute('width',cashedAttributes.width*subCanvas.resolution);
            subCanvas.object.setAttribute('height',cashedAttributes.height*subCanvas.resolution);
        }
        updateDimentions();

        this._ = subCanvas.context;
        this.$ = function(a){return a*subCanvas.resolution;};
        this.resolution = function(a){
            if(a == undefined){return subCanvas.resolution;}
            subCanvas.resolution = a;
            updateDimentions();
        };
        this.requestUpdate = function(){
            createImageBitmap(subCanvas.object).then(bitmap => {
                executeMethod('imageBitmap',[bitmap],undefined,bitmap);
            });
        };
        this.requestUpdate();

    this.ignored = function(bool,useCache=useCache_default){
        dev.log.elementLibrary(' - image.ignored('+bool+')'); //#development
        if(useCache && bool == undefined){ return cashedAttributes.ignored; } cashedAttributes.ignored = bool;
        return executeMethod('ignored',[bool]);
    };
    this.x = function(number,useCache=useCache_default){
        dev.log.elementLibrary(' - image.x('+number+')'); //#development
        if(useCache && number == undefined){ return cashedAttributes.x; } cashedAttributes.x = number;
        return executeMethod('x',[number]);
    };
    this.y = function(number,useCache=useCache_default){
        dev.log.elementLibrary(' - image.y('+number+')'); //#development
        if(useCache && number == undefined){ return cashedAttributes.y; } cashedAttributes.y = number;
        return executeMethod('y',[number]);
    };
    this.angle = function(number,useCache=useCache_default){
        dev.log.elementLibrary(' - image.angle('+number+')'); //#development
        if(useCache && number == undefined){ return cashedAttributes.angle; } cashedAttributes.angle = number;
        return executeMethod('angle',[number]);
    };
    this.anchor = function(anchor,useCache=useCache_default){
        dev.log.elementLibrary(' - image.anchor('+anchor+')'); //#development
        if(useCache && newAnchor == undefined){ return cashedAttributes.anchor; } cashedAttributes.anchor = newAnchor;
        return executeMethod('anchor',[newAnchor]);
    };
    this.width = function(number,useCache=useCache_default){
        dev.log.elementLibrary(' - image.width('+number+')'); //#development
        if(useCache && number == undefined){ return cashedAttributes.width; } cashedAttributes.width = number;
        updateDimentions();
        return executeMethod('width',[number]);
    };
    this.height = function(number,useCache=useCache_default){
        dev.log.elementLibrary(' - image.height('+number+')'); //#development
        if(useCache && number == undefined){ return cashedAttributes.height; } cashedAttributes.height = number;
        updateDimentions();
        return executeMethod('height',[number]);
    };
    this.scale = function(number,useCache=useCache_default){
        dev.log.elementLibrary(' - image.scale('+number+')'); //#development
        if(useCache && number == undefined){ return cashedAttributes.scale; } cashedAttributes.scale = number;
        return executeMethod('scale',[number]);
    };
    this.static = function(bool,useCache=useCache_default){
        dev.log.elementLibrary(' - image.static('+bool+')'); //#development
        if(useCache && bool == undefined){ return cashedAttributes.static; } cashedAttributes.static = bool;
        return executeMethod('static',[bool]);
    };
    this.unifiedAttribute = function(attributes,useCache=useCache_default){
        dev.log.elementLibrary(' - image.unifiedAttribute('+JSON.stringify(attributes)+')'); //#development
        if(useCache && attributes == undefined){ return cashedAttributes; } 
        Object.keys(attributes).forEach(key => { cashedAttributes[key] = attributes[key]; });
        if(attributes.resolution != undefined){
            this.resolution(attributes.resolution);
            delete attributes.resolution;
        }
        updateDimentions();
        return executeMethod('unifiedAttribute',[attributes]);
    };
    this.getAddress = function(){
        dev.log.elementLibrary(' - canvas.getAddress()'); //#development
        return executeMethod('getAddress',[]);
    };

    this._dump = function(){
        dev.log.elementLibrary(' - canvas._dump()'); //#development
        return executeMethod('_dump',[]);
    };
};