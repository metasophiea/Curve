class amplitudeControlledModulator extends AudioWorkletNode{
    constructor(context, options={}){
        options.numberOfInputs = 2;
        options.numberOfOutputs = 1;
        options.channelCount = 1;
        super(context, 'amplitudeControlledModulator', options);
    }
}