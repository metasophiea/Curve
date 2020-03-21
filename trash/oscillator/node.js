class oscillator extends AudioWorkletNode{
    constructor(context, options={}){
        options.numberOfInputs = 3;
        options.numberOfOutputs = 1;
        options.channelCount = 1;
        super(context, 'oscillator', options);

        this._waveform = 0;
        this._gain_mode = 0;
        this._detune_mode = 0;
        this._dutyCycle_mode = 0;
    }


    get waveform(){
        return this._waveform;
    }
    set waveform(value){
        this._waveform = value;
        this.parameters.get('waveform').setValueAtTime(this._waveform,0);
    }
    get gain_mode(){
        return this._gain_mode;
    }
    set gain_mode(value){
        this._gain_mode = value;
        this.parameters.get('gain_mode').setValueAtTime(this._gain_mode,0);
    }
    get detune_mode(){
        return this._detune_mode;
    }
    set detune_mode(value){
        this._detune_mode = value;
        this.parameters.get('detune_mode').setValueAtTime(this._detune_mode,0);
    }

    get dutyCycle_mode(){
        return this._dutyCycle_mode;
    }
    set dutyCycle_mode(value){
        this._dutyCycle_mode = value;
        this.parameters.get('dutyCycle_mode').setValueAtTime(this._dutyCycle_mode,0);
    }
    get frequency(){
        return this.parameters.get('frequency');
    }
    get gain(){
        return this.parameters.get('gain');
    }
    get detune(){
        return this.parameters.get('detune');
    }
    get dutyCycle(){
        return this.parameters.get('dutyCycle');
    }
}