class amplitudeInverter extends AudioWorkletProcessor{
    static get parameterDescriptors(){
        return [];
    }
    
    constructor(options){
        super(options);
    }

    process(inputs, outputs, parameters){
        const input = inputs[0];
        const output = outputs[0];
    
        for(let channel = 0; channel < input.length; channel++){
            const inputChannel = input[channel];
            const outputChannel = output[channel];
    
            for(let a = 0; a < inputChannel.length; a++){
                outputChannel[a] = -inputChannel[a];
            }
        }
        return true;
    }
}
registerProcessor('amplitudeInverter', amplitudeInverter);