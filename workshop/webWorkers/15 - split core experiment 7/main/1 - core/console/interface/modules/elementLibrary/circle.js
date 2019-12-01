this.circle = function(_name){
    dev.log.elementLibrary(' - new circle('+_name+')'); //#development

    let id = -1;
    this.getId = function(){return id;};
    this.__idRecieved = function(){};
    this.__id = function(a){
        dev.log.elementLibrary(' - circle.__id('+a+')'); //#development
        id = a;
        repush(this);
        if(this.__idRecieved){this.__idRecieved();}
    };
    let name = _name;
    this.getName = function(){return name;};
    this.setName = function(a){name = a;};
    this.getType = function(){return 'circle';};
    this.parent = undefined;

    const cashedAttributes = {
        ignored: false,
        colour: {r:1,g:0,b:0,a:1},
        x: 0,
        y: 0,
        radius: 10,
        scale: 1,
        static: false,
    };
    const cashedCallbacks = {};

    function repush(self){ 
        dev.log.elementLibrary(' - circle::repush()'); //#development
        communicationModule.run('element.executeMethod',[id,'unifiedAttribute',[cashedAttributes]]);
        Object.entries(cashedCallbacks).forEach(entry => { _canvas_.core.callback.attachCallback(self,entry[0],entry[1]); });
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

    this.ignored = function(bool){
        if(bool == undefined){ return cashedAttributes.ignored; }
        dev.log.elementLibrary(' - circle.ignored('+bool+')'); //#development
        cashedAttributes.ignored = bool;
        if(id != -1){ communicationModule.run('element.executeMethod',[id,'ignored',[bool]]); }
    };
    this.colour = function(colour){
        if(colour == undefined){ return cashedAttributes.colour; }
        dev.log.elementLibrary(' - circle.colour('+JSON.stringify(colour)+')'); //#development
        cashedAttributes.colour = colour;
        if(id != -1){ communicationModule.run('element.executeMethod',[id,'colour',[colour]]); }
    };
    this.x = function(number){
        if(number == undefined){ return cashedAttributes.x; }
        dev.log.elementLibrary(' - circle.x('+number+')'); //#development
        cashedAttributes.x = number;
        if(id != -1){ communicationModule.run('element.executeMethod',[id,'x',[number]]); }
    };
    this.y = function(number){
        if(number == undefined){ return cashedAttributes.y; }
        dev.log.elementLibrary(' - circle.y('+number+')'); //#development
        cashedAttributes.y = number;
        if(id != -1){ communicationModule.run('element.executeMethod',[id,'y',[number]]); }
    };
    this.radius = function(number){
        if(number == undefined){ return cashedAttributes.radius; }
        dev.log.elementLibrary(' - circle.radius('+number+')'); //#development
        cashedAttributes.radius = number;
        if(id != -1){ communicationModule.run('element.executeMethod',[id,'radius',[number]]); }
    };
    this.scale = function(number){
        if(number == undefined){ return cashedAttributes.scale; }
        dev.log.elementLibrary(' - circle.scale('+number+')'); //#development
        cashedAttributes.scale = number;
        if(id != -1){ communicationModule.run('element.executeMethod',[id,'scale',[number]]); }
    };
    this.static = function(bool){
        if(bool == undefined){ return cashedAttributes.static; }
        dev.log.elementLibrary(' - circle.static('+bool+')'); //#development
        cashedAttributes.static = bool;
        if(id != -1){ communicationModule.run('element.executeMethod',[id,'scale',[bool]]); }
    };
    this.unifiedAttribute = function(attributes){
        if(attributes == undefined){ return cashedAttributes; }
        dev.log.elementLibrary(' - circle.unifiedAttribute('+JSON.stringify(attributes)+')'); //#development
        Object.keys(attributes).forEach(key => { cashedAttributes[key] = attributes[key]; });
        if(id != -1){ communicationModule.run('element.executeMethod',[id,'unifiedAttribute',[attributes]]); }
    };

    this.getCallback = function(callbackType){
        return cashedCallbacks[callbackType];
    };
    this.attachCallback = function(callbackType, callback){
        dev.log.elementLibrary(' - circle.attachCallback('+callbackType+','+callback+')'); //#development
        cashedCallbacks[callbackType] = callback;
        if(id != -1){ _canvas_.core.callback.attachCallback(this,callbackType,callback); }
    }
    this.removeCallback = function(callbackType){
        dev.log.elementLibrary(' - circle.removeCallback('+callbackType+')'); //#development
        delete cashedCallbacks[callbackType];
        if(id != -1){ _canvas_.core.callback.removeCallback(this,callbackType); }
    }

    this._dump = function(){
        dev.log.elementLibrary(' - circle._dump()'); //#development
        communicationModule.run('element.executeMethod',[id,'_dump',[]]);
    };
};