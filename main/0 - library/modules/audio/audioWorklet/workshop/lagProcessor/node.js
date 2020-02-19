class lagProcessor extends AudioWorkletNode{
    constructor(context, options={}){
        options.numberOfInputs = 1;
        options.numberOfOutputs = 1;
        options.channelCount = 1;
        super(context, 'lagProcessor', options);
    }

    get samples(){
        return this.parameters.get('samples');
    }
}