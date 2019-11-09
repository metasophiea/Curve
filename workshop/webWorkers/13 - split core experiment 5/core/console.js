const dev = {
    element:{active:true,fontStyle:'color:rgb(161, 145, 80); font-style:italic;'},
    elementLibrary:{active:true,fontStyle:'color:rgb(129, 80, 161); font-style:italic;'},
    arrangement:{active:true,fontStyle:'color:rgb(80, 161, 141); font-style:italic;'},
    render:{active:true,fontStyle:'color:rgb(161, 84, 80); font-style:italic;'},
    stats:{active:true,fontStyle:''},
    log:function(section){ 
        if(dev[section].active){
            console.log('%c'+'core_engine.'+section+(new Array(...arguments).slice(1).join(' ')),dev[section].fontStyle );
        }
    },
};

const __canvasPrefix = 'core';
const canvasElement = document.getElementById('theCanvas');
canvasElement.setAttribute('tabIndex',1);

{{include:communicationModule.js}}
const communicationModule = new communicationModuleMaker(core_engine,'core_console');
communicationModule.function.ready = function(){
    if(core.ready != undefined){core.ready();}
};

//communicationModule functions
    communicationModule.function.printToScreen = function(imageData){
        canvasElement.getContext("bitmaprenderer").transferFromImageBitmap(imageData);
    };
    communicationModule.function['document.body.style.overflow'] = function(state){
        if(state == undefined){ return document.body.style.overflow; }
        document.body.style.overflow = state;
    };
    communicationModule.function['window.devicePixelRatio'] = function(state){
        if(state == undefined){ return window.devicePixelRatio; }
        window.devicePixelRatio = state;
    };
    communicationModule.function['setCanvasAttributes'] = function(attributes=[]){
        attributes.forEach(attribute => {
            canvasElement[attribute.name] = attribute.value;
        });
    };
    communicationModule.function['getCanvasAttributes'] = function(attributeNames,prefixActiveArray=[]){
        return attributeNames.map((name,index) => {
            return canvasElement.getAttribute((prefixActiveArray[index]?__canvasPrefix:'')+name);
        });
    };
    communicationModule.function['getCanvasParentAttributes'] = function(attributeNames,prefixActiveArray=[]){
        return attributeNames.map((name,index) => {
            return canvasElement.parentElement[(prefixActiveArray[index]?__canvasPrefix:'')+name];
        });
    };











    this.ready = function(){};
//element
    this.element = new function(){
        this.getAvailableElements = function(){
            return new Promise((resolve, reject) => {
                communicationModule.run('element.getAvailableElements',[],resolve);
            });
        };
        this.getCreatedElements = function(){
            return new Promise((resolve, reject) => {
                communicationModule.run('element.getCreatedElements',[],resolve);
            });
        };
        this.create = function(type,name){
            return new Promise((resolve, reject) => {
                communicationModule.run('element.create',[type,name],resolve);
            });
        };
        this.delete = function(id){
            communicationModule.run('element.delete',[id],resolve);
        };
        this.deleteAllCreated = function(){
            communicationModule.run('element.deleteAllCreated',[],resolve);
        };
        this.getTypeById = function(id){
            return new Promise((resolve, reject) => {
                communicationModule.run('element.getTypeById',[id],resolve);
            });
        };
        this.executeMethod = function(id,method,argumentList=[]){
            return new Promise((resolve, reject) => {
                communicationModule.run('element.executeMethod',[id,method,argumentList],resolve);
            });
        };
        this.boatload_executeMethod = new function(){
            let containers = [];
            this.load = function(container){
                containers.push(container);
            };
            this.ship = function(){
                communicationModule.run('element.boatload_executeMethod',[containers]);
                containers = [];
            };
        };

        this._dump = function(){
            communicationModule.run('element._dump');
        };
    };

//arrangement
    this.arrangement = new function(){
        this.new = function(){
            communicationModule.run('arrangement.new');
        };
        this.prepend = function(id){
            communicationModule.run('arrangement.prepend',[id]);
        };
        this.append = function(id){
            communicationModule.run('arrangement.append',[id]);
        };
        this.remove = function(id){
            communicationModule.run('arrangement.remove',[id]);
        };
        this.clear = function(){
            communicationModule.run('arrangement.clear');
        };
        this.getElementByAddress = function(address){
            return new Promise((resolve, reject) => {
                communicationModule.run('arrangement.getElementByAddress',[address],resolve);
            });
        };
        this.getElementsUnderPoint = function(x,y){
            return new Promise((resolve, reject) => {
                communicationModule.run('arrangement.getElementsUnderPoint',[x,y],resolve);
            });
        };
        this.getElementsUnderArea = function(points){
            return new Promise((resolve, reject) => {
                communicationModule.run('arrangement.getElementsUnderArea',[points],resolve);
            });
        };
        this.printTree = function(mode){
            communicationModule.run('arrangement.printTree',[mode]);
        };
        this._dump = function(){
            communicationModule.run('arrangement._dump');
        };
    };
    
//render
    this.render = new function(){
        this.clearColour = function(colour){
            return new Promise((resolve, reject) => {
                communicationModule.run('render.clearColour',[colour],resolve);
            });
        };
        this.adjustCanvasSize = function(newWidth, newHeight){
            communicationModule.run('render.adjustCanvasSize',[newWidth, newHeight]);
        };
        this.refreshCoordinates = function(){
            communicationModule.run('render.refreshCoordinates',[]);
        };
        this.refresh = function(){
            communicationModule.run('render.refresh',[]);
        };
        this.activeLimitToFrameRate = function(active){
            return new Promise((resolve, reject) => {
                communicationModule.run('render.activeLimitToFrameRate',[active],resolve);
            });
        };
        this.frameRateLimit = function(rate){
            return new Promise((resolve, reject) => {
                communicationModule.run('render.frameRateLimit',[rate],resolve);
            });
        };
        this.frame = function(){
            communicationModule.run('render.frame',[]);
        };
        this.active = function(active){
            return new Promise((resolve, reject) => {
                communicationModule.run('render.active',[active],resolve);
            });
        };
        this.getCanvasDimensions = function(){
            return new Promise((resolve, reject) => {
                communicationModule.run('render.getCanvasDimensions',[],resolve);
            });
        };
        this.drawDot = function(x,y,r,colour){
            communicationModule.run('render.drawDot',[x,y,r,colour]);
        };
        this._dump = function(){
            communicationModule.run('render._dump',[]);
        };
    };

//viewport
    this.viewport = new function(){
        this.position = function(x,y){
            return new Promise((resolve, reject) => {
                communicationModule.run('viewport.position',[x,y],resolve);
            });
        };
        this.scale = function(s){
            return new Promise((resolve, reject) => {
                communicationModule.run('viewport.scale',[s],resolve);
            });
        };
        this.angle = function(a){
            return new Promise((resolve, reject) => {
                communicationModule.run('viewport.angle',[a],resolve);
            });
        };
        this.getElementUnderCanvasPoint = function(x,y){
            return new Promise((resolve, reject) => {
                communicationModule.run('viewport.getElementUnderCanvasPoint',[x,y],resolve);
            });
        };
        this.getElementsUnderCanvasArea = function(points){
            return new Promise((resolve, reject) => {
                communicationModule.run('viewport.getElementsUnderCanvasArea',[points],resolve);
            });
        };
        this.calculateViewportExtremities = function(){
            communicationModule.run('viewport.calculateViewportExtremities',[]);
        };
        this.refresh = function(){
            communicationModule.run('viewport.refresh',[]);
        };
        this.getBoundingBox = function(){
            return new Promise((resolve, reject) => {
                communicationModule.run('viewport.getBoundingBox',[],resolve);
            });
        };
        this.mousePosition = function(x,y){
            return new Promise((resolve, reject) => {
                communicationModule.run('viewport.mousePosition',[x,y],resolve);
            });
        };
        this.stopMouseScroll = function(bool){
            return new Promise((resolve, reject) => {
                communicationModule.run('viewport.stopMouseScroll',[bool],resolve);
            });
        };
        this.clickVisibility = function(bool){
            return new Promise((resolve, reject) => {
                communicationModule.run('viewport.clickVisibility',[bool],resolve);
            });
        };
        this.getHeight = function(){
            return new Promise((resolve, reject) => {
                communicationModule.run('viewport.getHeight',[],resolve);
            });
        };
        this.getWidth = function(){
            return new Promise((resolve, reject) => {
                communicationModule.run('viewport.getWidth',[],resolve);
            });
        };
        this._dump = function(){
            communicationModule.run('viewport._dump',[]);
        };

        this.onCameraAdjust = function(state){};
        communicationModule.function['viewport.onCameraAdjust'] = this.onCameraAdjust;
    };

//stats
    this.stats = new function(){
        this.active = function(active){
            return new Promise((resolve, reject) => {
                communicationModule.run('stats.active',[active],resolve);
            });
        };
        this.getReport = function(){
            return new Promise((resolve, reject) => {
                communicationModule.run('stats.getReport',[],resolve);
            });
        };
    };

//callback
    this.callback = new function(){
        this.listCallbackTypes = function(){
            return new Promise((resolve, reject) => {
                communicationModule.run('callback.listCallbackTypes',[],resolve);
            });
        };
        this.getShapeCallbackState = function(type){
            return new Promise((resolve, reject) => {
                communicationModule.run('callback.getShapeCallbackState',[type],resolve);
            });
        };
        this.activateShapeCallback = function(type){
            communicationModule.run('callback.activateShapeCallback',[type],resolve);
        };
        this.disactivateShapeCallback = function(type){
            communicationModule.run('callback.disactivateShapeCallback',[type],resolve);
        };
        this.activateAllShapeCallbacks = function(){
            communicationModule.run('callback.activateAllShapeCallbacks',[],resolve);
        };
        this.disactivateAllShapeCallbacks = function(){
            communicationModule.run('callback.disactivateAllShapeCallbacks',[],resolve);
        };

        this.listCallbackTypes().then(callbackNames => {
            callbackNames.forEach(callbackName => {
                canvasElement[callbackName] = function(event){
                    communicationModule.run('callback.coupling.'+callbackName,[{X:event.offsetX, Y:event.offsetY}]);
                };
            });
        });
    };