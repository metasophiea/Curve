workspace.system = new function(){};
workspace.system.mouse = new function(){
    {{include:mouse.js}}
};
workspace.system.keyboard = new function(){
    {{include:keyboard.js}}
};

{{include:paneSetup.js}}