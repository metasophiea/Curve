class bitcrusher extends AudioWorkletNode {
    static wasm_url = 'wasm/audio_processing/bitcrusher.production.wasm';
    // static wasm_url = 'wasm/audio_processing/bitcrusher.development.wasm';
    static fetch_promise;
    static compiled_wasm;

    constructor(context, options={}){
        //populate options
            options.numberOfInputs = 1;
            options.numberOfOutputs = 1;
            options.channelCount = 1;

        //generate class instance
            super(context, 'bitcrusher', options);

        //load wasm processor
            audio.audioWorklet.requestWasm(bitcrusher, this);
        
        //instance state
            this._amplitudeResolution = 10;
            this._sampleFrequency = 16;

        //shutdown
            this.shutdown = function(){
                this.port.postMessage({command:'shutdown', value:undefined});
                this.port.close();
            };
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