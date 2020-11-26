_canvas_.curve = new function(){
    this.versionInformation = { tick:0, lastDateModified:{y:2020,m:11,d:26} };
};

_canvas_.layers.registerLayer("curve", _canvas_.curve);
_canvas_.layers.registerFunctionForLayer("control", function(){
    _canvas_.control.gui.showMenubar();
    _canvas_.control.viewport.stopMouseScroll(true);
    _canvas_.control.viewport.activeRender(true);
    _canvas_.core.render.activeLimitToFrameRate(true);
    _canvas_.core.render.frameRateLimit(30);

    _canvas_.layers.declareLayerAsLoaded("curve");
} );

_canvas_.layers.registerFunctionForLayer("curve", function(){
    _canvas_.control.queryString.modLoader();
    _canvas_.control.queryString.defaultDemoUrlPrefix = 'https://curve.metasophiea.com/demos/';
    _canvas_.control.queryString.demoLoader();

    const hour = (new Date()).getHours();
    if( 
        (new URL(window.location.href)).searchParams.get("darkmode") != null ||
        hour < 8 || hour >= 20
    ){ _canvas_.control.gui.style.darkMode(); }
});


{{include:units/main.js}}
{{include:menubarItems.js}}