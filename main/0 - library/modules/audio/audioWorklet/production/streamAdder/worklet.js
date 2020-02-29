class streamAdder extends AudioWorkletProcessor{
    static get parameterDescriptors(){
        return [
            {
                name: 'mode',
                defaultValue: 0, // 0 - manual / 1 - automatic
                minValue: 0,
                maxValue: 1,
                automationRate: 'k-rate',
            },{
                name: 'mix',
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
        const input_1 = inputs[0];
        const input_2 = inputs[1];
        const mixControl = inputs[2];
        const output = outputs[0];

        const mix_useFirstOnly = parameters.mix.length == 1;

        for(let channel = 0; channel < output.length; channel++){
            for(let a = 0; a < output[channel].length; a++){
                const mix = parameters.mode[0] == 0 ? (mix_useFirstOnly ? parameters.mix[0] : parameters.mix[a]) : (mixControl[channel][a]+1)/2;
                output[channel][a] = input_1[channel][a]*(1-mix) + input_2[channel][a]*mix;
            }
        }

        return true;
    }
}
registerProcessor('streamAdder', streamAdder);