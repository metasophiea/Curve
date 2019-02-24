_canvas_.interface = new function(){
    var interface = this;

    this.circuit = new function(){
        {{include:circuit/main.js}}
    };
    this.part = new function(){
        {{include:part/main.js}}
    };
    // this.unit = new function(){
    //     {{include:unit/main.js}}
    // };
};