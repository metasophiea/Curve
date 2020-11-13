class sigmoid extends AudioWorkletNode{
    static wasm_url = 'wasm/audio_processing/sigmoid.production.wasm';
    // static wasm_url = 'wasm/audio_processing/sigmoid.development.wasm';
    static fetch_promise;
    static compiled_wasm;

    constructor(context, options={}){
        options.numberOfInputs = 1;
        options.numberOfOutputs = 1;
        options.channelCount = 1;
        super(context, 'sigmoid', options);

        audio.audioWorklet.requestWasm(sigmoid, this);
    }

    get gain(){
        return this.parameters.get('gain');
    }
    get sharpness(){
        return this.parameters.get('sharpness');
    }
}