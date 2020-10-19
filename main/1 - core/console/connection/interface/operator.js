this.element = new function(){
    //element library
        this.getAvailableElements = function(){
            dev.log.interface('.operator.element.getAvailableElements()'); //#development
            return communicationModule.run_withPromise('operator__element__getAvailableElements');
        };
    //basic management
        this.create = function(type, name){
            dev.log.interface('.operator.element.create(',type, name); //#development
            return communicationModule.run_withPromise('operator__element__create', [type, name]);
        };
        this.delete = function(element_id){
            dev.log.interface('.operator.element.delete(',element_id); //#development
            communicationModule.run_withoutPromise('operator__element__delete', [element_id]);
        };
        this.deleteAllCreated = function(){
            dev.log.interface('.operator.element.deleteAllCreated()'); //#development
            communicationModule.run_withoutPromise('operator__element__deleteAllCreated');
        };
    //get element
        this.getTypeById = function(element_id){
            dev.log.interface('.operator.element.getTypeById(',element_id); //#development
            return communicationModule.run_withPromise('operator__element__getTypeById', [element_id]);
        };
    //execute method
        this.executeMethod = new function(){
            //hierarchy and identity
                this.getElementType = function(id){
                    dev.log.interface('.operator.element.getElementType(',id); //#development
                    communicationModule.run_withPromise('operator__element__executeMethod__getElementType', [id]);
                };
                this.getName = function(id){
                    dev.log.interface('.operator.element.getName(',id); //#development
                    communicationModule.run_withPromise('operator__element__executeMethod__getName', [id]);
                };
                this.setName = function(id, new_name){
                    dev.log.interface('.operator.element.setName(',id, new_name); //#development
                    communicationModule.run_withoutPromise('operator__element__executeMethod__getName', [id, new_name]);
                };
                this.getParentId = function(id){
                    dev.log.interface('.operator.element.getParentId(',id); //#development
                    communicationModule.run_withPromise('operator__element__executeMethod__getParentId', [id]);
                };
            //position
                this.setX = function(id, x){
                    dev.log.interface('.operator.element.setX(',id, x); //#development
                    communicationModule.run_withoutPromise('operator__element__executeMethod__setX', [id, x]);
                };
                this.setY = function(id, y){
                    dev.log.interface('.operator.element.setY(',id, y); //#development
                    communicationModule.run_withoutPromise('operator__element__executeMethod__setY', [id, y]);
                };
                this.setAngle = function(id, angle){
                    dev.log.interface('.operator.element.setAngle(',id, angle); //#development
                    communicationModule.run_withoutPromise('operator__element__executeMethod__setAngle', [id, angle]);
                };
                this.setScale = function(id, scale){
                    dev.log.interface('.operator.element.setScale(',id, scale); //#development
                    communicationModule.run_withoutPromise('operator__element__executeMethod__setScale', [id, scale]);
                };
            //other
                this.getIgnored = function(id){
                    dev.log.interface('.operator.element.getIgnored(',id); //#development
                    return communicationModule.run_withPromise('operator__element__executeMethod__getIgnored', [id]);
                };
                this.setIgnored = function(id, bool){
                    dev.log.interface('.operator.element.setIgnored(',id, bool); //#development
                    communicationModule.run_withoutPromise('operator__element__executeMethod__setIgnored', [id, bool]);
                };
            //universal attribute
                this.unifiedAttribute = function(id,data,transferables){
                    dev.log.interface('.operator.element.unifiedAttribute(',id,data,transferables); //#development
                    communicationModule.run_withoutPromise('operator__element__executeMethod__unifiedAttribute', [id, data], transferables);
                };
            //addressing
                this.getAddress = function(id){
                    dev.log.interface('.operator.element.getAddress(',id); //#development
                    return communicationModule.run_withPromise('operator__element__executeMethod__getAddress', [id]);
                };
            //extremities
                this.getAllowComputeExtremities = function(id){
                    dev.log.interface('.operator.element.getAllowComputeExtremities(',id); //#development
                    return communicationModule.run_withPromise('operator__element__executeMethod__getAllowComputeExtremities', [id]);
                };
                this.setAllowComputeExtremities = function(id, bool){
                    dev.log.interface('.operator.element.setAllowComputeExtremities(',id, bool); //#development
                    communicationModule.run_withoutPromise('operator__element__executeMethod__setAllowComputeExtremities', [id, bool]);
                };
            //render
                this.getDotFrame = function(id){
                    dev.log.interface('.operator.element.getDotFrame(',id); //#development
                    return communicationModule.run_withPromise('operator__element__executeMethod__getDotFrame', [id]);
                };
                this.setDotFrame = function(id, bool){
                    dev.log.interface('.operator.element.setDotFrame(',id, bool); //#development
                    communicationModule.run_withoutPromise('operator__element__executeMethod__setDotFrame', [id, bool]);
                };
            //info/dump
                this.info = function(id){
                    dev.log.interface('.operator.element.info(',id); //#development
                    return communicationModule.run_withPromise('operator__element__executeMethod__info', [id]);
                };
                this.dump = function(id){
                    dev.log.interface('.operator.element.dump(',id); //#development
                    communicationModule.run_withoutPromise('operator__element__executeMethod__dump', [id]);
                };
            this.Group = new function(){
                this.setUnifiedAttribute = function(id, x, y, angle, scale, heed_camera){
                    dev.log.interface('.operator.element.Group.setUnifiedAttribute(',id, x, y, angle, scale, heed_camera); //#development
                    communicationModule.run_withoutPromise('operator__element__executeMethod__Group__setUnifiedAttribute', [id, x, y, angle, scale, heed_camera]);
                };

                this.children = function(id){
                    dev.log.interface('.operator.element.Group.children(',id); //#development
                    return communicationModule.run_withPromise('operator__element__executeMethod__Group__children', [id]);
                };
                this.getChildByName = function(id, name){
                    dev.log.interface('.operator.element.Group.getChildByName(',id, name); //#development
                    return communicationModule.run_withPromise('operator__element__executeMethod__Group__getChildByName', [id, name]);
                };

                this.append = function(parent_id, child_id){
                    dev.log.interface('.operator.element.Group.append(',parent_id, child_id); //#development
                    communicationModule.run_withoutPromise('operator__element__executeMethod__Group__append', [parent_id, child_id]);
                };
                this.prepend = function(parent_id, child_id){
                    dev.log.interface('.operator.element.Group.prepend(',parent_id, child_id); //#development
                    communicationModule.run_withoutPromise('operator__element__executeMethod__Group__prepend', [parent_id, child_id]);
                };
                this.remove = function(parent_id, child_id){
                    dev.log.interface('.operator.element.Group.remove(',parent_id, child_id); //#development
                    communicationModule.run_withoutPromise('operator__element__executeMethod__Group__remove', [parent_id, child_id]);
                };
                this.clear = function(parent_id){
                    dev.log.interface('.operator.element.Group.clear(',parent_id); //#development
                    communicationModule.run_withoutPromise('operator__element__executeMethod__Group__clear', [parent_id]);
                };
                this.shift = function(parent_id, child_id, new_position){
                    dev.log.interface('.operator.element.Group.shift(',parent_id, child_id, new_position); //#development
                    communicationModule.run_withoutPromise('operator__element__executeMethod__Group__shift', [parent_id, child_id, new_position]);
                };
                this.replaceWithTheseChildren = function(id, new_elements){
                    dev.log.interface('.operator.element.Group.replaceWithTheseChildren(',id, new_elements); //#development
                    communicationModule.run_withoutPromise('operator__element__executeMethod__Group__replace_with_these_children', [id, new_elements]);
                };

                this.getElementsUnderPoint = function(id, x, y){
                    dev.log.interface('.operator.element.Group.getElementsUnderPoint(',id, x, y); //#development
                    return communicationModule.run_withPromise('operator__element__executeMethod__Group__getElementsUnderPoint', [id, x, y]);
                };
                this.getElementsUnderArea = function(id, points){
                    dev.log.interface('.operator.element.Group.getElementsUnderArea(',id, points); //#development
                    return communicationModule.run_withPromise('operator__element__executeMethod__Group__getElementsUnderArea', [id, points]);
                };

                this.stencil = function(id, stencil_id){
                    dev.log.interface('.operator.element.Group.stencil(',id, stencil_id); //#development
                    communicationModule.run_withoutPromise('operator__element__executeMethod__Group__stencil', [id, stencil_id]);
                };
                this.getClipActive = function(id){
                    dev.log.interface('.operator.element.Group.getClipActive(',id); //#development
                    return communicationModule.run_withPromise('operator__element__executeMethod__Group__getClipActive', [id]);
                };
                this.setClipActive = function(id, bool){
                    dev.log.interface('.operator.element.Group.setClipActive(',id, bool); //#development
                    communicationModule.run_withoutPromise('operator__element__executeMethod__Group__setClipActive', [id, bool]);
                };
            };
            // this.Rectangle = new function(){
            //     this.getWidth = function(id){
            //         dev.log.interface('.operator.element.Rectangle.getWidth(',id); //#development
            //         return communicationModule.run_withPromise('operator__element__executeMethod__Rectangle__getWidth', [id]);
            //     };
            //     this.setWidth = function(id, width){
            //         dev.log.interface('.operator.element.Rectangle.setWidth(',id, width); //#development
            //         communicationModule.run_withoutPromise('operator__element__executeMethod__Rectangle__setWidth', [id, width]);
            //     };
            //     this.getHeight = function(id){
            //         dev.log.interface('.operator.element.Rectangle.getHeight(',id); //#development
            //         return communicationModule.run_withPromise('operator__element__executeMethod__Rectangle__getHeight', [id]);
            //     };
            //     this.setHeight = function(id, height){
            //         dev.log.interface('.operator.element.Rectangle.setHeight(',id, height); //#development
            //         communicationModule.run_withoutPromise('operator__element__executeMethod__Rectangle__setHeight', [id, height]);
            //     };
            //     this.getAnchor = function(id){
            //         dev.log.interface('.operator.element.Rectangle.getAnchor(',id); //#development
            //         return communicationModule.run_withPromise('operator__element__executeMethod__Rectangle__getAnchor', [id]);
            //     };
            //     this.setAnchor = function(id, x, y){
            //         dev.log.interface('.operator.element.Rectangle.setAnchor(',id, x, y); //#development
            //         communicationModule.run_withoutPromise('operator__element__executeMethod__Rectangle__setAnchor', [id, x, y]);
            //     };
            //     this.getColour = function(id){
            //         dev.log.interface('.operator.element.Rectangle.getColour(',id); //#development
            //         return communicationModule.run_withPromise('operator__element__executeMethod__Rectangle__getColour', [id]);
            //     };
            //     this.setColour = function(id, r, g, b, a){
            //         dev.log.interface('.operator.element.Rectangle.setColour(',id, r, g, b, a); //#development
            //         communicationModule.run_withoutPromise('operator__element__executeMethod__Rectangle__setColour', [id, r, g, b, a]);
            //     };

            //     this.setUnifiedAttribute = function(id, x, y, angle, scale, width, height, anchor_x, anchor_y, colour_r, colour_g, colour_b, colour_a){
            //         dev.log.interface('.operator.element.Rectangle.setUnifiedAttribute(',id, x, y, angle, scale, width, height, anchor_x, anchor_y, colour_r, colour_g, colour_b, colour_a); //#development
            //         communicationModule.run_withoutPromise('operator__element__executeMethod__Rectangle__setUnifiedAttribute', [id, x, y, angle, scale, width, height, anchor_x, anchor_y, colour_r, colour_g, colour_b, colour_a]);
            //     };
            // };
        };
    //misc
        this.createSetAppend = function(type, name, data, group_id){
            return communicationModule.run_withPromise('operator__element___createSetAppend', [type, name, data, group_id]);
        }
        this._dump = function(){
            communicationModule.run_withoutPromise('operator__element___dump');
        };
};

this.arrangement = new function(){
    //root
        this.prepend = function(element_id){
            dev.log.interface('.operator.arrangement.prepend(',element_id); //#development
            communicationModule.run_withoutPromise('operator__arrangement__prepend', [element_id]);
        };
        this.append = function(element_id){
            dev.log.interface('.operator.arrangement.append(',element_id); //#development
            communicationModule.run_withoutPromise('operator__arrangement__append', [element_id]);
        };
        this.remove = function(element_id){
            dev.log.interface('.operator.arrangement.remove(',element_id); //#development
            communicationModule.run_withoutPromise('operator__arrangement__remove', [element_id]);
        };
        this.clear = function(){
            dev.log.interface('.operator.arrangement.clear()'); //#development
            communicationModule.run_withoutPromise('operator__arrangement__clear');
        };
    //discovery
        this.getElementByAddress = function(address){
            dev.log.interface('.operator.arrangement.getElementByAddress(',address); //#development
            return communicationModule.run_withPromise('operator__arrangement__getElementByAddress', [address]);
        };
        this.getElementsUnderPoint = function(x,y){
            dev.log.interface('.operator.arrangement.getElementsUnderPoint(',x,y); //#development
            return communicationModule.run_withPromise('operator__arrangement__getElementsUnderPoint', [x,y]);
        };
        this.getElementsUnderArea = function(points){
            dev.log.interface('.operator.arrangement.getElementsUnderArea(',points); //#development
            return communicationModule.run_withPromise('operator__arrangement__getElementsUnderArea', [points]);
        };
    //misc
        this.printTree = function(mode){
            dev.log.interface('.operator.arrangement.printTree(',mode); //#development
            communicationModule.run_withoutPromise('operator__arrangement__printTree', [mode]);
        };
        this.printSurvey = function(){
            dev.log.interface('.operator.arrangement.printSurvey()'); //#development
            communicationModule.run_withoutPromise('operator__arrangement__printSurvey');
        };
        this._dump = function(){
            dev.log.interface('.operator.arrangement._dump()'); //#development
            communicationModule.run_withoutPromise('operator__arrangement___dump');
        };
};

this.render = new function(){
    //canvas and webGL context
        this.clearColour = function(colour){
            dev.log.interface('.operator.render.clearColour(',colour); //#development
            communicationModule.run_withoutPromise('operator__render__clearColour', [colour]);
        };
        this.getCanvasSize = function(){
            dev.log.interface('.operator.render.getCanvasSize()'); //#development
            return communicationModule.run_withPromise('operator__render__getCanvasSize', undefined);
        };
        this.adjustCanvasSize = function(newWidth, newHeight){
            dev.log.interface('.operator.render.adjustCanvasSize(',newWidth, newHeight); //#development
            communicationModule.run_withoutPromise('operator__render__adjustCanvasSize', [newWidth, newHeight]);
        };
        this.adjustCanvasSampleCount = function(newSampleCount){
            dev.log.interface('.operator.render.adjustCanvasSampleCount(',newSampleCount); //#development
            communicationModule.run_withoutPromise('operator__render__adjustCanvasSampleCount', [newSampleCount]);
        };
        this.refreshCoordinates = function(){
            dev.log.interface('.operator.render.refreshCoordinates()'); //#development
            communicationModule.run_withoutPromise('operator__render__refreshCoordinates');
        };
        this.refresh = function(){
            dev.log.interface('.operator.render.refresh()'); //#development
            communicationModule.run_withoutPromise('operator__render__refresh');
        };
    //frame rate control
        this.activeLimitToFrameRate = function(a){
            dev.log.interface('.operator.render.activeLimitToFrameRate(',a); //#development
            communicationModule.run_withoutPromise('operator__render__activeLimitToFrameRate', [a]);
        };
        this.frameRateLimit = function(a){
            dev.log.interface('.operator.render.frameRateLimit(',a); //#development
            communicationModule.run_withoutPromise('operator__render__frameRateLimit', [a]);
        };
    //actual render
        this.frame = function(noClear){
            dev.log.interface('.operator.render.frame(',noClear); //#development
            communicationModule.run_withoutPromise('operator__render__frame', [noClear]);
        };
        this.active = function(bool){
            dev.log.interface('.operator.render.active(',bool); //#development
            communicationModule.run_withoutPromise('operator__render__active', [bool]);
        };
    //misc
        this.drawDot = function(x,y,r,colour){
            dev.log.interface('.operator.render.drawDot(',x,y,r,colour); //#development
            communicationModule.run_withoutPromise('operator__render__drawDot', [x,y,r,colour]);
        };
        this._dump = function(){
            dev.log.interface('.operator.render._dump()'); //#development
            communicationModule.run_withoutPromise('operator__render___dump');
        };
}

this.viewport = new function(){
    //camera position
        this.position = function(x,y){
            dev.log.interface('.operator.viewport.position(',x,y); //#development
            communicationModule.run_withoutPromise('operator__viewport__position', [x,y]);
        };
        this.scale = function(s){
            dev.log.interface('.operator.viewport.scale(',s); //#development
            communicationModule.run_withoutPromise('operator__viewport__scale', [s]);
        };
        this.angle = function(a){
            dev.log.interface('.operator.viewport.angle(',a); //#development
            communicationModule.run_withoutPromise('operator__viewport__angle', [a]);
        };
        this.anchor = function(x,y){
            dev.log.interface('.operator.viewport.anchor(',x,y); //#development
            communicationModule.run_withoutPromise('operator__viewport__anchor', [x,y]);
        };

    //mouse interaction
        this.getElementsUnderPoint = function(x,y){
            dev.log.interface('.operator.viewport.getElementsUnderPoint(',x,y); //#development
            return communicationModule.run_withPromise('operator__viewport__getElementsUnderPoint', [x,y]);
        };
        this.getElementsUnderArea = function(points){
            dev.log.interface('.operator.viewport.getElementsUnderArea(',points); //#development
            return communicationModule.run_withPromise('operator__viewport__getElementsUnderArea', [points]);
        };
        this.stopMouseScroll = function(bool){
            dev.log.interface('.operator.viewport.stopMouseScroll(',bool); //#development
            communicationModule.run_withoutPromise('operator__viewport__stopMouseScroll', [bool]);
        };

    //misc
        this.refresh = function(){
            dev.log.interface('.operator.viewport.refresh()'); //#development
            communicationModule.run_withoutPromise('operator__viewport___refresh');
        };
        this._dump = function(){
            dev.log.interface('.operator.viewport._dump()'); //#development
            communicationModule.run_withoutPromise('operator__viewport___dump');
        };
};

this.stats = new function(){
    this.active = function(bool){
        dev.log.interface('.operator.stats.active(',bool); //#development
        communicationModule.run_withoutPromise('operator__stats__active', [bool]);
    };
    this.getReport = function(){
        dev.log.interface('.operator.stats.getReport()'); //#development
        return communicationModule.run_withPromise('operator__stats__getReport');
    };
};

this.callback = new function(){
    this.listCallbackTypes = function(){
        dev.log.interface('.operator.callback.listCallbackTypes()'); //#development
        return communicationModule.run_withPromise('operator__callback__listCallbackTypes');
    };
    this.listActivationModes = function(){
        dev.log.interface('.operator.callback.listActivationModes()'); //#development
        return communicationModule.run_withPromise('operator__callback__listActivationModes');
    };
    this.attachCallback = function(id, callbackType){
        dev.log.interface('.operator.callback.attachCallback(',id, callbackType); //#development
        communicationModule.run_withoutPromise('operator__callback__attachCallback', [id, callbackType]);
    };
    this.removeCallback = function(id, callbackType){
        dev.log.interface('.operator.callback.removeCallback(',id, callbackType); //#development
        communicationModule.run_withoutPromise('operator__callback__removeCallback', [id, callbackType]);
    };
    this.callbackActivationMode = function(mode){
        dev.log.interface('.operator.callback.callbackActivationMode(',mode); //#development
        communicationModule.run_withoutPromise('operator__callback__callbackActivationMode', [mode]);
    };
    this._dump = function(){
        dev.log.interface('.operator.callback._dump()'); //#development
        communicationModule.run_withoutPromise('operator__callback___dump');
    };
};

this.meta = new function(){
    this.refresh = function(){
        return communicationModule.run_withPromise('operator__meta__refresh');
    };
};