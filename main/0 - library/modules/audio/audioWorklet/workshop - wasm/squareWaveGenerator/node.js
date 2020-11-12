class squareWaveGenerator_wasm extends AudioWorkletNode{
    static wasm_url = 'wasm/audio_processing/squareWaveGenerator_production.wasm';
    // static wasm_url = 'wasm/audio_processing/squareWaveGenerator_development.wasm';
    static fetch_promise;
    static raw_file;
    static arrayBuffer_wasm;
    static compiled_wasm;

    constructor(context, options={}){
        options.numberOfInputs = 0;
        options.numberOfOutputs = 1;
        options.channelCount = 1;
        super(context, 'squareWaveGenerator_wasm', options);

        if(squareWaveGenerator_wasm.compiled_wasm != undefined){
            this.port.postMessage({command:'loadWasm', 'load':gain.compiled_wasm});
        } else if(squareWaveGenerator_wasm.fetch_promise == undefined){
            squareWaveGenerator_wasm.fetch_promise = fetch(squareWaveGenerator_wasm.wasm_url)
                .then(response => {
                    squareWaveGenerator_wasm.raw_file = response;
                    return response.arrayBuffer();
                }).then(arrayBuffer => {
                    squareWaveGenerator_wasm.arrayBuffer_wasm = arrayBuffer;
                    return WebAssembly.compile(arrayBuffer);
                }).then(module => {
                    squareWaveGenerator_wasm.compiled_wasm = module;
                    this.port.postMessage({command:'loadWasm', 'load':squareWaveGenerator_wasm.compiled_wasm});
                });
        } else {
            this.attemptSecondaryWasmLoadIntervalId = setInterval(() => {
                if(squareWaveGenerator_wasm.compiled_wasm != undefined){
                    clearInterval(this.attemptSecondaryWasmLoadIntervalId);
                    this.port.postMessage({command:'loadWasm', 'load':squareWaveGenerator_wasm.compiled_wasm});
                }
            }, 100);
        }
    }

    get frequency(){
        return this.parameters.get('frequency');
    }
    get dutyCycle(){
        return this.parameters.get('dutyCycle');
    }
}