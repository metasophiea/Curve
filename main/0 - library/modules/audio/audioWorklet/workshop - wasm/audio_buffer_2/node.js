class audioBuffer_2 extends AudioWorkletNode{
    // static wasm_url = 'wasm/audio_processing/audio_buffer_2.production.wasm';
    static wasm_url = 'wasm/audio_processing/audio_buffer_2.development.wasm';
    static fetch_promise;
    static compiled_wasm;

    constructor(context, options={}){
        //populate options
            options.numberOfInputs = 0;
            options.numberOfOutputs = 1;
            options.channelCount = 1;

        //generate class instance
            super(context, 'audioBuffer_2', options);

        //load wasm processor
            audio.audioWorklet.requestWasm(audioBuffer_2, this);

        //shutdown
            this.shutdown = function(){
                this.port.postMessage({command:'shutdown', value:undefined});
                this.port.close();
            };
    }
}