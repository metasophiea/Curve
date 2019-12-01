this.group = function(_name){
    dev.log.elementLibrary(' - new group('+_name+')'); //#development
    const self = this;

    let id = -1;
    this.getId = function(){return id;};
    this.__idRecieved = function(){};
    this.__id = function(a){
        dev.log.elementLibrary('['+this.getAddress()+'] - group.__id('+a+')'); //#development
        id = a;
        repush(this);
        if(this.__idRecieved){this.__idRecieved();}
    };
    let name = _name;
    this.getName = function(){return name;};
    this.setName = function(a){name = a;};
    this.getType = function(){return 'group';};
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
        dev.log.elementLibrary('['+self.getAddress()+'] - group::lockClearingLock()'); //#development
        clearingLock = true;
    }
    function unlockClearingLock(){
        dev.log.elementLibrary('['+self.getAddress()+'] - group::unlockClearingLock()'); //#development
        repush(self);
        clearingLock = false;
    }

    function checkForName(name){ return childRegistry[name] != undefined; }
    function isValidElement(elementToCheck){
        dev.log.elementLibrary('['+self.getAddress()+'] - group::isValidElement({'+'name:'+self.getName()+',id:'+self.getId()+'},{'+'name:'+elementToCheck.getName()+',id:'+elementToCheck.getId()+'})'); //#development
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
        dev.log.elementLibrary('['+self.getAddress()+'] - group::repush()'); //#development
        communicationModule.run('element.executeMethod',[id,'unifiedAttribute',[cashedAttributes]]);
        Object.entries(cashedCallbacks).forEach(entry => { _canvas_.core.callback.attachCallback(self,entry[0],entry[1]); });
        
        if(stencilElement != undefined){
            function readdStencil(){
                if( stencilElement.getId() == -1 ){ setTimeout(readdStencil,1); }
                else{ communicationModule.run('element.executeMethod',[id,'stencil',[stencilElement.getId()]]); }
            }
            readdStencil();
        }

        communicationModule.run('element.executeMethod',[id,'clear'],() => {
            function readdChildren(){
                dev.log.elementLibrary('['+self.getAddress()+'] - group::repush::readdChildren -> self.getName(): '+ self.getName()+' children: ['+children.map(child => child.getId())+']'); //#development
                const childIds = children.map(child => child.getId());
                if( childIds.indexOf(-1) != -1 ){ setTimeout(readdChildren,1); }
                else{ communicationModule.run('element.executeMethod',[id,'syncChildren',[childIds]]); }
            }
            readdChildren();
        });
    }

    // function executeMethod_withReturn(method,argumentList,postProcessing){
    //     dev.log.elementLibrary('['+this.getAddress()+'] - group::executeMethod_withReturn('+method+','+JSON.stringify(argumentList)+','+postProcessing+')'); //#development
    //     if(id == -1){
    //         dev.log.elementLibrary('['+this.getAddress()+'] - group::executeMethod_withReturn -> this element\'s ID is -1, will retry in '+missingIdRetryPeriod+'ms...'); //#development
    //         setTimeout(() => {executeMethod_withReturn(method,argumentList,postProcessing);},missingIdRetryPeriod);
    //     }else{
    //         return new Promise((resolve, reject) => { 
    //             communicationModule.run('element.executeMethod',[id,method,argumentList],result => {
    //                 if(postProcessing){resolve(postProcessing(result));}else{resolve(result);}
    //             });
    //         });
    //     }
    // }

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
        dev.log.elementLibrary('['+this.getAddress()+'] - group.ignored('+bool+')'); //#development
        cashedAttributes.ignored = bool;
        if(id != -1){ communicationModule.run('element.executeMethod',[id,'ignored',[bool]]); }
    };
    this.x = function(number){
        if(number == undefined){ return cashedAttributes.x; } 
        dev.log.elementLibrary('['+this.getAddress()+'] - group.x('+number+')'); //#development
        cashedAttributes.x = number;
        if(id != -1){ communicationModule.run('element.executeMethod',[id,'x',[number]]); }
    };
    this.y = function(number){
        if(number == undefined){ return cashedAttributes.y; } 
        dev.log.elementLibrary('['+this.getAddress()+'] - group.y('+number+')'); //#development
        cashedAttributes.y = number;
        if(id != -1){ communicationModule.run('element.executeMethod',[id,'y',[number]]); }
    };
    this.angle = function(number){
        if(number == undefined){ return cashedAttributes.angle; } 
        dev.log.elementLibrary('['+this.getAddress()+'] - group.angle('+number+')'); //#development
        cashedAttributes.angle = number;
        if(id != -1){ communicationModule.run('element.executeMethod',[id,'angle',[number]]); }
    };
    this.scale = function(number){
        if(number == undefined){ return cashedAttributes.scale; } 
        dev.log.elementLibrary('['+this.getAddress()+'] - group.scale('+number+')'); //#development
        cashedAttributes.scale = number;
        if(id != -1){ communicationModule.run('element.executeMethod',[id,'scale',[number]]); }
    };
    this.heedCamera = function(bool){
        if(bool == undefined){ return cashedAttributes.heedCamera; } 
        dev.log.elementLibrary('['+this.getAddress()+'] - group.heedCamera('+bool+')'); //#development
        cashedAttributes.heedCamera = bool;
        if(id != -1){ communicationModule.run('element.executeMethod',[id,'heedCamera',[bool]]); }
    };
    this.static = function(bool){
        if(bool == undefined){ return cashedAttributes.static; } 
        dev.log.elementLibrary('['+this.getAddress()+'] - group.static('+bool+')'); //#development
        cashedAttributes.static = bool;
        if(id != -1){ communicationModule.run('element.executeMethod',[id,'static',[bool]]); }
    };
    this.unifiedAttribute = function(attributes){
        if(attributes == undefined){ return cashedAttributes; } 
        dev.log.elementLibrary('['+this.getAddress()+'] - group.unifiedAttribute('+JSON.stringify(attributes)+')'); //#development
        Object.keys(attributes).forEach(key => { cashedAttributes[key] = attributes[key]; });
        if(id != -1){ communicationModule.run('element.executeMethod',[id,'unifiedAttribute',[attributes]]); }
    };
    this.getChildren = function(){ 
        dev.log.elementLibrary('['+this.getAddress()+'] - group.getChildren()'); //#development
        return children;
    };
    this.getChildByName = function(name){
        dev.log.elementLibrary('['+this.getAddress()+'] - group.getChildByName('+name+')'); //#development
        return childRegistry[name];
    };
    this.getChildIndexByName = function(name){
        dev.log.elementLibrary('['+this.getAddress()+'] - group.getChildIndexByName('+name+')'); //#development
        return children.indexOf(childRegistry[name]);
    };
    this.contains = function(elementToCheck){
        dev.log.elementLibrary('['+this.getAddress()+'] - group.contains('+JSON.stringify(elementToCheck)+')'); //#development
        return children.indexOf(elementToCheck) != -1;
    };
    this.append = function(newElement){
        dev.log.elementLibrary('['+this.getAddress()+'] - group.append('+JSON.stringify(newElement.getName()+newElement.getId())+')'); //#development

        if( !isValidElement(newElement) ){ return false; }
        newElement.parent = this;
        children.push(newElement);
        childRegistry[newElement.getName()] = newElement;

        if(clearingLock){ return; }

        if(newElement.getId() == -1){
            dev.log.elementLibrary('['+this.getAddress()+'] - group.append -> newElement\'s id missing; setting up "__idRecieved" callback..'); //#development
            newElement.__idRecieved = function(){
                dev.log.elementLibrary('['+this.getAddress()+'] - group.append -> newElement\'s "__idRecieved" callback ->'); //#development
                if(children.indexOf(newElement) != -1 && id != -1){ 
                    dev.log.elementLibrary('['+this.getAddress()+'] - group.append -> this group\'s id missing; will not send message'); //#development
                    communicationModule.run('element.executeMethod',[id,'append', [newElement.getId()]]);
                }
            };
        }else{
            if(id != -1){
                dev.log.elementLibrary('['+this.getAddress()+'] - group.append -> this group\'s id missing; will not send message'); //#development
                communicationModule.run('element.executeMethod',[id,'append', [newElement.getId()]]);
            }
        }
    };
    this.prepend = function(newElement){
        dev.log.elementLibrary('['+this.getAddress()+'] - group.prepend('+JSON.stringify(newElement)+')'); //#development

        if( !isValidElement(newElement) ){ return false; }
        newElement.parent = this;
        children.unshift(newElement);
        childRegistry[newElement.getName()] = newElement;

        if(clearingLock){ return; }

        if(newElement.getId() == -1){
            dev.log.elementLibrary('['+this.getAddress()+'] - group.prepend -> newElement\'s id missing; setting up "__idRecieved" callback..'); //#development
            newElement.__idRecieved = function(){
                dev.log.elementLibrary('['+this.getAddress()+'] - group.prepend -> newElement\'s "__idRecieved" callback ->'); //#development
                if(children.indexOf(newElement) != -1 && id != -1){ 
                    dev.log.elementLibrary('['+this.getAddress()+'] - group.prepend -> this group\'s id missing; will not send message'); //#development
                    communicationModule.run('element.executeMethod',[id,'prepend', [newElement.getId()]]);
                }
            };
        }else{
            if(id != -1){
                dev.log.elementLibrary('['+this.getAddress()+'] - group.prepend -> this group\'s id missing; will not send message'); //#development
                communicationModule.run('element.executeMethod',[id,'prepend', [newElement.getId()]]);
            }
        }
    };
    this.remove = function(elementToRemove){
        dev.log.elementLibrary('['+this.getAddress()+'] - group.remove('+JSON.stringify(elementToRemove)+')'); //#development
        children.splice(children.indexOf(elementToRemove), 1);
        elementToRemove.parent = undefined;

        if(clearingLock){ return; }

        if(elementToRemove.getId() == -1){
            dev.log.elementLibrary('['+this.getAddress()+'] - group.remove -> newElement\'s id missing; setting up "__idRecieved" callback..'); //#development
            newElement.__idRecieved = function(){
                dev.log.elementLibrary('['+this.getAddress()+'] - group.remove -> newElement\'s "__idRecieved" callback ->'); //#development
                if(children.indexOf(newElement) == -1 && id != -1){ 
                    dev.log.elementLibrary('['+this.getAddress()+'] - group.remove -> this group\'s id missing; will not send message'); //#development
                    communicationModule.run('element.executeMethod',[id,'remove', [elementToRemove.getId()]]);
                }
            };
        }else{
            if(id != -1){
                dev.log.elementLibrary('['+this.getAddress()+'] - group.remove -> this group\'s id missing; will not send message'); //#development
                communicationModule.run('element.executeMethod',[id,'remove', [elementToRemove.getId()]]);
            }
        }
    };
    this.clear = function(){
        dev.log.elementLibrary('['+this.getAddress()+'] - group.clear()'); //#development
        children = [];
        childRegistry = {};
        if(id != -1){ 
            lockClearingLock();
            communicationModule.run('element.executeMethod',[id,'clear',[]],()=>{unlockClearingLock();});
        }
    };
    // this.getElementsUnderPoint = function(x,y){
    //     dev.log.elementLibrary('['+this.getAddress()+'] - group.getElementsUnderPoint('+x+','+y+')'); //#development
    //     executeMethod_withReturn('getElementsUnderPoint',[x,y],result => result.map(result => elementRegistry[result]));
    // };
    // this.getElementsUnderArea = function(points){
    //     dev.log.elementLibrary('['+this.getAddress()+'] - group.getElementsUnderArea('+JSON.stringify(points)+')'); //#development
    //     executeMethod_withReturn('getElementsUnderArea',[points],result => result.map(result => elementRegistry[result]));
    // };
    // this.getTree = function(){
    //     dev.log.elementLibrary('['+this.getAddress()+'] - group.getTree()'); //#development

    //     const result = {name:name, type:this.getType(), id:this.getId(), children:[]};
    //     children.forEach(function(a){
    //         if(a.getType() == 'group'){ result.children.push( a.getTree() ); }
    //         else{ result.children.push({ type:a.getType(), name:a.name, id:a.getId() }); }
    //     });
    //     return result;
    // };
    this.stencil = function(newStencilElement){
        if(newStencilElement == undefined){ return stencilElement; }
        dev.log.elementLibrary('['+this.getAddress()+'] - group.stencil('+JSON.stringify(newStencilElement)+')'); //#development
        stencilElement = newStencilElement;

        if(newStencilElement.getId() == -1){
            newStencilElement.__idRecieved = function(){
                if(id != -1){ communicationModule.run('element.executeMethod',[id,'stencil', [newStencilElement.getId()]]); }
            };
        }else{
            if(id != -1){ communicationModule.run('element.executeMethod',[id,'stencil', [newStencilElement.getId()]]); }
        }
    };
    this.clipActive = function(bool){ 
        dev.log.elementLibrary('['+this.getAddress()+'] - group.clipActive('+bool+')'); //#development
        if(bool == undefined){ return cashedAttributes.clipActive; } cashedAttributes.clipActive = bool;
        if(id != -1){ communicationModule.run('element.executeMethod',[id,'clipActive',[bool]]); }
    };

    this.getCallback = function(callbackType){
        return cashedCallbacks[callbackType];
    };
    this.attachCallback = function(callbackType, callback){
        dev.log.elementLibrary('['+this.getAddress()+'] - group.attachCallback('+callbackType+','+callback+')'); //#development
        cashedCallbacks[callbackType] = callback;
        if(id != -1){ _canvas_.core.callback.attachCallback(this,callbackType,callback); }
    }
    this.removeCallback = function(callbackType){
        dev.log.elementLibrary('['+this.getAddress()+'] - group.removeCallback('+callbackType+')'); //#development
        delete cashedCallbacks[callbackType];
        if(id != -1){ _canvas_.core.callback.removeCallback(this,callbackType); }
    }

    this._dump = function(){
        dev.log.elementLibrary('['+this.getAddress()+'] - group._dump()'); //#development
        communicationModule.run('element.executeMethod',[id,'_dump',[]]);
    };
};