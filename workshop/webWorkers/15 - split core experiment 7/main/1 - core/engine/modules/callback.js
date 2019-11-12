const callback = new function(){
    const self = this; 

    var callbacks = [
        'onmousedown', 'onmouseup', 'onmousemove', 'onmouseenter', 'onmouseleave', 'onwheel', 'onclick', 'ondblclick',
        'onmouseenterelement', 'onmouseleaveelement',
        'onkeydown', 'onkeyup',
    ];
    this.listCallbackTypes = function(){
        return callbacks;
    };

    var elementCallbackStates = {}; 
    callbacks.forEach(callbackType => elementCallbackStates[callbackType] = true);
    this.getElementCallbackState = function(type){
        dev.log.callback('.getElementCallbackState('+type+')'); //#development
        return elementCallbackStates[type];
    };
    this.activateElementCallback = function(type){
        dev.log.callback('.activateElementCallback('+type+')'); //#development
        elementCallbackStates[type] = true;
    };
    this.disactivateElementCallback = function(type){
        dev.log.callback('.disactivateElementCallback('+type+')'); //#development
        elementCallbackStates[type] = false;
    };
    this.activateAllElementCallbacks = function(){ 
        dev.log.callback('.activateAllElementCallbacks()'); //#development
        callbacks.forEach(callback => this.activateElementCallback(callback)); 
    };
    this.disactivateAllElementCallbacks = function(){ 
        dev.log.callback('.disactivateAllElementCallbacks()'); //#development
        callbacks.forEach(callback => this.disactivateElementCallback(callback)); 
    };
    this.activateAllElementCallbacks();

    this.attachCallback = function(element,callbackType){
        dev.log.callback('.attachCallback('+JSON.stringify(element)+','+callbackType+')'); //#development
        element[callbackType] = function(){};
    };
    this.removeCallback = function(element,callbackType){
        dev.log.callback('.removeCallback('+JSON.stringify(element)+','+callbackType+')'); //#development
        element[callbackType] = undefined;
        delete element[callbackType];
    };

    function gatherDetails(event,callback,count){
        dev.log.callback('::gatherDetails('+JSON.stringify(event)+','+callback+','+count+')'); //#development
        //only calculate enough data for what will be needed
        return {
            point: count > 0 ? viewport.adapter.windowPoint2workspacePoint(event.X,event.Y) : undefined,
            elements: count > 3 ? arrangement.getElementsUnderPoint(event.X,event.Y) : undefined,
        };
    }
    this.functions = {};

    //coupling object
        this.coupling = {};

    //default
        for(var a = 0; a < callbacks.length; a++){
            this.coupling[callbacks[a]] = function(callbackName){
                return function(event){
                    dev.log.callback('.coupling.'+callbackName+'('+JSON.stringify(event)+')'); //#development
                    var data = gatherDetails(event,callbackName,self.functions[callbackName].length);
                    self.functions[callbackName]( data.point.x, data.point.y, event, data.elements );
                }
            }(callbacks[a]);
        }

    //special cases
        //canvas onmouseenter / onmouseleave
            this.coupling.onmouseenter = function(event){
                //if appropriate, remove the window scrollbars
                    if(viewport.stopMouseScroll()){ 
                        interface['document.body.style.overflow']('hidden');
                    }
            };
            this.coupling.onmouseleave = function(event){
                //if appropriate, replace the window scrollbars
                    if(viewport.stopMouseScroll()){ 
                        interface['document.body.style.overflow']('');
                    }
            };

        //onmousemove / onmouseenter / onmouseleave
            var elementMouseoverList = [];
            this.coupling.onmousemove = function(event){
                dev.log.callback('.coupling.onmousemove('+JSON.stringify(event)+')'); //#development
                viewport.mousePosition(event.X,event.Y);
                var elementsUnderPoint = arrangement.getElementsUnderPoint(event.X,event.Y);
                dev.log.callback('.coupling.onmousemove -> elementsUnderPoint.length: '+elementsUnderPoint.length); //#development
                var point = viewport.adapter.windowPoint2workspacePoint(event.X,event.Y);
                dev.log.callback('.coupling.onmousemove -> workspace point: '+JSON.stringify(point)); //#development

                //check for onmouseenter / onmouseleave
                    //go through the elementsUnderPoint list, comparing to the element transition list
                        var diff = library.math.getDifferenceOfArrays(elementMouseoverList,elementsUnderPoint);
                        //run both onmouseenterelement and onmouseenterelement, only if there's
                        //  elements to report, providing only the relevant set of elements
                        //elements only on elements list; add to elementMouseoverList
                        //elements only on elementMouseoverList; remove from elementMouseoverList
                        if(elementCallbackStates.onmouseenter){
                            if(diff.b.length > 0){ self.functions.onmouseenterelement( point.x, point.y, event, diff.b); }
                            if(diff.a.length > 0){ self.functions.onmouseleaveelement( point.x, point.y, event, diff.a); }
                        }
                        diff.b.forEach(function(element){ elementMouseoverList.push(element); });
                        diff.a.forEach(function(element){ elementMouseoverList.splice(elementMouseoverList.indexOf(element),1); });

                //perform regular onmousemove actions
                    if(self.functions.onmousemove){
                        self.functions.onmousemove( point.x, point.y, event, elementsUnderPoint );
                    }
            };

        //onwheel
            this.coupling.onwheel = function(event){
                dev.log.callback('.coupling.onwheel('+JSON.stringify(event)+')'); //#development

                if(self.functions.onwheel){
                    var data = gatherDetails(event,'onwheel',self.functions.onwheel.length);
                    self.functions.onwheel( data.point.x, data.point.y, event, data.elements );
                }
            };

        //onkeydown / onkeyup
            ['onkeydown', 'onkeyup'].forEach(callbackName => {
                this.coupling[callbackName] = function(callback){
                    return function(event){
                        dev.log.callback('.coupling.'+callbackName+'('+JSON.stringify(event)+')'); //#development
                        var p = viewport.mousePosition(); event.X = p.x; event.Y = p.y;
                        var point = viewport.adapter.windowPoint2workspacePoint(event.X,event.Y);
                        dev.log.callback('.coupling.'+callbackName+' -> guessed mouse point: '+JSON.stringify(point)); //#development
                
                        if(self.functions[callback]){
                            var data = gatherDetails(event,callback,self.functions[callback].length);
                            self.functions[callback]( point.x, point.y, event, data.elements );
                        }
                    }
                }(callbackName);
            });

        //onmousedown / onmouseup / onclick / ondblclick
            var elementMouseclickList = [];
            this.coupling.onmousedown = function(event){
                dev.log.callback('.coupling.onmousedown('+JSON.stringify(event)+')'); //#development

                var elementsUnderPoint = arrangement.getElementsUnderPoint(event.X,event.Y);
                var workspacePoint = viewport.adapter.windowPoint2workspacePoint(event.X,event.Y);

                //save current elements for use in the onclick part of the onmouseup callback
                    elementMouseclickList = elementsUnderPoint;

                //perform global function
                    if(self.functions.onmousedown){
                        self.functions.onmousedown( workspacePoint.x, workspacePoint.y, event, elementsUnderPoint );
                    }
            };
            this.coupling.onmouseup = function(event){
                dev.log.callback('.coupling.onmouseup('+JSON.stringify(event)+')'); //#development
                    
                //perform global function
                    if(self.functions.onmouseup){
                        var data = gatherDetails(event,'onmouseup',self.functions.onmouseup.length);
                        self.functions.onmouseup( data.point.x, data.point.y, event, data.elements );
                    }
            };
            var recentlyClickedDoubleClickableElementList = [];
            this.coupling.onclick = function(event){
                dev.log.callback('.coupling.onclick('+JSON.stringify(event)+')'); //#development
                if(self.functions.onclick){
                    var data = gatherDetails(event,'onclick',self.functions.onclick.length);
                    data.elements = data.elements.filter( element => elementMouseclickList.includes(element) );
                    recentlyClickedDoubleClickableElementList = data.elements;
                    self.functions.onclick( data.point.x, data.point.y, event, data.elements );
                }
            };
            this.coupling.ondblclick = function(event){
                dev.log.callback('.coupling.ondblclick('+JSON.stringify(event)+')'); //#development
                if(self.functions.ondblclick){
                    var data = gatherDetails(event,'ondblclick',self.functions.ondblclick.length);
                    data.elements = data.elements.filter( element => recentlyClickedDoubleClickableElementList.includes(element) );
                    self.functions.ondblclick( data.point.x, data.point.y, event, data.elements );
                }
            };
};