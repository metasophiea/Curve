class amplitudeModifier extends AudioWorkletProcessor{
    static get parameterDescriptors(){
        return [
            {
                name: 'invert',
                defaultValue: 0,
                minValue: 0,
                maxValue: 1,
                automationRate: 'k-rate',
            },{
                name: 'offset',
                defaultValue: 0,
                minValue: -10,
                maxValue: 10,
                automationRate: 'a-rate',
            },{
                name: 'divisor',
                defaultValue: 1,
                minValue: 1,
                maxValue: 16,
                automationRate: 'a-rate',
            },{
                name: 'ceiling',
                defaultValue: 10,
                minValue: -10,
                maxValue: 10,
                automationRate: 'a-rate',
            },{
                name: 'floor',
                defaultValue: -10,
                minValue: -10,
                maxValue: 10,
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

                        self.inputFrame = {};
                        self.inputFrame.pointer = self.wasm.exports.get_input_pointer();
                        self.inputFrame.buffer = new Float32Array(self.wasm.exports.memory.buffer, self.inputFrame.pointer, 128);

                        self.outputFrame = {};
                        self.outputFrame.pointer = self.wasm.exports.get_output_pointer();
                        self.outputFrame.buffer = new Float32Array(self.wasm.exports.memory.buffer, self.outputFrame.pointer, 128);

                        self.divisorFrame = {};
                        self.divisorFrame.pointer = self.wasm.exports.get_divisor_pointer();
                        self.divisorFrame.buffer = new Float32Array(self.wasm.exports.memory.buffer, self.divisorFrame.pointer, 128);
                        self.offsetFrame = {};
                        self.offsetFrame.pointer = self.wasm.exports.get_offset_pointer();
                        self.offsetFrame.buffer = new Float32Array(self.wasm.exports.memory.buffer, self.offsetFrame.pointer, 128);
                        self.floorFrame = {};
                        self.floorFrame.pointer = self.wasm.exports.get_floor_pointer();
                        self.floorFrame.buffer = new Float32Array(self.wasm.exports.memory.buffer, self.floorFrame.pointer, 128);
                        self.ceilingFrame = {};
                        self.ceilingFrame.pointer = self.wasm.exports.get_ceiling_pointer();
                        self.ceilingFrame.buffer = new Float32Array(self.wasm.exports.memory.buffer, self.ceilingFrame.pointer, 128);
                    });
                break;
            }
        };
    }

    process(inputs, outputs, parameters){
        if(this.wasm == undefined){ return true; }

        const input = inputs[0];
        const output = outputs[0];

        const sign = parameters.invert[0] == 1 ? -1 : 1;
        const divisor_useFirstOnly = parameters.divisor.length == 1;
        const offset_useFirstOnly = parameters.offset.length == 1;
        const floor_useFirstOnly = parameters.floor.length == 1;
        const ceiling_useFirstOnly = parameters.ceiling.length == 1;

        this.divisorFrame.buffer.set( divisor_useFirstOnly ? [parameters.divisor[0]] : parameters.divisor );
        this.offsetFrame.buffer.set( offset_useFirstOnly ? [parameters.offset[0]] : parameters.offset );
        this.floorFrame.buffer.set( floor_useFirstOnly ? [parameters.floor[0]] : parameters.floor );
        this.ceilingFrame.buffer.set( ceiling_useFirstOnly ? [parameters.ceiling[0]] : parameters.ceiling );

        for(let channel = 0; channel < input.length; channel++){
            this.inputFrame.buffer.set(input[channel]);
            this.wasm.exports.process(
                sign,
                divisor_useFirstOnly,
                offset_useFirstOnly,
                floor_useFirstOnly,
                ceiling_useFirstOnly,
            );
            output[channel].set(this.outputFrame.buffer);
        }

        return true;
    }
}
registerProcessor('amplitudeModifier', amplitudeModifier);