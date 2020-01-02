_canvas_.curve = new function(){
    this.versionInformation = { tick:0, lastDateModified:{y:2020,m:1,d:2} };
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
    _canvas_.core.render.frameRateLimit(30);

    _canvas_.layers.registerLayerLoaded('curve',_canvas_.curve);
    _canvas_.curve.go.__activate();
} );

_canvas_.curve.go.add(function(){
    _canvas_.control.queryString.modLoader();
    _canvas_.control.queryString.defaultDemoUrlPrefix = 'https://curve.metasophiea.com/demos/';
    _canvas_.control.queryString.demoLoader();
    if( (new URL(window.location.href)).searchParams.get("darkmode") != null ){ _canvas_.control.gui.style.darkMode(); }
});


{{include:units/main.js}}
{{include:menubarItems.js}}