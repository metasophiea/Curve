class osc_4 extends AudioWorkletProcessor{
    static twoPI = Math.PI*2;
    static starterFrequency = 440;
    static maxFrequency = 20000;
    static detuneMux = 0.1;
    static detuneBounds = 1/osc_4.detuneMux;

    static get parameterDescriptors(){
        return [
            {
                name: 'frequency',
                defaultValue: osc_4.starterFrequency,
                minValue: 0,
                maxValue: osc_4.maxFrequency,
                automationRate: 'a-rate',
            },{
                name: 'gain',
                defaultValue: 1,
                minValue: -1,
                maxValue: 1,
                automationRate: 'a-rate',
            },{
                name: 'detune',
                defaultValue: 0,
                minValue: -osc_4.detuneBounds,
                maxValue: osc_4.detuneBounds,
                automationRate: 'a-rate',
            },{
                name: 'dutyCycle',
                defaultValue: 0.5,
                minValue: 0,
                maxValue: 1,
                automationRate: 'a-rate',
            },
        ];
    }

    constructor(options){
        super(options);
        const self = this;
        this._wavePosition = 0;

        this._state = {
            waveform:'sin',
            gain_useControl:false,
            detune_useControl:false,
            dutyCycle_useControl:false,
        };
        this._envelope = {
            phase:'off', // front - wait - back - off
            requestedPhase:undefined,

            gainStep:0,
            previousGain:0,
            currentGain:0,

            procedure:{
                index:0,
                sample:0,
                front:[ {destination:1, elapse:0, _elapseSamples:1} ],
                back:[ {destination:0, elapse:0, _elapseSamples:1} ],
            },
            defaultProcedurePoint:{
                front:{destination:1, elapse:0, _elapseSamples:1},
                back:{destination:0, elapse:0, _elapseSamples:1},
            },
        };

        this.port.onmessage = function(event){
            Object.entries(event.data).forEach(([key,value]) => {
                switch(key){
                    case 'command':
                        switch(value){
                            case 'start':
                                if(self._envelope.requestedPhase == 'back' || self._envelope.phase == 'back' || self._envelope.phase == 'off'){
                                    self._envelope.requestedPhase = 'front';
                                }
                            break;
                            case 'stop':
                                if(self._envelope.requestedPhase == 'front' || self._envelope.phase == 'front' || self._envelope.phase == 'wait'){
                                    self._envelope.requestedPhase = 'back';
                                }
                            break;
                        }
                    break;
                    case 'waveform': 
                        self._state.waveform = value;
                    break;
                    case 'gain_useControl': 
                        self._state.gain_useControl = value;
                    break;
                    case 'detune_useControl': 
                        self._state.detune_useControl = value;
                    break;
                    case 'dutyCycle_useControl': 
                        self._state.dutyCycle_useControl = value;
                    break;
                    case 'envelope':
                        Object.entries(value).forEach(([phase,points]) => {
                            if( points != undefined && points.length != 0 ){
                                self._envelope.procedure[phase] = points.map(point => {
                                    return {
                                        destination:point.destination, 
                                        elapse:point.elapse, 
                                        _elapseSamples:point.elapse == 0 ? 1 : sampleRate*point.elapse
                                    };
                                });
                            }else{
                                self._envelope.procedure[phase] = [self._envelope.defaultProcedurePoint[phase]];
                            }
                        });
                    break;
                }
            });
        };
        this.port.start();
    }

    process(inputs, outputs, parameters){
        //envelope calculation
            this.activatePhase();
            if( this._envelope.phase == 'off'){ return true; }

        //io
            const output = outputs[0];
            const gainControl = inputs[0];
            const detuneControl = inputs[1];
            const dutyCycleControl = inputs[2];

        //oscillation gerneration
            const frequency_useFirstOnly = parameters.frequency.length == 1;
            const dutyCycle_useFirstOnly = parameters.dutyCycle.length == 1;
            const detune_useFirstOnly = parameters.detune.length == 1;
            const gain_useFirstOnly = parameters.gain.length == 1;

            for(let channel = 0; channel < output.length; channel++){
                for(let a = 0; a < output[channel].length; a++){
                    if(this._envelope.phase == 'front' || this._envelope.phase == 'back'){
                        if( currentFrame+a - this._envelope.procedure.sample >= this._envelope.procedure[this._envelope.phase][this._envelope.procedure.index]._elapseSamples ){
                            this._envelope.procedure.index++;
                            this._envelope.procedure.sample = currentFrame+a;
                            if( this._envelope.procedure.index >= this._envelope.procedure[this._envelope.phase].length){
                                if(this._envelope.phase == 'front'){
                                    this._envelope.phase = 'wait';
                                    this.port.postMessage({phase:'wait'});
                                    this._envelope.gainStep = 0;
                                }else if(this._envelope.phase == 'back'){
                                    this._envelope.phase = 'off';
                                    this.port.postMessage({phase:'off'});
                                    this._envelope.gainStep = 0;
                                }
                            }else{
                                this._envelope.previousGain = this._envelope.currentGain;
                                this._envelope.gainStep = (this._envelope.procedure[this._envelope.phase][this._envelope.procedure.index].destination - this._envelope.previousGain)/this._envelope.procedure[this._envelope.phase][this._envelope.procedure.index]._elapseSamples;                    
                            }
                        }
                    }

                    this._envelope.currentGain += this._envelope.gainStep;

                    const gain = this._envelope.currentGain * (this._state.gain_useControl ? gainControl[channel][a] : (gain_useFirstOnly ? parameters.gain[0] : parameters.gain[a]));
                    const frequency = frequency_useFirstOnly ? parameters.frequency[0] : parameters.frequency[a];
                    const detune = this._state.detune_useControl ? detuneControl[channel][a] : (detune_useFirstOnly ? parameters.detune[0] : parameters.detune[a]);
                    const dutyCycle = this._state.dutyCycle_useControl ? dutyCycleControl[channel][a] : (dutyCycle_useFirstOnly ? parameters.dutyCycle[0] : parameters.dutyCycle[a]);

                    this._wavePosition += (frequency*(detune*osc_4.detuneMux + 1))/sampleRate;
                    const localWavePosition = this._wavePosition % 1;

                    switch(this._state.waveform){
                        case 'sin':
                            output[channel][a] = gain*Math.sin( localWavePosition * osc_4.twoPI );
                        break;
                        case 'square':
                            output[channel][a] = gain*(localWavePosition < dutyCycle ? 1 : -1);
                        break;
                        case 'triangle':
                            if(localWavePosition < dutyCycle/2){
                                output[channel][a] = gain*(2*localWavePosition / dutyCycle);
                            }else if(localWavePosition >= 1 - dutyCycle/2){
                                output[channel][a] = gain*((2*localWavePosition - 2) / dutyCycle);
                            }else{
                                output[channel][a] = gain*((2*localWavePosition - 1) / (dutyCycle - 1));
                            }
                        break;
                        case 'noise': default: 
                            output[channel][a] = gain*(Math.random()*2 - 1);
                        break;
                    }
                }
            }

        return true;
    }

    activatePhase(){
        if( this._envelope.requestedPhase != undefined && this._envelope.requestedPhase != this._envelope.phase ){
            this._envelope.phase = this._envelope.requestedPhase;
            this.port.postMessage({phase:this._envelope.phase});
            this._envelope.requestedPhase = undefined;
            this._envelope.procedure.sample = currentFrame;
            this._envelope.procedure.index = 0;
            this._envelope.previousGain = this._envelope.currentGain;
            this._envelope.gainStep = (this._envelope.procedure[this._envelope.phase][this._envelope.procedure.index].destination - this._envelope.previousGain)/this._envelope.procedure[this._envelope.phase][this._envelope.procedure.index]._elapseSamples;
            if( this._envelope.phase == 'start' ){ this._wavePosition = 0; }
        }
    }
}
registerProcessor('osc_4', osc_4);