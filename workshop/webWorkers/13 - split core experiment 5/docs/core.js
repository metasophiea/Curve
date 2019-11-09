const core = new function(){
    const core_engine = new Worker("docs/core_engine.js");
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
    
    const communicationModuleMaker = function(communicationObject,callerName){
        const self = this;
        const devMode = false;
        this.log = function(){
            if(!devMode){return;}
            let prefix = 'communicationModule['+callerName+']';
            console.log('%c'+prefix+(new Array(...arguments).join(' ')),'color:rgb(235, 52, 131); font-style:italic;' );
        };
        this.function = {};
    
        let messageId = 0;
        const messagingCallbacks = {};
    
        function generateMessageID(){
            self.log('::generateMessageID()'); //#development
            return messageId++;
        }
    
        communicationObject.onmessage = function(encodedPacket){
            self.log('::communicationObject.onmessage('+JSON.stringify(encodedPacket)+')'); //#development
            let message = encodedPacket.data;
    
            if(message.outgoing){
                self.log('::communicationObject.onmessage -> message is an outgoing one'); //#development
                if(message.cargo.function in self.function){
                    self.log('::communicationObject.onmessage -> function "'+message.cargo.function+'" found'); //#development
                    self.log('::communicationObject.onmessage -> function arguments: '+JSON.stringify(message.cargo.arguments)); //#development
                    if(message.cargo.arguments == undefined){message.cargo.arguments = [];}
                    if(message.id == null){
                        self.log('::communicationObject.onmessage -> message ID missing; will not return any data'); //#development
                        self.function[message.cargo.function](...message.cargo.arguments);
                    }else{
                        self.log('::communicationObject.onmessage -> message ID found; "'+message.id+'", will return any data'); //#development
                        communicationObject.postMessage({
                            id:message.id,
                            outgoing:false,
                            cargo:self.function[message.cargo.function](...message.cargo.arguments),
                        });
                    }
                }else{
                    self.log('::communicationObject.onmessage -> function "'+message.cargo.function+'" not found'); //#development
                }
            }else{
                self.log('::communicationObject.onmessage -> message is an incoming one'); //#development
                self.log('::communicationObject.onmessage -> message ID: '+message.id+' cargo: '+JSON.stringify(message.cargo)); //#development
                messagingCallbacks[message.id](message.cargo);
                delete messagingCallbacks[message.id];
            }
        };
        this.run = function(functionName,argumentList=[],callback,transferables){
            self.log('.run('+functionName+','+JSON.stringify(argumentList)+','+callback+','+JSON.stringify(transferables)+')'); //#development
            let id = null;
            if(callback != undefined){
                self.log('.run -> callback was defined; generating message ID'); //#development
                id = generateMessageID();
                self.log('.run -> message ID:',id); //#development
                messagingCallbacks[id] = callback;
            }
            communicationObject.postMessage({ id:id, outgoing:true, cargo:{function:functionName,arguments:argumentList} },transferables);
        };
    };
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
};

let rectangleCount = 16;

//element generation
    let upper_band = {
        elementIds:[],
        tick:0,
        tickStep:0.02*rectangleCount,
        wavelength:3,
        colour:{
            current:{r:0.9,g:0,b:0,a:1},
            origin:{r:1,g:0,b:0,a:1},
            destination:{r:Math.random(),g:Math.random(),b:Math.random(),a:1},
            journeyPercentageStepSize:1/40,
            journeyPercentage:0,
            history:(new Array(rectangleCount)).fill().map(() => {return {r:1,g:1,b:1,a:1}}),
            changeCounter:0,
            changeStepSize:1/2,
        },
    };

    let middle_band = {
        elementIds:[],
        tick:0,
        tickStep:0.02*rectangleCount,
        wavelength:2,
        colour:{
            current:{r:0,g:0.9,b:0,a:1},
            origin:{r:1,g:1,b:0,a:1},
            destination:{r:Math.random(),g:Math.random(),b:Math.random(),a:1},
            journeyPercentageStepSize:1/40,
            journeyPercentage:0,
            history:(new Array(rectangleCount)).fill().map(() => {return {r:1,g:1,b:1,a:1}}),
            changeCounter:0,
            changeStepSize:1/3,
        },
    };

    let lower_band = {
        elementIds:[],
        tick:0,
        tickStep:0.02*rectangleCount,
        wavelength:1,
        colour:{
            current:{r:0,g:0,b:0.9,a:1},
            origin:{r:1,g:1,b:0,a:1},
            destination:{r:Math.random(),g:Math.random(),b:Math.random(),a:1},
            journeyPercentageStepSize:1/30,
            journeyPercentage:0,
            history:(new Array(rectangleCount)).fill().map(() => {return {r:1,g:1,b:1,a:1}}),
            changeCounter:0,
            changeStepSize:1/4,
        },
    };

    function produceRectangle(a,x,y,namePrefix,grouping){
        core.element.create('rectangle',namePrefix+a).then( rectangleId => {
            core.element.executeMethod(rectangleId,'unifiedAttribute',[{ x:(x - a*30), y:y, width:30, height:30 }]);
            core.arrangement.append(rectangleId);
            grouping.push(rectangleId);
        } );
    };
    core.render.getCanvasDimensions().then(canvasDimensions => {
        for(let a = 0; a < rectangleCount; a++){
            produceRectangle( a, (200 + canvasDimensions.width/2), (-175 + canvasDimensions.height/2), 'upperBand_rectangle_', upper_band.elementIds );
            produceRectangle( a, (200 + 20/2 + canvasDimensions.width/2), (-100 + canvasDimensions.height/2), 'middleBand_rectangle_', middle_band.elementIds );
            produceRectangle( a, (200 + canvasDimensions.width/2), (75 + canvasDimensions.height/2), 'lowerBand_rectangle_', lower_band.elementIds );
        }  
    });

//animation
    let canvasDimensions = {width:0,height:0};
    core.render.getCanvasDimensions().then(newCanvasDimensions => { canvasDimensions = newCanvasDimensions; });
    function blendColours(A,B,p){ return { r: (1-p)*A.r + p*B.r, g: (1-p)*A.g + p*B.g, b: (1-p)*A.b + p*B.b, a: (1-p)*A.a + p*B.a }; }
    function updateColour(band){
        if(band.colour.changeCounter >= 1){
            band.colour.changeCounter = 0;

            if(band.colour.journeyPercentage >= 1){
                band.colour.journeyPercentage = 0;
                band.colour.origin = band.colour.destination;
                band.colour.current = band.colour.destination;
                band.colour.destination = {r:Math.random(),g:Math.random(),b:Math.random(),a:1};
            }else{
                band.colour.current = blendColours(band.colour.current,band.colour.destination,band.colour.journeyPercentage);
            }

            band.colour.history.push(band.colour.current);
            if(band.colour.history.length > rectangleCount){ band.colour.history.shift(); }
            band.colour.journeyPercentage += band.colour.journeyPercentageStepSize;
        }
        band.colour.changeCounter += band.colour.changeStepSize;
    }

    setInterval(function(){
        updateColour(upper_band);
        updateColour(middle_band);
        updateColour(lower_band);

        //upper band
            upper_band.elementIds.forEach((elementID,index) => {
                let t = Math.PI*( (upper_band.tick+index*upper_band.wavelength)/upper_band.elementIds.length );
                core.element.boatload_executeMethod.load({
                    id:elementID,
                    method:'unifiedAttribute',
                    argumentList:[{ 
                        width:30 + 25*Math.sin(t), 
                        height:30 + 25*Math.cos(t), 
                        colour:upper_band.colour.history[index]
                    }],
                });
            });

        //middle band
            middle_band.elementIds.forEach((elementID,index) => {
                let t = Math.PI*( (middle_band.tick+index*middle_band.wavelength)/middle_band.elementIds.length );
                core.element.boatload_executeMethod.load({
                    id:elementID,
                    method:'unifiedAttribute',
                    argumentList:[{ 
                        y:-75 + 30 + 25*Math.sin(t) + canvasDimensions.height/2,
                        height:30 + 25*Math.cos(t),
                        colour:middle_band.colour.history[index]
                    }],
                });
            });

        //lower band
            lower_band.elementIds.forEach((elementID,index) => {
                let t = Math.PI*( (lower_band.tick+index*lower_band.wavelength)/lower_band.elementIds.length );
                core.element.boatload_executeMethod.load({
                    id:elementID,
                    method:'unifiedAttribute',
                    argumentList:[{ 
                        width:30 + 25*Math.sin(t),
                        y:75 + canvasDimensions.height/2 + 30 + 25*Math.cos(t),
                        colour:lower_band.colour.history[index]
                    }],
                });
            });

        upper_band.tick+=upper_band.tickStep;
        middle_band.tick+=middle_band.tickStep;
        lower_band.tick+=lower_band.tickStep;
        core.element.boatload_executeMethod.ship();
    },1000/40);
























//rendering controls
    core.render.active(true);
    // core.render.activeLimitToFrameRate(true);
    core.render.frameRateLimit(40);

    // core.stats.active(true);
    // let averages = [];
    // let rollingAverage = 0;
    // let rollingAverageIndex = 1;
    // setInterval(function(){
    //     let tmp = core.stats.getReport(); 
    //     tmp.then(data => {
    //         averages.push(data.framesPerSecond);
    //         console.log( 'rollingAverage:', averages.reduce( ( p, c ) => p + c, 0 ) / averages.length, data.framesPerSecond );
    //     });
    // },1000);


