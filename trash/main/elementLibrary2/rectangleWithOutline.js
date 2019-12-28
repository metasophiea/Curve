this.rectangleWithOutline = function(_name){
    const type = 'rectangleWithOutline';
    dev.log.elementLibrary[type](' - new rectangleWithOutline(',_name); //#development

    let id = -1;
    this.getId = function(){return id;};
    this.__idReceived = function(){};
    this.__id = function(a){
        dev.log.elementLibrary[type]('['+this.getAddress()+'].__id(',a); //#development
        id = a;
        repush(this);
        if(this.__idReceived){this.__idReceived();}
    };
    let name = _name;
    this.getName = function(){return name;};
    this.setName = function(a){name = a;};
    this.getType = function(){return type;};
    this.parent = undefined;

    const cashedAttributes = {
        ignored: false,
        colour: {r:1,g:0,b:0,a:1},
        lineColour: {r:1,g:0,b:0,a:1},
        x: 0,
        y: 0,
        angle: 0,
        anchor: {x:0,y:0},
        width: 10,
        height: 10,
        scale: 1,
        thickness: 0,
        static: false,
    };
    const cashedCallbacks = {};

    function repush(self){ 
        dev.log.elementLibrary[type]('['+self.getAddress()+']::repush()'); //#development
        _canvas_.core.element.__executeMethod(id,'unifiedAttribute',[cashedAttributes]);
        Object.entries(cashedCallbacks).forEach(entry => { _canvas_.core.callback.attachCallback(self,entry[0],entry[1]); });
    }

    this.getAddress = function(){
        return (this.parent != undefined ? this.parent.getAddress() : '') + '/' + name;
    };
    this.getOffset = function(){
        dev.log.elementLibrary[type]('['+this.getAddress()+'].getOffset()'); //#development

        let output = {x:0,y:0,scale:1,angle:0};

        if(this.parent){
            dev.log.elementLibrary[type]('['+this.getAddress()+'].getOffset() -> parent found'); //#development
            const offset = this.parent.getOffset();
            const point = _canvas_.library.math.cartesianAngleAdjust(cashedAttributes.x,cashedAttributes.y,offset.angle);
            output = { 
                x: point.x*offset.scale + offset.x,
                y: point.y*offset.scale + offset.y,
                scale: offset.scale * cashedAttributes.scale,
                angle: offset.angle + cashedAttributes.angle,
            };
        }else{
            dev.log.elementLibrary[type]('['+this.getAddress()+'].getOffset -> no parent found'); //#development
            output = {x:cashedAttributes.x ,y:cashedAttributes.y ,scale:cashedAttributes.scale ,angle:cashedAttributes.angle};
        }

        dev.log.elementLibrary[type]('['+this.getAddress()+'].getOffset -> output: ',output); //#development
        return output;
    };

    this.ignored = function(bool){
        if(bool == undefined){ return cashedAttributes.ignored; }
        dev.log.elementLibrary[type]('[',this.getAddress()+'].ignored(',bool); //#development
        cashedAttributes.ignored = bool;
        if(id != -1){ _canvas_.core.element.__executeMethod(id,'ignored',[bool]); }
    };
    this.colour = function(colour){
        if(colour == undefined){ return cashedAttributes.colour; }
        dev.log.elementLibrary[type]('[',this.getAddress()+'].colour(',colour); //#development
        cashedAttributes.colour = colour;
        if(id != -1){ _canvas_.core.element.__executeMethod(id,'colour',[colour]); }
    };
    this.lineColour = function(colour){
        if(colour == undefined){ return cashedAttributes.lineColour; }
        dev.log.elementLibrary[type]('[',this.getAddress()+'].lineColour(',colour); //#development
        cashedAttributes.lineColour = colour;
        if(id != -1){ _canvas_.core.element.__executeMethod(id,'lineColour',[colour]); }
    };
    this.x = function(number){
        if(number == undefined){ return cashedAttributes.x; }
        dev.log.elementLibrary[type]('[',this.getAddress()+'].x(',number); //#development
        cashedAttributes.x = number;
        if(id != -1){ _canvas_.core.element.__executeMethod(id,'x',[number]); }
    };
    this.y = function(number){
        if(number == undefined){ return cashedAttributes.y; }
        dev.log.elementLibrary[type]('[',this.getAddress()+'].y(',number); //#development
        cashedAttributes.y = number;
        if(id != -1){ _canvas_.core.element.__executeMethod(id,'y',[number]); }
    };
    this.angle = function(number){
        if(number == undefined){ return cashedAttributes.angle; }
        dev.log.elementLibrary[type]('[',this.getAddress()+'].angle(',number); //#development
        cashedAttributes.angle = number;
        if(id != -1){ _canvas_.core.element.__executeMethod(id,'angle',[number]); }
    };
    this.anchor = function(anchor){
        if(newAnchor == undefined){ return cashedAttributes.anchor; }
        dev.log.elementLibrary[type]('[',this.getAddress()+'].anchor(',anchor); //#development
        cashedAttributes.anchor = anchor;
        if(id != -1){ _canvas_.core.element.__executeMethod(id,'anchor',[anchor]); }
    };
    this.width = function(number){
        if(number == undefined){ return cashedAttributes.width; }
        dev.log.elementLibrary[type]('[',this.getAddress()+'].width(',number); //#development
        cashedAttributes.width = number;
        if(id != -1){ _canvas_.core.element.__executeMethod(id,'width',[number]); }
    };
    this.height = function(number){
        if(number == undefined){ return cashedAttributes.height; }
        dev.log.elementLibrary[type]('[',this.getAddress()+'].height(',number); //#development
        cashedAttributes.height = number;
        if(id != -1){ _canvas_.core.element.__executeMethod(id,'height',[number]); }
    };
    this.scale = function(number){
        if(number == undefined){ return cashedAttributes.scale; }
        dev.log.elementLibrary[type]('[',this.getAddress()+'].scale(',number); //#development
        cashedAttributes.scale = number;
        if(id != -1){ _canvas_.core.element.__executeMethod(id,'scale',[number]); }
    };
    this.thickness = function(number){
        if(number == undefined){ return cashedAttributes.thickness; }
        dev.log.elementLibrary[type]('[',this.getAddress()+'].thickness(',number); //#development
        cashedAttributes.thickness = number;
        if(id != -1){ _canvas_.core.element.__executeMethod(id,'thickness',[number]); }
    };
    this.static = function(bool){
        if(bool == undefined){ return cashedAttributes.static; }
        dev.log.elementLibrary[type]('[',this.getAddress()+'].static(',bool); //#development
        if(bool == undefined){ return cashedAttributes.static; } cashedAttributes.static = bool;
        if(id != -1){ _canvas_.core.element.__executeMethod(id,'scale',[bool]); }
    };
    this.unifiedAttribute = function(attributes){
        if(attributes == undefined){ return cashedAttributes; }
        dev.log.elementLibrary[type]('[',this.getAddress()+'].unifiedAttribute(',attributes); //#development
        Object.keys(attributes).forEach(key => { cashedAttributes[key] = attributes[key]; });
        if(id != -1){ _canvas_.core.element.__executeMethod(id,'unifiedAttribute',[attributes]); }
    };

    this.getCallback = function(callbackType){
        dev.log.elementLibrary[type]('['+this.getAddress()+'].getCallback(',callbackType); //#development
        return cashedCallbacks[callbackType];
    };
    this.attachCallback = function(callbackType, callback){
        dev.log.elementLibrary[type]('[',this.getAddress()+'].attachCallback(',callbackType,callback); //#development
        cashedCallbacks[callbackType] = callback;
        if(id != -1){ _canvas_.core.callback.attachCallback(this,callbackType,callback); }
    }
    this.removeCallback = function(callbackType){
        dev.log.elementLibrary[type]('[',this.getAddress()+'].removeCallback(',callbackType); //#development
        delete cashedCallbacks[callbackType];
        if(id != -1){ _canvas_.core.callback.removeCallback(this,callbackType); }
    }

    this._dump = function(){
        dev.log.elementLibrary[type]('['+this.getAddress()+']._dump()'); //#development
        _canvas_.core.element.__executeMethod(id,'_dump',[]);
    };
};