const debug = function(id, ...args){ console.log(id+':', args.join(' ')); };

class audioBuffer_2 extends AudioWorkletProcessor{
    static get parameterDescriptors(){
        return [{
                name: 'samples',
                defaultValue: 1,
                minValue: 1,
                maxValue: 100,
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
                            WebAssembly.instantiate(
                                event.data.value,
                                // { env: { Math_random: Math.random, debug_: debug, } },
                            ).then(result => {
                                self.wasm = result;

                                self.outputFrame = {};
                                self.audioBufferShovelFrame = {};

                                self.attachBuffers();

                                self.transferAudioBufferData(
                                    new Float32Array(new Array(440).fill(1).map((_,index) => Math.sin(2*Math.PI*(index/440))))
                                );
                            });
                        break;
                    
                    //shutdown
                        case 'shutdown':
                            self.shutdown = true;
                        break;
                }
            };
    }

    transferAudioBufferData(audio_data){
        const shovelSize = this.wasm.exports.get_shovel_size();

        this.wasm.exports.clear_audio_buffer();
        for(let block = 0; block < (Math.floor(audio_data.length / shovelSize) + 1); block++) {
            const data_to_send = audio_data.slice( block*shovelSize, (block+1)*shovelSize );

            this.audioBufferShovelFrame.buffer = new Float32Array(this.wasm.exports.memory.buffer, this.wasm.exports.get_audio_buffer_shovel_pointer(), shovelSize);
            this.audioBufferShovelFrame.buffer.set(data_to_send);

            this.wasm.exports.shovel_audio_data_in(data_to_send.length);
        }

        this.attachBuffers();
    }
    attachBuffers(){
        this.outputFrame.pointer = this.wasm.exports.get_output_pointer();
        this.outputFrame.buffer = new Float32Array(this.wasm.exports.memory.buffer, this.outputFrame.pointer, 128);
    }

    process(inputs, outputs, parameters){
        if(this.shutdown){ return false; }
        if(this.wasm == undefined){ return true; }

        //collect inputs/outputs
            const output = outputs[0];

        //copy data in, process data, and copy results to channels
            this.wasm.exports.process();
            for(let channel = 0; channel < output.length; channel++){
                output[channel].set(this.outputFrame.buffer);
            }

        return true;
    }
}
registerProcessor('audioBuffer_2', audioBuffer_2);