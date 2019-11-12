_canvas_.core = new function(){
    this.versionInformation = { tick:0, lastDateModified:{y:'????',m:'??',d:'??'} };
    const core_engine = new Worker("js/core_engine.js");
    {{include:console/main.js}}
};