_canvas_.core = new function(){
    this.versionInformation = { tick:0, lastDateModified:{y:2020,m:10,d:4} };

    const core = this;

    const core_engine = new Worker("js/core_engine.js");
    {{include:../communicationModule.js}}
    const communicationModule = new communicationModuleMaker(core_engine,'core_console');

    _canvas_.setAttribute('tabIndex',1);
    _canvas_.style.outline = "none";

    {{include:dev.js}}
    {{include:connection/service/main.js}}
    {{include:connection/interface/main.js}}
    {{include:representation/main.js}}

    this.ready = function(){
        core.callback.__attachCallbacks().then(() => {
            _canvas_.layers.declareLayerAsLoaded("core");
        });
    }
};

_canvas_.layers.registerLayer("core", _canvas_.core);