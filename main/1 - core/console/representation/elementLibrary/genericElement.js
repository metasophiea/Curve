const genericElement = function(_type, _name){
    const self = this;

    //type
        const type = _type;
        this.getType = function(){return type;};

    //id
        let id = undefined;
        this.getId = function(){return id;};
        this.__onIdReceived = function(){};
        this.__id = function(a){
            dev.log.elementLibrary[type]('['+self.getAddress()+'].__id(',a); //#development
            id = a;

            __unifiedAttribute(__unifiedAttribute());
            Object.entries(cashedCallbacks).forEach(entry => { 
                core.callback.attachCallback(this, entry[0], entry[1]);
            });

            if(this.__repush != undefined){this.__repush();}
            if(this.__onIdReceived){this.__onIdReceived(id);}
        };

    //name
        let name = _name;
        this.getName = function(){return name;};

    //hierarchy
        this.parent = undefined;
        this.getAddress = function(){
            return (this.parent != undefined && this.parent.getId() != 0 ? this.parent.getAddress() : '') + '/' + name;
        };
        this.getOffset = function(){
            let output = {x:0,y:0,scale:1,angle:0};

            if(this.parent){
                const offset = this.parent.getOffset();
                const point = _canvas_.library.math.cartesianAngleAdjust(cashedAttributes.x,cashedAttributes.y,offset.angle);
                output = { 
                    x: point.x*offset.scale + offset.x,
                    y: point.y*offset.scale + offset.y,
                    scale: offset.scale * cashedAttributes.scale,
                    angle: offset.angle + cashedAttributes.angle,
                };
            }else{
                output = {x:cashedAttributes.x ,y:cashedAttributes.y ,scale:cashedAttributes.scale ,angle:cashedAttributes.angle};
            }

            return output;
        };

    //attributes
        const cashedAttributes = {};
        const transferableAttributes = [];
        this.__setupSimpleAttribute = function(name,defaultValue){
            cashedAttributes[name] = defaultValue;
            this[name] = function(a){
                if(a == undefined){ return cashedAttributes[name]; }
                if(a == cashedAttributes[name]){ return; } //no need to set things to what they already are
                dev.log.elementLibrary[this.getType()]('['+this.getAddress()+'].'+name+'(',...arguments); //#development
                cashedAttributes[name] = a;
                if(this.getId() != undefined){
                    const obj = {};
                    obj[name] = a;
                    interface.operator.element.executeMethod.unifiedAttribute(this.getId(),obj);
                }
            };
        }
        this.__setupTransferableAttribute = function(name,defaultValue){
            transferableAttributes.push(name);
            cashedAttributes[name] = defaultValue;
            this[name] = function(a){
                if(a == undefined){ return cashedAttributes[name]; }
                if(a == cashedAttributes[name]){ return; } //no need to set things to what they already are
                dev.log.elementLibrary[this.getType()]('['+this.getAddress()+'].'+name+'(',...arguments); //#development
                cashedAttributes[name] = a;
                if(this.getId() != undefined){
                    const obj = {};
                    obj[name] = a;
                    interface.operator.element.executeMethod.unifiedAttribute(this.getId(),obj,[a]);
                }
            };
        }
        Object.entries({
            x: 0,
            y: 0,
            angle: 0,
            scale: 1,
            ignored: false,
        }).forEach(([name,defaultValue]) => this.__setupSimpleAttribute(name,defaultValue) );
        
        const __unifiedAttribute = function(attributes){
            if(attributes == undefined){ return cashedAttributes; }
            Object.keys(attributes).forEach(key => { cashedAttributes[key] = attributes[key]; });
            if(id != undefined){
                interface.operator.element.executeMethod.unifiedAttribute(
                    id,
                    attributes,
                    transferableAttributes.map(name => attributes[name]).filter(item => item != undefined)
                );
            }
        };
        this.unifiedAttribute = function(attributes){ return __unifiedAttribute(attributes); };

    //callbacks
        const cashedCallbacks = {};
        this.getCallback = function(callbackType){
            dev.log.elementLibrary[type]('['+self.getAddress()+'].getCallback(',callbackType); //#development
            return cashedCallbacks[callbackType];
        };
        this.attachCallback = function(callbackType, callback){
            dev.log.elementLibrary[type]('['+this.getAddress()+'].attachCallback(',callbackType,callback); //#development
            cashedCallbacks[callbackType] = callback;
            if(id != undefined){
                interface.operator.callback.attachCallback(this, callbackType, callback);
            }
        }
        this.removeCallback = function(callbackType){
            dev.log.elementLibrary[type]('['+this.getAddress()+'].removeCallback(',callbackType); //#development
            delete cashedCallbacks[callbackType];
            if(id != undefined){ 
                interface.operator.callback.removeCallback(this, callbackType);
            }
        }

    //info dump
        this._dump = function(){
            if(id != undefined){
                interface.operator.element.executeMethod.dump(id);
            }
        };
};