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
                defaultValue: 16,
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
            for(let a = 0; a < input[channel].length; a++){
                output[channel][a] = a%sampleFrequency == 0 ? Math.round(input[channel][a]*amplitudeResolution)/amplitudeResolution : output[channel][a-1];
            }
        }
        return true;
    }
}
registerProcessor('bitcrusher', bitcrusher);