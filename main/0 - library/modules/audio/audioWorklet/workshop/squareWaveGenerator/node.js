class squareWaveGenerator extends AudioWorkletNode{
    constructor(context, options={}){
        options.numberOfInputs = 0;
        options.numberOfOutputs = 1;
        options.channelCount = 1;
        super(context, 'squareWaveGenerator', options);
    }

    get frequency(){
        return this.parameters.get('frequency');
    }
    get dutyCycle(){
        return this.parameters.get('dutyCycle');
    }
}