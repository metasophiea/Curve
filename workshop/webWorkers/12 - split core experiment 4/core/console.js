const dev = {
    shape:{active:true,fontStyle:'color:rgb(161, 145, 80); font-style:italic;'},
    arrangement:{active:true,fontStyle:'color:rgb(80, 161, 141); font-style:italic;'},
    render:{active:true,fontStyle:'color:rgb(161, 84, 80); font-style:italic;'},
    viewport:{active:true,fontStyle:'color:rgb(80, 134, 161); font-style:italic;'},
    stats:{active:true,fontStyle:''},
    log:function(section){ 
        if(dev[section].active){
            console.log('%c'+'core.'+section+(new Array(...arguments).slice(1).join(' ')),dev[section].fontStyle );
        }
    },
};

const canvasElement = document.getElementById('theCanvas');

{{include:communicationModule.js}}
const communicationModule = new communicationModuleMaker(core_engine,'core_console');

//communicationModule functions
    communicationModule.function.printToScreen = function(imageData){
        canvasElement.getContext("bitmaprenderer").transferFromImageBitmap(imageData);
    };

//interface
    this.ready = function(){
        return new Promise(function(resolve, reject) { communicationModule.run('ready',[],resolve); });
    };

    this.shape = new function(){
        this.getAvailableShapes = function(){ 
            dev.log('shape','.getAvailableShapes()');
            return new Promise(function(resolve, reject) { communicationModule.run('shape.getAvailableShapes',[],resolve); });
        };
        this.getShapeMethods = function(type){ 
            dev.log('shape','.getShapeMethods('+type+')');
            return new Promise(function(resolve, reject) { communicationModule.run('shape.getProxyableShapeMethods',[type],resolve); });
        };

        this.createShape = function(type,name){
            dev.log('shape','.createShape('+type+','+name+')');
            return new Promise( (resolve,reject) => {
                communicationModule.run('shape.createShape',[type,name],resolve);    
            } );
        };
        this.getCreatedShapes = function(){
            dev.log('shape','.getCreatedShapes()');
            return new Promise( (resolve,reject) => {
                communicationModule.run('shape.getCreatedShapes',[],resolve);    
            } );
        };
        this.getShapeTypeById = function(shapeId){
            dev.log('shape','.getShapeTypeById()');
            return new Promise( (resolve,reject) => {
                communicationModule.run('shape.getShapeTypeById',[shapeId],resolve);    
            } );
        };
        this.executeShapeMethod = function(shapeId,methodName,argumentList){
            dev.log('shape','.executeShapeMethod('+shapeId+','+methodName+','+JSON.stringify(argumentList)+')');
            return new Promise( (resolve,reject) => {
                communicationModule.run('shape.executeShapeMethod',[shapeId,methodName,argumentList],resolve);    
            } );
        };
        this.deleteShape = function(shapeId){ 
            dev.log('shape','.deleteShape('+shapeId+')');
            communicationModule.run('shape.deleteShape',[shapeId]);
        };
        this.deleteAllCreatedShapes = function(){ 
            dev.log('shape','.deleteAllCreatedShapes()');
            communicationModule.run('shape.deleteAllCreatedShapes',[]);
        };
    };
    this.arrangement = new function(){
        this.new = function(){
            dev.log('arrangement','.new()');
            communicationModule.run('arrangement.new');
        };
        this.getChildren = function(){
            dev.log('arrangement','.getChildren()');
            return new Promise( (resolve,reject) => {
                communicationModule.run('arrangement.getChildren',undefined,resolve);
            });
        };
        this.getChildByName = function(name){
            dev.log('arrangement','.getChildren('+name+')');
            return new Promise( (resolve,reject) => {
                communicationModule.run('arrangement.getChildByName',[name],resolve);
            });
        };
        this.prepend = function(shapeId){
            dev.log('arrangement','.prepend()');
            return new Promise( (resolve,reject) => {
                communicationModule.run('arrangement.prepend',[shapeId],resolve);
            });
        };
        this.append = function(shapeId){
            dev.log('arrangement','.append()');
            return new Promise( (resolve,reject) => {
                communicationModule.run('arrangement.append',[shapeId],resolve);
            });
        };
        this.remove = function(shapeId){
            dev.log('arrangement','.remove()');
            return new Promise( (resolve,reject) => {
                communicationModule.run('arrangement.remove',[shapeId],resolve);
            });
        };
        this.getElementByAddress = function(address){
            dev.log('arrangement','.getElementByAddress()');
            return new Promise( (resolve,reject) => {
                communicationModule.run('arrangement.getElementByAddress',[address],resolve);
            });
        };
        this.getElementsUnderPoint = function(x,y){
            dev.log('arrangement','.getElementsUnderPoint()');
            return new Promise( (resolve,reject) => {
                communicationModule.run('arrangement.getElementsUnderPoint',[x,y],resolve);
            });
        };
        this.getElementsUnderArea = function(points){
            dev.log('arrangement','.getElementsUnderArea()');
            return new Promise( (resolve,reject) => {
                communicationModule.run('arrangement.getElementsUnderArea',[points],resolve);
            });
        };
        this.printTree = function(mode){
            dev.log('arrangement','.printTree('+mode+')');
            communicationModule.run('arrangement.printTree',[mode]);
        };
    };
    this.render = new function(){
        this.clearColour = function(colour){
            dev.log('render','.clearColour('+colour+')');
            return new Promise( (resolve,reject) => {
                communicationModule.run('render.clearColour',[colour],resolve);
            } );
        };
        this.adjustCanvasSize = function(height,width){
            dev.log('render','.adjustCanvasSize('+height+','+width+')');
            dev.log('render','.clearColour('+colour+')');
            return new Promise( (resolve,reject) => {
                communicationModule.run('render.adjustCanvasSize',[height,width]);
            } );
        };
        this.refreshCoordinates = function(){
            dev.log('render','.refreshCoordinates()');
            communicationModule.run('render.refreshCoordinates',[]);
        };
        this.refresh = function(){
            dev.log('render','.refresh()');
            communicationModule.run('render.refresh',[]);
        };
        this.activeLimitToFrameRate = function(active){
            dev.log('render','.activeLimitToFrameRate('+active+')');
            return new Promise( (resolve,reject) => {
                communicationModule.run('render.activeLimitToFrameRate',[active]);
            } );
        };
        this.frameRateLimit = function(limit){
            dev.log('render','.frameRateLimit('+limit+')');
            return new Promise( (resolve,reject) => {
                communicationModule.run('render.frameRateLimit',[limit],resolve);
            } );
        };
        this.frame = function(){
            dev.log('render','.frame()');
            communicationModule.run('render.frame',[]);
        };
        this.active = function(active){
            dev.log('render','.active('+active+')');
            return new Promise( (resolve,reject) => {
                communicationModule.run('render.active',[active],resolve);
            } );
        };
        this.getCanvasDimensions = function(){
            dev.log('render','.getCanvasDimensions()');
            return new Promise( (resolve,reject) => {
                communicationModule.run('render.getCanvasDimensions',[],resolve);
            } );
        };
        this.drawDot = function(x,y,r,colour){
            dev.log('render','.drawDot('+x+','+y+','+r+','+colour+')');
            communicationModule.run('render.drawDot',[x,y,r,colour]);
        };
        this._dump = function(){
            dev.log('render','._dump()');
            communicationModule.run('render._dump',[]);
        };
    };
    this.viewport = new function(){
        this.position = function(x,y){
            dev.log('viewport','.position('+x+','+y+')');
            return new Promise( (resolve,reject) => {
                communicationModule.run('viewport.position',[x,y],resolve);
            } );
        };
        this.scale = function(s){
            dev.log('viewport','.scale('+s+')');
            return new Promise( (resolve,reject) => {
                communicationModule.run('viewport.scale',[s],resolve);
            } );
        };
        this.angle = function(a){
            dev.log('viewport','.angle('+a+')');
            return new Promise( (resolve,reject) => {
                communicationModule.run('viewport.angle',[a],resolve);
            } );
        };
        this.getElementUnderCanvasPoint = function(x,y){
            dev.log('viewport','.getElementUnderCanvasPoint('+x+','+y+')');
            return new Promise( (resolve,reject) => {
                communicationModule.run('viewport.getElementUnderCanvasPoint',[x,y],resolve);
            } );
        };
        this.getElementsUnderCanvasArea = function(points){
            dev.log('viewport','.getElementsUnderCanvasArea('+a+')');
            return new Promise( (resolve,reject) => {
                communicationModule.run('viewport.getElementsUnderCanvasArea',[points],resolve);
            } );
        };
        this.mousePosition = function(x,y){
            dev.log('viewport','.mousePosition('+x+','+y+')');
            return new Promise( (resolve,reject) => {
                communicationModule.run('viewport.mousePosition',[x,y],resolve);
            } );
        };
        this.clickVisibility = function(a){
            dev.log('viewport','.clickVisibility('+a+')');
            return new Promise( (resolve,reject) => {
                communicationModule.run('viewport.clickVisibility',[a],resolve);
            } );
        };
        this.getHeight = function(){
            dev.log('viewport','.getHeight()');
            return new Promise( (resolve,reject) => {
                communicationModule.run('viewport.getHeight',undefined,resolve);
            } );
        };
        this.getWidth = function(){
            dev.log('viewport','.getWidth()');
            return new Promise( (resolve,reject) => {
                communicationModule.run('viewport.getWidth',undefined,resolve);
            } );
        };
        this._dump = function(){
            dev.log('viewport','._dump()');
            communicationModule.run('viewport._dump',[]);
        };
    };
    this.stats = new function(){};