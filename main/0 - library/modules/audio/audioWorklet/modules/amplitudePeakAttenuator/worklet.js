class amplitudePeakAttenuator extends AudioWorkletProcessor{
    static get parameterDescriptors(){
        return [
            {
                name: 'sharpness',
                defaultValue: 10,
                minValue: 1,
                maxValue: 100,
                automationRate: 'a-rate',
            }
        ];
    }

    constructor(options){
        super(options);
    }

    process(inputs, outputs, parameters){
        const input = inputs[0];
        const output = outputs[0];
        const sharpness = parameters.sharpness;
    
        for(let channel = 0; channel < input.length; channel++){
            const inputChannel = input[channel];
            const outputChannel = output[channel];
    
            for(let a = 0; a < inputChannel.length; a++){
                const mux = inputChannel[a]*sharpness;
                outputChannel[a] = mux / ( 1 + Math.abs(mux) );
            }
        }
        return true;
    }
}
registerProcessor('amplitudePeakAttenuator', amplitudePeakAttenuator);





// 2*(x - x^2)