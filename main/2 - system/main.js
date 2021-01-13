_canvas_.system = new function(){
    this.versionInformation = { tick:0, lastDateModified:{y:2021,m:1,d:13} };
    this.mouseReady = false;
};
_canvas_.system.mouse = new function(){
    {{include:mouse.js}}
};
_canvas_.system.keyboard = new function(){
    {{include:keyboard.js}}
};

_canvas_.layers.registerLayer("system", _canvas_.system);

{{include:paneSetup.js}}

const checkingInterval = setInterval(() => {
    if(
        _canvas_.system.pane != undefined &&
        _canvas_.system.pane.b != undefined &&
        _canvas_.system.pane.b.getId() != -1 &&
        _canvas_.system.pane.mb.getId() != -1 &&
        _canvas_.system.pane.mm.getId() != -1 &&
        _canvas_.system.pane.mf.getId() != -1 &&
        _canvas_.system.pane.f.getId() != -1 &&
        _canvas_.system.mouse.original != undefined
    ){
        clearInterval(checkingInterval);
        _canvas_.layers.declareLayerAsLoaded("system");
    }
}, 100);