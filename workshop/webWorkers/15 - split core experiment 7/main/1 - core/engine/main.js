{{include:library.js}}

{{include:../communicationModule.js}}
const communicationModule = new communicationModuleMaker(this,'core_engine');

{{include:dev.js}}

{{include:modules/element.js}}
{{include:modules/arrangement.js}}
{{include:modules/render.js}}
{{include:modules/viewport.js}}
{{include:modules/stats.js}}
{{include:modules/callback.js}}

{{include:connection/service.js}}
{{include:connection/interface.js}}

render.refresh(() => {
    viewport.refresh();
    interface.go();
});