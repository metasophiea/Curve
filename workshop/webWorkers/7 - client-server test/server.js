const communicationModule = new function(communicationObject){
    const self = this;
    this.function = {};

    let messageId = 0;
    const messagingCallbacks = {};

    communicationObject.onmessage = function(encodedPacket){
        var message = encodedPacket.data;

        if(message.outgoing){
            if(message.cargo.function in self.function){
                communicationObject.postMessage({
                    id:message.id,
                    outgoing:false,
                    cargo:self.function[message.cargo.function](...message.cargo.arguments),
                });
            }
        }else{
            if(messagingCallbacks[message.id] != undefined){
                messagingCallbacks[message.id](message.cargo);
                delete messagingCallbacks[message.id];
            }
        }
    };

    this.run = function(cargo,callback){
        if(callback != undefined){ messagingCallbacks[messageId] = callback; }
        communicationObject.postMessage({ id:messageId++, outgoing:true, cargo:cargo });
    };
}(this);

communicationModule.function.adder = function(a,b){return a+b;};

communicationModule.run(
    {function:'adder', arguments:[2,3]},
    (a) => console.log(a)
);