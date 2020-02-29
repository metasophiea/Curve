class osc_2 extends AudioWorkletNode{
    constructor(context, options={}){
        options.numberOfInputs = 2;
        options.numberOfOutputs = 1;
        options.channelCount = 1;
        super(context, 'osc_2', options);
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

    get harmonic_mux_1(){
        return this.parameters.get('harmonic_mux_1');
    }
    get harmonic_mux_2(){
        return this.parameters.get('harmonic_mux_2');
    }
    get harmonic_power_1(){
        return this.parameters.get('harmonic_power_1');
    }
    get harmonic_power_2(){
        return this.parameters.get('harmonic_power_2');
    }
}