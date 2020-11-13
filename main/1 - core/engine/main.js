{{include:rust/main.js}}

{{include:library.js}}

{{include:../communicationModule.js}}
const communicationModule = new communicationModuleMaker(this,'core_engine');

self.__getWorker = function(){ return self; };
wasm_bindgen('/wasm/core/core_engine.development.wasm').then(r => {
    self.WASM = {};
    Object.entries(wasm_bindgen).forEach(item => {
        self.WASM[item[0]] = item[1];
    });
    self.ENGINE = self.WASM.Engine.new(self);
    setup();
    // WASM.Engine.test();
});

function setup(){
    {{include:dev.js}}
    {{include:operator/main.js}}
    {{include:connection/service/main.js}}
    {{include:connection/interface/main.js}}

    self.operator.meta.refresh().then(() => {
        interface.ready();
    });
}