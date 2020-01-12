class bitcrusher extends AudioWorkletProcessor{
    static get parameterDescriptors(){
        return [
            {
                name: 'amplitudeResolution',
                defaultValue: 10,
                minValue: 1,
                maxValue: 128,
                automationRate: 'k-rate',
            },{
                name: 'sampleFrequency',
                defaultValue: 1,
                minValue: 1,
                maxValue: 128,
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
        const amplitudeResolution = parameters.amplitudeResolution;
        const sampleFrequency = parameters.sampleFrequency;
    
        for(let channel = 0; channel < input.length; channel++){
            const inputChannel = input[channel];
            const outputChannel = output[channel];
    
            for(let i = 0; i < inputChannel.length; i++){
                outputChannel[i] = i%sampleFrequency == 0 ? Math.round(inputChannel[i]*amplitudeResolution)/amplitudeResolution : outputChannel[i-1];
            }
        }
    return true;
    }
}
registerProcessor('bitcrusher', bitcrusher);