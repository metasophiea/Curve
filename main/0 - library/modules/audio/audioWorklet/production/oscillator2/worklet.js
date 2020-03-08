class oscillator2 extends AudioWorkletProcessor{
    static twoPI = Math.PI*2;
    static starterFrequency = 440;
    static maxFrequency = 20000;
    static detuneMux = 0.1;
    static detuneBounds = 1/oscillator2.detuneMux;

    static get parameterDescriptors(){
        return [
            {
                name: 'frequency',
                defaultValue: oscillator2.starterFrequency,
                minValue: 0,
                maxValue: oscillator2.maxFrequency,
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
                minValue: -oscillator2.detuneBounds,
                maxValue: oscillator2.detuneBounds,
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
            waveform:'sine',
            gain_useControl:false,
            detune_useControl:false,
            dutyCycle_useControl:false,
        };
        this._envelope = {
            gain:{
                phase:'off', // front - wait - back - off
                requestedPhase:undefined,

                step:0,
                previous:0,
                current:0,

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
            },
            detune:{
                phase:'off', // front - wait - back - off
                requestedPhase:undefined,

                step:0,
                previous:0,
                current:0,

                procedure:{
                    index:0,
                    sample:0,
                    front:[ {destination:0, elapse:0, _elapseSamples:1} ],
                    back:[ {destination:0, elapse:0, _elapseSamples:1} ],
                },
                defaultProcedurePoint:{
                    front:{destination:0, elapse:0, _elapseSamples:1},
                    back:{destination:0, elapse:0, _elapseSamples:1},
                },
            },
            dutyCycle:{
                phase:'off', // front - wait - back - off
                requestedPhase:undefined,

                step:0,
                previous:0,
                current:0,

                procedure:{
                    index:0,
                    sample:0,
                    front:[ {destination:0.5, elapse:0, _elapseSamples:1} ],
                    back:[ {destination:0.5, elapse:0, _elapseSamples:1} ],
                },
                defaultProcedurePoint:{
                    front:{destination:0.5, elapse:0, _elapseSamples:1},
                    back:{destination:0.5, elapse:0, _elapseSamples:1},
                },
            },
        };

        this.port.onmessage = function(event){
            Object.entries(event.data).forEach(([key,value]) => {
                switch(key){
                    case 'command':
                        switch(value){
                            case 'start':
                                Object.keys(self._envelope).forEach(aspect => {
                                    if(self._envelope[aspect].requestedPhase == 'back' || self._envelope[aspect].phase == 'back' || self._envelope[aspect].phase == 'off'){
                                        self._envelope[aspect].requestedPhase = 'front';
                                    }
                                });
                            break;
                            case 'stop':
                                Object.keys(self._envelope).forEach(aspect => {
                                    if(self._envelope[aspect].requestedPhase == 'front' || self._envelope[aspect].phase == 'front' || self._envelope[aspect].phase == 'wait'){
                                        self._envelope[aspect].requestedPhase = 'back';
                                    }
                                });
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
                    case 'gain_envelope':
                        Object.entries(value).forEach(([phase,points]) => {
                            if( points != undefined && points.length != 0 ){
                                self._envelope.gain.procedure[phase] = points.map(point => {
                                    return {
                                        destination:point.destination, 
                                        elapse:point.elapse, 
                                        _elapseSamples:point.elapse == 0 ? 1 : sampleRate*point.elapse
                                    };
                                });
                            }else{
                                self._envelope.gain.procedure[phase] = [self._envelope.gain.defaultProcedurePoint[phase]];
                            }
                        });
                    break;
                    case 'detune_envelope':
                        Object.entries(value).forEach(([phase,points]) => {
                            if( points != undefined && points.length != 0 ){
                                self._envelope.detune.procedure[phase] = points.map(point => {
                                    return {
                                        destination:point.destination, 
                                        elapse:point.elapse, 
                                        _elapseSamples:point.elapse == 0 ? 1 : sampleRate*point.elapse
                                    };
                                });
                            }else{
                                self._envelope.detune.procedure[phase] = [self._envelope.detune.defaultProcedurePoint[phase]];
                            }
                        });
                    break;
                    case 'dutyCycle_envelope':
                        Object.entries(value).forEach(([phase,points]) => {
                            if( points != undefined && points.length != 0 ){
                                self._envelope.dutyCycle.procedure[phase] = points.map(point => {
                                    return {
                                        destination:point.destination, 
                                        elapse:point.elapse, 
                                        _elapseSamples:point.elapse == 0 ? 1 : sampleRate*point.elapse
                                    };
                                });
                            }else{
                                self._envelope.dutyCycle.procedure[phase] = [self._envelope.dutyCycle.defaultProcedurePoint[phase]];
                            }
                        });
                    break;
                }
            });
        };
        this.port.start();
    }

    process(inputs, outputs, parameters){
        //envelope activation
            this.activatePhase();
            if( this._envelope.gain.phase == 'off'){ return true; }

        //io
            const output = outputs[0];
            const gainControl = inputs[0]; 
            const detuneControl = inputs[1];
            const dutyCycleControl = inputs[2];

        //oscillation generation
            const frequency_useFirstOnly = parameters.frequency.length == 1;
            const dutyCycle_useFirstOnly = parameters.dutyCycle.length == 1;
            const detune_useFirstOnly = parameters.detune.length == 1;
            const gain_useFirstOnly = parameters.gain.length == 1;

            for(let channel = 0; channel < output.length; channel++){
                for(let a = 0; a < output[channel].length; a++){
                    //envelope calculation
                        Object.keys(this._envelope).forEach(aspect => {
                            if(this._envelope[aspect].phase == 'front' || this._envelope[aspect].phase == 'back'){
                                if( currentFrame+a - this._envelope[aspect].procedure.sample >= this._envelope[aspect].procedure[this._envelope[aspect].phase][this._envelope[aspect].procedure.index]._elapseSamples ){
                                    this._envelope[aspect].procedure.index++;
                                    this._envelope[aspect].procedure.sample = currentFrame+a;
                                    if( this._envelope[aspect].procedure.index >= this._envelope[aspect].procedure[this._envelope[aspect].phase].length){
                                        if(this._envelope[aspect].phase == 'front'){
                                            this._envelope[aspect].phase = 'wait';
                                            this.reportPhase(aspect);
                                            this._envelope[aspect].step = 0;
                                        }else if(this._envelope[aspect].phase == 'back'){
                                            this._envelope[aspect].phase = 'off';
                                            this.reportPhase(aspect);
                                            this._envelope[aspect].step = 0;
                                        }
                                    }else{
                                        this._envelope[aspect].previous = this._envelope[aspect].current;
                                        this._envelope[aspect].step = (this._envelope[aspect].procedure[this._envelope[aspect].phase][this._envelope[aspect].procedure.index].destination - this._envelope[aspect].previous)/this._envelope[aspect].procedure[this._envelope[aspect].phase][this._envelope[aspect].procedure.index]._elapseSamples;                    
                                    }
                                }
                            }
                            this._envelope[aspect].current += this._envelope[aspect].step;
                        });

                    //aspect calculation
                        const gain = this._envelope.gain.current * (this._state.gain_useControl ? gainControl[channel][a] : (gain_useFirstOnly ? parameters.gain[0] : parameters.gain[a]));
                        const detune = this._envelope.detune.current + (this._state.detune_useControl ? detuneControl[channel][a] : (detune_useFirstOnly ? parameters.detune[0] : parameters.detune[a]));
                        const dutyCycle = this._envelope.dutyCycle.current + (this._state.dutyCycle_useControl ? dutyCycleControl[channel][a] : (dutyCycle_useFirstOnly ? parameters.dutyCycle[0] : parameters.dutyCycle[a]));

                    //wave calculation
                        const frequency = frequency_useFirstOnly ? parameters.frequency[0] : parameters.frequency[a];
                        this._wavePosition += (frequency*(detune*oscillator2.detuneMux + 1))/sampleRate;
                        const localWavePosition = this._wavePosition % 1;

                        switch(this._state.waveform){
                            case 'sine':
                                output[channel][a] = gain*Math.sin( localWavePosition * oscillator2.twoPI );
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
        Object.keys(this._envelope).forEach(aspect => {
            if( this._envelope[aspect].requestedPhase != undefined && this._envelope[aspect].requestedPhase != this._envelope[aspect].phase ){
                this._envelope[aspect].phase = this._envelope[aspect].requestedPhase;
                this.reportPhase(aspect);
                this._envelope[aspect].requestedPhase = undefined;
                this._envelope[aspect].procedure.sample = currentFrame;
                this._envelope[aspect].procedure.index = 0;
                this._envelope[aspect].previous = this._envelope[aspect].current;
                this._envelope[aspect].step = (this._envelope[aspect].procedure[this._envelope[aspect].phase][this._envelope[aspect].procedure.index].destination - this._envelope[aspect].previous)/this._envelope[aspect].procedure[this._envelope[aspect].phase][this._envelope[aspect].procedure.index]._elapseSamples;
                if( aspect == 'gain' && this._envelope.gain.phase == 'start' ){ this._wavePosition = 0; }
            }
        });
    }

    reportPhase(aspect){
        const self = this;
        this.port.postMessage(
            (() => {
                const tmp = {};
                tmp[aspect+'_phase'] = self._envelope[aspect].phase;
                return tmp;
            })()
        );
    }
}
registerProcessor('oscillator2', oscillator2);