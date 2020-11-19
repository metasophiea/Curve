const __canvasPrefix = 'workspace';
const __canvasElements = [...document.getElementsByTagName('canvas')].filter(canvas => canvas.hasAttribute(__canvasPrefix));
for(let __canvasElements_count = 0; __canvasElements_count < __canvasElements.length; __canvasElements_count++){
    if( __canvasElements[__canvasElements_count].hasAttribute(__canvasPrefix) ){
        const _canvas_ = __canvasElements[__canvasElements_count];
        function tester(item1,item2){
            function getType(obj){
                return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase()
            }
            function comparer(item1,item2){
                if(getType(item1) != getType(item2)){ return false; }
                if(typeof item1 == 'boolean' || typeof item1 == 'string'){ return item1 === item2; }
                if(typeof item1 == 'number'){
                    if( Math.abs(item1) < 1.0e-14 ){item1 = 0;}
                    if( Math.abs(item2) < 1.0e-14 ){item2 = 0;}
                    if( Math.abs(item1 - item2) < 1.0e-14 ){return true;}
                    return item1 === item2;
                }
                if(typeof item1 === 'undefined' || typeof item2 === 'undefined' || item1 === null || item2 === null){ return item1 === item2;  }
                if(getType(item1) == 'function'){
                    item1 = item1.toString();
                    item2 = item2.toString();
        
                    var item1_functionHead = item1.substring(0,item1.indexOf('{'));
                    item1_functionHead = item1_functionHead.substring(item1_functionHead.indexOf('(')+1, item1_functionHead.lastIndexOf(')'));
                    var item1_functionBody = item1.substring(item1.indexOf('{')+1, item1.lastIndexOf('}'));
        
                    var item2_functionHead = item2.substring(0,item2.indexOf('{'));
                    item2_functionHead = item2_functionHead.substring(item2_functionHead.indexOf('(')+1, item2_functionHead.lastIndexOf(')'));
                    var item2_functionBody = item2.substring(item2.indexOf('{')+1, item2.lastIndexOf('}'));
        
                    return item1_functionHead.trim() == item2_functionHead.trim() && item1_functionBody.trim() == item2_functionBody.trim();
                }
                if(typeof item1 == 'object'){
                    var keys1 = Object.keys(item1);
                    var keys2 = Object.keys(item2);
                    if(keys1.length != keys2.length){return false;}
        
                    for(var a = 0; a < keys1.length; a++){ 
                        if( keys1.indexOf(keys2[a]) == -1 || !comparer(item1[keys1[a]],item2[keys1[a]])){return false;}
                    }
                    return true;
                }
                return false;
            }
        
            if( comparer(item1,item2) ){
                console.log('%cpass', 'color: green;'); return true;
            }else{
                console.log(item1 ,'!=', item2);
                console.log('%cfail', 'color: red;'); return false;
            }
        }
        
        
        
        // -- Only one test per time -- //
        // {{include:0 - library/main.js}}
        _canvas_.layers = new function(){
            const layerRegistry = [];
        
            function getLayerIndexByName(layerName){
                for(let a = 0; a < layerRegistry.length; a++){
                    if(layerRegistry[a].name == layerName){
                        return a;
                    }
                }
                return -1;
            }
        
            this.getVersionInformation = function(){
                return Object.keys(layerRegistry).map(key => { return {name:layerRegistry[key].name, data:layerRegistry[key].versionInformation} });
            };
        
            this.registerLayer = function(layerName, layer){
                if( getLayerIndexByName(layerName) != -1){
                    console.error('_canvas_.layers.registerLayer('+layerName+','+layer+') : duplicate layer name detected ');
                    return;
                }
        
                layerRegistry.push({
                    name: layerName,
                    isLoaded: false,
                    versionInformation: layer.versionInformation,
                    functionList:[],
                });
        
                if(this.onLayerRegistered){this.onLayerRegistered(layerName,layerRegistry);}
            };
            this.onLayerRegistered = function(layerName,layerRegistry){};
        
            this.declareLayerAsLoaded = function(layerName){
                let index = getLayerIndexByName(layerName);
                if( index == -1){
                    console.error('_canvas_.layers.declareLayerAsLoaded('+layerName+') : unknown layer name ');
                    return;
                }
        
                layerRegistry[index].isLoaded = true;
                if(this.onLayerLoad){this.onLayerLoad(layerName,layerRegistry);}
                layerRegistry[index].functionList.forEach(func => { func(); });
            };
            this.onLayerLoad = function(layerName,layerRegistry){};
        
            this.registerFunctionForLayer = function(layerName, func){
                let index = getLayerIndexByName(layerName);
                if( index == -1){
                    console.error('_canvas_.layers.registerFunctionForLayer('+layerName+') : unknown layer name ');
                    return;
                }
                layerRegistry[index].functionList.push(func);
            };
        };
        _canvas_.library = new function(){
            this.versionInformation = { tick:0, lastDateModified:{y:2020,m:11,d:14} };
            const library = this;
            
            const dev = {
                prefix:'library',
            
                active:{ math:false, structure:false, audio:false, font:false, misc:false },
            
                log:{
                    math:function(){
                        if(!dev.active.math){return;}
                        console.log( dev.prefix+'.math'+arguments[0], ...(new Array(...arguments).slice(1)) );
                    },
                    structure:function(){
                        if(!dev.active.structure){return;}
                        console.log( dev.prefix+'.structure'+arguments[0], ...(new Array(...arguments).slice(1)) );
                    },
                    audio:function(){
                        if(!dev.active.audio){return;}
                        console.log( dev.prefix+'.audio'+arguments[0], ...(new Array(...arguments).slice(1)) );
                    },
                    font:function(){
                        if(!dev.active.font){return;}
                        console.log( dev.prefix+'.font'+arguments[0], ...(new Array(...arguments).slice(1)) );
                    },
                    misc:function(){
                        if(!dev.active.misc){return;}
                        console.log( dev.prefix+'.misc'+arguments[0], ...(new Array(...arguments).slice(1)) );
                    },
                },
            
                countActive:false,
                countMemory:{},
                count:function(commandTag){
                    if(!dev.countActive){return;}
                    if(commandTag in dev.countMemory){ dev.countMemory[commandTag]++; }
                    else{ dev.countMemory[commandTag] = 1; }
                },
                countResults:function(){return countMemory;},
            };
        
            this.math = new function(){
                this.convertColour = new function(){
                    this.obj2rgba = function(obj){
                        dev.log.math('.convertColour.obj2rgbacartesianAngleAdjust(',obj); //#development
                        dev.count('.math.convertColour.obj2rgba'); //#development
                
                        return 'rgba('+obj.r*255+','+obj.g*255+','+obj.b*255+','+obj.a+')';
                    };
                    this.rgba2obj = function(rgba){
                        dev.log.math('.convertColour.rgba2obj(',rgba); //#development
                        dev.count('.convertColour.rgba2obj'); //#development
                
                        rgba = rgba.split(',');
                        rgba[0] = rgba[0].replace('rgba(', '');
                        rgba[3] = rgba[3].replace(')', '');
                        rgba = rgba.map(function(a){return parseFloat(a);})
                        return {r:rgba[0]/255,g:rgba[1]/255,b:rgba[2]/255,a:rgba[3]};
                    };
                };
            };
        };
        
        _canvas_.layers.registerLayer("library", _canvas_.library);
        // _canvas_.library.audio.nowReady = function(){
            _canvas_.layers.declareLayerAsLoaded("library");
        // };
        _canvas_.core = new function(){
            this.versionInformation = { tick:0, lastDateModified:{y:2020,m:11,d:15} };
        
            const core = this;
        
            const core_engine = new Worker("core_engine.js");
            const communicationModuleMaker = function(communicationObject,callerName){
                const self = this;
                const devMode = false;
                this.log = function(){
                    if(!devMode){return;}
                    let prefix = 'communicationModule['+callerName+']';
                    console.log('%c'+prefix+(new Array(...arguments).join(' ')),'color:rgb(235, 52, 131); font-style:italic;' );
                };
                this.function = {};
                this.delayedFunction = {};
            
                let messageId = 0;
                const messagingCallbacks = {};
            
                function generateMessageID(){
                    self.log('::generateMessageID()'); //#development
                    return messageId++;
                }
            
                communicationObject.onmessage = function(encodedPacket){
                    self.log('::communicationObject.onmessage('+JSON.stringify(encodedPacket)+')'); //#development
                    self.log('::communicationObject.onmessage -> <encodedPacket>'); //#development
                    if(devMode){console.log(encodedPacket);} //#development
                    self.log('::communicationObject.onmessage -> </encodedPacket>'); //#development
                    let message = encodedPacket.data;
            
                    if(!message.response){
                        self.log('::communicationObject.onmessage -> message is a calling one'); //#development
            
                        if(message.cargo == undefined){
                            self.log('::communicationObject.onmessage -> message cargo not found; aborting'); //#development
                            return;
                        }
            
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
                                    response:true,
                                    cargo:self.function[message.cargo.function](...message.cargo.arguments),
                                });
                            }
                        }else if(message.cargo.function in self.delayedFunction){
                            self.log('::communicationObject.onmessage -> delayed function "'+message.cargo.function+'" found'); //#development
                            self.log('::communicationObject.onmessage -> delayed function arguments: '+JSON.stringify(message.cargo.arguments)); //#development
                            if(message.cargo.arguments == undefined){message.cargo.arguments = [];}
                            if(message.id == null){
                                self.log('::communicationObject.onmessage -> message ID missing; will not return any data'); //#development
                                self.delayedFunction[message.cargo.function](...message.cargo.arguments);
                            }else{
                                self.log('::communicationObject.onmessage -> message ID found; "'+message.id+'", will return any data'); //#development
                                self.delayedFunction[message.cargo.function](...[function(returnedData){
                                    communicationObject.postMessage({ id:message.id, response:true, cargo:returnedData });
                                }].concat(message.cargo.arguments));
                            }
                        }else{
                            self.log('::communicationObject.onmessage -> function "'+message.cargo.function+'" not found'); //#development
                        }
                    }else{
                        self.log('::communicationObject.onmessage -> message is a response one'); //#development
                        self.log('::communicationObject.onmessage -> message ID: '+message.id+' cargo: '+JSON.stringify(message.cargo)); //#development
                        messagingCallbacks[message.id](message.cargo);
                        delete messagingCallbacks[message.id];
                    }
                };
            
                this.run_withoutPromise = function(functionName,argumentList=[],transferables){
                    self.log('::communicationObject.run_withoutPromise('+functionName+','+JSON.stringify(argumentList)+','+JSON.stringify(transferables)+')'); //#development
                    communicationObject.postMessage({ id:undefined, response:false, cargo:{function:functionName,arguments:argumentList} }, transferables);
                };
                this.run_withPromise = function(functionName,argumentList=[],transferables){
                    self.log('::communicationObject.run_withPromise('+functionName+','+JSON.stringify(argumentList)+','+JSON.stringify(transferables)+')'); //#development
            
                    let id = generateMessageID();
                    self.log('::communicationObject.run_withPromise -> message ID:',id); //#development
            
                    return new Promise((resolve, reject) => {
                        messagingCallbacks[id] = resolve;
                        self.log('::communicationObject.run_withPromise -> sending calling message'); //#development
                        communicationObject.postMessage({ id:id, response:false, cargo:{function:functionName,arguments:argumentList} }, transferables);
                    });
                };
            };
            const communicationModule = new communicationModuleMaker(core_engine,'core_console');
        
            _canvas_.setAttribute('tabIndex',1);
            _canvas_.style.outline = "none";
        
            const dev = new function(){
                const prefix = 'core_console';
                const active = {
                    service:false,
                    interface:false,
                    elementLibrary:{
                        Group:false,
                        Rectangle:false,
                        RectangleWithOutline:false,
                        Circle:false,
                        CircleWithOutline:false,
                        Polygon:false,
                        PolygonWithOutline:false,
                        Path:false,
                        Image:false,
                        Canvas:false,
                        Character:false,
                        CharacterString:false,
                    },
                    element:false,
                    arrangement:false,
                    render:false,
                    viewport:false,
                    stats:false,
                    callback:false,
                };
            
                this.log = {};
                Object.entries(active).forEach(entry => {
                    if(typeof entry[1] == 'object'){
                        this.log[entry[0]] = {};
                        Object.keys(active[entry[0]]).forEach(key => {
                            this.log[entry[0]][key] = function(){
                                if(active[entry[0]][key]){ 
                                    console.log( prefix+'.'+entry[0]+'.'+key+arguments[0], ...(new Array(...arguments).slice(1)) );
                                }
                            };
                        });
                    }else{
                        this.log[entry[0]] = function(){
                            if(active[entry[0]]){ 
                                console.log( prefix+'.'+entry[0]+arguments[0], ...(new Array(...arguments).slice(1)) );
                            }
                        };
                    }
                });
            
                const countActive = !false;
                const countMemory = {};
                this.count = function(commandTag){
                    if(!countActive){return;}
                    if(commandTag in countMemory){ countMemory[commandTag]++; }
                    else{ countMemory[commandTag] = 1; }
                };
                this.countResults = function(){return countMemory;};
            };
            communicationModule.function.frame = function(data){
                dev.log.service(' -> frame(',data); //#development
                _canvas_.getContext("bitmaprenderer").transferFromImageBitmap(data);
            };
            communicationModule.function.ready = function(){
                dev.log.service(' -> ready()'); //#development
                core.ready();
            };
            communicationModule.function.setCanvasSize = function(width,height){
                dev.log.service(' -> setCanvasSize(',width,height); //#development
                _canvas_.setAttribute('width',width);
                _canvas_.setAttribute('height',height);
            }
            
            communicationModule.function.updateElement = function(ele_id, data={}){
                dev.log.service(' -> updateElement(',ele_id,data); //#development
                const proxyElement = _canvas_.core.element.getElementById(ele_id);
                if(proxyElement.__updateValues != undefined){ proxyElement.__updateValues(data); }
            };
            communicationModule.function.runElementCallback = function(ele_id, data={}){
                dev.log.service(' -> runElementCallback(',ele_id,data); //#development
                const proxyElement = _canvas_.core.element.getElementById(ele_id);
                if(proxyElement.__runCallback != undefined){ proxyElement.__runCallback(data); }
            };
            
            communicationModule.function.getCanvasAttributes = function(attributeNames=[],prefixActiveArray=[]){
                dev.log.service(' -> getCanvasAttributes(',attributeNames,prefixActiveArray); //#development
                return attributeNames.map((name,index) => {
                    return _canvas_.getAttribute((prefixActiveArray[index]?__canvasPrefix:'')+name);
                });    
            };
            communicationModule.function.setCanvasAttributes = function(attributeNames=[],values=[],prefixActiveArray=[]){
                dev.log.service(' -> setCanvasAttributes(',attributeNames,values,prefixActiveArray); //#development
                attributeNames.map((name,index) => {
                    _canvas_.setAttribute((prefixActiveArray[index]?__canvasPrefix:'')+name, values[index]);
                });
            };
            
            communicationModule.function.getCanvasParentAttributes = function(attributeNames=[],prefixActiveArray=[]){
                dev.log.service(' -> getCanvasParentAttributes(',attributeNames,prefixActiveArray); //#development
                return attributeNames.map((name,index) => {
                    return _canvas_.parentElement[(prefixActiveArray[index]?__canvasPrefix:'')+name];
                });
            };
            
            communicationModule.function.getDocumentAttributes = function(attributeNames=[]){
                dev.log.service(' -> getDocumentAttributes(',attributeNames); //#development
                return attributeNames.map(attribute => {
                    return eval('document.'+attribute);
                });
            };
            communicationModule.function.setDocumentAttributes = function(attributeNames=[],values=[]){
                dev.log.service(' -> setDocumentAttributes(',attributeNames,values); //#development
                return attributeNames.map((attribute,index) => {
                    eval('document.'+attribute+' = "'+values[index]+'"');
                });
            };
            communicationModule.function.getWindowAttributes = function(attributeNames=[]){
                dev.log.service(' -> getWindowAttributes(',attributeNames); //#development
                return attributeNames.map(attribute => {
                    return eval('window.'+attribute);
                });
            };
            communicationModule.function.setWindowAttributes = function(attributes=[]){
                dev.log.service(' -> setWindowAttributes(',attributes); //#development
                attributes.map((attribute,index) => {
                    eval('window.'+attribute.name+' = "'+attribute.value+'"');
                });
            };
            const interface = new function(){
                this.operator = new function(){
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
                            this.allowFrameSkipping = function(a){
                                dev.log.interface('.operator.render.allowFrameSkipping(',a); //#development
                                communicationModule.run_withoutPromise('operator__render__allowFrameSkipping', [a]);
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
                            this.scaleAroundWindowPoint = function(s,x,y){
                                dev.log.interface('.operator.viewport.scaleAroundWindowPoint(',s,x,y); //#development
                                return communicationModule.run_withPromise('operator__viewport__scaleAroundWindowPoint', [s,x,y]);
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
                        this.elementRenderDecision_clearData = function(){
                            dev.log.interface('.operator.stats.elementRenderDecision_clearData()'); //#development
                            return communicationModule.run_withPromise('operator__stats__elementRenderDecision_clearData');
                        };
                        this._dump = function(){
                            dev.log.interface('.operator.stats._dump()'); //#development
                            communicationModule.run_withoutPromise('operator__stats___dump');
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
                };
            };
            this.if = interface;
            this.element = new function(){
                const elementLibrary = new function(){
                    const genericElement = function(_type, _name){
                        const self = this;
                    
                        //type
                            const type = _type;
                            this.getType = function(){return type;};
                    
                        //id
                            let id = undefined;
                            this.getId = function(){return id;};
                            this.__onIdReceived = function(){};
                            this.__id = function(a){
                                dev.log.elementLibrary[type]('['+self.getAddress()+'].__id(',a); //#development
                                id = a;
                    
                                __unifiedAttribute(__unifiedAttribute());
                                Object.entries(cashedCallbacks).forEach(entry => { 
                                    core.callback.attachCallback(this, entry[0], entry[1]);
                                });
                    
                                if(this.__repush != undefined){this.__repush();}
                                if(this.__onIdReceived){this.__onIdReceived(id);}
                            };
                    
                        //name
                            let name = _name;
                            this.getName = function(){return name;};
                    
                        //hierarchy
                            this.parent = undefined;
                            this.getAddress = function(){
                                return (this.parent != undefined && this.parent.getId() != 0 ? this.parent.getAddress() : '') + '/' + name;
                            };
                            this.getOffset = function(){
                                let output = {x:0,y:0,scale:1,angle:0};
                    
                                if(this.parent){
                                    const offset = this.parent.getOffset();
                                    const point = _canvas_.library.math.cartesianAngleAdjust(cashedAttributes.x,cashedAttributes.y,offset.angle);
                                    output = { 
                                        x: point.x*offset.scale + offset.x,
                                        y: point.y*offset.scale + offset.y,
                                        scale: offset.scale * cashedAttributes.scale,
                                        angle: offset.angle + cashedAttributes.angle,
                                    };
                                }else{
                                    output = {x:cashedAttributes.x ,y:cashedAttributes.y ,scale:cashedAttributes.scale ,angle:cashedAttributes.angle};
                                }
                    
                                return output;
                            };
                    
                        //attributes
                            const cashedAttributes = {};
                            const transferableAttributes = [];
                            this.__setupSimpleAttribute = function(name,defaultValue){
                                cashedAttributes[name] = defaultValue;
                                this[name] = function(a){
                                    if(a == undefined){ return cashedAttributes[name]; }
                                    if(a == cashedAttributes[name]){ return; } //no need to set things to what they already are
                                    dev.log.elementLibrary[this.getType()]('['+this.getAddress()+'].'+name+'(',...arguments); //#development
                                    cashedAttributes[name] = a;
                                    if(this.getId() != undefined){
                                        const obj = {};
                                        obj[name] = a;
                                        interface.operator.element.executeMethod.unifiedAttribute(this.getId(),obj);
                                    }
                                };
                            }
                            this.__setupTransferableAttribute = function(name,defaultValue){
                                transferableAttributes.push(name);
                                cashedAttributes[name] = defaultValue;
                                this[name] = function(a){
                                    if(a == undefined){ return cashedAttributes[name]; }
                                    if(a == cashedAttributes[name]){ return; } //no need to set things to what they already are
                                    dev.log.elementLibrary[this.getType()]('['+this.getAddress()+'].'+name+'(',...arguments); //#development
                                    cashedAttributes[name] = a;
                                    if(this.getId() != undefined){
                                        const obj = {};
                                        obj[name] = a;
                                        interface.operator.element.executeMethod.unifiedAttribute(this.getId(),obj,[a]);
                                    }
                                };
                            }
                            Object.entries({
                                x: 0,
                                y: 0,
                                angle: 0,
                                scale: 1,
                                ignored: false,
                            }).forEach(([name,defaultValue]) => this.__setupSimpleAttribute(name,defaultValue) );
                            
                            const __unifiedAttribute = function(attributes){
                                if(attributes == undefined){ return cashedAttributes; }
                                Object.keys(attributes).forEach(key => { cashedAttributes[key] = attributes[key]; });
                                if(id != undefined){
                                    interface.operator.element.executeMethod.unifiedAttribute(
                                        id,
                                        attributes,
                                        transferableAttributes.map(name => attributes[name]).filter(item => item != undefined)
                                    );
                                }
                            };
                            this.unifiedAttribute = function(attributes){ return __unifiedAttribute(attributes); };
                    
                        //callbacks
                            const cashedCallbacks = {};
                            this.getCallback = function(callbackType){
                                dev.log.elementLibrary[type]('['+self.getAddress()+'].getCallback(',callbackType); //#development
                                return cashedCallbacks[callbackType];
                            };
                            this.attachCallback = function(callbackType, callback){
                                dev.log.elementLibrary[type]('['+this.getAddress()+'].attachCallback(',callbackType,callback); //#development
                                cashedCallbacks[callbackType] = callback;
                                if(id != undefined){
                                    interface.operator.callback.attachCallback(this, callbackType, callback);
                                }
                            }
                            this.removeCallback = function(callbackType){
                                dev.log.elementLibrary[type]('['+this.getAddress()+'].removeCallback(',callbackType); //#development
                                delete cashedCallbacks[callbackType];
                                if(id != undefined){ 
                                    interface.operator.callback.removeCallback(this, callbackType);
                                }
                            }
                    
                        //info dump
                            this._dump = function(){
                                if(id != undefined){
                                    interface.operator.element.executeMethod.dump(id);
                                }
                            };
                    };
                    
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
                            
                            // //perform removal callback
                            //     if(elementToRemove.getCallback('onremove')){elementToRemove.getCallback('onremove')();}
                    
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
                    this.Canvas = function(_name){
                        genericElement.call(this,'Canvas',_name);
                    
                        Object.entries({
                            x: 0,
                            y: 0,
                            angle: 0,
                            anchor: {x:0,y:0},
                            width: 10,
                            height: 10,
                        }).forEach(([name,defaultValue]) => this.__setupSimpleAttribute(name,defaultValue) );
                    
                        //subCanvas
                            const subCanvas = { object:document.createElement('canvas'), context:undefined, resolution:1 };
                            subCanvas.context = subCanvas.object.getContext('2d');
                    
                            function updateDimensions(self){
                                subCanvas.object.setAttribute('width',self.width()*subCanvas.resolution);
                                subCanvas.object.setAttribute('height',self.height()*subCanvas.resolution);
                            }
                            updateDimensions(this);
                    
                            this._ = subCanvas.context;
                            this.$ = function(a){return a*subCanvas.resolution;};
                            this.resolution = function(a){
                                if(a == undefined){return subCanvas.resolution;}
                                subCanvas.resolution = a;
                                updateDimensions(this);
                            };
                            this.requestUpdate = function(){
                                if(this.getId() != undefined){
                                    createImageBitmap(subCanvas.object).then(bitmap => {
                                        interface.operator.element.executeMethod.unifiedAttribute(this.getId(),{bitmap:bitmap},[bitmap]);
                                    });
                                }
                            };
                            this.requestUpdate();
                            this.__repush = function(){ this.requestUpdate(); };
                    
                        const __unifiedAttribute = this.unifiedAttribute;
                        this.unifiedAttribute = function(attributes){
                            if(attributes == undefined){ return __unifiedAttribute(); }
                            if(attributes.resolution != undefined){
                                this.resolution(attributes.resolution);
                                delete attributes.resolution;
                            }
                            __unifiedAttribute(attributes);
                            updateDimensions(this);
                        };
                    };
                    // {{include:character.js}}
                    // {{include:characterString.js}}
                };
                const elementRegistry = [];
                
                //element library
                    this.getAvailableElements = function(){
                        return Object.keys(elementLibrary);
                    };
                    this.getElementById = function(id){
                        return elementRegistry[id];
                    };
                //basic management
                    this.__createLocalWithId = function(type,name,id){
                        if( type == undefined || name == undefined || id == undefined ){
                            console.error("core.element.__createLocalWithId(",type,name,id);
                            console.error("missing arguments");
                            return;
                        }
                        if( elementRegistry[id] != undefined ){
                            console.error("core.element.__createLocalWithId(",type,name,id);
                            console.error("proxy already present");
                            return;
                        }
            
                        elementRegistry[id] = new elementLibrary[type](name);
                        elementRegistry[id].__id(id);
                        return elementRegistry[id];
                    };
                    this.create = function(type,name){
                        if( ! (type in elementLibrary) ){
                            console.error("core.element.create -> element type: \""+type+"\" is not a known type");
                            return;
                        }
            
                        const newElementProxy = new elementLibrary[type](name);
                        interface.operator.element.create(type,name).then(id => {
                                newElementProxy.__id(id);
                                elementRegistry[id] = newElementProxy;
                            }
                        );
                        return newElementProxy;
                    };
                    this.delete = function(element){
                        interface.operator.element.delete(element.getId());
                        elementRegistry[element.getId()] = undefined;
                    };
                    this.deleteAllCreated = function(){
                        interface.operator.element.deleteAllCreated();
                        elementRegistry = [];
                    };
                //misc
                    this._dump = function(){
                        console.log("┌─Console Element Dump─");
                        console.log("│ elementRegistry:", elementRegistry);
                        console.log("└──────────────────────");
                        interface.operator.element._dump();
                    };
            };
            this.arrangement = new function(){
                const design = core.element.__createLocalWithId('Group','root',0);
            
                //root
                    this.prepend = function(element){
                        return design.prepend(element);
                    };
                    this.append = function(element){
                        return design.append(element);
                    };
                    this.remove = function(element){
                        return design.remove(element);
                    };
                    this.clear = function(){
                        return design.clear();
                    };
                    this.shift = function(element, newPosition){
                        return design.shift(element, newPosition);
                    };
            
                //discovery
                    this.getElementByAddress = function(address,local=true){
                        if(local){
                            const route = address.split('/');
                            route.shift();
                            route.shift();
                    
                            let currentObject = design;
                            route.forEach((a) => {
                                currentObject = currentObject.getChildByName(a);
                            });
                    
                            return currentObject;
                        }else{
                            return new Promise((resolve, reject) => {
                                interface.operator.arrangement.getElementByAddress(address).then(id => {
                                    resolve(core.element.getElementById(id));
                                });
                            });
                        }
            
                    };
                    this.getElementsUnderPoint = function(x,y){
                        return new Promise((resolve, reject) => {
                            interface.operator.arrangement.getElementsUnderPoint(x,y).then(ids => {
                                const output = [];
                                for(let a = 0; a < ids.length; a++){
                                    output.push( core.element.getElementById(ids[a]) );
                                }
                                resolve(output);
                            });
                        });
                    };
                    this.getElementsUnderArea = function(points){
                        return new Promise((resolve, reject) => {
                            interface.operator.arrangement.getElementsUnderArea(points).then(ids => {
                                const output = [];
                                for(let a = 0; a < ids.length; a++){
                                    output.push( core.element.getElementById(ids[a]) );
                                }
                                resolve(output);
                            });
                        });
                    };
            
                //misc
                    this.printTree = function(mode='spaced',local=false){
                        if(local){               
                            function format(element, prefix='', mode='spaced'){
                                const data = '(id:'+element.getId() + ', type:'+element.getType() + ', x:'+element.x()+ ', y:'+element.y()+ ', angle:'+element.angle()+ ', scale:'+element.scale() + ')';
                                if(mode == 'spaced'){
                                    return prefix+element.getName()+' '+data;
                                }else if(mode == 'tabular'){
                                    return prefix+element.getName()+' '+data;
                                }else if(mode == 'address'){
                                    return prefix+'/'+element.getName()+' '+data;
                                }
                            }
                            function recursivePrint(group, prefix='', mode='spaced'){
                                console.log( format(group, prefix, mode) );
            
                                let new_prefix = '';
                                if(mode == 'spaced'){
                                    new_prefix = prefix+'- ';
                                }else if(mode == 'tabular'){
                                    new_prefix = prefix+'-\t';
                                }else if(mode == 'address'){
                                    new_prefix = prefix+'/'+group.getName();
                                }
            
                                group.getChildren().forEach(element => {
                                    if(element.getType() == 'Group'){
                                        recursivePrint(element, new_prefix, mode)
                                    } else {
                                        console.log( format(element, new_prefix, mode) );
                                    }
                                });
                            }
                            recursivePrint(design, undefined, mode);
                        } else {
                            interface.operator.arrangement.printTree(mode);
                        }
                    };
                    this.printSurvey = function(local=false){
                        if(local){
                            
                        } else {
                            interface.operator.arrangement.printSurvey();
                        }
                    };
                    this._dump = function(){
                        interface.operator.arrangement._dump();
                    };
            };
            this.render = new function(){
                const cachedValues = {
                    clearColour:{r:1,g:1,b:1,a:1},
                    activeLimitToFrameRate:false,
                    frameRateLimit:30,
                    active:false,
                    allowFrameSkipping:true,
                };
            
                //canvas and webGL context
                    this.clearColour = function(colour){
                        dev.log.render('.clearColour(',colour); //#development
                        if(colour == undefined){ return cachedValues.clearColour; }
                        cachedValues.clearColour = colour;
                        interface.operator.render.clearColour(colour);
                    };
                    this.getCanvasSize = function(){
                        dev.log.render('.getCanvasSize()'); //#development
                        return interface.operator.render.getCanvasSize();
                    };
                    this.adjustCanvasSize = function(newWidth, newHeight){
                        dev.log.render('.adjustCanvasSize(',newWidth,newHeight); //#development
                        interface.operator.render.adjustCanvasSize(newWidth, newHeight);
                    };
                    this.refreshCoordinates = function(){
                        dev.log.render('.refreshCoordinates()'); //#development
                        interface.operator.render.refreshCoordinates();
                    };
                    this.refresh = function(){
                        dev.log.render('.refresh()'); //#development
                        interface.operator.render.refresh();
                    };
            
                //frame rate control
                    this.activeLimitToFrameRate = function(a){
                        dev.log.render('.activeLimitToFrameRate(',a); //#development
                        if(a == undefined){ return cachedValues.activeLimitToFrameRate; }
                        cachedValues.activeLimitToFrameRate = a;
                        interface.operator.render.activeLimitToFrameRate(a);
                    };
                    this.frameRateLimit = function(a){
                        dev.log.render('.frameRateLimit(',a); //#development
                        if(a == undefined){ return cachedValues.frameRateLimit; }
                        cachedValues.frameRateLimit = a;
                        interface.operator.render.frameRateLimit(a);
                    };
                    this.allowFrameSkipping = function(a){
                        dev.log.render('.allowFrameSkipping(',a); //#development
                        if(a == undefined){ return cachedValues.allowFrameSkipping; }
                        cachedValues.allowFrameSkipping = a;
                        interface.operator.render.allowFrameSkipping(a);
                    };
            
                //actual render
                    this.frame = function(noClear=false){
                        dev.log.render('.frame(',noClear); //#development
                        interface.operator.render.frame(noClear);
                    };
                    this.active = function(bool){
                        dev.log.render('.active(',bool); //#development
                        if(bool == undefined){ return cachedValues.active; }
                        cachedValues.active = bool;
                        interface.operator.render.active(bool);
                    };
            
                //misc
                    this.drawDot = function(x,y,r=2,colour={r:1,g:0,b:0,a:1}){
                        dev.log.render('.drawDot(',x,y,r,colour); //#development
                        interface.operator.render.drawDot(x,y,r,colour);
                    };
                    this._dump = function(){
                        dev.log.render('._dump()'); //#development
                        interface.operator.render._dump();
                    };
            };
            this.viewport = new function(){
                const cachedValues = {
                    position:{x:0,y:0},
                    scale:1,
                    angle:0,
                    anchor:{x:0,y:0},
                    stopMouseScroll:false,
                };
                const mouseData = { 
                    x:undefined, 
                    y:undefined, 
                };
            
                //adapter
                    this.adapter = new function(){
                        this.windowPoint2workspacePoint = function(x,y){
                            dev.log.interface('.viewport.adapter.windowPoint2workspacePoint(',x,y); //#development
                            const position = cachedValues.position;
                            const scale = cachedValues.scale;
                            const angle = cachedValues.angle;
            
                            let tmp = {x:x, y:y};
                            tmp = _canvas_.library.math.cartesianAngleAdjust(tmp.x,tmp.y,-angle);
                            tmp.x = tmp.x/scale + position.x;
                            tmp.y = tmp.y/scale + position.y;
            
                            return tmp;
                        };
                    };
                    
                //camera position
                    this.position = function(x,y){
                        dev.log.viewport('.position(',x,y); //#development
                        if(x == undefined || y == undefined){ return cachedValues.position; }
                        cachedValues.position = {x:x,y:y};
                        interface.operator.viewport.position(x,y);
                    };
                    this.scale = function(s){
                        dev.log.viewport('.scale(',s); //#development
                        if(s == undefined){ return cachedValues.scale; }
                        if(s == 0){ console.error('cannot set scale to zero'); }
                        cachedValues.scale = s;
                        interface.operator.viewport.scale(s);
                    };
                    this.angle = function(a){
                        dev.log.viewport('.angle(',a); //#development
                        if(a == undefined){ return cachedValues.angle; }
                        cachedValues.angle = a;
                        interface.operator.viewport.angle(a);
                    };
                    this.anchor = function(x,y){
                        dev.log.viewport('.anchor(',x,y); //#development
                        if(x == undefined || y == undefined){ return cachedValues.anchor; }
                        cachedValues.anchor = {x:x,y:y};
                        interface.operator.viewport.anchor(x,y);
                    };
                    this.scaleAroundWindowPoint = function(s,x,y){
                        dev.log.viewport('.scaleAroundWindowPoint(',s); //#development
                        if(s == undefined || x == undefined || y == undefined){ return; }
                        if(s == 0){ console.error('cannot set scale to zero'); }
                        cachedValues.scale = s;
                        interface.operator.viewport.scaleAroundWindowPoint(s,x,y).then(data => {
                            cachedValues.position = {x:data[0],y:data[1]};
                        });
                    };
                
                //mouse interaction
                    this.getElementsUnderPoint = function(x,y){
                        dev.log.viewport('.getElementsUnderPoint(',x,y); //#development
                        return new Promise((resolve, reject) => {
                            interface.operator.viewport.getElementsUnderPoint(x,y).then(ids => {
                                resolve(ids.map(id => self.element.getElementById(id)));
                            });
                        });
                    };
                    this.getElementsUnderArea = function(points){
                        dev.log.viewport('.getElementsUnderArea(',points); //#development
                        return new Promise((resolve, reject) => {
                            interface.operator.viewport.getElementsUnderArea(points).then(ids => {
                                resolve(ids.map(id => self.element.getElementById(id)));
                            });
                        });
                    };
                    this.mousePosition = function(x,y){
                        dev.log.viewport('.mousePosition(',x,y); //#development
                        if(x == undefined || y == undefined){ return mouseData; }
                        mouseData.x = x;
                        mouseData.y = y;
                        interface.operator.viewport.mousePosition(x,y);
                    };
                    this.stopMouseScroll = function(bool){
                        dev.log.viewport('.stopMouseScroll(',bool); //#development
                        if(bool == undefined){ return cachedValues.stopMouseScroll; }
                        cachedValues.stopMouseScroll = bool;
                        interface.operator.viewport.stopMouseScroll(bool);
                    };
                
                //misc
                    this.refresh = function(){
                        dev.log.viewport('.refresh()'); //#development
                        interface.operator.viewport.refresh();
                    };
                    this.cursor = function(type){
                        //cursor types: https://www.w3schools.com/csSref/tryit.asp?filename=trycss_cursor
                        if(type == undefined){return document.body.style.cursor;}
                        document.body.style.cursor = type;
                    };
                    this._dump = function(){
                        dev.log.viewport('._dump()'); //#development
                        interface.operator.viewport._dump();
                    };
            };
            this.stats = new function(){
                const cachedValues = {
                    active:false,
                };
            
                this.elementRenderDecision_clearData = function(){
                    dev.log.stats('.elementRenderDecision_clearData()'); //#development
                    interface.operator.stats.elementRenderDecision_clearData();
                };
            
                this.active = function(active){
                    dev.log.stats('.active(',active); //#development
                    if(active == undefined){ return cachedValues.active; }
                    cachedValues.active = active;
                    interface.operator.stats.active(active);
                };
                this.getReport = function(){
                    dev.log.stats('.getReport()'); //#development
                    return interface.operator.stats.getReport();
                };
            
            
                let autoPrintActive = false;
                let autoPrintIntervalId = undefined;
                this.autoPrint = function(bool){
                    dev.log.stats('.autoPrint(',bool); //#development
                    if(bool == undefined){ return autoPrintActive; }
                    autoPrintActive = bool;
            
                    if(autoPrintActive){
                        autoPrintIntervalId = setInterval(() => {
                            core.stats.getReport().then(console.log)
                        }, 500);
                    }else{
                        clearInterval(autoPrintIntervalId);
                    }
                };
                let autoPrintRenderDecisionReportActive = false;
                let autoPrintRenderDecisionReportIntervalId = undefined;
                this.autoPrintRenderDecisionReport = function(bool){
                    dev.log.stats('.autoPrintRenderDecisionReport(',bool); //#development
                    if(bool == undefined){ return autoPrintRenderDecisionReportActive; }
                    autoPrintRenderDecisionReportActive = bool;
            
                    if(autoPrintRenderDecisionReportActive){
                        autoPrintRenderDecisionReportIntervalId = setInterval(() => {
                            core.stats.getReport().then(data => {
                                Object.keys(data.renderDecision).sort().forEach(key => {
                                    let printingString = key + ': ';
                                    Object.keys(data.renderDecision[key]).sort().forEach((innerDataKey, index, array) => {
                                        printingString += innerDataKey + ':' + data.renderDecision[key][innerDataKey].percentage;
                                        if(index < array.length-1){ printingString += ' - '; }
                                    });
                                    console.log(printingString);
                                });
                                console.log('');
                            })
                        }, 500);
                    }else{
                        clearInterval(autoPrintRenderDecisionReportIntervalId);
                    }
            
                };
            
                let onScreenAutoPrint_active = false;
                let onScreenAutoPrint_intervalId = false;
                let onScreenAutoPrint_section = undefined;
                this.onScreenAutoPrint = function(bool){
                    dev.log.stats('.onScreenAutoPrint(',bool); //#development
                    if(bool == undefined){ return onScreenAutoPrint_active; }
                    onScreenAutoPrint_active = bool;
            
                    core.stats.active(bool);
            
                    if(onScreenAutoPrint_active){
                        onScreenAutoPrint_section = document.createElement('section');
                            onScreenAutoPrint_section.style = 'position:fixed; z-index:1; margin:0; font-family:Helvetica;';
                            document.body.prepend(onScreenAutoPrint_section);
                            
                        onScreenAutoPrint_intervalId = setInterval(() => {
                            onScreenAutoPrint_section.style.top = (window.innerHeight-onScreenAutoPrint_section.offsetHeight)+'px';
                            core.stats.getReport().then(data => {
                                const position = core.viewport.position();
                                const anchor = core.viewport.anchor();
            
                                const potentialFPS = data.secondsPerFrameOverTheLastThirtyFrames != 0 ? (1/data.secondsPerFrameOverTheLastThirtyFrames).toFixed(2) : 'infinite ';
            
                                onScreenAutoPrint_section.innerHTML = ''+
                                    '<p style="margin:1px"> position: x:'+ position.x + ' y:' + position.y +'</p>' +
                                    '<p style="margin:1px"> scale:'+ core.viewport.scale() +'</p>' +
                                    '<p style="margin:1px"> angle:'+ core.viewport.angle()+'</p>' +
                                    '<p style="margin:1px"> anchor: x:'+ anchor.x + ' y:' + anchor.y +'</p>' +
                                    '<p style="margin:1px"> framesPerSecond: '+ data.framesPerSecond.toFixed(2) +'</p>' +
                                    '<p style="margin:1px"> secondsPerFrameOverTheLastThirtyFrames: '+ data.secondsPerFrameOverTheLastThirtyFrames.toFixed(15) +' (potentially '+ potentialFPS +'fps)</p>' +
                                    '<p style="margin:1px"> renderSplitOverTheLastThirtyFrames: '+ data.renderSplit+'</p>' +
                                '';
            
                                onScreenAutoPrint_section.innerHTML += '<p style="margin:1px">render decision</p>';
                                Object.keys(data.renderDecision).sort().forEach(key => {
                                    let printingString = key + ': ';
                                    Object.keys(data.renderDecision[key]).sort().forEach((innerDataKey, index, array) => {
                                        printingString += innerDataKey + ':' + data.renderDecision[key][innerDataKey].percentage;
                                        if(index < array.length-1){ printingString += ' - '; }
                                    });
                                    onScreenAutoPrint_section.innerHTML += '<p style="margin:1px"> - '+ printingString + '</p>';
                                });
                    
                            });
                        }, 250);
                    }else{
                        clearInterval(onScreenAutoPrint_intervalId);
                        if(onScreenAutoPrint_section != undefined){ onScreenAutoPrint_section.remove(); }
                        onScreenAutoPrint_section = undefined;
                    }
                };
            
                this._dump = function(){
                    dev.log.callback('._dump()'); //#development
                    interface.operator.stats._dump();
                };
            };
            this.callback = new function(){
                this.listCallbackTypes = function(){
                    dev.log.callback('.listCallbackTypes()'); //#development
                    return interface.operator.callback.listCallbackTypes();
                };
                this.listActivationModes = function(){
                    dev.log.callback('.listActivationModes()'); //#development
                    return interface.operator.callback.listActivationModes();
                };
            
                const callbackRegistry = new function(){
                    const registeredShapes = {};
            
                    this.getCallback = function(id,callbackType){
                        if(id == undefined || registeredShapes[id] == undefined || registeredShapes[id][callbackType] == undefined){return;}
                        return registeredShapes[id][callbackType];
                    };
                    this.register = function(id,callbackType,callback){
                        if(!(id in registeredShapes)){ registeredShapes[id] = {}; }
                        registeredShapes[id][callbackType] = callback;
                    };
                    this.remove = function(id,callbackType){
                        registeredShapes[id][callbackType] = undefined;
                        delete registeredShapes[id][callbackType];
                    };
                    this.call = function(id,callbackType,x,y,event){
                        if(id == undefined || registeredShapes[id] == undefined || registeredShapes[id][callbackType] == undefined){return false;}
                        registeredShapes[id][callbackType](x,y,event);
                        return true;
                    };
                };
                this.getCallback = function(element, callbackType){
                    dev.log.callback('.getCallback(',element,callbackType); //#development
                    callbackRegistry.getCallback(element.getId(), callbackType);
                };
                this.attachCallback = function(element, callbackType, callback){
                    dev.log.callback('.attachCallback(',element,callbackType,callback); //#development
                    callbackRegistry.register(element.getId(), callbackType, callback);
                    interface.operator.callback.attachCallback(element.getId(),callbackType);
                };
                this.removeCallback = function(element, callbackType){
                    dev.log.callback('.removeCallback(',element,callbackType); //#development
                    callbackRegistry.remove(element.getId(), callbackType);
                    interface.operator.callback.removeCallback(element.getId(),callbackType);
                };
            
                let callbackActivationMode = 'firstMatch'; //topMostOnly / firstMatch / allMatches
                this.callbackActivationMode = function(mode){
                    if(mode == undefined){return callbackActivationMode;}
                    dev.log.callback('.callbackActivationMode(',mode); //#development
                    callbackActivationMode = mode;
                    return interface.operator.callback.callbackActivationMode(callbackActivationMode);
                };
            
                this.functions = {};
                this.__attachCallbacks = function(){
                    return new Promise((resolve, reject) => {
                        this.listCallbackTypes().then(callbackNames => {
                            dev.log.callback(' setting up outgoing message callbacks'); //#development
                            callbackNames.forEach(callbackName => {
                                dev.log.callback(' ->',callbackName); //#development
            
                                //outgoing messages
                                    _canvas_[callbackName] = function(event){
                                        let sudoEvent = {};
                                        if(event instanceof KeyboardEvent){
                                            sudoEvent = {
                                                key: event.key,
                                                code: event.code,
                                                keyCode: event.keyCode,
                                                altKey: event.altKey,
                                                ctrlKey: event.ctrlKey,
                                                metaKey: event.metaKey,
                                                shiftKey: event.shiftKey,
                                            };
                                        }else if(event instanceof WheelEvent){
                                            sudoEvent = { 
                                                x: event.offsetX,
                                                y: event.offsetY,
                                                wheelDelta: event.wheelDelta,
                                                wheelDeltaX: event.wheelDeltaX,
                                                wheelDeltaY: event.wheelDeltaY,
                                                altKey: event.altKey,
                                                ctrlKey: event.ctrlKey,
                                                metaKey: event.metaKey,
                                                shiftKey: event.shiftKey,
                                            };
                                        }else if(event instanceof MouseEvent){
                                            sudoEvent = { 
                                                x: event.offsetX, 
                                                y: event.offsetY,
                                                altKey: event.altKey,
                                                ctrlKey: event.ctrlKey,
                                                metaKey: event.metaKey,
                                                shiftKey: event.shiftKey,
                                                buttons: event.buttons,
                                            };
                                        }else{
                                            console.warn('unknown event type: ',event);
                                        }
                                        
                                        communicationModule.run_withoutPromise('operator__callback__coupling_in__'+callbackName, [sudoEvent]);
                                    };
            
                                //incoming messages
                                    communicationModule.function['callback__'+callbackName] = function(xy,event,all_elements,relevant_elements){
                                        dev.log.callback('.callback - engine has called: callback__'+callbackName+'(',xy,event,all_elements,relevant_elements); //#development
                                        
                                        if(core.callback.functions[callbackName]){
                                            core.callback.functions[callbackName](xy.x,xy.y,event,{
                                                all: all_elements.map(core.element.getElementById),
                                                relevant: relevant_elements.map(core.element.getElementById),
                                            });
                                        }
            
                                        relevant_elements.forEach(id => callbackRegistry.call(id,callbackName,xy.x,xy.y,event) );
                                    };
            
                                resolve();
                            });
                        });
                    });
                }
            
                this._dump = function(){
                    dev.log.callback('._dump()'); //#development
                    interface.operator.callback._dump();
                };
            };
            
            this.meta = new function(){
                this.refresh = function(){
                    return interface.operator.meta.refresh();
                };
            };
        
            this.ready = function(){
                core.callback.__attachCallbacks().then(() => {
                    _canvas_.layers.declareLayerAsLoaded("core");
                });
            }
        };
        
        _canvas_.layers.registerLayer("core", _canvas_.core);
        
        _canvas_.layers.registerFunctionForLayer("core", function(){
            let canvases = [];
        
            for(let y = 0; y < 5; y++){
                for(let x = 0; x < 5; x++){
                    canvas = _canvas_.core.element.create('Canvas','test_canvas_'+y+'_'+x);
                    canvas.unifiedAttribute({ x:10 + 70*x, y:10 + 70*y, width:60, height:60 });
                    _canvas_.core.arrangement.append(canvas);
                    canvases.push(canvas);
                }
            }
        
            let tick = 0;
            setInterval(() => {
                tick += 0.1;
        
                canvases.forEach((canvas,index) => {
                    const length = Math.abs(Math.sin(tick*(1+(index/100))));
                    canvas._.fillStyle = _canvas_.library.math.convertColour.obj2rgba({r:1,g:1,b:1,a:1});
                    canvas._.fillRect(0,0,canvas.$(60),canvas.$(60));
                    canvas._.fillStyle = _canvas_.library.math.convertColour.obj2rgba({r:0.732,g:0.756,b:0.892,a:1});
                    canvas._.fillRect(canvas.$(0),canvas.$(0),canvas.$(60),canvas.$(length*60));
                    canvas.requestUpdate();
                });
            }, 1);
        });
    }
}
