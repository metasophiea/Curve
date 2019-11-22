_canvas_.system = new function(){
    this.versionInformation = { tick:0, lastDateModified:{y:'????',m:'??',d:'??'} };
};
_canvas_.system.mouse = new function(){
    {{include:mouse.js}}
};
_canvas_.system.keyboard = new function(){
    {{include:keyboard.js}}
};

{{include:paneSetup.js}}