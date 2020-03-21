class oscillator extends AudioWorkletNode{
    constructor(context, options={}){
        options.numberOfInputs = 3;
        options.numberOfOutputs = 1;
        options.channelCount = 1;
        super(context, 'oscillator', options);
        const self = this;

        this._state = {
            waveform:'sine',
            gain_useControl:false,
            detune_useControl:false,
            dutyCycle_useControl:false,
        };
        this._gain_envelope = {
            front:[ {destination:1, elapse:0} ],
            back:[ {destination:0, elapse:0} ],
        };
        this._detune_envelope = {
            reporting:false,
            front:[ {destination:0, elapse:0} ],
            back:[ {destination:0, elapse:0} ],
        };
        this._dutyCycle_envelope = {
            reporting:false,
            front:[ {destination:0.5, elapse:0} ],
            back:[ {destination:0.5, elapse:0} ],
        };
        this._reporting = {
            gain:false,
            detune:false,
            dutyCycle:false,
        };
        this._additiveSynthesisSettings = {
            sin:[1],
            cos:[]
        };
        this._phaseModulation_settings = [
            {mux:2,power:1},
            {mux:3,power:1},
        ];

        this.port.onmessage = function(event){
            if(self.onEnvelopeEvent == undefined){ return; }
            const event_deconstructed = Object.entries(event.data)[0];
            self.onEnvelopeEvent({aspect:event_deconstructed[0], phase:event_deconstructed[1]});
        };

        this.start = function(velocity=1){
            this.port.postMessage({start:velocity});
        };
        this.stop = function(){
            this.port.postMessage({stop:undefined});
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
        return this._state.waveform;
    }
    set waveform(value){ // sine / square / triangle / noise / additiveSynthesis / phaseModulation
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
        return JSON.parse(JSON.stringify(this._gain_envelope));
    }
    set gain_envelope(newEnvelope){
        this._gain_envelope = newEnvelope;
        this.port.postMessage({gain_envelope:newEnvelope});
    }
    get detune_envelope(){
        return JSON.parse(JSON.stringify(this._detune_envelope));
    }
    set detune_envelope(newEnvelope){
        this._detune_envelope = newEnvelope;
        this.port.postMessage({detune_envelope:newEnvelope});
    }
    get dutyCycle_envelope(){
        return JSON.parse(JSON.stringify(this._dutyCycle_envelope));
    }
    set dutyCycle_envelope(newEnvelope){
        this._dutyCycle_envelope = newEnvelope;
        this.port.postMessage({dutyCycle_envelope:newEnvelope});
    }

    get gain_envelope_reporting(){
        return this._reporting.gain;
    }
    set gain_envelope_reporting(bool){
        this._reporting.gain = bool;
        this.port.postMessage({gain_reporting:bool});
    }
    get detune_envelope_reporting(){
        return this._reporting.detune;
    }
    set detune_envelope_reporting(bool){
        this._reporting.detune = bool;
        this.port.postMessage({detune_reporting:bool});
    }
    get dutyCycle_envelope_reporting(){
        return this._reporting.dutyCycle;
    }
    set dutyCycle_envelope_reporting(bool){
        this._reporting.dutyCycle = bool;
        this.port.postMessage({dutyCycle_reporting:bool});
    }

    get additiveSynthesis_sin(){
        return JSON.parse(JSON.stringify(this._additiveSynthesisSettings.sin));
    }
    set additiveSynthesis_sin(value){
        this._additiveSynthesisSettings.sin = value;
        this.port.postMessage({additiveSynthesis_sin:value});
    }
    get additiveSynthesis_cos(){
        return JSON.parse(JSON.stringify(this._additiveSynthesisSettings.cos));
    }
    set additiveSynthesis_cos(value){
        this._additiveSynthesisSettings.cos = value;
        this.port.postMessage({additiveSynthesis_cos:value});
    }

    get phaseModulation_settings(){
        return JSON.parse(JSON.stringify(this._phaseModulation_settings));
    }
    set phaseModulation_settings(value){
        this._phaseModulation_settings = value;
        this.port.postMessage({_phaseModulation_settings:value});
    }
}