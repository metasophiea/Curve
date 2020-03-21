this.group = function(_name){
    genericElementProxy.call(this,'group',_name);

    Object.entries({
        heedCamera: false,
        x: 0,
        y: 0,
        angle: 0,
        clipActive: false,
    }).forEach(([name,defaultValue]) => this.setupSimpleAttribute(name,defaultValue) );


    const self = this;

    let children = [];
    let childRegistry = {};
    let stencilElement = undefined;

    let clearingLock = false;
    function lockClearingLock(){
        dev.log.elementLibrary[self.getType()]('['+self.getAddress()+']::lockClearingLock()'); //#development
        clearingLock = true;
    }
    function unlockClearingLock(){
        dev.log.elementLibrary[self.getType()]('['+self.getAddress()+']::unlockClearingLock()'); //#development
        self.__repush();
        clearingLock = false;
    }

    function checkForName(name){ return childRegistry[name] != undefined; }
    function isValidElement(elementToCheck){
        dev.log.elementLibrary[self.getType()]('['+self.getAddress()+']::isValidElement(',elementToCheck); //#development
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

    this.__repush = function(){
        if(stencilElement != undefined){
            function readdStencil(){
                if( stencilElement.getId() == -1 ){ setTimeout(readdStencil,1); }
                else{ _canvas_.core.element.__executeMethod(self.getId(),'stencil',[stencilElement.getId()]); }
            }
            readdStencil();
        }

        communicationModule.run('element.executeMethod',[self.getId(),'clear'],() => {
            function readdChildren(){
                dev.log.elementLibrary[self.getType()]('['+self.getAddress()+']::repush::readdChildren -> children:',children); //#development
                const childIds = children.map(child => child.getId());
                if( childIds.indexOf(-1) != -1 ){ setTimeout(readdChildren,1); }
                else{ _canvas_.core.element.__executeMethod(self.getId(),'syncChildren',[childIds]); }
            }
            readdChildren();
        });
    };
    
    this.getChildren = function(){ 
        dev.log.elementLibrary[this.getType()]('['+this.getAddress()+'].getChildren()'); //#development
        return children;
    };
    this.getChildByName = function(name){
        dev.log.elementLibrary[this.getType()]('['+this.getAddress()+'].getChildByName(',name); //#development
        return childRegistry[name];
    };
    this.getChildIndexByName = function(name){
        dev.log.elementLibrary[this.getType()]('['+this.getAddress()+'].getChildIndexByName(',name); //#development
        return children.indexOf(childRegistry[name]);
    };
    this.contains = function(elementToCheck){
        dev.log.elementLibrary[this.getType()]('['+this.getAddress()+'].contains(',elementToCheck); //#development
        return children.indexOf(elementToCheck) != -1;
    };
    this.append = function(newElement){
        dev.log.elementLibrary[this.getType()]('['+this.getAddress()+'].append(',newElement,'(',newElement.getName(),')'); //#development

        if( !isValidElement(newElement) ){ return false; }
        newElement.parent = this;
        children.push(newElement);
        childRegistry[newElement.getName()] = newElement;
        if(newElement.getCallback('onadd')){newElement.getCallback('onadd')();}

        if(clearingLock){ return; }

        if(newElement.getId() == -1){
            dev.log.elementLibrary[this.getType()]('['+this.getAddress()+'].append -> newElement\'s id missing; setting up "__idReceived" callback..'); //#development
            newElement.__calledBy = this.getAddress();
            newElement.__idReceived = function(){
                dev.log.elementLibrary[this.getType()]('['+this.getAddress()+'].append -> newElement\'s "__idReceived" callback, called by '+newElement.__calledBy+', id is: '+newElement.getId()+' ()'); //#development
                if(self.getId() != -1){ 
                    dev.log.elementLibrary[this.getType()]('['+this.getAddress()+'].append -> this group\'s id:',self.getId()); //#development
                    if(children.indexOf(newElement) != -1){
                        dev.log.elementLibrary[this.getType()]('['+this.getAddress()+'].append -> element position:',children.indexOf(newElement)); //#development
                        _canvas_.core.element.__executeMethod(self.getId(),'append', [newElement.getId()]);
                    }else{
                        dev.log.elementLibrary[this.getType()]('['+this.getAddress()+'].append -> this element doesn\'t seem to be relevant anymore; not sending message'); //#development
                    }
                }else{
                    dev.log.elementLibrary[this.getType()]('['+this.getAddress()+'].append -> this group\'s id missing; will not send message'); //#development
                }
            };
        }else{
            if(self.getId() != -1){
                _canvas_.core.element.__executeMethod(self.getId(),'append', [newElement.getId()]);
            }else{
                dev.log.elementLibrary[this.getType()]('['+this.getAddress()+'].append -> this group\'s id missing; will not send message'); //#development
            }
        }
    };
    this.prepend = function(newElement){
        dev.log.elementLibrary[this.getType()]('['+this.getAddress()+'].prepend(',newElement,'(',newElement.getName(),')'); //#development

        if( !isValidElement(newElement) ){ return false; }

        //add element
            newElement.parent = this;
            children.unshift(newElement);
            childRegistry[newElement.getName()] = newElement;

        //perform addition callback
            if(newElement.getCallback('onadd')){newElement.getCallback('onadd')();}

        //communicate with engine for removal
            if(clearingLock){ return; }

            if(newElement.getId() == -1){
                dev.log.elementLibrary[this.getType()]('['+this.getAddress()+'].prepend -> newElement\'s id missing; setting up "__idReceived" callback..'); //#development
                newElement.__idReceived = function(){
                    dev.log.elementLibrary[this.getType()]('['+this.getAddress()+'].prepend -> newElement\'s "__idReceived" callback ->'); //#development
                    if(children.indexOf(newElement) != -1 && self.getId() != -1){ 
                        _canvas_.core.element.__executeMethod(self.getId(),'prepend', [newElement.getId()]);
                    }else{
                        dev.log.elementLibrary[this.getType()]('['+this.getAddress()+'].prepend -> this group\'s id missing; will not send message'); //#development
                    }
                };
            }else{
                if(self.getId() != -1){
                    _canvas_.core.element.__executeMethod(self.getId(),'prepend', [newElement.getId()]);
                }else{
                    dev.log.elementLibrary[this.getType()]('['+this.getAddress()+'].append -> this group\'s id missing; will not send message'); //#development
                }
            }
    };
    this.remove = function(elementToRemove){
        dev.log.elementLibrary[this.getType()]('['+this.getAddress()+'].remove(',elementToRemove,'(',elementToRemove.getName(),')'); //#development

        //ensure that removing elements is actually a child of this group
            if( !children.includes(elementToRemove) ){ return; }

        //clear out children of removing element (if it is a group)
            if(elementToRemove.getType() == 'group'){ elementToRemove.clear(); }
        
        //perform removal callback
            if(elementToRemove.getCallback('onremove')){elementToRemove.getCallback('onremove')();}

        //remove element
            children.splice(children.indexOf(elementToRemove), 1);
            delete childRegistry[elementToRemove.getName()];
            elementToRemove.parent = undefined;

        //communicate with engine for removal
            if(clearingLock){ return; }

            if(elementToRemove.getId() == -1){
                dev.log.elementLibrary[this.getType()]('['+this.getAddress()+'].remove -> elementToRemove\'s id missing'); //#development
                elementToRemove.__idReceived = function(){
                    dev.log.elementLibrary[this.getType()]('['+this.getAddress()+'].remove -> elementToRemove\'s "__idReceived" callback ->'); //#development
                    if(children.indexOf(elementToRemove) == -1 && self.getId() != -1){ 
                        _canvas_.core.element.__executeMethod(self.getId(),'remove', [elementToRemove.getId()]);
                    }else{
                        dev.log.elementLibrary[this.getType()]('['+this.getAddress()+'].remove -> this group\'s id missing; will not send message'); //#development
                    }
                };
            }else{
                dev.log.elementLibrary[this.getType()]('['+this.getAddress()+'].remove -> elementToRemove\'s id:',elementToRemove.getId()); //#development
                if(self.getId() != -1){
                    _canvas_.core.element.__executeMethod(self.getId(),'remove', [elementToRemove.getId()]);
                }else{
                    dev.log.elementLibrary[this.getType()]('['+this.getAddress()+'].remove -> this group\'s id missing; will not send message'); //#development
                }
            }
    };
    this.clear = function(){
        dev.log.elementLibrary[this.getType()]('['+this.getAddress()+'].clear()'); //#development
        children.forEach(child => {if(child.getCallback('onremove')){child.getCallback('onremove')();}});
        children = [];
        childRegistry = {};
        if(self.getId() != -1){ 
            lockClearingLock();
            communicationModule.run('element.executeMethod',[self.getId(),'clear',[]],unlockClearingLock);
        }else{
            dev.log.elementLibrary[this.getType()]('['+this.getAddress()+'].append -> this group\'s id missing; will not send message'); //#development
        }
    };
    this.shift = function(elementToShift,newPosition){
        dev.log.elementLibrary[this.getType()]('['+this.getAddress()+'].shift(',elementToShift,newPosition); //#development

        //ensure that removing elements is actually a child of this group
            if( !children.includes(elementToShift) ){ return; }

        //shift element
            children.splice(children.indexOf(elementToShift), 1);
            children.splice(newPosition,0,elementToShift);

        //perform removal callback
            if(elementToShift.getCallback('onshift')){elementToShift.getCallback('onshift')(children.indexOf(elementToShift));}

        //communicate with engine for shifting
            if(clearingLock){ return; }

            if(elementToShift.getId() == -1){
                dev.log.elementLibrary[this.getType()]('['+this.getAddress()+'].shift -> elementToShift\'s id missing'); //#development
                // elementToShift.__idReceived = function(){
                //     dev.log.elementLibrary[this.getType()]('['+this.getAddress()+'].shift -> elementToShift\'s "__idReceived" callback ->'); //#development
                //     if(children.indexOf(elementToShift) != -1 && self.getId() != -1){ 
                //         _canvas_.core.element.__executeMethod(self.getId(),'shift', [elementToShift.getId(),newPosition]);
                //     }else{
                //         dev.log.elementLibrary[this.getType()]('['+this.getAddress()+'].shift -> this group\'s id missing; will not send message'); //#development
                //     }
                // };
            }else{
                dev.log.elementLibrary[this.getType()]('['+this.getAddress()+'].shift -> elementToShift\'s id:',elementToShift.getId()); //#development
                if(self.getId() != -1){
                    _canvas_.core.element.__executeMethod(self.getId(),'shift', [elementToShift.getId(),newPosition]);
                }else{
                    dev.log.elementLibrary[this.getType()]('['+this.getAddress()+'].shift -> this group\'s id missing; will not send message'); //#development
                }
            }
    };
    this.getElementsUnderPoint = function(x,y){
        dev.log.elementLibrary[this.getType()]('['+this.getAddress()+'].getElementsUnderPoint(',x,y); //#development
        if(self.getId() != -1){
            return new Promise((resolve, reject) => {
                _canvas_.core.element.__executeMethod(self.getId(),'getElementsUnderPoint',[x,y],result => resolve(result.map(elementId => elementRegistry[elementId])) );
            });
        }
    };
    this.getTree = function(){
        dev.log.elementLibrary[this.getType()]('['+this.getAddress()+'].getTree()'); //#development

        const result = {name:this.getName(), type:this.getType(), id:this.getId(), children:[]};
        children.forEach(function(a){
            if(a.getType() == 'group'){ result.children.push( a.getTree() ); }
            else{ result.children.push({ type:a.getType(), name:a.getName(), id:a.getId() }); }
        });
        return result;
    };
    this.stencil = function(newStencilElement){
        if(newStencilElement == undefined){ return stencilElement; }
        dev.log.elementLibrary[this.getType()]('['+this.getAddress()+'].stencil(',newStencilElement); //#development
        stencilElement = newStencilElement;

        if(newStencilElement.getId() == -1){
            newStencilElement.__idReceived = function(){
                if(self.getId() != -1){ _canvas_.core.element.__executeMethod(self.getId(),'stencil', [newStencilElement.getId()]); }
            };
        }else{
            if(self.getId() != -1){ _canvas_.core.element.__executeMethod(self.getId(),'stencil', [newStencilElement.getId()]); }
        }
    };
};