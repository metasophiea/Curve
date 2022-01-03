class audioBuffer_1 extends AudioWorkletNode{
    // static wasm_url = 'wasm/audio_processing/audio_buffer.production.wasm';
    static wasm_url = 'wasm/audio_processing/audio_buffer.development.wasm';
    static fetch_promise;
    static compiled_wasm;

    constructor(context, options={}){
        //populate options
            options.numberOfInputs = 1;
            options.numberOfOutputs = 1;
            options.channelCount = 2;

        //generate class instance
            super(context, 'audioBuffer', options);

        //load wasm processor
            audio.audioWorklet.requestWasm(audioBuffer, this);

        //instance state
            this._state = {};

        //shutdown
            this.shutdown = function(){
                this.port.postMessage({command:'shutdown', value:undefined});
                this.port.close();
            };
    }

    get rate(){
        return this.parameters.get('rate');
    }
}