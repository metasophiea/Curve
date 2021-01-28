this.Group = function(_name){
    genericElement.call(this,'Group',_name);

    Object.entries({
        heedCamera: false,
        heedCameraActive: false,
        clipActive: false,
        framebufferActive: false,
    }).forEach(([name,defaultValue]) => this.__setupSimpleAttribute(name,defaultValue) );

    const self = this;

    let children = [];
    let childRegistry = {};
    let stencilElement = undefined;

    function checkForName(name){ return childRegistry[name] != undefined; }
    function isValidElement(elementToCheck){
        if( elementToCheck == undefined ){ return false; }
        if( elementToCheck.getName() == undefined || elementToCheck.getName().length == 0 ){
            console.error('group error: element with no name being inserted into group "'+self.getAddress()+'", therefore; the element will not be added');
            return false;
        }
        if( checkForName(elementToCheck.getName()) ){
            console.error('group error: element with name "'+elementToCheck.getName()+'" already exists in group "'+self.getAddress()+'", therefore; the element will not be added');
            return false;
        }

        return true;
    }

    this.__repush = function(){
        dev.log.elementLibrary[self.getType()]('['+self.getAddress()+'].__repush()'); //#development

        dev.log.elementLibrary[self.getType()]('['+self.getAddress()+'].__repush -> pushing unifiedAttribute'); //#development
        self.unifiedAttribute(self.unifiedAttribute());

        if(stencilElement != undefined){
            function readdStencil(){
                if( stencilElement.getId() == undefined ){ 
                    setTimeout(readdStencil,1);
                } else{ 
                    dev.log.elementLibrary[self.getType()]('['+self.getAddress()+'].__repush -> pushing stencil'); //#development
                    interface.operator.element.executeMethod.Group.stencil(self.getId(),stencilElement.getId());
                }
            }
            readdStencil();
        }

        function readdChildren(){
            const childIds = children.map(child => child.getId());
            if( childIds.indexOf(-1) != -1 ){ 
                setTimeout(readdChildren,1);
            }else{
                dev.log.elementLibrary[self.getType()]('['+self.getAddress()+'].__repush -> pushing children'); //#development
                interface.operator.element.executeMethod.Group.replaceWithTheseChildren(self.getId(),childIds.filter(id => id!=undefined));
            }
        }
        readdChildren();
    };

    this.getChildren = function(){ 
        return children;
    };
    this.getChildByName = function(name){
        return childRegistry[name];
    };
    this.getChildIndexByName = function(name){
        return children.indexOf(childRegistry[name]);
    };
    this.contains = function(elementToCheck){
        return children.indexOf(elementToCheck) != -1;
    };
    
    this.prepend = function(newElement){
        dev.log.elementLibrary[self.getType()]('['+self.getAddress()+'].prepend(',newElement,'(',newElement.getName(),')'); //#development

        if( !isValidElement(newElement) ){ return false; }

        //don't add an element twice
            if( children.includes(newElement) ){ return; }

        //add element
            newElement.parent = this;
            children.push(newElement);
            childRegistry[newElement.getName()] = newElement;
            if(newElement.getCallback('onadd')){ newElement.getCallback('onadd')(); }

        //perform addition callback
            // if(newElement.getCallback('onadd')){newElement.getCallback('onadd')();}

        //communicate with engine for addition
            if(newElement.getId() == undefined){
                dev.log.elementLibrary[self.getType()]('['+self.getAddress()+'].prepend -> newElement\'s id missing; setting up "__onIdReceived" callback..'); //#development
                newElement.__calledBy = self.getAddress();
                newElement.__onIdReceived = function(){
                    dev.log.elementLibrary[self.getType()]('['+self.getAddress()+'].prepend -> newElement\'s "__onIdReceived" callback, called by '+newElement.__calledBy+', id is: '+newElement.getId()+' ()'); //#development
                    if(self.getId() != undefined){ 
                        dev.log.elementLibrary[self.getType()]('['+self.getAddress()+'].prepend -> this group\'s id:',self.getId()); //#development
                        if(children.indexOf(newElement) != -1){
                            dev.log.elementLibrary[self.getType()]('['+self.getAddress()+'].prepend -> element position:',children.indexOf(newElement)); //#development
                            interface.operator.element.executeMethod.Group.prepend(self.getId(), newElement.getId());
                        }else{
                            dev.log.elementLibrary[self.getType()]('['+self.getAddress()+'].prepend -> this element doesn\'t seem to be relevant anymore; not sending message'); //#development
                        }
                    }else{
                        dev.log.elementLibrary[self.getType()]('['+self.getAddress()+'].prepend -> this group\'s id missing; will not send message'); //#development
                    }
                };
            }else{
                dev.log.elementLibrary[self.getType()]('['+self.getAddress()+'].prepend -> newElement\'s id present'); //#development
                if(self.getId() != undefined){
                    dev.log.elementLibrary[self.getType()]('['+self.getAddress()+'].prepend -> group\'s id present, pushing prepend through...'); //#development
                    interface.operator.element.executeMethod.Group.prepend(self.getId(), newElement.getId());
                }else{
                    dev.log.elementLibrary[self.getType()]('['+self.getAddress()+'].prepend -> this group\'s id missing; will not send message'); //#development
                }
            }
    };
    this.append = function(newElement){
        dev.log.elementLibrary[self.getType()]('['+self.getAddress()+'].append(',newElement,'(',newElement.getName(),')'); //#development

        if( !isValidElement(newElement) ){ return false; }

        //don't add an element twice
            if( children.includes(newElement) ){ return; }

        //add element
            newElement.parent = this;
            children.push(newElement);
            childRegistry[newElement.getName()] = newElement;
            if(newElement.getCallback('onadd')){ newElement.getCallback('onadd')();}

        //perform addition callback
            // if(newElement.getCallback('onadd')){newElement.getCallback('onadd')();}

        //communicate with engine for addition
            if(newElement.getId() == undefined){
                dev.log.elementLibrary[self.getType()]('['+self.getAddress()+'].append -> newElement\'s id missing; setting up "__onIdReceived" callback..'); //#development
                newElement.__calledBy = self.getAddress();
                newElement.__onIdReceived = function(){
                    dev.log.elementLibrary[self.getType()]('['+self.getAddress()+'].append -> newElement\'s "__onIdReceived" callback, called by '+newElement.__calledBy+', id is: '+newElement.getId()+' ()'); //#development
                    if(self.getId() != undefined){ 
                        dev.log.elementLibrary[self.getType()]('['+self.getAddress()+'].append -> this group\'s id:',self.getId()); //#development
                        if(children.indexOf(newElement) != -1){
                            dev.log.elementLibrary[self.getType()]('['+self.getAddress()+'].append -> element position:',children.indexOf(newElement)); //#development
                            interface.operator.element.executeMethod.Group.append(self.getId(), newElement.getId());
                        }else{
                            dev.log.elementLibrary[self.getType()]('['+self.getAddress()+'].append -> this element doesn\'t seem to be relevant anymore; not sending message'); //#development
                        }
                    }else{
                        dev.log.elementLibrary[self.getType()]('['+self.getAddress()+'].append -> this group\'s id missing; will not send message'); //#development
                    }
                };
            }else{
                dev.log.elementLibrary[self.getType()]('['+self.getAddress()+'].append -> newElement\'s id present'); //#development
                if(self.getId() != undefined){
                    dev.log.elementLibrary[self.getType()]('['+self.getAddress()+'].append -> group\'s id present, pushing append through...'); //#development
                    interface.operator.element.executeMethod.Group.append(self.getId(), newElement.getId());
                }else{
                    dev.log.elementLibrary[self.getType()]('['+self.getAddress()+'].append -> this group\'s id missing; will not send message'); //#development
                }
            }
    };
    this.remove = function(elementToRemove){
        dev.log.elementLibrary[self.getType()]('['+self.getAddress()+'].remove(',elementToRemove,'(',elementToRemove.getName(),')'); //#development

        //ensure that removing element is actually a child of this group
            if( !children.includes(elementToRemove) ){ return; }

        //clear out children of removing element (if it is a group)
            if(elementToRemove.getType() == 'Group'){ elementToRemove.clear(); }
        
        //perform removal callback
            if(elementToRemove.getCallback('onremove')){ elementToRemove.getCallback('onremove')(); }

        //remove element
            children.splice(children.indexOf(elementToRemove), 1);
            delete childRegistry[elementToRemove.getName()];
            elementToRemove.parent = undefined;

        //communicate with engine for removal
            if(elementToRemove.getId() == undefined){
                dev.log.elementLibrary[self.getType()]('['+self.getAddress()+'].remove -> elementToRemove\'s id is missing, setting up __onIdReceived callback...'); //#development
                elementToRemove.__onIdReceived = function(){
                    dev.log.elementLibrary[self.getType()]('['+self.getAddress()+'].remove -> elementToRemove\'s "__onIdReceived" callback ->'); //#development
                    if(children.indexOf(elementToRemove) == -1){ 
                        dev.log.elementLibrary[self.getType()]('['+self.getAddress()+'].remove -> element is not in the proxy group, pushing remove through...'); //#development
                        interface.operator.element.executeMethod.Group.remove(self.getId(), elementToRemove.getId());
                    }else{
                        dev.log.elementLibrary[self.getType()]('['+self.getAddress()+'].remove -> element is still in the group; will not send message'); //#development
                    }
                };
            }else{
                dev.log.elementLibrary[self.getType()]('['+self.getAddress()+'].remove -> elementToRemove\'s id:',elementToRemove.getId()); //#development
                if(self.getId() != undefined){
                    dev.log.elementLibrary[self.getType()]('['+self.getAddress()+'].remove -> group\'s id present, pushing remove through...'); //#development
                    interface.operator.element.executeMethod.Group.remove(self.getId(), elementToRemove.getId());
                }else{
                    dev.log.elementLibrary[self.getType()]('['+self.getAddress()+'].remove -> this group\'s id missing; will not send message'); //#development
                }
            }
    };
    this.clear = function(){
        dev.log.elementLibrary[self.getType()]('['+self.getAddress()+'].clear()'); //#development
        children.forEach(child => {if(child.getCallback('onremove')){ child.getCallback('onremove')(); }});
        children = [];
        childRegistry = {};
        if(self.getId() != undefined){ 
            dev.log.elementLibrary[self.getType()]('['+self.getAddress()+'].clear -> this group\'s id is present; setting lock and sending message...'); //#development
            interface.operator.element.executeMethod.Group.clear(self.getId());
        }else{
            dev.log.elementLibrary[self.getType()]('['+self.getAddress()+'].clear -> this group\'s id is missing; will not send message'); //#development
        }
    };
    this.shift = function(elementToShift,newPosition){
        dev.log.elementLibrary[self.getType()]('['+self.getAddress()+'].shift(',elementToShift,newPosition); //#development

        //ensure that moving element is actually a child of this group
            if( !children.includes(elementToShift) ){ return; }

        //shift element
            children.splice(children.indexOf(elementToShift), 1);
            children.splice(newPosition,0,elementToShift);

        //perform shift callback
            if(elementToShift.getCallback('onshift')){elementToShift.getCallback('onshift')(children.indexOf(elementToShift));}

        //communicate with engine for shift
            if(elementToShift.getId() == undefined){
                dev.log.elementLibrary[self.getType()]('['+self.getAddress()+'].shift -> elementToShift\'s id missing, setting up replacement "__onIdReceived" callback'); //#development
                elementToShift.__onIdReceived = function(){
                    dev.log.elementLibrary[self.getType()]('['+self.getAddress()+'].shift -> elementToShift\'s "__onIdReceived" callback ->'); //#development
                    if(self.getId() != undefined){ 
                        dev.log.elementLibrary[self.getType()]('['+self.getAddress()+'].shift -> this group\'s id:',self.getId()); //#development
                        if(children.indexOf(elementToShift) != -1){
                            dev.log.elementLibrary[self.getType()]('['+self.getAddress()+'].shift -> element position:',children.indexOf(elementToShift)); //#development
                            interface.operator.element.executeMethod.Group.replaceWithTheseChildren(self.getId(),children.map(child => child.getId()).filter(id => id!=undefined) );
                        }else{
                            dev.log.elementLibrary[self.getType()]('['+self.getAddress()+'].shift -> this element doesn\'t seem to be relevant anymore; not sending message'); //#development
                        }
                    }else{
                        dev.log.elementLibrary[self.getType()]('['+self.getAddress()+'].shift -> this group\'s id missing; will not send message'); //#development
                    }
                };
            }else{
                dev.log.elementLibrary[self.getType()]('['+self.getAddress()+'].shift -> elementToShift\'s id:',elementToShift.getId()); //#development
                if(self.getId() != undefined){
                    interface.operator.element.executeMethod.Group.shift(self.getId(), elementToShift.getId(), newPosition);
                }else{
                    dev.log.elementLibrary[self.getType()]('['+self.getAddress()+'].shift -> this group\'s id missing; will not send message'); //#development
                }
            }
    };

    this.getElementsUnderPoint = function(x,y){
        dev.log.elementLibrary[self.getType()]('['+self.getAddress()+'].getElementsUnderPoint(',x,y); //#development
        if(self.getId() != undefined){
            return interface.operator.element.executeMethod.Group.getElementsUnderPoint(self.getId(),x,y);
        }
    };

    this.stencil = function(newStencilElement){
        if(newStencilElement == undefined){ return stencilElement; }
        dev.log.elementLibrary[self.getType()]('['+self.getAddress()+'].stencil(',newStencilElement); //#development

        if( !isValidElement(newStencilElement) ){ return false; }

        stencilElement = newStencilElement;

        if(newStencilElement.getId() == undefined){
            dev.log.elementLibrary[self.getType()]('['+self.getAddress()+'].stencil -> newStencilElement\'s id missing; setting up "__onIdReceived" callback..'); //#development
            newStencilElement.__onIdReceived = function(){
                dev.log.elementLibrary[self.getType()]('['+self.getAddress()+'].stencil -> newStencilElement\'s "__onIdReceived" callback, called by '+newStencilElement.__calledBy+', id is: '+newStencilElement.getId()+' ()'); //#development
                if(self.getId() != undefined){
                    dev.log.elementLibrary[self.getType()]('['+self.getAddress()+'].stencil -> sending message...:'); //#development
                    interface.operator.element.executeMethod.Group.stencil(self.getId(), newStencilElement.getId());
                }
            };
        }else{
            if(self.getId() != undefined){
                dev.log.elementLibrary[self.getType()]('['+self.getAddress()+'].stencil -> sending message...:'); //#development
                interface.operator.element.executeMethod.Group.stencil(self.getId(), newStencilElement.getId());
            }else{
                dev.log.elementLibrary[self.getType()]('['+self.getAddress()+'].stencil -> this group\'s id missing; will not send message'); //#development
            }
        }
    };
};