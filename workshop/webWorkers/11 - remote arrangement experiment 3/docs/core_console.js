const communicationModuleMaker = function(communicationObject,callerName){
    const self = this;
    const devMode = !true;
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
                    if(message.cargo.arguments == undefined){message.cargo.arguments = [];}
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
    this.run = function(functionName,argumentList=[],callback){
        self.log('.run('+functionName+','+JSON.stringify(argumentList)+','+callback+')');
        let id = null;
        if(callback != undefined){
            self.log('.run -> callback was defined; generating message ID');
            id = generateMessageID();
            self.log('.run -> message ID:',id);
            messagingCallbacks[id] = callback;
        }
        communicationObject.postMessage({ id:id, outgoing:true, cargo:{function:functionName,arguments:argumentList} });
    };
};

const core_engine = new Worker("docs/core_engine.js");

const communicationModule = new communicationModuleMaker(core_engine,'core_console');

const core = {
    ready:function(){
        return new Promise(function(resolve, reject) { communicationModule.run('ready',[],resolve); });
    },

    arrangement:{
        getAvailableShapes:function(){ 
            return new Promise(function(resolve, reject) { communicationModule.run('arrangement.getAvailableShapes',[],resolve); });
        },
        getProxyableMethodsForShape:function(type){ 
            return new Promise(function(resolve, reject) { communicationModule.run('arrangement.getProxyableMethodsForShape',[type],resolve); });
        },

        deleteShape:function(shapeId){ communicationModule.run('arrangement.deleteShape',[shapeId]); },
        deleteAllCreatedShapes:function(){ communicationModule.run('arrangement.deleteAllCreatedShapes',[]); },
        getCreatedShapes:function(){
            return new Promise( (resolve,reject) => {
                communicationModule.run('arrangement.getCreatedShapes',[],resolve);    
            } );
        },
        getShapeTypeById:function(shapeId){
            return new Promise( (resolve,reject) => {
                communicationModule.run('arrangement.getShapeTypeById',[shapeId],resolve);    
            } );
        },
        createShape:function(type){
            return new Promise( (resolve,reject) => {
                communicationModule.run('arrangement.createShape',[type],resolve);    
            } );
        },
        executeShapeMethod:function(shapeId,methodName,argumentList){
            return new Promise( (resolve,reject) => {
                communicationModule.run('arrangement.executeShapeMethod',[shapeId,methodName,argumentList],resolve);    
            } );
        },
    },
};
