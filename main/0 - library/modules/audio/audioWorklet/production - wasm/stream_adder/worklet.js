class streamAdder extends AudioWorkletProcessor{
    static get parameterDescriptors(){
        return [
            {
                name: 'mode',
                defaultValue: 0, // 0 - manual / 1 - automatic
                minValue: 0,
                maxValue: 1,
                automationRate: 'k-rate',
            },{
                name: 'mix',
                defaultValue: 0.5,
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
                        case 'loadWasm':
                            WebAssembly.instantiate(event.data.value).then(result => {
                                self.wasm = result;

                                self.input1Frame = {};
                                self.input1Frame.pointer = self.wasm.exports.get_input_1_pointer();
                                self.input1Frame.buffer = new Float32Array(self.wasm.exports.memory.buffer, self.input1Frame.pointer, 128);

                                self.input2Frame = {};
                                self.input2Frame.pointer = self.wasm.exports.get_input_2_pointer();
                                self.input2Frame.buffer = new Float32Array(self.wasm.exports.memory.buffer, self.input2Frame.pointer, 128);

                                self.mixControlFrame = {};
                                self.mixControlFrame.pointer = self.wasm.exports.get_mix_control_pointer();
                                self.mixControlFrame.buffer = new Float32Array(self.wasm.exports.memory.buffer, self.mixControlFrame.pointer, 128);

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
            const input_1 = inputs[0];
            const input_2 = inputs[1];
            const mixControl = inputs[2];
            const output = outputs[0];

        //pre-calculation
            const mixControl_useFirstOnly = parameters.mode[0] == 0 ? parameters.mix.length == 1 : false;

        //populate input buffers, process data, and copy results to channels
            for(let channel = 0; channel < input_1.length; channel++){
                this.input1Frame.buffer.set(input_1[channel]);
                this.input2Frame.buffer.set(input_2[channel]);
                this.mixControlFrame.buffer.set(parameters.mode[0] == 0 ? [(mixControl_useFirstOnly ? parameters.mix[0] : parameters.mix[a])] : mixControl[channel]);
                this.wasm.exports.process(
                    mixControl_useFirstOnly
                );
                output[channel].set(this.outputFrame.buffer);
            }

        return true;
    }
}
registerProcessor('streamAdder', streamAdder);