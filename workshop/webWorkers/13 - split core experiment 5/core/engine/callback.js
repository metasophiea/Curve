const callback = new function(){
    const self = this; 

    var callbacks = [
        'onmousedown', 'onmouseup', 'onmousemove', 'onmouseenter', 'onmouseleave', 'onwheel', 'onclick', 'ondblclick',
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

    function gatherDetails(event,callback,count){
        dev.log.callback('::gatherDetails('+JSON.stringify(event)+','+callback+','+count+')'); //#development
        //only calculate enough data for what will be needed
        return {
            point: count > 0 ? viewport.adapter.windowPoint2workspacePoint(event.X,event.Y) : undefined,
            elements: count > 3 ? arrangement.getElementsUnderPoint(event.X,event.Y).filter(a => a[callback]!=undefined) : undefined,
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
                    if( !self.functions[callbackName] ){return;}

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
                    //get all elements under point that have onmousemove, onmouseenter or onmouseleave callbacks
                        var elements = elementsUnderPoint.filter(element => element.onmousemove!=undefined || element.onmouseenter!=undefined || element.onmouseleave!=undefined);
                    //run all onmousemove callbacks for elements
                        if(elementCallbackStates.onmousemove){
                            elements.forEach(element => { if(element.onmousemove){element.onmousemove( point.x, point.y, event );} });
                        }
                    //go through this list, comparing to the element transition list
                        //elements only on elements list; run onmouseenter and add to elementMouseoverList
                        //elements only on elementMouseoverList; run onmouseleave and remove from elementMouseoverList
                        var diff = library.math.getDifferenceOfArrays(elementMouseoverList,elements);
                        diff.b.forEach(function(element){
                            if(elementCallbackStates.onmouseenter && element.onmouseenter){element.onmouseenter( point.x, point.y, event );}
                            elementMouseoverList.push(element);
                        });
                        diff.a.forEach(function(element){
                            if(elementCallbackStates.onmouseleave && element.onmouseleave){element.onmouseleave( point.x, point.y, event );}
                            elementMouseoverList.splice(elementMouseoverList.indexOf(element),1);
                        });

                //perform regular onmousemove actions
                    if(self.functions.onmousemove){
                        self.functions.onmousemove( point.x, point.y, event, elementsUnderPoint.filter(element => element.onmousemove!=undefined) );
                    }
            };

        //onwheel
            this.coupling.onwheel = function(event){
                dev.log.callback('.coupling.onwheel('+JSON.stringify(event)+')'); //#development

                if(elementCallbackStates.onwheel){
                    var point = viewport.adapter.windowPoint2workspacePoint(event.X,event.Y);
                    arrangement.getElementsUnderPoint(event.X,event.Y).filter(element => element.onwheel!=undefined).forEach(element => { element.onwheel(point.x,point.y,event); });
                }

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

                        if(elementCallbackStates[callback]){
                            arrangement.getElementsUnderPoint(event.X,event.Y).filter(element => element[callback]!=undefined).forEach(element => { element[callback](point.x,point.y,event); });
                        }
                
                        if(self.functions[callback]){
                            var data = gatherDetails(event,callback,self.functions[callback].length);
                            self.functions[callback]( point.x, point.y, event, data.elements );
                        }
                    }
                }(callbackName);
            });

        //onmousedown / onmouseup / onclick / ondblclick
            var elementMouseclickList = [];
            var doubleClickCounter = 0;
            this.coupling.onmousedown = function(event){
                dev.log.callback('.coupling.onmousedown('+JSON.stringify(event)+')'); //#development
                if(viewport.clickVisibility()){ render.drawDot(event.offsetX,event.offsetY); }

                var elementsUnderPoint = arrangement.getElementsUnderPoint(event.X,event.Y);
                var workspacePoint = viewport.adapter.windowPoint2workspacePoint(event.X,event.Y);

                //save current elements for use in the onclick part of the onmouseup callback
                    elementMouseclickList = elementsUnderPoint.filter(element => element.onclick!=undefined);

                //activate the onmousedown callback for all the elements under this point
                    if(elementCallbackStates.onmousedown){
                        elementsUnderPoint.filter(element => element.onmousedown!=undefined).forEach(element => { 
                            if( element.onmousedown ){ element.onmousedown(workspacePoint.x,workspacePoint.y,event); }
                        });
                    }

                //perform global function
                    if(self.functions.onmousedown){
                        self.functions.onmousedown( workspacePoint.x, workspacePoint.y, event, elementsUnderPoint.filter(element => element.onmousedown!=undefined) );
                    }
            };
            this.coupling.onmouseup = function(event){
                dev.log.callback('.coupling.onmouseup('+JSON.stringify(event)+')'); //#development
                var point = viewport.adapter.windowPoint2workspacePoint(event.X,event.Y);

                //run callbacks for all elements with the onmouseup callback
                    if(elementCallbackStates.onmouseup){
                        arrangement.getElementsUnderPoint(event.X,event.Y).filter(element => element.onmouseup!=undefined).forEach(element => { element.onmouseup( point.x, point.y, event ); });
                    };

                //for the elements under the mouse that are also on the elementMouseclickList, activate their "onclick" callback
                    if(elementCallbackStates.onclick){
                        arrangement.getElementsUnderPoint(event.X,event.Y).filter(element => element.onclick!=undefined).forEach(element => { 
                            if( elementMouseclickList.includes(element) && element.onclick ){ element.onclick( point.x, point.y, event ); } 
                        });
                    }

                //for the elements under the mouse that are also on the elementMouseclickList, activate their "ondblclick" callback, if appropriate
                    if(elementCallbackStates.ondblclick){
                        doubleClickCounter++;
                        setTimeout(function(){doubleClickCounter=0;},500);
                        if(doubleClickCounter >= 2){
                            arrangement.getElementsUnderPoint(event.X,event.Y).filter(element => element.ondblclick!=undefined).forEach(element => { 
                                if( elementMouseclickList.includes(element) && element.ondblclick ){ element.ondblclick( point.x, point.y, event ); } 
                            });
                            doubleClickCounter = 0;
                        }
                    }
                    
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
                    recentlyClickedDoubleClickableElementList = gatherDetails(event,'ondblclick',self.functions.onclick.length).elements;
                    var data = gatherDetails(event,'onclick',self.functions.onclick.length);
                    data.elements = data.elements.filter( element => elementMouseclickList.includes(element) );
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