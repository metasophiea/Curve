const debug = function(id, ...args){ console.log(id+':', args.join(' ')); };

class audioBuffer_1 extends AudioWorkletProcessor{
    static get parameterDescriptors(){
        return [
            {
                name: 'rate',
                defaultValue: 1,
                minValue: -16,
                maxValue: 16,
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
                            WebAssembly.instantiate(
                                event.data.value,
                                { env: { Math_random: Math.random, debug_: debug, } },
                            ).then(result => {
                                self.wasm = result;

                                self.outputFrame = {};
                                self.outputFrame.pointer = self.wasm.exports.get_output_pointer();
                                self.outputFrame.buffer = new Float32Array(self.wasm.exports.memory.buffer, self.outputFrame.pointer, 128);

                                self.audioDataShovelFrame = {};
                                self.audioDataShovelFrame.pointer = self.wasm.exports.get_audio_data_shovel_pointer();
                                self.audioDataShovelFrame.buffer = new Float32Array(self.wasm.exports.memory.buffer, self.audioDataShovelFrame.pointer, 128);

                                self.rateFrame = {};
                                self.rateFrame.pointer = self.wasm.exports.get_rate_pointer();
                                self.rateFrame.buffer = new Float32Array(self.wasm.exports.memory.buffer, self.rateFrame.pointer, 128);

                                self.transfer_audio_buffer_data(new Float32Array([1.0,2.0,3.0]));
                            });
                        break;
                    
                    //shutdown
                        case 'shutdown':
                            self.shutdown = true;
                        break;
                }
            };
    }

    transfer_audio_buffer_data(data){
        const data_to_send = data.slice(0,128);
        this.audioDataShovelFrame.buffer.set(data_to_send);
        this.wasm.exports.shovel_load_audio_data(data_to_send.length);
    }

    process(inputs, outputs, parameters){
        if(this.shutdown){ return false; }
        if(this.wasm == undefined){ return true; }

        //collect inputs/outputs
            const output = outputs[0];

        //pre-calculations
            const rate_useFirstOnly = parameters.rate.length == 1;

        //populate input buffers
            this.rateFrame.buffer.set( rate_useFirstOnly ? [parameters.rate[0]] : parameters.rate );

        //process data, and copy results to channels
            this.wasm.exports.process(
                rate_useFirstOnly,
            );
            output[0].set(this.outputFrame.buffer);


        return true;
    }
}
registerProcessor('audioBuffer_1', audioBuffer_1);