const self = this;

{{include:../communicationModule.js}}
const communicationModule = new communicationModuleMaker(core_engine,'core_console');
this.__com = communicationModule;

_canvas_.setAttribute('tabIndex',1);

{{include:dev.js}}
{{include:interface/main.js}}
{{include:service.js}}