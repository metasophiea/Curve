class gain extends AudioWorkletNode{
    static wasm_url = 'wasm/audio_processing/gain.production.wasm';
    // static wasm_url = 'wasm/audio_processing/gain.development.wasm';
    static fetch_promise;
    static compiled_wasm;

    constructor(context, options={}){
        //populate options
            options.numberOfInputs = 2;
            options.numberOfOutputs = 1;
            options.channelCount = 1;

        //generate class instance
            super(context, 'gain', options);

        //load wasm processor
            audio.audioWorklet.requestWasm(gain, this);

        //instance state
            this._mode = false;

        //shutdown
            this.shutdown = function(){
                this.port.postMessage({command:'shutdown', value:undefined});
                this.port.close();
            };
    }

    get mode(){
        return this._mode;
    }
    set mode(value){
        this._mode = value;
        this.parameters.get('mode').setValueAtTime(this._mode?1:0,0);
    }
    get gain(){
        return this.parameters.get('gain');
    }
}