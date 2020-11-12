class stableAmplitudeGenerator extends AudioWorkletNode{
    constructor(context, options={}){
        options.numberOfInputs = 0;
        options.numberOfOutputs = 1;
        options.channelCount = 1;
        super(context, 'stableAmplitudeGenerator', options);
    }

    get amplitude(){
        return this.parameters.get('amplitude');
    }
}