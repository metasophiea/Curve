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

var test = [];
const interface = {
    hello:function(){
        communicationModule.run({function:'hello'});
    },
    makeShape:function(type,callback){
        communicationModule.run({function:'arrangement.makeShape',arguments:[type]},function(shape){
            let proxyShape = new function(){
                const type = shape.type;
                const id = shape.id;

                this.getType = function(){return type};
            };
            shape.methods.forEach((method) => {
                proxyShape[method.function] = new Function(
                    ...method.arguments.concat([ "callback", "" +
                        "console.log(this);" +
                        "interface.executeShapeMethod(this,{function:'"+method.function+"',arguments:[]});"
                    ])
                );
            });

            console.log(proxyShape);
            test.push(proxyShape);


            callback(shape);
        });
    },
    executeShapeMethod:function(shape,functionInfo,callback){
        communicationModule.run({function:'arrangement.executeShapeMethod',arguments:[shape,functionInfo]},callback);
    },
};







let t = 0;
let shapes = [];

setTimeout(() => {
    console.log('');
    interface.hello();
},t+=100);

setTimeout(() => {
    console.log('');
    console.log('-> create group');
    interface.makeShape('group', function(shape){
        console.log(shape);
        shapes.push(shape);
    });
},t+=100);

setTimeout(() => {
    console.log('');
    console.log('-> create another group');
    interface.makeShape('group', function(shape){
        console.log(shape);
        shapes.push(shape);
    });
},t+=100);

setTimeout(() => {
    console.log('');
    console.log('-> create element');
    interface.makeShape('element', function(shape){
        console.log(shape);
        shapes.push(shape);
    });
},t+=100);

setTimeout(() => {
    console.log('');
    console.log('-> get data from element');
    interface.executeShapeMethod(shapes[2],{function:'getData'},console.log);
},t+=100);

setTimeout(() => {
    console.log('');
    console.log('-> modify element');
    interface.executeShapeMethod(shapes[2],{function:'setData',arguments:[100]});
},t+=100);

setTimeout(() => {
    console.log('');
    console.log('-> get data from element');
    interface.executeShapeMethod(shapes[2],{function:'getData'},console.log);
},t+=100);

setTimeout(() => {
    console.log('');
    console.log('-> add element to group');
    interface.executeShapeMethod(shapes[0],{function:'addChild',arguments:[shapes[2]]});
},t+=100);

setTimeout(() => {
    console.log('');
    console.log('-> get children of group');
    interface.executeShapeMethod(shapes[0],{function:'getChildren'},console.log);
},t+=100);

setTimeout(() => {
    console.log('');
    console.log('-> remove element from group');
    interface.executeShapeMethod(shapes[0],{function:'removeChild',arguments:[shapes[2]]});
},t+=100);

setTimeout(() => {
    console.log('');
    console.log('-> get children of group');
    interface.executeShapeMethod(shapes[0],{function:'getChildren'},console.log);
},t+=100);