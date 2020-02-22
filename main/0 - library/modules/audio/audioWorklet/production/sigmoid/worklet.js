class sigmoid extends AudioWorkletProcessor{
    static get parameterDescriptors(){
        return [
            {
                name: 'gain',
                defaultValue: 1,
                minValue: 0,
                maxValue: 1,
                automationRate: 'a-rate',
            },
            {
                name: 'sharpness',
                defaultValue: 0,
                minValue: 0,
                maxValue: 1,
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
        const gain_useFirstOnly = parameters.gain.length == 1;
        const sharpness_useFirstOnly = parameters.sharpness.length == 1;
    
        for(let channel = 0; channel < input.length; channel++){
            const inputChannel = input[channel];
            const outputChannel = output[channel];
    
            for(let a = 0; a < inputChannel.length; a++){
                const gain = gain_useFirstOnly ? parameters.gain[0] : parameters.gain[a];
                const sharpness = sharpness_useFirstOnly ? parameters.sharpness[0] : parameters.sharpness[a];
                outputChannel[a] = gain * ( inputChannel[a] / ( 1 - sharpness + sharpness*Math.abs(inputChannel[a]) ) );
            }
        }
        return true;
    }
}
registerProcessor('sigmoid', sigmoid);