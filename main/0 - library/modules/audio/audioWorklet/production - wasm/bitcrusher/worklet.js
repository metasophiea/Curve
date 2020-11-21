class bitcrusher extends AudioWorkletProcessor {
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
        //construct class instance
            super(options);

        //instance state
            this.shutdown = false;

        //setup message receiver
            const self = this;
            this.port.onmessage = function(event){
                switch(event.data.command){
                    //wasm initialization
                        case 'loadWasm':
                            WebAssembly.instantiate(event.data.value).then(result => {
                                self.wasm = result;

                                self.inputFrame = {};
                                self.inputFrame.pointer = self.wasm.exports.get_input_pointer();
                                self.inputFrame.buffer = new Float32Array(self.wasm.exports.memory.buffer, self.inputFrame.pointer, 128);

                                self.outputFrame = {};
                                self.outputFrame.pointer = self.wasm.exports.get_output_pointer();
                                self.outputFrame.buffer = new Float32Array(self.wasm.exports.memory.buffer, self.outputFrame.pointer, 128);
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

        //process data, and copy results to channels
            for(let channel = 0; channel < input.length; channel++){
                this.inputFrame.buffer.set(input[channel]);
                this.wasm.exports.process( 
                    parameters.amplitudeResolution[0],
                    parameters.sampleFrequency[0],
                );
                output[channel].set(this.outputFrame.buffer);
            }

        return true;
    }
}
registerProcessor('bitcrusher', bitcrusher);