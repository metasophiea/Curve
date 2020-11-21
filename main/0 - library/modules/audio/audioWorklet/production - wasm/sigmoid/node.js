class sigmoid extends AudioWorkletNode{
    static wasm_url = 'wasm/audio_processing/sigmoid.production.wasm';
    // static wasm_url = 'wasm/audio_processing/sigmoid.development.wasm';
    static fetch_promise;
    static compiled_wasm;

    constructor(context, options={}){
        //populate options
            options.numberOfInputs = 1;
            options.numberOfOutputs = 1;
            options.channelCount = 1;

        //generate class instance
            super(context, 'sigmoid', options);

        //load wasm processor
            audio.audioWorklet.requestWasm(sigmoid, this);

        //shutdown
            this.shutdown = function(){
                this.port.postMessage({command:'shutdown', value:undefined});
                this.port.close();
            };
    }

    get gain(){
        return this.parameters.get('gain');
    }
    get sharpness(){
        return this.parameters.get('sharpness');
    }
}