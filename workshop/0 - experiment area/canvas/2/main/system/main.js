canvas.system = new function(){};

canvas.system.utility = new function(){
    {{include:utility.js}}
};
canvas.system.core = new function(){
    {{include:core.js}}
};
canvas.system.mouse = new function(){
    {{include:mouse.js}}
};




canvas.system.core.animate();
// canvas.system.core.render2();