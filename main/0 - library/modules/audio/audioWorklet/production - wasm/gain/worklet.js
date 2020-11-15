class gain extends AudioWorkletProcessor{
    static get parameterDescriptors(){
        return [
            {
                name: 'mode',
                defaultValue: 0,
                minValue: 0,
                maxValue: 1,
                automationRate: 'k-rate',
            },{
                name: 'gain',
                defaultValue: 1,
                minValue: -100,
                maxValue: 100,
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
                    WebAssembly.instantiate(event.data.value).then(result => {
                        self.wasm = result;

                        self.input1Frame = {};
                        self.input1Frame.pointer = self.wasm.exports.get_input_1_pointer();
                        self.input1Frame.buffer = new Float32Array(self.wasm.exports.memory.buffer, self.input1Frame.pointer, 128);

                        self.input2Frame = {};
                        self.input2Frame.pointer = self.wasm.exports.get_input_2_pointer();
                        self.input2Frame.buffer = new Float32Array(self.wasm.exports.memory.buffer, self.input2Frame.pointer, 128);

                        self.outputFrame = {};
                        self.outputFrame.pointer = self.wasm.exports.get_output_pointer();
                        self.outputFrame.buffer = new Float32Array(self.wasm.exports.memory.buffer, self.outputFrame.pointer, 128);
                    });
                break;
            }
        };
    }

    process(inputs, outputs, parameters){
        if(this.wasm == undefined){ return true; }

        const input_1 = inputs[0];
        const input_2 = inputs[1];
        const output = outputs[0];

        if( parameters.mode[0] == 1 ){
            //automatic
            for(let channel = 0; channel < input_1.length; channel++){
                this.input1Frame.buffer.set(input_1[channel]);
                this.input2Frame.buffer.set(input_2[channel]);
                this.wasm.exports.process(false);
                output[channel].set(this.outputFrame.buffer);
            }
        } else {
            //manual
            const gain_useFirstOnly = parameters.gain.length == 1;
            this.input2Frame.buffer.set(parameters.gain);

            for(let channel = 0; channel < input_1.length; channel++){
                this.input1Frame.buffer.set(input_1[channel]);
                this.wasm.exports.process(gain_useFirstOnly);
                output[channel].set(this.outputFrame.buffer);
            }
        }

        return true;
    }
}
registerProcessor('gain', gain);