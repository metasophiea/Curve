const debug = function(id, ...args){ console.log(id+':', args.join(' ')); };

class oscillator_type_1 extends AudioWorkletProcessor {
    static starterFrequency = 440;
    static maxFrequency = 20000;
    static detuneMux = 0.1;
    static detuneBounds = 1/oscillator_type_1.detuneMux;
    static availableWaveforms = ['sine', 'square', 'triangle', 'noise'];

    static get parameterDescriptors(){
        return [
            {
                name: 'frequency',
                defaultValue: oscillator_type_1.starterFrequency,
                minValue: 0,
                maxValue: oscillator_type_1.maxFrequency,
                automationRate: 'a-rate',
            },{
                name: 'gain',
                defaultValue: 1,
                minValue: -1,
                maxValue: 1,
                automationRate: 'a-rate',
            },{
                name: 'detune',
                defaultValue: 0,
                minValue: -oscillator_type_1.detuneBounds,
                maxValue: oscillator_type_1.detuneBounds,
                automationRate: 'a-rate',
            },{
                name: 'dutyCycle',
                defaultValue: 0.5,
                minValue: 0,
                maxValue: 1,
                automationRate: 'a-rate',
            },
        ];
    }

    constructor(options){
        //construct class instance
            super(options);

        //instance state
            this.shutdown = false;
            this._state = {
                gain_useControl: false,
                detune_useControl: false,
                dutyCycle_useControl: false,

                selected_waveform: 0,
            };

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
                                //save wasm processor to instance
                                    self.wasm = result;

                                //assemble wasm buffers
                                    self.frequencyFrame = { pointer: self.wasm.exports.get_frequency_pointer() };
                                    self.frequencyFrame.buffer = new Float32Array(self.wasm.exports.memory.buffer, self.frequencyFrame.pointer, 128);
                                    self.gainFrame = { pointer: self.wasm.exports.get_gain_pointer() };
                                    self.gainFrame.buffer = new Float32Array(self.wasm.exports.memory.buffer, self.gainFrame.pointer, 128);
                                    self.detuneFrame = { pointer: self.wasm.exports.get_detune_pointer() };
                                    self.detuneFrame.buffer = new Float32Array(self.wasm.exports.memory.buffer, self.detuneFrame.pointer, 128);
                                    self.dutyCycleFrame = { pointer: self.wasm.exports.get_duty_cycle_pointer() };
                                    self.dutyCycleFrame.buffer = new Float32Array(self.wasm.exports.memory.buffer, self.dutyCycleFrame.pointer, 128);
                                    self.outputFrame = { pointer: self.wasm.exports.get_output_pointer() };
                                    self.outputFrame.buffer = new Float32Array(self.wasm.exports.memory.buffer, self.outputFrame.pointer, 128);

                                //re-send waveform selection (just incase)
                                    self.wasm.exports.select_waveform(self._state.selected_waveform);
                            });
                        break;
                    
                    //shutdown
                        case 'shutdown':
                            self.shutdown = true;
                        break;

                    //use control
                        case 'gain_useControl': 
                            self._state.gain_useControl = event.data.value;
                        break;
                        case 'detune_useControl': 
                            self._state.detune_useControl = event.data.value;
                        break;
                        case 'dutyCycle_useControl': 
                            self._state.dutyCycle_useControl = event.data.value;
                        break;

                    //waveform
                        case 'waveform':
                            self._state.selected_waveform = oscillator_type_1.availableWaveforms.indexOf(event.data.value);
                            if(self.wasm == undefined){ return; }
                            self.wasm.exports.select_waveform(self._state.selected_waveform);
                        break;
                }
            };
    }

    process(inputs, outputs, parameters){
        if(this.shutdown){ return false; }
        if(this.wasm == undefined){ return true; }

        //collect inputs/outputs
            const output = outputs[0];
            const gainControl = inputs[0];
            const detuneControl = inputs[1];
            const dutyCycleControl = inputs[2];

        //populate input buffers
            const frequency_useFirstOnly = parameters.frequency.length == 1;
            this.frequencyFrame.buffer.set( parameters.frequency );

            const gain_useFirstOnly = this._state.gain_useControl ? false : parameters.gain.length == 1;
            this.gainFrame.buffer.set( this._state.gain_useControl ? gainControl[0] : parameters.gain );

            const detune_useFirstOnly = this._state.detune_useControl ? false : parameters.detune.length == 1;
            this.detuneFrame.buffer.set( this._state.detune_useControl ? detuneControl[0] : parameters.detune );

            const dutyCycle_useFirstOnly = this._state.dutyCycle_useControl ? false : parameters.dutyCycle.length == 1;
            this.dutyCycleFrame.buffer.set( this._state.dutyCycle_useControl ? dutyCycleControl[0] : parameters.dutyCycle );

        //process data, and copy results to channels
            for(let channel = 0; channel < output.length; channel++){
                this.wasm.exports.process(
                    frequency_useFirstOnly,
                    gain_useFirstOnly,
                    detune_useFirstOnly,
                    dutyCycle_useFirstOnly,
                );
                output[channel].set(this.outputFrame.buffer);
            }
        
        return true;
    }
}
registerProcessor('oscillator_type_1', oscillator_type_1);