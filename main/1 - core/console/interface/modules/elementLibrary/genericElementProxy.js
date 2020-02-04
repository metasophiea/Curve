const genericElementProxy = function(_type, _name){
    const self = this;

    //type
        const type = _type;
        this.getType = function(){return type;};
        dev.log.elementLibrary[type](' - new '+type+'(',_name); //#development

    //id
        let id = -1;
        this.getId = function(){return id;};
        this.__idReceived = function(){};
        this.__id = function(a,updateIdOnly=false){
            dev.log.elementLibrary[type]('['+self.getAddress()+'].__id(',a); //#development
            id = a;
            if(updateIdOnly){return;}

            //repush
                _canvas_.core.element.__executeMethod(id,'unifiedAttribute',[cashedAttributes]);
                Object.entries(cashedCallbacks).forEach(entry => { _canvas_.core.callback.attachCallback(this,entry[0],entry[1]); });
                if(this.__repush != undefined){this.__repush();}

            if(this.__idReceived){this.__idReceived();}
        };

    //name
        let name = _name;
        this.getName = function(){return name;};
        // this.setName = function(a){
        //     dev.log.elementLibrary[type]('['+this.getAddress+'].setName(',a); //#development
        //     name = a;
        // };

    //hierarchy
        this.parent = undefined;
        this.getAddress = function(){
            return (this.parent != undefined && this.parent.getId() != 0 ? this.parent.getAddress() : '') + '/' + name;
        };
        this.getOffset = function(){
            dev.log.elementLibrary[type]('['+self.getAddress()+'].getOffset()'); //#development

            let output = {x:0,y:0,scale:1,angle:0};

            if(this.parent){
                dev.log.elementLibrary[type]('['+self.getAddress()+'].getOffset() -> parent found'); //#development
                const offset = this.parent.getOffset();
                const point = _canvas_.library.math.cartesianAngleAdjust(cashedAttributes.x,cashedAttributes.y,offset.angle);
                output = { 
                    x: point.x*offset.scale + offset.x,
                    y: point.y*offset.scale + offset.y,
                    scale: offset.scale * cashedAttributes.scale,
                    angle: offset.angle + cashedAttributes.angle,
                };
            }else{
                dev.log.elementLibrary[type]('['+self.getAddress()+'].getOffset -> no parent found'); //#development
                output = {x:cashedAttributes.x ,y:cashedAttributes.y ,scale:cashedAttributes.scale ,angle:cashedAttributes.angle};
            }

            dev.log.elementLibrary[type]('['+self.getAddress()+'].getOffset -> output: '+JSON.stringify(output)); //#development
            return output;
        };

    //attributes
        const cashedAttributes = {};
        this.setupSimpleAttribute = function(name,defaultValue){
            cashedAttributes[name] = defaultValue;
            this[name] = function(a){
                if(a == undefined){ return cashedAttributes[name]; }
                if(a == cashedAttributes[name]){ return; } //no need to set things to what they already are
                dev.log.elementLibrary[this.getType()]('['+this.getAddress+'].'+name+'(',...arguments); //#development
                cashedAttributes[name] = a;
                if(this.getId() != -1){ _canvas_.core.element.__executeMethod(this.getId(),name,[...arguments]); }
            };
        }
        Object.entries({
            ignored: false,
            scale: 1,
        }).forEach(([name,defaultValue]) => this.setupSimpleAttribute(name,defaultValue) );
        this.unifiedAttribute = function(attributes){
            if(attributes == undefined){ return cashedAttributes; }
            dev.log.elementLibrary[type]('['+this.getAddress+'].unifiedAttribute(',attributes); //#development
            Object.keys(attributes).forEach(key => { cashedAttributes[key] = attributes[key]; });
            if(id != -1){ _canvas_.core.element.__executeMethod(id,'unifiedAttribute',[attributes]); }
        };

    //callbacks
        const cashedCallbacks = {};
        this.getCallback = function(callbackType){
            dev.log.elementLibrary[type]('['+self.getAddress()+'].getCallback(',callbackType); //#development
            return cashedCallbacks[callbackType];
        };
        this.attachCallback = function(callbackType, callback){
            dev.log.elementLibrary[type]('['+this.getAddress+'].attachCallback(',callbackType,callback); //#development
            cashedCallbacks[callbackType] = callback;
            if(id != -1){ _canvas_.core.callback.attachCallback(this,callbackType,callback); }
        }
        this.removeCallback = function(callbackType){
            dev.log.elementLibrary[type]('['+this.getAddress+'].removeCallback(',callbackType); //#development
            delete cashedCallbacks[callbackType];
            if(id != -1){ _canvas_.core.callback.removeCallback(this,callbackType); }
        }

    //info dump
        this._dump = function(){
            dev.log.elementLibrary[type]('['+self.getAddress()+']._dump()'); //#development
            _canvas_.core.element.__executeMethod(id,'_dump',[]);
        };
};

// this.getType
// this.getId
// this.__idReceived
// this.__id
// this.__repush
// this.getName
// this.setName
// this.parent
// this.getAddress
// this.getOffset
// this.setupSimpleAttribute
// this.unifiedAttribute
// this.getCallback
// this.attachCallback
// this.removeCallback
// this._dump