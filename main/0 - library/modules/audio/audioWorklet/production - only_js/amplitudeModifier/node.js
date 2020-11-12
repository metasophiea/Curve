class amplitudeModifier extends AudioWorkletNode{
    constructor(context, options={}){
        options.numberOfInputs = 1;
        options.numberOfOutputs = 1;
        options.channelCount = 1;
        super(context, 'amplitudeModifier', options);

        this._invert = false;
    }

    get invert(){
        return this._invert;
    }
    set invert(value){
        this._invert = value;
        this.parameters.get('invert').setValueAtTime(this._invert?1:0,0);
    }

    get offset(){
        return this.parameters.get('offset');
    }
    get divisor(){
        return this.parameters.get('divisor');
    }
    get ceiling(){
        return this.parameters.get('ceiling');
    }
    get floor(){
        return this.parameters.get('floor');
    }
}