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