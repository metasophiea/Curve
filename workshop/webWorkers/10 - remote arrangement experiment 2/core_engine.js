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
}(this,'core_engine');
















const arrangement = new function(){
    //shape library
        const shapeLibrary = new function(){
            this.group = function(_id){
                const type = 'group';
                this.getType = function(){return type};
                const id = _id;
                this.getId = function(){return id};

                const children = [];
                this.getChildren = function(){
                    return children.map((child) => {
                        if(child.getType() == 'group'){ return child.getChildren(); }
                        return getIdFromShape(child);
                    });
                };
                this.getChildCount = function(){ return children.length; };
                this.addChild = function(shapeId){ children.push(getShapeById(shapeId)); };
                this.removeChild = function(shapeId){ children.splice(children.indexOf(getShapeById(shapeId)),1); };
            };
            this.group.proxyableMethods = [
                {function:'getChildren',arguments:[]},
                {function:'getChildCount',arguments:[]},
                {function:'addChild',arguments:['child']},
                {function:'removeChild',arguments:['child']}
            ];
            this.element = function(_id){
                const type = 'element';
                this.getType = function(){return type};
                const id = _id;
                this.getId = function(){return id};

                let data = Math.random();
                this.getData = function(){return data;};
                this.setData = function(a){data = a;};
            };
            this.element.proxyableMethods = [
                {function:'getData',arguments:[]},
                {function:'setData',arguments:['a']}
            ];
        };
        this.getAvailableShapes = function(){ return Object.keys(shapeLibrary); };
        this.getProxyableMethodsForShapeByShapeType = function(type){
            return shapeLibrary[type].proxyableMethods;
        };

    //shape universe
        const createdShapes = [];
        function generateShapeId(){
            let newId = 0;
            while(createdShapes[newId] != undefined){newId++;}
            return newId;
        }
        function getShapeById(id){ return createdShapes[id]; }
        function getIdFromShape(shape){ return shape.getId(); }
        this.deleteAll = function(){ for(let a = 0; a < createdShapes.length; a++){createdShapes[a]=undefined;} };
        this.getCreatedShapes = function(){
            return createdShapes.map(shape => getIdFromShape(shape));
        };
        this.createShape = function(type){
            let newShape;
            let newShape_id = generateShapeId();

            switch(type){
                case 'group': newShape = new shapeLibrary.group(newShape_id); break;
                case 'element': newShape = new shapeLibrary.element(newShape_id); break;
            }

            createdShapes[newShape_id] = newShape;
            return getIdFromShape(newShape);
        };
        this.deleteShape = function(shapeId){
            createdShapes[shapeId] = undefined;
        };
        this.executeShapeMethod = function(shapeId,methodName,argumentList=[]){
            return getShapeById(shapeId)[methodName](...argumentList);
        };

    //selected design
        let selectedDesignShapeId = 0;
        this.getArrangement = function(){ return createdShapes[selectedDesignShapeId]; };
        this.selectDesign = function(id){ selectedDesignShapeId = id; };
};
communicationModule.function['arrangement.deleteAll'] = function(){ return arrangement.deleteAll(); };
communicationModule.function['arrangement.getCreatedShapes'] = function(){ return arrangement.getCreatedShapes(); };
communicationModule.function['arrangement.getAvailableShapes'] = function(){ return arrangement.getAvailableShapes(); };
communicationModule.function['arrangement.getProxyableMethodsForShapeByShapeType'] = function(type){ return arrangement.getProxyableMethodsForShapeByShapeType(type); };
communicationModule.function['arrangement.createShape'] = function(type){ return arrangement.createShape(type); };
communicationModule.function['arrangement.deleteShape'] = function(shapeID){ return arrangement.deleteShape(shapeID); };
communicationModule.function['arrangement.executeShapeMethod'] = function(shapeId,methodName,argumentList){ return arrangement.executeShapeMethod(shapeId,methodName,argumentList); };