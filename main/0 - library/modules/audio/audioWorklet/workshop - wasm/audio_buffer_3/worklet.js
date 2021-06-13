class audioBuffer_3 extends AudioWorkletProcessor {
    static get parameterDescriptors(){
        return [
            {
                name: 'rate',
                defaultValue: 1,
                minValue: -8,
                maxValue: 8,
                automationRate: 'a-rate',
            },
        ];
    }

    attachBuffers(){
        this.positionReadout = { pointer: this.wasm.exports.get_position_readout_pointer() };
        this.positionReadout.buffer = new Uint32Array(this.wasm.exports.memory.buffer, this.positionReadout.pointer, 1);
        this.outputFrame = { pointer: this.wasm.exports.get_output_pointer() };
        this.outputFrame.buffer = new Float32Array(this.wasm.exports.memory.buffer, this.outputFrame.pointer, 128);
        this.rateFrame = { pointer: this.wasm.exports.get_rate_pointer() };
        this.rateFrame.buffer = new Float32Array(this.wasm.exports.memory.buffer, this.rateFrame.pointer, 128);
    }

    constructor(options){
        //construct class instance
            super(options);

        //instance state
            this.shutdown = false;
            this._state = {
                rate_useControl: false,
            };

            //setup message receiver
                const self = this;
                this.port.onmessage = function(event){
                    switch(event.data.command){
                        //wasm initialization
                            case 'loadWasm':
                                WebAssembly.instantiate(
                                    event.data.value,
                                ).then(result => {
                                    //save wasm processor to instance
                                        self.wasm = result;

                                    //attach buffers
                                        self.attachBuffers();
    
                                    //assemble wasm buffers
                                        self.positionReadout = { pointer: self.wasm.exports.get_position_readout_pointer() };
                                        self.outputFrame = { pointer: self.wasm.exports.get_output_pointer() };
                                        self.rateFrame = { pointer: self.wasm.exports.get_rate_pointer() };
                                        self.audioBufferShovelFrame = { pointer: self.wasm.exports.get_audio_buffer_shovel_pointer() };

                                    //test
                                        self.transferAudioBufferDataIn(
                                            new Float32Array(new Array(441).fill(1).map((_,index) => Math.sin(2*Math.PI*(index/441))))
                                        );
                                });
                            break;
                        
                        //performance control
                            case 'play':
                                self.wasm.exports.play();
                            break;
                            case 'pause':
                                self.wasm.exports.pause();
                            break;
                            case 'return':
                                self.wasm.exports.return_play_position();
                            break;
                            case 'loop':
                                self.wasm.exports.loop_active(event.data.value);
                            break;
                            case 'section_start':
                                self.wasm.exports.section_start(event.data.value);
                            break;
                            case 'section_end':
                                self.wasm.exports.section_end(event.data.value);
                            break;

                        //status
                            case 'getPosition': 
                                console.log('worklet time:',  globalThis.currentTime*1000);
                                console.log(self.positionReadout.buffer[0]);
                            break;
                                

                        //use control
                            case 'rate_useControl': 
                                self._state.rate_useControl = event.data.value;
                            break;

                        //shutdown
                            case 'shutdown':
                                self.shutdown = true;
                            break;
                    }
                };
    }

    transferAudioBufferDataIn(audio_data){
        this.wasm.exports.clear_audio_buffer();

        const shovelSize = this.wasm.exports.get_shovel_size();
        const block_count = (Math.floor(audio_data.length / shovelSize) + 1);
        for(let block = 0; block < block_count; block++) {
            //reattach shovel buffer 
                this.audioBufferShovelFrame.buffer = new Float32Array(
                    this.wasm.exports.memory.buffer, 
                    this.wasm.exports.get_audio_buffer_shovel_pointer(), 
                    shovelSize
                );

            //shovel block in
                const data_to_send = audio_data.slice( block*shovelSize, (block+1)*shovelSize );
                this.audioBufferShovelFrame.buffer.set(data_to_send);
                this.wasm.exports.shovel_audio_data_in(data_to_send.length);
        }

        this.attachBuffers();
    }

    process(inputs, outputs, parameters){
        if(this.shutdown){ return false; }
        if(this.wasm == undefined){ return true; }

        //collect inputs/outputs
            const output = outputs[0];
            const rateControl = inputs[0];

        //populate input buffers
            const rate_useFirstOnly = this._state.rate_useControl ? false : parameters.rate.length == 1;
            this.rateFrame.buffer.set( this._state.rate_useControl && rateControl[0] != undefined ? rateControl[0] : parameters.rate );

        //have wasm process data, and copy results to channels
            this.wasm.exports.process(
                rate_useFirstOnly,
            );
            for(let channel = 0; channel < output.length; channel++){
                output[channel].set(this.outputFrame.buffer);
            }

        return true;
    }
}
registerProcessor('audioBuffer_3', audioBuffer_3);