canvas.part = new function(){};

canvas.part.circuit = new function(){
    {{include:circuit/main.js}}
};

canvas.part.element = new function(){
    {{include:element/main.js}}
};

{{include:builder.js}}