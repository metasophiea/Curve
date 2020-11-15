class simpleOscillator extends AudioWorkletNode{
    // static wasm_url = 'wasm/audio_processing/simple_oscillator.production.wasm';
    static wasm_url = 'wasm/audio_processing/simple_oscillator.development.wasm';
    static fetch_promise;
    static compiled_wasm;

    constructor(context, options={}){
        options.numberOfInputs = 2;
        options.numberOfOutputs = 1;
        options.channelCount = 1;
        super(context, 'simpleOscillator', options);

        audio.audioWorklet.requestWasm(simpleOscillator, this);

        this.start = function(hitVelocity){
            this.port.postMessage({command:'start', value:hitVelocity});
        };
        this.stop = function(){
            this.port.postMessage({command:'stop', value:undefined});
        };
    }

    get frequency(){
        return this.parameters.get('frequency');
    }
}