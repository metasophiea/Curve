class squareWaveGenerator_wasm extends AudioWorkletProcessor{
    static get parameterDescriptors(){
        return [
            {
                name: 'frequency',
                defaultValue: 440,
                minValue: 0,
                maxValue: 20000,
                automationRate: 'a-rate',
            },{
                name: 'dutyCycle',
                defaultValue: 0.5,
                minValue: 0,
                maxValue: 1,
                automationRate: 'a-rate',
            }
        ];
    }

    constructor(options){
        super(options);
		const self = this;

        this.port.onmessage = function(event){
            switch(event.data.command){
                case 'loadWasm':
                    WebAssembly.instantiate(event.data.load).then(result => {
                        self.wasm = result;

                        self.outputFrame = {};
                        self.outputFrame.pointer = self.wasm.exports.alloc_128_f32_wasm_memory();
                        self.outputFrame.buffer = new Float32Array(self.wasm.exports.memory.buffer, self.outputFrame.pointer, 128);

                        self.frequency = {};
                        self.frequency.pointer = self.wasm.exports.alloc_128_f32_wasm_memory();
                        self.frequency.buffer = new Float32Array(self.wasm.exports.memory.buffer, self.frequency.pointer, 128);

                        self.dutyCycle = {};
                        self.dutyCycle.pointer = self.wasm.exports.alloc_128_f32_wasm_memory();
                        self.dutyCycle.buffer = new Float32Array(self.wasm.exports.memory.buffer, self.dutyCycle.pointer, 128);
                    });
                break;
            }
        };
    }

    process(inputs, outputs, parameters){
        if(this.wasm){
            const output = outputs[0];

            const frequency_useFirstOnly = parameters.frequency.length == 1;
            const dutyCycle_useFirstOnly = parameters.dutyCycle.length == 1;

            this.frequency.buffer.set(parameters.frequency);
            this.dutyCycle.buffer.set(parameters.dutyCycle);

            for(let channel = 0; channel < output.length; channel++){
                this.wasm.exports.process(
                    sampleRate,
                    currentFrame,
                    frequency_useFirstOnly,
                    this.frequency.pointer,
                    dutyCycle_useFirstOnly,
                    this.dutyCycle.pointer,
                    this.outputFrame.pointer
                );
                output[channel].set(this.outputFrame.buffer);
            }
        }
        
        return true;
    }
}
registerProcessor('squareWaveGenerator_wasm', squareWaveGenerator_wasm);