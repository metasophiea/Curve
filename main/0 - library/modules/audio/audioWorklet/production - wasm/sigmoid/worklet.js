class sigmoid extends AudioWorkletProcessor{
    static get parameterDescriptors(){
        return [
            {
                name: 'gain',
                defaultValue: 1,
                minValue: 0,
                maxValue: 1,
                automationRate: 'a-rate',
            },
            {
                name: 'sharpness',
                defaultValue: 0,
                minValue: 0,
                maxValue: 1,
                automationRate: 'a-rate',
            }
        ];
    }

    constructor(options){
        //construct class instance
            super(options);

        //instance state
            this.shutdown = false;

        //setup message receiver
		    const self = this;
            this.port.onmessage = function(event){
                switch(event.data.command){
                    //wasm initialization
                        case 'loadUncompiledWasm':
                            WebAssembly.compile(event.data.value)
                                .then(WebAssembly.instantiate)
                                .then(result => {
                                    self.wasm = result;
    
                                    self.inputFrame = {};
                                    self.inputFrame.pointer = self.wasm.exports.get_input_pointer();
                                    self.inputFrame.buffer = new Float32Array(self.wasm.exports.memory.buffer, self.inputFrame.pointer, 128);
    
                                    self.outputFrame = {};
                                    self.outputFrame.pointer = self.wasm.exports.get_output_pointer();
                                    self.outputFrame.buffer = new Float32Array(self.wasm.exports.memory.buffer, self.outputFrame.pointer, 128);
    
                                    self.gainBuffer = {};
                                    self.gainBuffer.pointer = self.wasm.exports.get_gain_pointer();
                                    self.gainBuffer.buffer = new Float32Array(self.wasm.exports.memory.buffer, self.gainBuffer.pointer, 128);
    
                                    self.sharpnessBuffer = {};
                                    self.sharpnessBuffer.pointer = self.wasm.exports.get_sharpness_pointer();
                                    self.sharpnessBuffer.buffer = new Float32Array(self.wasm.exports.memory.buffer, self.sharpnessBuffer.pointer, 128);
                                });
                        break;
                        case 'loadWasm':
                            WebAssembly.instantiate(event.data.value).then(result => {
                                self.wasm = result;

                                self.inputFrame = {};
                                self.inputFrame.pointer = self.wasm.exports.get_input_pointer();
                                self.inputFrame.buffer = new Float32Array(self.wasm.exports.memory.buffer, self.inputFrame.pointer, 128);

                                self.outputFrame = {};
                                self.outputFrame.pointer = self.wasm.exports.get_output_pointer();
                                self.outputFrame.buffer = new Float32Array(self.wasm.exports.memory.buffer, self.outputFrame.pointer, 128);

                                self.gainBuffer = {};
                                self.gainBuffer.pointer = self.wasm.exports.get_gain_pointer();
                                self.gainBuffer.buffer = new Float32Array(self.wasm.exports.memory.buffer, self.gainBuffer.pointer, 128);

                                self.sharpnessBuffer = {};
                                self.sharpnessBuffer.pointer = self.wasm.exports.get_sharpness_pointer();
                                self.sharpnessBuffer.buffer = new Float32Array(self.wasm.exports.memory.buffer, self.sharpnessBuffer.pointer, 128);
                            });
                        break;
                
                    //shutdown
                        case 'shutdown':
                            self.shutdown = true;
                        break;
                }
            };
    }

    process(inputs, outputs, parameters){
        if(this.shutdown){ return false; }
        if(this.wasm == undefined){ return true; }

        //collect inputs/outputs
            const input = inputs[0];
            const output = outputs[0];

        //populate input buffers
            const gain_useFirstOnly = parameters.gain.length == 1;
            const sharpness_useFirstOnly = parameters.sharpness.length == 1;
            this.gainBuffer.buffer.set(parameters.gain);
            this.sharpnessBuffer.buffer.set(parameters.sharpness);

        //copy data in, process data, and copy results to channels
            for(let channel = 0; channel < input.length; channel++){
                this.inputFrame.buffer.set(input[channel]);
                this.wasm.exports.process(
                    gain_useFirstOnly,
                    sharpness_useFirstOnly,
                );
                output[channel].set(this.outputFrame.buffer);
            }

        return true;
    }
}
registerProcessor('sigmoid', sigmoid);