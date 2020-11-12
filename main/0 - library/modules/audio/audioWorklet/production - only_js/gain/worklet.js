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
    }

    process(inputs, outputs, parameters){
        const input_1 = inputs[0];
        const input_2 = inputs[1];
        const output_1 = outputs[0];

        if( parameters.mode[0] == 1 ){
            //automatic
            for(let channel = 0; channel < input_1.length; channel++){    
                for(let a = 0; a < output_1[channel].length; a++){
                    output_1[channel][a] = input_1[channel][a] * input_2[channel][a];
                }
            }
        }else{
            //manual
            if(parameters.gain.length == 1){
                for(let channel = 0; channel < input_1.length; channel++){        
                    for(let a = 0; a < input_1[channel].length; a++){
                        output_1[channel][a] = input_1[channel][a] * parameters.gain[0];
                    }
                }
            }else{
                for(let channel = 0; channel < input_1.length; channel++){        
                    for(let a = 0; a < input_1[channel].length; a++){
                        output_1[channel][a] = input_1[channel][a] * parameters.gain[a];
                    }
                }
            }
        }

        return true;
    }
}
registerProcessor('gain', gain);