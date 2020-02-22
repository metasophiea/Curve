class amplitudeControlledModulator extends AudioWorkletProcessor{
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
            for(let a = 0; a < output_1[channel].length; a++){
                output_1[channel][a] = input_1[channel][a] * input_2[channel][a];
            }
        }

        return true;
    }
}
registerProcessor('amplitudeControlledModulator', amplitudeControlledModulator);