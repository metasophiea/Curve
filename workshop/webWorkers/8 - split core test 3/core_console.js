const core_console = new function(){
    const canvasElement = document.getElementById('theCanvas');
    const communicationModule = new function(communicationObject,callerName){
        const self = this;
        const devMode = true;
        this.log = function(){
            if(!devMode){return;}
            let prefix = 'communicationModule['+callerName+']';
            console.log('%c'+prefix+(new Array(...arguments).join(' ')),'color:rgb(235, 52, 131); font-style:italic;' );
        };
        this.function = {};
    
        let messageId = 0;
        const messagingCallbacks = {};
    
        function generateMessageID(){
            self.log('::generateMessageID()');
            return messageId++;
        }
    
        communicationObject.onmessage = function(encodedPacket){
            self.log('::communicationObject.onmessage('+JSON.stringify(encodedPacket)+')');
            let message = encodedPacket.data;
    
            if(message.outgoing){
                self.log('::communicationObject.onmessage -> message is an outgoing one');
                if(message.cargo.function in self.function){
                    self.log('::communicationObject.onmessage -> function "'+message.cargo.function+'" found');
                    self.log('::communicationObject.onmessage -> function arguments: '+JSON.stringify(message.cargo.arguments));
                    if(message.id == null){
                        self.log('::communicationObject.onmessage -> message ID missing; will not return any data');
                        self.function[message.cargo.function](...message.cargo.arguments);
                    }else{
                        self.log('::communicationObject.onmessage -> message ID found; "'+message.id+'", will return any data');
                        communicationObject.postMessage({
                            id:message.id,
                            outgoing:false,
                            cargo:self.function[message.cargo.function](...message.cargo.arguments),
                        });
                    }
                }else{
                    self.log('::communicationObject.onmessage -> function "'+message.cargo.function+'" not found');
                }
            }else{
                self.log('::communicationObject.onmessage -> message is an incoming one');
                self.log('::communicationObject.onmessage -> message ID: '+message.id+' cargo: '+JSON.stringify(message.cargo));
                messagingCallbacks[message.id](message.cargo);
                delete messagingCallbacks[message.id];
            }
        };
        this.run = function(cargo,callback){
            self.log('.run('+JSON.stringify(cargo)+','+callback+')');
            let id = null;
            if(callback != undefined){
                self.log('.run -> callback was defined; generating message ID');
                id = generateMessageID();
                self.log('.run -> message ID:',id);
                messagingCallbacks[id] = callback;
            }
            communicationObject.postMessage({ id:id, outgoing:true, cargo:cargo });
        };
    }(core_engine,'core_console');

    function printToScreen(imageData){ canvasElement.getContext("bitmaprenderer").transferFromImageBitmap(imageData); };
    communicationModule.function.printToScreen = printToScreen;

    // this.shape
    // this.arrangment
    // this.render
    this.viewport = new function(){
        this.position = function(x,y,callback){ 
            communicationModule.run( {function:'viewport.position', arguments:[x,y]}, callback);
        };
        this.scale = function(s,callback){ 
            communicationModule.run( {function:'viewport.scale', arguments:[s]}, callback);
        };
        this.angle = function(a,callback){ 
            communicationModule.run( {function:'viewport.angle', arguments:[a]}, callback);
        };
        this.getElementUnderCanvasPoint = function(x,y,callback){ 
            communicationModule.run( {function:'viewport.getElementUnderCanvasPoint', arguments:[x,y]}, callback );
        };
        this.getElementsUnderCanvasArea = function(points,callback){ 
            communicationModule.run( {function:'viewport.getElementsUnderCanvasArea', arguments:[points]}, callback );
        };
        this.calculateViewportExtremities = function(){ 
            communicationModule.run( {function:'viewport.calculateViewportExtremities', arguments:[]} );
        };
        this.refresh = function(){ 
            communicationModule.run( {function:'viewport.refresh', arguments:[]} );
        };
        this.getBoundingBox = function(callback){ 
            communicationModule.run( {function:'viewport.getBoundingBox', arguments:[]}, callback );
        };
        this.mousePosition = function(x,y,callback){ 
            communicationModule.run( {function:'viewport.mousePosition', arguments:[x,y]}, callback );
        };
        this.clickVisibility = function(a,callback){ 
            communicationModule.run( {function:'viewport.clickVisibility', arguments:[a]}, callback);
        };
        this.getHeight = function(callback){ 
            communicationModule.run( {function:'viewport.getHeight', arguments:[]}, callback );
        };
        this.getWidth = function(callback){ 
            communicationModule.run( {function:'viewport.getWidth', arguments:[]}, callback );
        };
    };
    // this.stats
};


//test
    setTimeout(() => {
        console.log('');
        core_console.viewport.position(20,20);
    },100);

    setTimeout(() => {
        console.log('');
        core_console.viewport.position(undefined,undefined,(response) => {console.log('position:',response);});
    },200);

    setTimeout(() => {
        console.log('');
        core_console.viewport.getWidth((response) => {console.log('width:', response);});
    },300);

    setTimeout(() => {
        console.log('');
        core_console.viewport.getHeight((response) => {console.log('height:', response);});
    },400);
