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
            },{
                name: 'ceiling',
                defaultValue: 10,
                minValue: -10,
                maxValue: 10,
                automationRate: 'k-rate',
            },{
                name: 'floor',
                defaultValue: -10,
                minValue: -10,
                maxValue: 10,
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

        //shortest code
            const sign = parameters.invert == 1 ? -1 : 1;
            for(let channel = 0; channel < input.length; channel++){        
                for(let a = 0; a < input[channel].length; a++){
                    output[channel][a] = sign * (input[channel][a]/parameters.divisor) + parameters.offset[0];

                    if( output[channel][a] < parameters.floor ){
                        output[channel][a] = parameters.floor;
                    }else if( output[channel][a] > parameters.ceiling ){
                        output[channel][a] = parameters.ceiling;
                    }
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

        //                     if( output[channel][a] < parameters.floor ){
        //                         output[channel][a] = parameters.floor;
        //                     }else if( output[channel][a] > parameters.ceiling ){
        //                         output[channel][a] = parameters.ceiling;
        //                     }
        //                 }
        //             }
        //         }else{
        //             for(let channel = 0; channel < input.length; channel++){
        //                 const inputChannel = input[channel];
        //                 const outputChannel = output[channel];
                
        //                 for(let a = 0; a < inputChannel.length; a++){
        //                     outputChannel[a] = -(inputChannel[a]/divisor) + offset;

        //                     if( output[channel][a] < parameters.floor ){
        //                         output[channel][a] = parameters.floor;
        //                     }else if( output[channel][a] > parameters.ceiling ){
        //                         output[channel][a] = parameters.ceiling;
        //                     }
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

        //                     if( output[channel][a] < parameters.floor ){
        //                         output[channel][a] = parameters.floor;
        //                     }else if( output[channel][a] > parameters.ceiling ){
        //                         output[channel][a] = parameters.ceiling;
        //                     }
        //                 }
        //             }
        //         }else{
        //             for(let channel = 0; channel < input.length; channel++){
        //                 const inputChannel = input[channel];
        //                 const outputChannel = output[channel];
                
        //                 for(let a = 0; a < inputChannel.length; a++){
        //                     outputChannel[a] = (inputChannel[a]/divisor) + offset;

        //                     if( output[channel][a] < parameters.floor ){
        //                         output[channel][a] = parameters.floor;
        //                     }else if( output[channel][a] > parameters.ceiling ){
        //                         output[channel][a] = parameters.ceiling;
        //                     }
        //                 }
        //             }
        //         }
        //     }

        return true;
    }
}
registerProcessor('amplitudeModifier', amplitudeModifier);