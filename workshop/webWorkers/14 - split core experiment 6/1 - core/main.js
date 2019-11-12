const core = new function(){
    const core_engine = new Worker("docs/core_engine.js");
    {{include:console/main.js}}
};