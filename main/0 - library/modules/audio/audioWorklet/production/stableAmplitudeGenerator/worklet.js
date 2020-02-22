class stableAmplitudeGenerator extends AudioWorkletProcessor{
    static get parameterDescriptors(){
        return [
            {
                name: 'amplitude',
                defaultValue: 0,
                minValue: -1,
                maxValue: 1,
                automationRate: 'k-rate',
            }
        ];
    }

    constructor(options){
        super(options);
    }

    process(inputs, outputs, parameters){
        const output = outputs[0];

        for(let channel = 0; channel < output.length; channel++){
            for(let a = 0; a < output[channel].length; a++){
                output[channel][a] = parameters.amplitude[0];
            }
        }

        return true;
    }
}
registerProcessor('stableAmplitudeGenerator', stableAmplitudeGenerator);