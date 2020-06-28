_canvas_.core = new function(){
    this.versionInformation = { tick:0, lastDateModified:{y:2020,m:6,d:25} };
    const core_engine = new Worker("/js/core_engine.js");
    {{include:console/main.js}}
};

_canvas_.layers.registerLayer("core", _canvas_.core);