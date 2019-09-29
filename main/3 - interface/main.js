_canvas_.interface = new function(){
    this.versionInformation = { tick:1, lastDateModified:{y:2019,m:9,d:29} };
    var interface = this;

    this.circuit = new function(){
        {{include:circuit/main.js}}
    };
    this.part = new function(){
        {{include:part/main.js}}
    };
    this.unit = new function(){
        {{include:unit/main.js}}
    };
};