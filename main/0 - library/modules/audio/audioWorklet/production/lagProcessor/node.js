class lagProcessor extends AudioWorkletNode{
    constructor(context, options={}){
        options.numberOfInputs = 1;
        options.numberOfOutputs = 1;
        options.channelCount = 1;
        super(context, 'lagProcessor', options);

        this._samples = 1;
    }

    get samples(){
        return this._samples;
    }
    set samples(value){
        this._samples = Math.round(value);
        this.parameters.get('samples').setValueAtTime(this._samples,0);
    }
}