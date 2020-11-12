class osc_4 extends AudioWorkletNode{
    constructor(context, options={}){
        options.numberOfInputs = 3;
        options.numberOfOutputs = 1;
        options.channelCount = 1;
        super(context, 'osc_4', options);
        const self = this;

        this._state = {
            waveform:'sin',
            gain_useControl:false,
            detune_useControl:false,
            dutyCycle_useControl:false,
        };
        this._envelope = {
            front:[
                {elapse:0.5,gain:5},
                {elapse:0.5,gain:1},
            ],
            back:[
                {elapse:0.5,gain:5},
                {elapse:0.5,gain:0}
            ],
        };

        this.port.onmessage = function(event){
            if(self.onEnvelopeEvent == undefined){ return; }
            self.onEnvelopeEvent(event.data.phase);
        };

        this.start = function(){
            this.port.postMessage({command:'start'});
        };
        this.stop = function(){
            this.port.postMessage({command:'stop'});
        };

        this.onEnvelopeEvent = function(data){console.log(data);};
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

    get envelope(){
        return JSON.parse(JSON.stringify(this._envelope));
    }
    set envelope(newEnvelope){
        this._envelope = newEnvelope;
        this.port.postMessage({envelope:newEnvelope});
    }
}