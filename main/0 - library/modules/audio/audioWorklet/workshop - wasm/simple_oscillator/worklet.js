class simpleOscillator extends AudioWorkletProcessor {
    static starterFrequency = 440;
    static maxFrequency = 20000;

    static get parameterDescriptors(){
        return [
            {
                name: 'frequency',
                defaultValue: simpleOscillator.starterFrequency,
                minValue: 0,
                maxValue: simpleOscillator.maxFrequency,
                automationRate: 'a-rate',
            }
        ];
    }

    constructor(options){
        super(options);
        const self = this;
        this._wavePosition = 0;

        this.port.onmessage = function(event){
            switch(event.data.command){
                case 'loadWasm':
                    WebAssembly.instantiate(event.data.value).then(result => {
                        self.wasm = result;

                        self.outputFrame = {};
                        self.outputFrame.pointer = self.wasm.exports.get_output_pointer();
                        self.outputFrame.buffer = new Float32Array(self.wasm.exports.memory.buffer, self.outputFrame.pointer, 128);
                    });
                break;
                case 'start': break;
                case 'stop': break;
            }
        };
    }

    process(inputs, outputs, parameters){
        if(this.wasm == undefined){ return true; }

        const output = outputs[0];

        for(let channel = 0; channel < output.length; channel++){
            this.wasm.exports.process();
            output[channel].set(this.outputFrame.buffer);
        }
        
        return true;
    }
}
registerProcessor('simpleOscillator', simpleOscillator);