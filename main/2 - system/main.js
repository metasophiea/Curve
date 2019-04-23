_canvas_.system = new function(){};
_canvas_.system.mouse = new function(){
    {{include:mouse.js}}
};
_canvas_.system.keyboard = new function(){
    {{include:keyboard.js}}
};

{{include:paneSetup.js}}