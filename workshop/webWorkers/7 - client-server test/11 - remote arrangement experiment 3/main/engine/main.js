{{include:../communicationModule.js}}
const communicationModule = new communicationModuleMaker(this,'core_engine');
communicationModule.function['ready'] = function(){return false;};

const arrangement = new function(){
    const shapeLibrary = new function(){
        {{include:shapeLibrary/*}} /**/
    };
    this.getAvailableShapes = function(){ return Object.keys(shapeLibrary); };
    this.getProxyableMethodsForShape = function(type){ return shapeLibrary[type].proxyableMethods; };

    {{include:controls.js}}
    {{include:paging.js}}
    {{include:mapping.js}}
};

communicationModule.function['ready'] = function(){return true;};