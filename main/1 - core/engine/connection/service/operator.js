//element
    //element library
        communicationModule.function.operator__element__getAvailableElements = self.operator.element.getAvailableElements;
        communicationModule.function.operator__element__getTypeById = self.operator.element.getTypeById;
    //basic management
        communicationModule.function.operator__element__create = self.operator.element.create;
        communicationModule.function.operator__element__delete = self.operator.element.delete;
        communicationModule.function.operator__element__deleteAllCreated = self.operator.element.deleteAllCreated;
    //execute method
        communicationModule.function.operator__element__executeMethod__getElementType = self.operator.element.executeMethod.getElementType;
        communicationModule.function.operator__element__executeMethod__getName = self.operator.element.executeMethod.getName;
        communicationModule.function.operator__element__executeMethod__setName = self.operator.element.executeMethod.setName;
        communicationModule.function.operator__element__executeMethod__getParentId = self.operator.element.executeMethod.getParentId;
        communicationModule.function.operator__element__executeMethod__setX = self.operator.element.executeMethod.setX;
        communicationModule.function.operator__element__executeMethod__setY = self.operator.element.executeMethod.setY;
        communicationModule.function.operator__element__executeMethod__setAngle = self.operator.element.executeMethod.setAngle;
        communicationModule.function.operator__element__executeMethod__setScale = self.operator.element.executeMethod.setScale;
        communicationModule.function.operator__element__executeMethod__getIgnored = self.operator.element.executeMethod.getIgnored;
        communicationModule.function.operator__element__executeMethod__setIgnored = self.operator.element.executeMethod.setIgnored;
        communicationModule.function.operator__element__executeMethod__unifiedAttribute = self.operator.element.executeMethod.unifiedAttribute;
        communicationModule.function.operator__element__executeMethod__getAddress = self.operator.element.executeMethod.getAddress;
        communicationModule.function.operator__element__executeMethod__getAllowComputeExtremities = self.operator.element.executeMethod.getAllowComputeExtremities;
        communicationModule.function.operator__element__executeMethod__setAllowComputeExtremities = self.operator.element.executeMethod.setAllowComputeExtremities;
        communicationModule.function.operator__element__executeMethod__getDotFrame = self.operator.element.executeMethod.getDotFrame;
        communicationModule.function.operator__element__executeMethod__setDotFrame = self.operator.element.executeMethod.setDotFrame;
        communicationModule.function.operator__element__executeMethod__info = self.operator.element.executeMethod.info;
        communicationModule.function.operator__element__executeMethod__dump = self.operator.element.executeMethod.dump;
        //Group
            communicationModule.function.operator__element__executeMethod__Group__setUnifiedAttribute = self.operator.element.executeMethod.Group.setUnifiedAttribute;
            communicationModule.function.operator__element__executeMethod__Group__children = self.operator.element.executeMethod.Group.children;
            communicationModule.function.operator__element__executeMethod__Group__getChildByName = self.operator.element.executeMethod.Group.getChildByName;
            communicationModule.function.operator__element__executeMethod__Group__append = self.operator.element.executeMethod.Group.append;
            communicationModule.function.operator__element__executeMethod__Group__prepend = self.operator.element.executeMethod.Group.prepend;
            communicationModule.function.operator__element__executeMethod__Group__remove = self.operator.element.executeMethod.Group.remove;
            communicationModule.function.operator__element__executeMethod__Group__clear = self.operator.element.executeMethod.Group.clear;
            communicationModule.function.operator__element__executeMethod__Group__shift = self.operator.element.executeMethod.Group.shift;
            communicationModule.function.operator__element__executeMethod__Group__replace_with_these_children = self.operator.element.executeMethod.Group.replace_with_these_children;
            communicationModule.function.operator__element__executeMethod__Group__getElementsUnderPoint = self.operator.element.executeMethod.Group.getElementsUnderPoint;
            communicationModule.function.operator__element__executeMethod__Group__getElementsUnderArea = self.operator.element.executeMethod.Group.getElementsUnderArea;
            communicationModule.function.operator__element__executeMethod__Group__stencil = self.operator.element.executeMethod.Group.stencil;
            communicationModule.function.operator__element__executeMethod__Group__getClipActive = self.operator.element.executeMethod.Group.getClipActive;
            communicationModule.function.operator__element__executeMethod__Group__setClipActive = self.operator.element.executeMethod.Group.setClipActive;
        // //Rectangle
        //     communicationModule.function.operator_element_executeMethod__Rectangle__getWidth = self.operator.element.executeMethod.Rectangle.getWidth;
        //     communicationModule.function.operator_element_executeMethod__Rectangle__setWidth = self.operator.element.executeMethod.Rectangle.setWidth;
        //     communicationModule.function.operator_element_executeMethod__Rectangle__getHeight = self.operator.element.executeMethod.Rectangle.getHeight;
        //     communicationModule.function.operator_element_executeMethod__Rectangle__setHeight = self.operator.element.executeMethod.Rectangle.setHeight;
        //     communicationModule.function.operator_element_executeMethod__Rectangle__getAnchor = self.operator.element.executeMethod.Rectangle.getAnchor;
        //     communicationModule.function.operator_element_executeMethod__Rectangle__setAnchor = self.operator.element.executeMethod.Rectangle.setAnchor;
        //     communicationModule.function.operator_element_executeMethod__Rectangle__getColour = self.operator.element.executeMethod.Rectangle.getColour;
        //     communicationModule.function.operator_element_executeMethod__Rectangle__setColour = self.operator.element.executeMethod.Rectangle.setColour;
        //     communicationModule.function.operator_element_executeMethod__Rectangle__setUnifiedAttribute = self.operator.element.executeMethod.Rectangle.setUnifiedAttribute;

    //misc
        communicationModule.function.operator__element___createSetAppend = self.operator.element.createSetAppend;
        communicationModule.function.operator__element___dump = self.operator.element._dump;

//arrangement
    //root
        communicationModule.function.operator__arrangement__prepend = self.operator.arrangement.prepend;
        communicationModule.function.operator__arrangement__append = self.operator.arrangement.append;
        communicationModule.function.operator__arrangement__remove = self.operator.arrangement.remove;
        communicationModule.function.operator__arrangement__clear = self.operator.arrangement.clear;
    //discovery
        communicationModule.function.operator__arrangement__getElementByAddress = self.operator.arrangement.getElementByAddress;
        communicationModule.function.operator__arrangement__getElementsUnderPoint = self.operator.arrangement.getElementsUnderPoint;
        communicationModule.function.operator__arrangement__getElementsUnderArea = self.operator.arrangement.getElementsUnderArea;
    //misc
        communicationModule.function.operator__arrangement__printTree = self.operator.arrangement.printTree;
        communicationModule.function.operator__arrangement__printSurvey = self.operator.arrangement.printSurvey;
        communicationModule.function.operator__arrangement___dump = self.operator.arrangement._dump;
    
//render
    //canvas and webGL context
        communicationModule.function.operator__render__clearColour = self.operator.render.clearColour;
        communicationModule.function.operator__render__getCanvasSize = self.operator.render.getCanvasSize;
        communicationModule.function.operator__render__adjustCanvasSize = self.operator.render.adjustCanvasSize;
        communicationModule.function.operator__render__adjustCanvasSampleCount = self.operator.render.adjustCanvasSampleCount;
        communicationModule.function.operator__render__refreshCoordinates = self.operator.render.refreshCoordinates;
        communicationModule.function.operator__render__refresh = self.operator.render.refresh;
    //frame rate control
        communicationModule.function.operator__render__activeLimitToFrameRate = self.operator.render.activeLimitToFrameRate;
        communicationModule.function.operator__render__frameRateLimit = self.operator.render.frameRateLimit;
    //actual render
        communicationModule.function.operator__render__frame = self.operator.render.frame;
        communicationModule.function.operator__render__active = self.operator.render.active;
    //misc
        communicationModule.function.operator__render__drawDot = self.operator.render.drawDot;
        communicationModule.function.operator__render___dump = self.operator.render._dump;

//viewport
    //camera position
        communicationModule.function.operator__viewport__position = self.operator.viewport.position;
        communicationModule.function.operator__viewport__scale = self.operator.viewport.scale;
        communicationModule.function.operator__viewport__angle = self.operator.viewport.angle;
        communicationModule.function.operator__viewport__anchor = self.operator.viewport.anchor;
    //mouse interaction
        communicationModule.function.operator__viewport__getElementsUnderPoint = self.operator.viewport.getElementsUnderPoint;
        communicationModule.function.operator__viewport__getElementsUnderArea = self.operator.viewport.getElementsUnderArea;
        communicationModule.function.operator__viewport__stopMouseScroll = self.operator.viewport.stopMouseScroll;
    //misc
        communicationModule.function.operator__viewport__refresh = self.operator.viewport.refresh;
        communicationModule.function.operator__viewport___dump = self.operator.viewport._dump;

//stats
    communicationModule.function.operator__stats__active = self.operator.stats.active;
    communicationModule.function.operator__stats__getReport = self.operator.stats.getReport;
    communicationModule.function.operator__stats__elementRenderDecision_clearData = self.operator.stats.elementRenderDecision_clearData;
    communicationModule.function.operator__stats___dump = self.operator.stats._dump;

//callback
    communicationModule.function.operator__callback__listCallbackTypes = self.operator.callback.listCallbackTypes;
    communicationModule.function.operator__callback__listActivationModes = self.operator.callback.listActivationModes;
    communicationModule.function.operator__callback__attachCallback = self.operator.callback.attachCallback;
    communicationModule.function.operator__callback__removeCallback = self.operator.callback.removeCallback;
    communicationModule.function.operator__callback__callbackActivationMode = self.operator.callback.callbackActivationMode;
    communicationModule.function.operator__callback___dump = self.operator.callback._dump;
    self.operator.callback.listCallbackTypes().forEach(callbackName => { //for accepting the callback signals from the window's canvas
        communicationModule.function['operator__callback__coupling_in__'+callbackName] = function(event){
            self.operator.callback.coupling_in[callbackName](event);
        };
    });




//meta
    communicationModule.delayedFunction.operator__meta__refresh = function(responseFunction){
        self.operator.meta.refresh().then(() => {
            responseFunction();
        });
    };
