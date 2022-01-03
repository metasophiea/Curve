class audio_buffer_type_2 extends AudioWorkletProcessor {
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
        this.playheadPositionReadout = { pointer: this.wasm.exports.get_playhead_position_readout_pointer() };
        this.playheadPositionReadout.buffer = new Uint32Array(this.wasm.exports.memory.buffer, this.playheadPositionReadout.pointer, 256);
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
                nodeConstructorTime: undefined,
                temporaryAudioData: undefined,
                rate_useControl: false,
            };

        //setup message receiver
            const self = this;
            this.port.onmessage = function(event){
                console.log(event.data);
                switch(event.data.command){
                    //time sync
                        case 'log_nodeConstructorTime':
                            self._state.nodeConstructorTime = event.data.value;
                        break;

                    //wasm initialization
                        case 'loadWasm':
                            WebAssembly.instantiate(
                                event.data.value,
                                { env: {
                                    _onEnd: function(playhead_id){ self.port.postMessage({ command:'onEnd', value:playhead_id }); },
                                    _onLoop: function(playhead_id){ self.port.postMessage({ command:'onLoop', value:playhead_id }); },

                                    debug_: function(id, ...args){ console.log(id+':', args.join(' ')); },
                                } },
                            ).then(result => {
                                //save wasm processor to instance
                                    self.wasm = result;

                                //attach buffers
                                    self.attachBuffers();

                                //assemble additional wasm buffers
                                    self.audioBufferShovelFrame = { pointer: self.wasm.exports.get_audio_buffer_shovel_pointer() };

                                //load data if necessary
                                    if(self._state.temporaryAudioData != undefined){
                                        self.transferAudioBufferDataIn(
                                            self._state.temporaryAudioData
                                        );
                                        self._state.temporaryAudioData = undefined;
                                    }
                            });
                        break;
                    
                    //load data
                        case "loadAudioData":
                            if(self.wasm == undefined){
                                self._state.temporaryAudioData = event.data.value;
                            } else {
                                self.transferAudioBufferDataIn(event.data.value);
                            }

                            self.port.postMessage({
                                command: 'loadAudioData_loadComplete', 
                                value: undefined,
                            });
                        break;

                    //performance control
                        case 'play':
                            self.wasm.exports.play(event.data.value.playhead_id!=undefined, event.data.value.playhead_id);
                        break;
                        case 'stop':
                            self.wasm.exports.stop(event.data.value.playhead_id!=undefined, event.data.value.playhead_id);
                        break;

                        case 'set_loop_active':
                            self.wasm.exports.set_loop_active(event.data.value.playhead_id!=undefined, event.data.value.playhead_id, event.data.value.loop_active);
                        break;

                        case 'set_playhead_position':
                            self.wasm.exports.set_playhead_position(event.data.value.playhead_id!=undefined, event.data.value.playhead_id, event.data.value.position);
                        break;
                        case 'got_to_start':
                            self.wasm.exports.got_to_start(event.data.value.playhead_id!=undefined, event.data.value.playhead_id);
                        break;
                        case 'got_to_end':
                            self.wasm.exports.got_to_end(event.data.value.playhead_id!=undefined, event.data.value.playhead_id);
                        break;

                        case 'section_start':
                            self.wasm.exports.section_start(event.data.value.playhead_id!=undefined, event.data.value.playhead_id, event.data.value.position);
                        break;
                        case 'section_end':
                            self.wasm.exports.section_end(event.data.value.playhead_id!=undefined, event.data.value.playhead_id, event.data.value.position);
                        break;
                        case 'maximize_section':
                            self.wasm.exports.maximize_section(event.data.value.playhead_id!=undefined, event.data.value.playhead_id);
                        break;
                        case 'invert_section':
                            self.wasm.exports.invert_section(event.data.value.playhead_id!=undefined, event.data.value.playhead_id);
                        break;

                    //status
                        case 'getPlayheadPosition':
                            if(event.data.value.calculateDelay){
                                const calculatedPresentTime = globalThis.currentTime*1000 + self._state.nodeConstructorTime;
                                const sendingDelay = calculatedPresentTime - event.data.sendTime;
    
                                self.port.postMessage({
                                    command:'getPlayheadPosition_return', 
                                    value: {
                                        playhead_id: event.data.value.playhead_id,
                                        playheadPosition: self.playheadPositionReadout.buffer[event.data.value.playhead_id],
                                        sendingDelay: sendingDelay,
                                    },
                                    sendTime: globalThis.currentTime*1000,
                                });
                            } else {
                                self.port.postMessage({
                                    command:'getPlayheadPosition_return', 
                                    value: {
                                        playhead_id: event.data.value.playhead_id,
                                        playheadPosition: self.playheadPositionReadout.buffer[event.data.value.playhead_id],
                                    },
                                });
                            }
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
registerProcessor('audio_buffer_type_2', audio_buffer_type_2);