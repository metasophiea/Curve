class squareWaveGenerator_wasm extends AudioWorkletNode{
    static wasm_url = 'wasm/audio_processing/square_wave_generator.production.wasm';
    // static wasm_url = 'wasm/audio_processing/square_wave_generator.development.wasm';
    static arrayBuffer_wasm;
    static compiled_wasm;

    constructor(context, options={}){
        options.numberOfInputs = 0;
        options.numberOfOutputs = 1;
        options.channelCount = 1;
        super(context, 'squareWaveGenerator_wasm', options);

        audio.audioWorklet.requestWasm(squareWaveGenerator_wasm, this);
    }

    get frequency(){
        return this.parameters.get('frequency');
    }
    get dutyCycle(){
        return this.parameters.get('dutyCycle');
    }
}