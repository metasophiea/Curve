class gain extends AudioWorkletNode{
    static wasm_url = 'wasm/audio_processing/gain.production.wasm';
    // static wasm_url = 'wasm/audio_processing/gain.development.wasm';
    static fetch_promise;
    static compiled_wasm;

    constructor(context, options={}){
        options.numberOfInputs = 2;
        options.numberOfOutputs = 1;
        options.channelCount = 1;
        super(context, 'gain', options);

        this._mode = false;

        audio.audioWorklet.requestWasm(gain, this);
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