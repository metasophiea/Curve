class gain extends AudioWorkletNode{
    constructor(context, options={}){
        options.numberOfInputs = 2;
        options.numberOfOutputs = 1;
        options.channelCount = 1;
        super(context, 'gain', options);

        this._mode = false;
    }

    get mode(){
        return this._mode;
    }
    set mode(value){
        this._mode = value;
        this.parameters.get('mode').setValueAtTime(this._mode?1:0,0);
    }
    get gain(){
        return this.parameters.get('gain');
    }
}