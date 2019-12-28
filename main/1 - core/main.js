_canvas_.core = new function(){
    this.versionInformation = { tick:0, lastDateModified:{y:2019,m:12,d:28} };
    const core_engine = new Worker("js/core_engine.js");
    {{include:console/main.js}}
};