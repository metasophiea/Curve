class nothing extends AudioWorkletProcessor{
    constructor(options){
        super(options);
    }

    process(inputs, outputs, parameters){
        const input = inputs[0];
        const output = outputs[0];

        for(let channel = 0; channel < input.length; channel++){
            output[channel].set(input[channel]);
        }

        return true;
    }
}
registerProcessor('nothing', nothing);