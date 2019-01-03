var part = new function(){
    this.circuit = new function(){
        {{include:circuit/circuit.js}}
    };
    this.element = new function(){
        {{include:element/element.js}}
    };
};

{{include:builder.js}}