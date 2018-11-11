canvas.system = new function(){};
canvas.system.mouse = new function(){
    {{include:mouse.js}}
};
canvas.system.keyboard = new function(){
    {{include:keyboard.js}}
};

{{include:paneSetup.js}}

canvas.core.render.active(true);