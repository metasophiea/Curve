class bitcrusher_wasm extends AudioWorkletProcessor {
    static get parameterDescriptors(){
        return [
            {
                name: 'amplitudeResolution',
                defaultValue: 10,
                minValue: 1,
                maxValue: 128,
                automationRate: 'k-rate',
            },{
                name: 'sampleFrequency',
                defaultValue: 16,
                minValue: 1,
                maxValue: 128,
                automationRate: 'k-rate',
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

                        self.inputFrame = {};
                        self.inputFrame.pointer = self.wasm.exports.alloc_128_f32_wasm_memory();
                        self.inputFrame.buffer = new Float32Array(self.wasm.exports.memory.buffer, self.inputFrame.pointer, 128);

                        self.outputFrame = {};
                        self.outputFrame.pointer = self.wasm.exports.alloc_128_f32_wasm_memory();
                        self.outputFrame.buffer = new Float32Array(self.wasm.exports.memory.buffer, self.outputFrame.pointer, 128);
                    });
                break;
            }
        };
    }

    process(inputs, outputs, parameters){
        if(this.wasm == undefined){ return true; }

        const input = inputs[0];
        const output = outputs[0];

        for(let channel = 0; channel < input.length; channel++){
            this.inputFrame.buffer.set(input[channel]);
            this.wasm.exports.process( 
                parameters.amplitudeResolution[0],
                parameters.sampleFrequency[0],
                this.inputFrame.pointer,
                this.outputFrame.pointer
            );
            output[channel].set(this.outputFrame.buffer);
        }

        return true;
    }
}
registerProcessor('bitcrusher_wasm', bitcrusher_wasm);