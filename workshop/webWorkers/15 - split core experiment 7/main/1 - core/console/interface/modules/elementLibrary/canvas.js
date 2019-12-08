this.canvas = function(_name){
    dev.log.elementLibrary(' - new canvas('+_name+')'); //#development

    let id = -1;
    this.getId = function(){return id;};
    this.__idRecieved = function(){};
    this.__id = function(a){
        dev.log.elementLibrary(' - canvas.__id('+a+')'); //#development
        id = a;
        repush(this);
        if(this.__idRecieved){this.__idRecieved();}
    };
    let name = _name;
    this.getName = function(){return name;};
    this.setName = function(a){name = a;};
    this.getType = function(){return 'canvas';};
    this.parent = undefined;

    const cashedAttributes = {
        ignored: false,
        x: 0,
        y: 0,
        angle: 0,
        anchor: {x:0,y:0},
        width: 10,
        height: 10,
        scale: 1,
        static: false,
    };
    const cashedCallbacks = {};

    function repush(self){ 
        dev.log.elementLibrary(' - image::repush()'); //#development
        _canvas_.core.element.__executeMethod(id,'unifiedAttribute',[cashedAttributes]);
        Object.entries(cashedCallbacks).forEach(entry => { _canvas_.core.callback.attachCallback(self,entry[0],entry[1]); });
        self.requestUpdate();
    }

    this.getAddress = function(){
        return (this.parent != undefined ? this.parent.getAddress() : '') + '/' + name;
    };
    this.getOffset = function(){
        dev.log.elementLibrary('['+this.getAddress()+'] - '+this.getType()+'.getOffset()'); //#development

        let output = {x:0,y:0,scale:1,angle:0};

        if(this.parent){
            dev.log.elementLibrary('['+this.getAddress()+'] - '+this.getType()+'.getOffset() -> parent found'); //#development
            const offset = this.parent.getOffset();
            const point = _canvas_.library.math.cartesianAngleAdjust(cashedAttributes.x,cashedAttributes.y,offset.angle);
            output = { 
                x: point.x*offset.scale + offset.x,
                y: point.y*offset.scale + offset.y,
                scale: offset.scale * cashedAttributes.scale,
                angle: offset.angle + cashedAttributes.angle,
            };
        }else{
            dev.log.elementLibrary('['+this.getAddress()+'] - '+this.getType()+'.getOffset -> no parent found'); //#development
            output = {x:cashedAttributes.x ,y:cashedAttributes.y ,scale:cashedAttributes.scale ,angle:cashedAttributes.angle};
        }

        dev.log.elementLibrary('['+this.getAddress()+'] - '+this.getType()+'.getOffset -> output: '+JSON.stringify(output)); //#development
        return output;
    };

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
                if(id != -1){ _canvas_.core.element.__executeMethod(id,'imageBitmap',[bitmap],undefined,[bitmap]); }
            });
        };
        this.requestUpdate();

    this.ignored = function(bool){
        if(bool == undefined){ return cashedAttributes.ignored; }
        dev.log.elementLibrary(' - image.ignored('+bool+')'); //#development
        cashedAttributes.ignored = bool;
        if(id != -1){ _canvas_.core.element.__executeMethod(id,'ignored',[bool]); }
    };
    this.x = function(number){
        if(number == undefined){ return cashedAttributes.x; }
        dev.log.elementLibrary(' - image.x('+number+')'); //#development
        cashedAttributes.x = number;
        if(id != -1){ _canvas_.core.element.__executeMethod(id,'x',[number]); }
    };
    this.y = function(number){
        if(number == undefined){ return cashedAttributes.y; }
        dev.log.elementLibrary(' - image.y('+number+')'); //#development
        cashedAttributes.y = number;
        if(id != -1){ _canvas_.core.element.__executeMethod(id,'y',[number]); }
    };
    this.angle = function(number){
        if(number == undefined){ return cashedAttributes.angle; }
        dev.log.elementLibrary(' - image.angle('+number+')'); //#development
        cashedAttributes.angle = number;
        if(id != -1){ _canvas_.core.element.__executeMethod(id,'angle',[number]); }
    };
    this.anchor = function(anchor){
        if(anchor == undefined){ return cashedAttributes.anchor; }
        dev.log.elementLibrary(' - image.anchor('+anchor+')'); //#development
        cashedAttributes.anchor = anchor;
        if(id != -1){ _canvas_.core.element.__executeMethod(id,'anchor',[anchor]); }
    };
    this.width = function(number){
        if(number == undefined){ return cashedAttributes.width; }
        dev.log.elementLibrary(' - image.width('+number+')'); //#development
        cashedAttributes.width = number;
        updateDimentions();
        if(id != -1){ _canvas_.core.element.__executeMethod(id,'width',[number]); }
    };
    this.height = function(number){
        if(number == undefined){ return cashedAttributes.height; }
        dev.log.elementLibrary(' - image.height('+number+')'); //#development
        cashedAttributes.height = number;
        updateDimentions();
        if(id != -1){ _canvas_.core.element.__executeMethod(id,'height',[number]); }
    };
    this.scale = function(number){
        if(number == undefined){ return cashedAttributes.scale; }
        dev.log.elementLibrary(' - image.scale('+number+')'); //#development
        cashedAttributes.scale = number;
        if(id != -1){ _canvas_.core.element.__executeMethod(id,'scale',[number]); }
    };
    this.static = function(bool){
        if(bool == undefined){ return cashedAttributes.static; }
        dev.log.elementLibrary(' - image.static('+bool+')'); //#development
        cashedAttributes.static = bool;
        if(id != -1){ _canvas_.core.element.__executeMethod(id,'static',[bool]); }
    };
    this.unifiedAttribute = function(attributes){
        if(attributes == undefined){ return cashedAttributes; }
        dev.log.elementLibrary(' - image.unifiedAttribute('+JSON.stringify(attributes)+')'); //#development
        if(attributes.resolution != undefined){
            this.resolution(attributes.resolution);
            delete attributes.resolution;
        }
        Object.keys(attributes).forEach(key => { cashedAttributes[key] = attributes[key]; });
        updateDimentions();
        if(id != -1){ _canvas_.core.element.__executeMethod(id,'unifiedAttribute',[attributes]); }
    };

    this._dump = function(){
        dev.log.elementLibrary(' - canvas._dump()'); //#development
        if(id != -1){ _canvas_.core.element.__executeMethod(id,'_dump',[]); }
    };
};