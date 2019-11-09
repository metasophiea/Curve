const communicationModule = new function(communicationObject,callerName){
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
}(core_engine,'core_console');
















const interface = {
    getAvailableShapes:function(callback){
        communicationModule.run('arrangement.getAvailableShapes',[],callback);
    },
    getCreatedShapes:function(callback){
        communicationModule.run('arrangement.getCreatedShapes',[],callback);
    },
    getProxyableMethodsForShapeByShapeType:function(type,callback){
        communicationModule.run('arrangement.getProxyableMethodsForShapeByShapeType',[type],callback);
    },
    deleteAll:function(){
        communicationModule.run('arrangement.deleteAll',[]);
    },
    createShape:function(type,callback){
        communicationModule.run('arrangement.createShape',[type],callback);
    },
    createShapeWithProxy:function(type,callback){
        interface.getProxyableMethodsForShapeByShapeType(type,methodList => {
            interface.createShape(type,shapeId => {
                const proxyShape = function(_id){
                    const id = _id;
                    this.getID = function(){return id;};
                };
                let newProxyShape = new proxyShape(shapeId);
                methodList.forEach(method => {
                    let functionBody = 'interface.executeShapeMethod(this.getID(),"'+method.function+'",['+method.arguments.join(',')+'],callback);';
                    method.arguments.forEach(arg => { functionBody = 'if('+arg+' != undefined && '+arg+'.constructor.name == "proxyShape"){'+arg+' = '+arg+'.getID();}' + functionBody; });
                    newProxyShape[method.function] = new Function( ...(method.arguments.concat(['callback',functionBody])) );
                });
                callback(newProxyShape);
            });
        });
    },
    deleteShape:function(shapeId){
        communicationModule.run('arrangement.deleteShape',[shapeId]);
    },
    executeShapeMethod:function(shapeId,methodName,argumentList,callback){
        communicationModule.run('arrangement.executeShapeMethod',[shapeId,methodName,argumentList],callback);
    },
};