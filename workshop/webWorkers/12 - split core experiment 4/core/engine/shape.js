const shape = new function(){
    //shapeLibrary
        const shapeLibrary = new function(){
            {{include:shapeLibrary/*}} /**/
        };
        this.getAvailableShapes = function(){ 
            dev.log('shape','.getAvailableShapes()'); 
            return Object.keys(shapeLibrary);
        };
        this.getProxyableShapeMethods = function(type){ 
            dev.log('shape','.getProxyableShapeMethods()'); 
            return shapeLibrary[type].proxyableMethods;
        };

    //controls
        const createdShapes = [];

        function generateShapeId(){
            let id = createdShapes.findIndex(item => item==undefined);
            return id != -1 ? id : createdShapes.length;
        }
        function getShapeById(id){ return createdShapes[id]; }
        function getIdFromShape(shape){ return shape.getId(); }
        this.getShapeById = getShapeById;
        this.getIdFromShape = getIdFromShape;
        this.getCreatedShapes = function(){ 
            dev.log('shape','.getCreatedShapes()'); 
            return createdShapes.map(shape => getIdFromShape(shape));
        };

        this.createShape_raw = function(type,name){
            dev.log('shape','.createShape_raw('+type+','+name+')');
            return new shapeLibrary[type](name);
        };
        this.createShape = function(type,name){
            dev.log('shape','.createShape('+type+','+name+')'); 
            const newShape_id = generateShapeId();
            createdShapes[newShape_id] = new shapeLibrary[type](name,newShape_id);
            return newShape_id;
        };        
        this.deleteShape = function(id){ 
            dev.log('shape','.deleteShape('+id+')'); 
            createdShapes[id] = undefined;
        };
        this.deleteAllCreatedShapes = function(){ 
            dev.log('shape','.deleteAllCreatedShapes()'); 
            for(let a = 0; a < createdShapes.length; a++){this.deleteShape(a);}
        };
        this.getShapeTypeById = function(id){ 
            dev.log('shape','.getShapeTypeById('+id+')');
            return getShapeById(id).getType();
        };
        this.executeShapeMethod = function(id,methodName,argumentList=[]){
            dev.log('shape','.executeShapeMethod('+id+','+methodName+','+JSON.stringify(argumentList)+')');
            return getShapeById(id)[methodName](...argumentList);
        };
        
    //mapping
        [
            {function:'getAvailableShapes', arguments:[]},
            {function:'getProxyableShapeMethods', arguments:['type']},
        
            {function:'createShape', arguments:['type','name']},
            {function:'deleteShape', arguments:['id']},
            {function:'deleteAllCreatedShapes', arguments:[]},
            {function:'getCreatedShapes', arguments:[]},
            {function:'getShapeTypeById', arguments:['id']},
            {function:'executeShapeMethod', arguments:['id','methodName','arguments']},
        ].forEach( method => {
            communicationModule.function['shape.'+method.function] = new Function( ...(method.arguments.concat('return shape.'+method.function+'('+method.arguments.join(',')+');')) );
        });
};