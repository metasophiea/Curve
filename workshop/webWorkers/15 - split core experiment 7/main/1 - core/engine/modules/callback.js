const callback = new function(){
    const self = this; 

    let callbackActivationMode = 'firstMatch'; //topMostOnly / firstMatch / allMatches
    const callbacks = [
        'onmousedown', 'onmouseup', 'onmousemove', 'onmouseenter', 'onmouseleave', 'onwheel', 'onclick', 'ondblclick',
        'onmouseenterelement', 'onmouseleaveelement',
        'onkeydown', 'onkeyup',
    ];
    function gatherDetails(event){
        dev.log.callback('::gatherDetails('+JSON.stringify(event)+')'); //#development
        return {
            point: viewport.adapter.windowPoint2workspacePoint(event.X,event.Y),
            elements: arrangement.getElementsUnderPoint(event.X,event.Y)
        };
    }
    let currentlyEnteredElement = undefined;
    function activateElementCallback(callbackName, x, y, event, all, relevant){
        switch(callbackActivationMode){
            case 'topMostOnly':
                if(callbackName == 'onmouseenterelement' && all[0] == relevant[0]){
                    self.coupling_out.onmouseleaveelement(x, y, event, {all:all, relevant:[currentlyEnteredElement]});
                    currentlyEnteredElement = relevant[0];
                    self.coupling_out[callbackName](x, y, event, {all:all, relevant:[relevant[0]]});
                }else if(callbackName == 'onmouseenterelement'){
                    //ignored
                }else if(callbackName == 'onmouseleaveelement' && all[0] != relevant[0]){
                    self.coupling_out[callbackName](x, y, event, {all:all, relevant:[relevant[0]]});
                    currentlyEnteredElement = all[0];
                    self.coupling_out.onmouseenterelement(x, y, event, {all:all, relevant:[all[0]]});
                }else if(callbackName == 'onmouseleaveelement'){
                    currentlyEnteredElement = undefined;
                    self.coupling_out[callbackName](x, y, event, {all:all, relevant:[relevant[0]]});
                }else if(all[0] == relevant[0]){
                    self.coupling_out[callbackName](x, y, event, {all:all, relevant:[relevant[0]]});
                }
            break;
            case 'firstMatch':
                    if(callbackName == 'onmouseenterelement'){
                        for(let a = 0; a < all.length; a++){
                            if(all[a][callbackName] != undefined){
                                if(relevant.indexOf(all[a]) >= 0){
                                    self.coupling_out.onmouseleaveelement(x, y, event, {all:all, relevant:[currentlyEnteredElement]});
                                    currentlyEnteredElement = all[a];
                                    self.coupling_out[callbackName](x, y, event, {all:all, relevant:[all[a]]});
                                }
                                break;
                            }
                        }
                    }else if(callbackName == 'onmouseleaveelement'){
                        currentlyEnteredElement = undefined;
                        self.coupling_out[callbackName](x, y, event, {all:all, relevant:[relevant[0]]});
                        for(let a = 0; a < all.length; a++){
                            if(all[a].onmouseenterelement != undefined){
                                currentlyEnteredElement = all[a];
                                self.coupling_out.onmouseenterelement(x, y, event, {all:all, relevant:[all[a]]});
                                break;
                            }
                        }
                    }else{
                        self.coupling_out[callbackName](x, y, event, {all:all, relevant:[relevant[0]]});
                    }
            break;
            case 'allMatches': default:
                self.coupling_out[callbackName](x, y, event, {all:all, relevant:relevant});
            break;
        }
    }

    this.listCallbackTypes = function(){
        return callbacks;
    };
    this.attachCallback = function(element,callbackType){
        dev.log.callback('.attachCallback('+JSON.stringify(element)+','+callbackType+')'); //#development
        element[callbackType] = true;
    };
    this.removeCallback = function(element,callbackType){
        dev.log.callback('.removeCallback('+JSON.stringify(element)+','+callbackType+')'); //#development
        element[callbackType] = undefined;
        delete element[callbackType];
    };
    this.callbackActivationMode = function(mode){
        dev.log.interface('.callback.callbackActivationMode('+mode+')'); //#development
        if(mode==undefined){return callbackActivationMode;}
        callbackActivationMode = mode;

        self.coupling_out.onmouseleaveelement(0, 0, {}, {all:[currentlyEnteredElement], relevant:[currentlyEnteredElement]});
        currentlyEnteredElement = undefined;
    };

    //main callback operation
        this.coupling_in = {};
        this.coupling_out = {};

        //default
            for(let a = 0; a < callbacks.length; a++){
                this.coupling_in[callbacks[a]] = function(callbackName){
                    return function(event){
                        dev.log.callback('.coupling_in.'+callbackName+'('+JSON.stringify(event)+')'); //#development
                        const data = gatherDetails(event);
                        activateElementCallback(callbackName, data.point.x, data.point.y, event, data.elements);
                    }
                }(callbacks[a]);
            }

        //special cases
            //canvas onmouseenter / onmouseleave
                this.coupling_in.onmouseenter = function(event){
                    //if appropriate, remove the window scrollbars
                        if(viewport.stopMouseScroll()){ 
                            interface.setDocumentAttributes(['body.style.overflow'],['hidden']);
                        }
                };
                this.coupling_in.onmouseleave = function(event){
                    //if appropriate, replace the window scrollbars
                        if(viewport.stopMouseScroll()){ 
                            interface.setDocumentAttributes(['body.style.overflow'],['']);
                        }
                };

            //onmousemove / onmouseenter / onmouseleave
                const elementMouseoverList = [];
                this.coupling_in.onmousemove = function(event){
                    dev.log.callback('.coupling_in.onmousemove('+JSON.stringify(event)+')'); //#development
                    viewport.mousePosition(event.X,event.Y);
                    const data = gatherDetails(event);
                    dev.log.callback('.coupling_in.onmousemove -> data.elements.length: '+data.elements.length); //#development
                    dev.log.callback('.coupling_in.onmousemove -> workspace point: '+JSON.stringify(data.point)); //#development

                    //check for onmouseenter / onmouseleave
                        //go through the elementsUnderPoint list, comparing to the element transition list
                            const diff = library.math.getDifferenceOfArrays(elementMouseoverList,data.elements);
                            //run both onmouseenterelement and onmouseenterelement, only if there's
                            //  elements to report, providing only the relevant set of elements
                            //elements only on elements list; add to elementMouseoverList
                            //elements only on elementMouseoverList; remove from elementMouseoverList
                            if(diff.b.length > 0){ activateElementCallback('onmouseenterelement', data.point.x, data.point.y, event, data.elements, diff.b); }
                            if(diff.a.length > 0){ activateElementCallback('onmouseleaveelement', data.point.x, data.point.y, event, data.elements, diff.a); }
                            diff.b.forEach(element => elementMouseoverList.push(element) );
                            diff.a.forEach(element => elementMouseoverList.splice(elementMouseoverList.indexOf(element),1) );

                    activateElementCallback('onmousemove', data.point.x, data.point.y, event, data.elements, data.elements.filter( element => (element.onmousemove != undefined) ) );
                };

            //onwheel
                this.coupling_in.onwheel = function(event){
                    dev.log.callback('.coupling_in.onwheel('+JSON.stringify(event)+')'); //#development
                    const data = gatherDetails(event);
                    activateElementCallback('onwheel', data.point.x, data.point.y, event, data.elements, data.elements.filter( element => (element.onwheel != undefined) ) );
                };

            //onkeydown / onkeyup
                ['onkeydown', 'onkeyup'].forEach(callbackName => {
                    this.coupling_in[callbackName] = function(callback){
                        return function(event){
                            dev.log.callback('.coupling_in.'+callbackName+'('+JSON.stringify(event)+')'); //#development
                            const p = viewport.mousePosition(); event.X = p.x; event.Y = p.y;
                            const data = gatherDetails(event);
                            dev.log.callback('.coupling_in.'+callbackName+' -> guessed mouse point: '+JSON.stringify(data.point)); //#development
                            activateElementCallback(callback, data.point.x, data.point.y, event, data.elements, data.elements.filter( element => (element[callbackName] != undefined) ) );

                        }
                    }(callbackName);
                });

            //onmousedown / onmouseup / onclick / ondblclick
                let elementMouseClickList = [];
                this.coupling_in.onmousedown = function(event){
                    dev.log.callback('.coupling_in.onmousedown('+JSON.stringify(event)+')'); //#development
                    const data = gatherDetails(event);
                    elementMouseClickList = data.elements; //save current elements for use in the onclick callback
                    activateElementCallback('onmousedown', data.point.x, data.point.y, event, data.elements, data.elements.filter( element => (element.onmousedown != undefined) ) );
                };
                this.coupling_in.onmouseup = function(event){
                    dev.log.callback('.coupling_in.onmouseup('+JSON.stringify(event)+')'); //#development
                    const data = gatherDetails(event);
                    activateElementCallback('onmouseup', data.point.x, data.point.y, event, data.elements, data.elements.filter( element => (element.onmouseup != undefined) ) );
                };
                let recentlyClickedDoubleClickableElementList = [];
                this.coupling_in.onclick = function(event){
                    dev.log.callback('.coupling_in.onclick('+JSON.stringify(event)+')'); //#development
                    const data = gatherDetails(event);
                    recentlyClickedDoubleClickableElementList = data.elements.filter( element => (element.ondblclick != undefined && elementMouseClickList.includes(element)) );
                    activateElementCallback('onclick', data.point.x, data.point.y, event, data.elements, data.elements.filter( element => (element.onclick != undefined && elementMouseClickList.includes(element)) ) );
                };
                this.coupling_in.ondblclick = function(event){
                    dev.log.callback('.coupling_in.ondblclick('+JSON.stringify(event)+')'); //#development
                    const data = gatherDetails(event);
                    activateElementCallback('ondblclick', data.point.x, data.point.y, event, data.elements, data.elements.filter( element => (element.ondblclick != undefined && recentlyClickedDoubleClickableElementList.includes(element)) ) );
                };

    this._dump = function(){
        report.info('callback._dump()');
        report.info('render._dump -> this.coupling_in:',this.coupling_in);
        report.info('render._dump -> this.coupling_out:',this.coupling_out);
        report.info('render._dump -> callbackActivationMode:',callbackActivationMode);
        report.info('render._dump -> callbacks:',callbacks);
    };
};