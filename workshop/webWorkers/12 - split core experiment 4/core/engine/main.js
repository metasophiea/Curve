{{include:../communicationModule.js}}
const communicationModule = new communicationModuleMaker(this,'core_engine');
communicationModule.function['ready'] = function(){return false;};

{{include:library.js}}

const dev = {
    shape:{active:true,fontStyle:'color:rgb(161, 145, 80); font-style:italic;'},
    arrangement:{active:true,fontStyle:'color:rgb(80, 161, 141); font-style:italic;'},
    shapeLibrary:{active:true,fontStyle:'color:rgb(129, 80, 161); font-style:italic;'},
    render:{active:true,fontStyle:'color:rgb(161, 84, 80); font-style:italic;'},
    viewport:{active:true,fontStyle:'color:rgb(80, 134, 161); font-style:italic;'},
    stats:{active:true,fontStyle:''},
    log:function(section){ 
        if(dev[section].active){
            console.log('%c'+'core_engine.'+section+(new Array(...arguments).slice(1).join(' ')),dev[section].fontStyle );
        }
    },
};

{{include:shape.js}}
{{include:arrangement.js}}
{{include:render.js}}
{{include:viewport.js}}

communicationModule.function['ready'] = function(){return true;};