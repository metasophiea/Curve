class bitcrusher extends AudioWorkletNode{
    constructor(context, options={}){
        options.numberOfInputs = 1;
        options.numberOfOutputs = 1;
        options.channelCount = 1;
        super(context, 'bitcrusher', options);
        
        this._amplitudeResolution = 10;
        this._sampleFrequency = 16;
    }

    get amplitudeResolution(){
        return this._amplitudeResolution;
    }
    set amplitudeResolution(value){
        this._amplitudeResolution = value;
        this.parameters.get('amplitudeResolution').setValueAtTime(this._amplitudeResolution,0);
    }

    get sampleFrequency(){
        return this._sampleFrequency;
    }
    set sampleFrequency(value){
        this._sampleFrequency = value;
        this.parameters.get('sampleFrequency').setValueAtTime(this._sampleFrequency,0);
    }
}