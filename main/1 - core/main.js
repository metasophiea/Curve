_canvas_.core = new function(){
    this.versionInformation = { tick:0, lastDateModified:{y:2020,m:3,d:21} };
    const core_engine = new Worker("/js/core_engine.js");
    {{include:console/main.js}}
};