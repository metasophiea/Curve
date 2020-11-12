class sigmoid extends AudioWorkletNode{
    constructor(context, options={}){
        options.numberOfInputs = 1;
        options.numberOfOutputs = 1;
        options.channelCount = 1;
        super(context, 'sigmoid', options);
    }

    get gain(){
        return this.parameters.get('gain');
    }
    get sharpness(){
        return this.parameters.get('sharpness');
    }
}