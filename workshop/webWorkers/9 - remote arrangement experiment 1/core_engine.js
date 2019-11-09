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
}(this,'core_engine');

communicationModule.function['hello'] = function(){
    console.log('hello from the engine');
};






const arrangement = new function(){
    const createdShapes = [];
    this.getCreatedShapes = function(){ return createdShapes; };

    function shapeToProxyShape(shape){ return {type:shape.getType(), id:shape.id, methods:shape._proxyableMethods} }
    function proxyShapeToShape(proxyShape){ return createdShapes[proxyShape.id]; }

    let id = 0;
    function generateShapeID(){ return id++; }


    this.makeShape = function(type){
        let newShape;
        let newShape_id = generateShapeID();

        const group = function(){
            const type = 'group';
            this.getType = function(){return type};
            this.id = newShape_id;

            const children = [];
            this.getChildren = function(){
                return children.map((child) => {
                    if(child.getType() == 'group'){ return child.getChildren(); }
                    return shapeToProxyShape(child);
                });
            };
            this.addChild = function(proxyShape){ children.push(proxyShapeToShape(proxyShape)); };
            this.removeChild = function(proxyShape){ children.splice(children.indexOf(proxyShapeToShape(proxyShape)),1); };

            this._proxyableMethods = [
                {function:'getChildren',arguments:[]},
                {function:'addChild',arguments:['proxyShape']},
                {function:'removeChild',arguments:['child']}
            ];
        };
        const element = function(){
            const type = 'element';
            this.getType = function(){return type};
            this.id = newShape_id;

            let data = Math.random();
            this.getData = function(){return data;};
            this.setData = function(a){data = a;};

            this._proxyableMethods = [
                {function:'getData',arguments:[]},
                {function:'setData',arguments:['a']}
            ];
        };

        switch(type){
            case 'group': newShape = new group(); break;
            case 'element': newShape = new element(); break;
        }

        createdShapes[newShape_id] = newShape;
        return shapeToProxyShape(newShape);
    };
    this.executeShapeMethod = function(proxyShape,functionInfo){
        if(functionInfo.arguments == undefined){functionInfo.arguments = [];}
        return proxyShapeToShape(proxyShape)[functionInfo.function](...functionInfo.arguments);
    };
};

communicationModule.function['arrangement.makeShape'] = function(type){
    return arrangement.makeShape(type);
};
communicationModule.function['arrangement.executeShapeMethod'] = function(shape,functionInfo){
    return arrangement.executeShapeMethod(shape,functionInfo);
};