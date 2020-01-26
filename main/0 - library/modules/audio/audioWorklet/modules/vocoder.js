class vocoder extends AudioWorkletProcessor{
    static get parameterDescriptors(){
        return [];
    }
    
    constructor(options){
        super(options);
    }

    process(inputs, outputs, parameters){
        const input_1 = inputs[0];
        const input_2 = inputs[1];
        const output_1 = outputs[0];

        for(let channel = 0; channel < input_1.length; channel++){
            const input_1_Channel = input_1[channel];
            const input_2_Channel = input_2[channel];
            const outputChannel = output_1[channel];
    
            for(let a = 0; a < outputChannel.length; a++){
                outputChannel[a] = input_1_Channel[a] * Math.abs(input_2_Channel[a])*2;
            }
        }

        return true;
    }
}
registerProcessor('vocoder', vocoder);