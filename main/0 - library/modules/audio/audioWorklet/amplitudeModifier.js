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
                automationRate: 'k-rate',
            },{
                name: 'divisor',
                defaultValue: 1,
                minValue: 1,
                maxValue: 16,
                automationRate: 'k-rate',
            }
        ];
    }
    
    constructor(options){
        super(options);
    }

    process(inputs, outputs, parameters){
        const input = inputs[0];
        const output = outputs[0];
        
        const offset = parameters.offset/10;
        //shortest code
            const sign = parameters.invert == 1 ? -1 : 1;
            for(let channel = 0; channel < input.length; channel++){
                const inputChannel = input[channel];
                const outputChannel = output[channel];
        
                for(let a = 0; a < inputChannel.length; a++){
                    outputChannel[a] = sign * (inputChannel[a]/parameters.divisor) + offset;
                }
            }

        // //desperate bid for speed
        //     if(parameters.invert == 1){
        //         if(parameters.divisor == 1){
        //             for(let channel = 0; channel < input.length; channel++){
        //                 const inputChannel = input[channel];
        //                 const outputChannel = output[channel];
                
        //                 for(let a = 0; a < inputChannel.length; a++){
        //                     outputChannel[a] = -inputChannel[a] + offset;
        //                 }
        //             }
        //         }else{
        //             for(let channel = 0; channel < input.length; channel++){
        //                 const inputChannel = input[channel];
        //                 const outputChannel = output[channel];
                
        //                 for(let a = 0; a < inputChannel.length; a++){
        //                     outputChannel[a] = -(inputChannel[a]/divisor) + offset;
        //                 }
        //             }
        //         }
        //     }else{
        //         if(parameters.divisor == 1){
        //             for(let channel = 0; channel < input.length; channel++){
        //                 const inputChannel = input[channel];
        //                 const outputChannel = output[channel];
                
        //                 for(let a = 0; a < inputChannel.length; a++){
        //                     outputChannel[a] = inputChannel[a] + offset;
        //                 }
        //             }
        //         }else{
        //             for(let channel = 0; channel < input.length; channel++){
        //                 const inputChannel = input[channel];
        //                 const outputChannel = output[channel];
                
        //                 for(let a = 0; a < inputChannel.length; a++){
        //                     outputChannel[a] = (inputChannel[a]/divisor) + offset;
        //                 }
        //             }
        //         }
        //     }

        return true;
    }
}
registerProcessor('amplitudeModifier', amplitudeModifier);