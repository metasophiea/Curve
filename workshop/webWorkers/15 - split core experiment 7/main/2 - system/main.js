_canvas_.system = new function(){
    this.versionInformation = { tick:0, lastDateModified:{y:2019,m:10,d:19} };
};
_canvas_.system.mouse = new function(){
    {{include:mouse.js}}
};
_canvas_.system.keyboard = new function(){
    {{include:keyboard.js}}
};

{{include:paneSetup.js}}