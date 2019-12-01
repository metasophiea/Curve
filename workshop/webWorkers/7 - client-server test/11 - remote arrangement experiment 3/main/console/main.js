{{include:../communicationModule.js}}

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