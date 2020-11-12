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
    }

    process(inputs, outputs, parameters){
        const input = inputs[0];
        const output = outputs[0];
        const sign = parameters.invert[0] == 1 ? -1 : 1;

        const divisor_useFirstOnly = parameters.divisor.length == 1;
        const offset_useFirstOnly = parameters.offset.length == 1;
        const floor_useFirstOnly = parameters.floor.length == 1;
        const ceiling_useFirstOnly = parameters.ceiling.length == 1;

        for(let channel = 0; channel < input.length; channel++){        
            for(let a = 0; a < input[channel].length; a++){
                const divisor = divisor_useFirstOnly ? parameters.divisor[0] : parameters.divisor[a];
                const offset = offset_useFirstOnly ? parameters.offset[0] : parameters.offset[a];
                const floor = floor_useFirstOnly ? parameters.floor[0] : parameters.floor[a];
                const ceiling = ceiling_useFirstOnly ? parameters.ceiling[0] : parameters.ceiling[a];

                output[channel][a] = sign * (input[channel][a]/divisor) + offset;

                if( output[channel][a] < floor ){
                    output[channel][a] = floor;
                }else if( output[channel][a] > ceiling ){
                    output[channel][a] = ceiling;
                }
            }
        }

        return true;
    }
}
registerProcessor('amplitudeModifier', amplitudeModifier);