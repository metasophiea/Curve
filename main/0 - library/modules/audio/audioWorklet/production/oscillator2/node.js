class oscillator2 extends AudioWorkletNode{
    constructor(context, options={}){
        options.numberOfInputs = 3;
        options.numberOfOutputs = 1;
        options.channelCount = 1;
        super(context, 'oscillator2', options);
        const self = this;

        this._state = {
            waveform:'sin',
            gain_useControl:false,
            detune_useControl:false,
            dutyCycle_useControl:false,
        };
        this._gainEnvelope = {
            front:[ {destination:1, elapse:0} ],
            back:[ {destination:0, elapse:0} ],
        };

        this.port.onmessage = function(event){
            if(self.onEnvelopeEvent == undefined){ return; }
            self.onEnvelopeEvent(event.data.gain_phase);
        };

        this.start = function(){
            this.port.postMessage({command:'start'});
        };
        this.stop = function(){
            this.port.postMessage({command:'stop'});
        };

        this.onEnvelopeEvent = function(){};
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


    get waveform(){
        return this._waveform;
    }
    set waveform(value){
        this._state.waveform = value;
        this.port.postMessage({waveform:value});
    }
    get gain_useControl(){
        return this._state.gain_useControl;
    }
    set gain_useControl(bool){
        this._state.gain_useControl = bool;
        this.port.postMessage({gain_useControl:bool});
    }
    get detune_useControl(){
        return this._state.detune_useControl;
    }
    set detune_useControl(bool){
        this._state.detune_useControl = bool;
        this.port.postMessage({detune_useControl:bool});
    }
    get dutyCycle_useControl(){
        return this._state.dutyCycle_useControl;
    }
    set dutyCycle_useControl(bool){
        this._state.dutyCycle_useControl = bool;
        this.port.postMessage({dutyCycle_useControl:bool});
    }

    
    get gain_envelope(){
        return JSON.parse(JSON.stringify(this.gain_envelope));
    }
    set gain_envelope(newEnvelope){
        this._gainEnvelope = newEnvelope;
        this.port.postMessage({gain_envelope:newEnvelope});
    }
    get detune_envelope(){
        return JSON.parse(JSON.stringify(this.detune_envelope));
    }
    set detune_envelope(newEnvelope){
        this._detuneEnvelope = newEnvelope;
        this.port.postMessage({detune_envelope:newEnvelope});
    }
    get dutyCycle_envelope(){
        return JSON.parse(JSON.stringify(this.dutyCycle_envelope));
    }
    set dutyCycle_envelope(newEnvelope){
        this._dutyCycleEnvelope = newEnvelope;
        this.port.postMessage({dutyCycle_envelope:newEnvelope});
    }
}