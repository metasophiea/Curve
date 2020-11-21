class amplitudeModifier extends AudioWorkletNode{
    static wasm_url = 'wasm/audio_processing/amplitude_modifier.production.wasm';
    // static wasm_url = 'wasm/audio_processing/amplitude_modifier.development.wasm';
    static fetch_promise;
    static compiled_wasm;

    constructor(context, options={}){
        //populate options
            options.numberOfInputs = 1;
            options.numberOfOutputs = 1;
            options.channelCount = 1;

        //generate class instance
            super(context, 'amplitudeModifier', options);

        //load wasm processor
            audio.audioWorklet.requestWasm(amplitudeModifier, this);

        //instance state
            this._invert = false;

        //shutdown
            this.shutdown = function(){
                this.port.postMessage({command:'shutdown', value:undefined});
                this.port.close();
            };
    }

    get invert(){
        return this._invert;
    }
    set invert(value){
        this._invert = value;
        this.parameters.get('invert').setValueAtTime(this._invert?1:0,0);
    }

    get offset(){
        return this.parameters.get('offset');
    }
    get divisor(){
        return this.parameters.get('divisor');
    }
    get ceiling(){
        return this.parameters.get('ceiling');
    }
    get floor(){
        return this.parameters.get('floor');
    }
}