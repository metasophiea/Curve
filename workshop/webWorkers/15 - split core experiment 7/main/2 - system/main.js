_canvas_.system = new function(){
    this.versionInformation = { tick:0, lastDateModified:{y:'????',m:'??',d:'??'} };
    this.mouseReady = false;

    this.go = new function(){
        const functionList = [];

        this.add = function(newFunction){ functionList.push(newFunction); };
        this.__activate = function(){ functionList.forEach(f => f()); };
    };
};
_canvas_.system.mouse = new function(){
    {{include:mouse.js}}
};
_canvas_.system.keyboard = new function(){
    {{include:keyboard.js}}
};

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
        _canvas_.layers.registerLayerLoaded('system',_canvas_.system);
        _canvas_.system.go.__activate();
    }
}, 100);