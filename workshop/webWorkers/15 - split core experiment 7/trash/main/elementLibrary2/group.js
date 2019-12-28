this.group = function(_name){
    const self = this;
    const type = 'group';
    dev.log.elementLibrary[type](' - new group(',_name); //#development

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
        heedCamera: false,
        x: 0,
        y: 0,
        angle: 0,
        scale: 1,
        static: false,
        clipActive: false,
    };
    const cashedCallbacks = {};

    let children = [];
    let childRegistry = {};
    let stencilElement = undefined;

    let clearingLock = false;
    function lockClearingLock(){
        dev.log.elementLibrary[type]('['+self.getAddress()+']::lockClearingLock()'); //#development
        clearingLock = true;
    }
    function unlockClearingLock(){
        dev.log.elementLibrary[type]('['+self.getAddress()+']::unlockClearingLock()'); //#development
        repush(self);
        clearingLock = false;
    }

    function checkForName(name){ return childRegistry[name] != undefined; }
    function isValidElement(elementToCheck){
        dev.log.elementLibrary[type]('['+self.getAddress()+']::isValidElement(',elementToCheck); //#development
        if( elementToCheck == undefined ){ return false; }
        if( elementToCheck.getName() == undefined || elementToCheck.getName().length == 0 ){
            console.warn('group error: element with no name being inserted into group "'+self.getAddress()+'", therefore; the element will not be added');
            return false;
        }
        if( checkForName(elementToCheck.getName()) ){
            console.warn('group error: element with name "'+elementToCheck.getName()+'" already exists in group "'+self.getAddress()+'", therefore; the element will not be added');
            return false;
        }

        return true;
    }

    function repush(){ 
        dev.log.elementLibrary[type]('['+self.getAddress()+']::repush()'); //#development
        _canvas_.core.element.__executeMethod(id,'unifiedAttribute',[cashedAttributes]);
        Object.entries(cashedCallbacks).forEach(entry => { _canvas_.core.callback.attachCallback(self,entry[0],entry[1]); });
        
        if(stencilElement != undefined){
            function readdStencil(){
                if( stencilElement.getId() == -1 ){ setTimeout(readdStencil,1); }
                else{ _canvas_.core.element.__executeMethod(id,'stencil',[stencilElement.getId()]); }
            }
            readdStencil();
        }

        communicationModule.run('element.executeMethod',[id,'clear'],() => {
            function readdChildren(){
                dev.log.elementLibrary[type]('['+self.getAddress()+']::repush::readdChildren -> children:',children); //#development
                const childIds = children.map(child => child.getId());
                if( childIds.indexOf(-1) != -1 ){ setTimeout(readdChildren,1); }
                else{ _canvas_.core.element.__executeMethod(id,'syncChildren',[childIds]); }
            }
            readdChildren();
        });
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

        dev.log.elementLibrary[type]('['+this.getAddress()+'].getOffset -> output:',output); //#development
        return output;
    };

    this.ignored = function(bool){
        if(bool == undefined){ return cashedAttributes.ignored; } 
        dev.log.elementLibrary[type]('[',this.getAddress()+'].ignored(',bool); //#development
        cashedAttributes.ignored = bool;
        if(id != -1){ _canvas_.core.element.__executeMethod(id,'ignored',[bool]); }
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
    this.scale = function(number){
        if(number == undefined){ return cashedAttributes.scale; } 
        dev.log.elementLibrary[type]('[',this.getAddress()+'].scale(',number); //#development
        cashedAttributes.scale = number;
        if(id != -1){ _canvas_.core.element.__executeMethod(id,'scale',[number]); }
    };
    this.heedCamera = function(bool){
        if(bool == undefined){ return cashedAttributes.heedCamera; } 
        dev.log.elementLibrary[type]('[',this.getAddress()+'].heedCamera(',bool); //#development
        cashedAttributes.heedCamera = bool;
        if(id != -1){ _canvas_.core.element.__executeMethod(id,'heedCamera',[bool]); }
    };
    this.static = function(bool){
        if(bool == undefined){ return cashedAttributes.static; } 
        dev.log.elementLibrary[type]('[',this.getAddress()+'].static(',bool); //#development
        cashedAttributes.static = bool;
        if(id != -1){ _canvas_.core.element.__executeMethod(id,'static',[bool]); }
    };
    this.unifiedAttribute = function(attributes){
        if(attributes == undefined){ return cashedAttributes; } 
        dev.log.elementLibrary[type]('[',this.getAddress()+'].unifiedAttribute(',attributes); //#development
        Object.keys(attributes).forEach(key => { cashedAttributes[key] = attributes[key]; });
        if(id != -1){ _canvas_.core.element.__executeMethod(id,'unifiedAttribute',[attributes]); }
    };
    this.getChildren = function(){ 
        dev.log.elementLibrary[type]('['+this.getAddress()+'].getChildren()'); //#development
        return children;
    };
    this.getChildByName = function(name){
        dev.log.elementLibrary[type]('[',this.getAddress()+'].getChildByName(',name); //#development
        return childRegistry[name];
    };
    this.getChildIndexByName = function(name){
        dev.log.elementLibrary[type]('[',this.getAddress()+'].getChildIndexByName(',name); //#development
        return children.indexOf(childRegistry[name]);
    };
    this.contains = function(elementToCheck){
        dev.log.elementLibrary[type]('[',this.getAddress()+'].contains(',elementToCheck); //#development
        return children.indexOf(elementToCheck) != -1;
    };
    this.append = function(newElement){
        dev.log.elementLibrary[type]('[',this.getAddress()+'].append(',newElement); //#development

        if( !isValidElement(newElement) ){ return false; }
        newElement.parent = this;
        children.push(newElement);
        childRegistry[newElement.getName()] = newElement;
        if(newElement.getCallback('onadd')){newElement.getCallback('onadd')();}

        if(clearingLock){ return; }

        if(newElement.getId() == -1){
            dev.log.elementLibrary[type]('['+this.getAddress()+'].append -> newElement\'s id missing; setting up "__idReceived" callback..'); //#development
            newElement.__idReceived = function(){
                dev.log.elementLibrary[type]('['+this.getAddress()+'].append -> newElement\'s "__idReceived" callback ->'); //#development
                if(children.indexOf(newElement) != -1 && id != -1){ 
                    dev.log.elementLibrary[type]('['+this.getAddress()+'].append -> this group\'s id missing; will not send message'); //#development
                    _canvas_.core.element.__executeMethod(id,'append', [newElement.getId()]);
                }
            };
        }else{
            if(id != -1){
                dev.log.elementLibrary[type]('['+this.getAddress()+'].append -> this group\'s id missing; will not send message'); //#development
                _canvas_.core.element.__executeMethod(id,'append', [newElement.getId()]);
            }
        }
    };
    this.prepend = function(newElement){
        dev.log.elementLibrary[type]('[',this.getAddress()+'].prepend(',newElement); //#development

        if( !isValidElement(newElement) ){ return false; }
        newElement.parent = this;
        children.unshift(newElement);
        childRegistry[newElement.getName()] = newElement;
        if(newElement.getCallback('onadd')){newElement.getCallback('onadd')();}

        if(clearingLock){ return; }

        if(newElement.getId() == -1){
            dev.log.elementLibrary[type]('['+this.getAddress()+'].prepend -> newElement\'s id missing; setting up "__idReceived" callback..'); //#development
            newElement.__idReceived = function(){
                dev.log.elementLibrary[type]('['+this.getAddress()+'].prepend -> newElement\'s "__idReceived" callback ->'); //#development
                if(children.indexOf(newElement) != -1 && id != -1){ 
                    dev.log.elementLibrary[type]('['+this.getAddress()+'].prepend -> this group\'s id missing; will not send message'); //#development
                    _canvas_.core.element.__executeMethod(id,'prepend', [newElement.getId()]);
                }
            };
        }else{
            if(id != -1){
                dev.log.elementLibrary[type]('['+this.getAddress()+'].prepend -> this group\'s id missing; will not send message'); //#development
                _canvas_.core.element.__executeMethod(id,'prepend', [newElement.getId()]);
            }
        }
    };
    this.remove = function(elementToRemove){
        dev.log.elementLibrary[type]('[',this.getAddress()+'].remove(',elementToRemove); //#development
        children.splice(children.indexOf(elementToRemove), 1);
        delete childRegistry[elementToRemove.getName()];
        elementToRemove.parent = undefined;
        if(elementToRemove.getCallback('onremove')){elementToRemove.getCallback('onremove')();}

        if(clearingLock){ return; }

        if(elementToRemove.getId() == -1){
            dev.log.elementLibrary[type]('['+this.getAddress()+'].remove -> elementToRemove\'s id missing; setting up "__idReceived" callback..'); //#development
            elementToRemove.__idReceived = function(){
                dev.log.elementLibrary[type]('['+this.getAddress()+'].remove -> elementToRemove\'s "__idReceived" callback ->'); //#development
                if(children.indexOf(elementToRemove) == -1 && id != -1){ 
                    dev.log.elementLibrary[type]('['+this.getAddress()+'].remove -> this group\'s id missing; will not send message'); //#development
                    _canvas_.core.element.__executeMethod(id,'remove', [elementToRemove.getId()]);
                }
            };
        }else{
            if(id != -1){
                dev.log.elementLibrary[type]('['+this.getAddress()+'].remove -> this group\'s id missing; will not send message'); //#development
                _canvas_.core.element.__executeMethod(id,'remove', [elementToRemove.getId()]);
            }
        }
    };
    this.clear = function(){
        dev.log.elementLibrary[type]('['+this.getAddress()+'].clear()'); //#development
        children = [];
        childRegistry = {};
        if(id != -1){ 
            lockClearingLock();
            communicationModule.run('element.executeMethod',[id,'clear',[]],()=>{unlockClearingLock();});
        }
    };
    this.getElementsUnderPoint = function(x,y){
        dev.log.elementLibrary[type]('[',this.getAddress()+'].getElementsUnderPoint(',x,y); //#development
        if(id != -1){
            return new Promise((resolve, reject) => {
                _canvas_.core.element.__executeMethod(id,'getElementsUnderPoint',[x,y],result => resolve(result.map(elementId => elementRegistry[elementId])) );
            });
        }
    };
    // this.getElementsUnderArea = function(points){
    //     dev.log.elementLibrary[type]('[',this.getAddress()+'].getElementsUnderArea(',JSON.stringify(points)); //#development
    //     executeMethod_withReturn('getElementsUnderArea',[points],result => result.map(result => elementRegistry[result]));
    // };
    // this.getTree = function(){
    //     dev.log.elementLibrary[type]('['+this.getAddress()+'].getTree()'); //#development

    //     const result = {name:name, type:this.getType(), id:this.getId(), children:[]};
    //     children.forEach(function(a){
    //         if(a.getType() == 'group'){ result.children.push( a.getTree() ); }
    //         else{ result.children.push({ type:a.getType(), name:a.name, id:a.getId() }); }
    //     });
    //     return result;
    // };
    this.stencil = function(newStencilElement){
        if(newStencilElement == undefined){ return stencilElement; }
        dev.log.elementLibrary[type]('[',this.getAddress()+'].stencil(',newStencilElement); //#development
        stencilElement = newStencilElement;

        if(newStencilElement.getId() == -1){
            newStencilElement.__idReceived = function(){
                if(id != -1){ _canvas_.core.element.__executeMethod(id,'stencil', [newStencilElement.getId()]); }
            };
        }else{
            if(id != -1){ _canvas_.core.element.__executeMethod(id,'stencil', [newStencilElement.getId()]); }
        }
    };
    this.clipActive = function(bool){ 
        dev.log.elementLibrary[type]('[',this.getAddress()+'].clipActive(',bool); //#development
        if(bool == undefined){ return cashedAttributes.clipActive; } cashedAttributes.clipActive = bool;
        if(id != -1){ _canvas_.core.element.__executeMethod(id,'clipActive',[bool]); }
    };

    this.getCallback = function(callbackType){
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