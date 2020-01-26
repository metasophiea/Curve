_canvas_.core = new function(){
    this.versionInformation = { tick:0, lastDateModified:{y:2020,m:1,d:20} };
    const core_engine = new Worker("/js/core_engine.js");
    {{include:console/main.js}}
};