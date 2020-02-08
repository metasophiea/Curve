class amplitudeExciter extends AudioWorkletNode{
    constructor(context, options={}){
        options.numberOfInputs = 1;
        options.numberOfOutputs = 1;
        options.channelCount = 1;
        super(context, 'amplitudeExciter', options);
        
        this._sharpness = 10;
    }

    get sharpness(){
        return this.parameters.get('sharpness');
    }
}