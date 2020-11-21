class lagProcessor extends AudioWorkletNode{
    static wasm_url = 'wasm/audio_processing/lag_processor.production.wasm';
    // static wasm_url = 'wasm/audio_processing/lag_processor.development.wasm';
    static fetch_promise;
    static compiled_wasm;

    constructor(context, options={}){
        //populate options
            options.numberOfInputs = 1;
            options.numberOfOutputs = 1;
            options.channelCount = 1;

        //generate class instance
            super(context, 'lagProcessor', options);

        //load wasm processor
            audio.audioWorklet.requestWasm(lagProcessor, this);

        //instance state
            this._samples = 1;

        //shutdown
            this.shutdown = function(){
                this.port.postMessage({command:'shutdown', value:undefined});
                this.port.close();
            };
    }

    get samples(){
        return this._samples;
    }
    set samples(value){
        this._samples = Math.round(value);
        this.parameters.get('samples').setValueAtTime(this._samples,0);
    }
}