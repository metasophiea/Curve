_canvas_.curve = new function(){
    this.versionInformation = { tick:0, lastDateModified:{y:'????',m:'??',d:'??'} };
    this.go = new function(){
        const functionList = [];

        this.add = function(newFunction){ functionList.push(newFunction); };
        this.__activate = function(){ functionList.forEach(f => f()); };
    };

};

_canvas_.control.go.add( function(){
    _canvas_.control.gui.showMenubar();
    _canvas_.control.viewport.stopMouseScroll(true);
    _canvas_.control.viewport.activeRender(true);
    _canvas_.core.render.activeLimitToFrameRate(true);
    if( (new URL(window.location.href)).searchParams.get("darkmode") != null ){ _canvas_.control.misc.darkMode(); }

    _canvas_.layers.registerLayerLoaded('curve',_canvas_.curve);
    _canvas_.curve.go.__activate();
} );

{{include:units/main.js}}
{{include:menubarItems.js}}
// {{include:queryStringManager.js}}