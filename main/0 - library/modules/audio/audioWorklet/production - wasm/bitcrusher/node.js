class bitcrusher_wasm extends AudioWorkletNode {
    static wasm_url = 'wasm/audio_processing/bitcrusher_production.wasm';
    // static wasm_url = 'wasm/audio_processing/bitcrusher_development.wasm';
    static fetch_promise;
    static raw_file;
    static arrayBuffer_wasm;
    static compiled_wasm;

    constructor(context, options={}){
        options.numberOfInputs = 1;
        options.numberOfOutputs = 1;
        options.channelCount = 1;
        super(context, 'bitcrusher_wasm', options);
        
        this._amplitudeResolution = 10;
        this._sampleFrequency = 16;

        if(bitcrusher_wasm.compiled_wasm != undefined){
            this.port.postMessage({command:'loadWasm', 'load':bitcrusher_wasm.compiled_wasm});
        } else if(bitcrusher_wasm.fetch_promise == undefined){
            bitcrusher_wasm.fetch_promise = fetch(bitcrusher_wasm.wasm_url)
                .then(response => {
                    bitcrusher_wasm.raw_file = response;
                    return response.arrayBuffer();
                }).then(arrayBuffer => {
                    bitcrusher_wasm.arrayBuffer_wasm = arrayBuffer;
                    return WebAssembly.compile(arrayBuffer);
                }).then(module => {
                    bitcrusher_wasm.compiled_wasm = module;
                    this.port.postMessage({command:'loadWasm', 'load':bitcrusher_wasm.compiled_wasm});
                });
        } else {
            this.attemptSecondaryWasmLoadIntervalId = setInterval(() => {
                if(bitcrusher_wasm.compiled_wasm != undefined){
                    clearInterval(this.attemptSecondaryWasmLoadIntervalId);
                    this.port.postMessage({command:'loadWasm', 'load':bitcrusher_wasm.compiled_wasm});
                }
            }, 100);
        }
    }

    get amplitudeResolution(){
        return this._amplitudeResolution;
    }
    set amplitudeResolution(value){
        this._amplitudeResolution = value;
        this.parameters.get('amplitudeResolution').setValueAtTime(this._amplitudeResolution,0);
    }

    get sampleFrequency(){
        return this._sampleFrequency;
    }
    set sampleFrequency(value){
        this._sampleFrequency = value;
        this.parameters.get('sampleFrequency').setValueAtTime(this._sampleFrequency,0);
    }
}