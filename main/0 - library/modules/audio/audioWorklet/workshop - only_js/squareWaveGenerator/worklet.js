class squareWaveGenerator extends AudioWorkletProcessor{
    static get parameterDescriptors(){
        return [
            {
                name: 'frequency',
                defaultValue: 440,
                minValue: 0,
                maxValue: 20000,
                automationRate: 'a-rate',
            },{
                name: 'dutyCycle',
                defaultValue: 0.5,
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
        const output = outputs[0];

        const frequency_useFirstOnly = parameters.frequency.length == 1;
        const dutyCycle_useFirstOnly = parameters.dutyCycle.length == 1;

        for(let channel = 0; channel < output.length; channel++){
            for(let a = 0; a < output[channel].length; a++){
                const frequency = frequency_useFirstOnly ? parameters.frequency[0] : parameters.frequency[a];
                const dutyCycle = dutyCycle_useFirstOnly ? parameters.dutyCycle[0] : parameters.dutyCycle[a];

                const overallWaveProgressPercentage = (frequency/sampleRate) * (currentFrame+a);
                const waveProgress = overallWaveProgressPercentage - Math.trunc(overallWaveProgressPercentage);
                output[channel][a] = waveProgress < dutyCycle ? 1 : -1;
            }
        }

        return true;
    }
}
registerProcessor('squareWaveGenerator', squareWaveGenerator);