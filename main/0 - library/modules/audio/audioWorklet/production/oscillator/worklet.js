class oscillator extends AudioWorkletProcessor{
    static halfPI = Math.PI/2;
    static twoPI = Math.PI*2;
    static starterFrequency = 440;
    static maxFrequency = 20000;
    static detuneMux = 0.1;
    static detuneBounds = 1/oscillator.detuneMux;

    static get parameterDescriptors(){
        return [
            {
                name: 'frequency',
                defaultValue: oscillator.starterFrequency,
                minValue: 0,
                maxValue: oscillator.maxFrequency,
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
                minValue: -oscillator.detuneBounds,
                maxValue: oscillator.detuneBounds,
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
        this._waveComplexityLength = 1;

        this._state = {
            waveform:'sine',
            gain_useControl:false,
            detune_useControl:false,
            dutyCycle_useControl:false,
            waveformGeneratorFunction:oscillator.waveFunction['sine'],
        };
        this._envelope = {
            gain:{
                reporting:false,
                velocity:1,
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
                reporting:false,
                velocity:1,
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
                reporting:false,
                velocity:1,
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
        };
        this._waveSettings = {
            additiveSynthesis:{
                sin:[1],
                cos:[]
            },
            phaseModulation:[
                {mux:2,power:1},
                {mux:3,power:1},
            ],
        };

        this.port.onmessage = function(event){
            Object.entries(event.data).forEach(([key,value]) => {
                switch(key){
                    case 'start':
                        if(value != undefined){
                            self._envelope.gain.velocity = value;
                        }
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
                    case 'waveform': 
                        self._state.waveform = value;
                        self._state.waveformGeneratorFunction = oscillator.waveFunction[value];
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
                    case 'gain_reporting': 
                        self._envelope.gain.reporting = value;
                    break;
                    case 'detune_reporting': 
                        self._envelope.detune.reporting = value;
                    break;
                    case 'dutyCycle_reporting': 
                        self._envelope.dutyCycle.reporting = value;
                    break;
                    case 'additiveSynthesis_sin':
                        self._waveSettings.additiveSynthesis.sin = value;
                    break;
                    case 'additiveSynthesis_cos':
                        self._waveSettings.additiveSynthesis.cos = value;
                    break;
                    case 'phaseModulation_settings':
                        self._waveSettings.phaseModulation = value;
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
                    //gain
                        if(this._envelope.gain.phase == 'front' || this._envelope.gain.phase == 'back'){
                            const procedure_phase = this._envelope.gain.procedure[this._envelope.gain.phase];
                            if( currentFrame+a - this._envelope.gain.procedure.sample >= procedure_phase[this._envelope.gain.procedure.index]._elapseSamples ){
                                this._envelope.gain.procedure.index++;
                                this._envelope.gain.procedure.sample = currentFrame+a;
                                if( this._envelope.gain.procedure.index >= procedure_phase.length ){
                                    if(this._envelope.gain.phase == 'front'){
                                        this._envelope.gain.phase = 'wait';
                                        this.reportPhase_gain();
                                        this._envelope.gain.step = 0;
                                    }else if(this._envelope.gain.phase == 'back'){
                                        this._envelope.gain.phase = 'off';
                                        this.reportPhase_gain();
                                        this._envelope.gain.step = 0;
                                    }
                                }else{
                                    this._envelope.gain.previous = this._envelope.gain.current;
                                    // (velocity*destination - previousGain) / elapseSamples
                                    this._envelope.gain.step = (this._envelope.gain.velocity*procedure_phase[this._envelope.gain.procedure.index].destination - this._envelope.gain.previous)/procedure_phase[this._envelope.gain.procedure.index]._elapseSamples;                    
                                }
                            }
                        }
                        this._envelope.gain.current += this._envelope.gain.step;
                    //detune
                        if(this._envelope.detune.phase == 'front' || this._envelope.detune.phase == 'back'){
                            const procedure_phase = this._envelope.detune.procedure[this._envelope.detune.phase];
                            if( currentFrame+a - this._envelope.detune.procedure.sample >= procedure_phase[this._envelope.detune.procedure.index]._elapseSamples ){
                                this._envelope.detune.procedure.index++;
                                this._envelope.detune.procedure.sample = currentFrame+a;
                                if( this._envelope.detune.procedure.index >= procedure_phase.length ){
                                    if(this._envelope.detune.phase == 'front'){
                                        this._envelope.detune.phase = 'wait';
                                        this.reportPhase_detune();
                                        this._envelope.detune.step = 0;
                                    }else if(this._envelope.detune.phase == 'back'){
                                        this._envelope.detune.phase = 'off';
                                        this.reportPhase_detune();
                                        this._envelope.detune.step = 0;
                                    }
                                }else{
                                    this._envelope.detune.previous = this._envelope.detune.current;
                                    // (velocity*destination - previousGain) / elapseSamples
                                    this._envelope.detune.step = (this._envelope.detune.velocity*procedure_phase[this._envelope.detune.procedure.index].destination - this._envelope.detune.previous)/procedure_phase[this._envelope.detune.procedure.index]._elapseSamples;                    
                                }
                            }
                        }
                        this._envelope.detune.current += this._envelope.detune.step;
                    //dutyCycle
                        if(this._envelope.dutyCycle.phase == 'front' || this._envelope.dutyCycle.phase == 'back'){
                            const procedure_phase = this._envelope.dutyCycle.procedure[this._envelope.dutyCycle.phase];
                            if( currentFrame+a - this._envelope.dutyCycle.procedure.sample >= procedure_phase[this._envelope.dutyCycle.procedure.index]._elapseSamples ){
                                this._envelope.dutyCycle.procedure.index++;
                                this._envelope.dutyCycle.procedure.sample = currentFrame+a;
                                if( this._envelope.dutyCycle.procedure.index >= procedure_phase.length ){
                                    if(this._envelope.dutyCycle.phase == 'front'){
                                        this._envelope.dutyCycle.phase = 'wait';
                                        this.reportPhase_dutyCycle();
                                        this._envelope.dutyCycle.step = 0;
                                    }else if(this._envelope.dutyCycle.phase == 'back'){
                                        this._envelope.dutyCycle.phase = 'off';
                                        this.reportPhase_dutyCycle();
                                        this._envelope.dutyCycle.step = 0;
                                    }
                                }else{
                                    this._envelope.dutyCycle.previous = this._envelope.dutyCycle.current;
                                    // (velocity*destination - previousGain) / elapseSamples
                                    this._envelope.dutyCycle.step = (this._envelope.dutyCycle.velocity*procedure_phase[this._envelope.dutyCycle.procedure.index].destination - this._envelope.dutyCycle.previous)/procedure_phase[this._envelope.dutyCycle.procedure.index]._elapseSamples;                    
                                }
                            }
                        }
                        this._envelope.dutyCycle.current += this._envelope.dutyCycle.step;

                //aspect calculation
                    const gain = this._envelope.gain.current * (this._state.gain_useControl ? gainControl[channel][a] : (gain_useFirstOnly ? parameters.gain[0] : parameters.gain[a]));
                    const detune = this._envelope.detune.current + (this._state.detune_useControl ? detuneControl[channel][a] : (detune_useFirstOnly ? parameters.detune[0] : parameters.detune[a]));
                    const dutyCycle = this._envelope.dutyCycle.current + (this._state.dutyCycle_useControl ? dutyCycleControl[channel][a] : (dutyCycle_useFirstOnly ? parameters.dutyCycle[0] : parameters.dutyCycle[a]));

                //wave calculation
                    const frequency = frequency_useFirstOnly ? parameters.frequency[0] : parameters.frequency[a];
                    this._wavePosition += (frequency*(detune*oscillator.detuneMux + 1))/sampleRate;
                    const localWavePosition = this._wavePosition - (Math.trunc(this._wavePosition) - (this._waveComplexityLength - 1));
                    output[channel][a] = gain*this._state.waveformGeneratorFunction(localWavePosition,dutyCycle,this._waveSettings);
            }
        }

        return true;
    }

    activatePhase(){
        //gain
            if( this._envelope.gain.requestedPhase != undefined && this._envelope.gain.requestedPhase != this._envelope.gain.phase ){
                this._envelope.gain.phase = this._envelope.gain.requestedPhase;
                this.reportPhase_gain();
                this._envelope.gain.requestedPhase = undefined;
                this._envelope.gain.procedure.sample = currentFrame;
                this._envelope.gain.procedure.index = 0;
                this._envelope.gain.previous = this._envelope.gain.current;
                // (velocity*destination - previousGain) / elapseSamples
                this._envelope.gain.step = (this._envelope.gain.velocity*this._envelope.gain.procedure[this._envelope.gain.phase][this._envelope.gain.procedure.index].destination - this._envelope.gain.previous)/this._envelope.gain.procedure[this._envelope.gain.phase][this._envelope.gain.procedure.index]._elapseSamples;
                if( this._envelope.gain.phase == 'start' ){ this._wavePosition = 0; }
            }
        //detune
            if( this._envelope.detune.requestedPhase != undefined && this._envelope.detune.requestedPhase != this._envelope.detune.phase ){
                this._envelope.detune.phase = this._envelope.detune.requestedPhase;
                this.reportPhase_detune();
                this._envelope.detune.requestedPhase = undefined;
                this._envelope.detune.procedure.sample = currentFrame;
                this._envelope.detune.procedure.index = 0;
                this._envelope.detune.previous = this._envelope.detune.current;
                // (velocity*destination - previousGain) / elapseSamples
                this._envelope.detune.step = (this._envelope.detune.velocity*this._envelope.detune.procedure[this._envelope.detune.phase][this._envelope.detune.procedure.index].destination - this._envelope.detune.previous)/this._envelope.detune.procedure[this._envelope.detune.phase][this._envelope.detune.procedure.index]._elapseSamples;
            }
        //dutyCycle
            if( this._envelope.dutyCycle.requestedPhase != undefined && this._envelope.dutyCycle.requestedPhase != this._envelope.dutyCycle.phase ){
                this._envelope.dutyCycle.phase = this._envelope.dutyCycle.requestedPhase;
                this.reportPhase_dutyCycle();
                this._envelope.dutyCycle.requestedPhase = undefined;
                this._envelope.dutyCycle.procedure.sample = currentFrame;
                this._envelope.dutyCycle.procedure.index = 0;
                this._envelope.dutyCycle.previous = this._envelope.dutyCycle.current;
                // (velocity*destination - previousGain) / elapseSamples
                this._envelope.dutyCycle.step = (this._envelope.dutyCycle.velocity*this._envelope.dutyCycle.procedure[this._envelope.dutyCycle.phase][this._envelope.dutyCycle.procedure.index].destination - this._envelope.dutyCycle.previous)/this._envelope.dutyCycle.procedure[this._envelope.dutyCycle.phase][this._envelope.dutyCycle.procedure.index]._elapseSamples;
            }
    }

    reportPhase_gain(){
        const self = this;
        if( !self._envelope.gain.reporting ){return;}
        this.port.postMessage( {gain:self._envelope.gain.phase} );
    };
    reportPhase_detune(){
        const self = this;
        if( !self._envelope.detune.reporting ){return;}
        this.port.postMessage( {detune:self._envelope.detune.phase} );
    };
    reportPhase_dutyCycle(){
        const self = this;
        if( !self._envelope.dutyCycle.reporting ){return;}
        this.port.postMessage( {dutyCycle:self._envelope.dutyCycle.phase} );
    };

    static waveFunction = {
        sine:function(localWavePosition,dutyCycle,waveSettings){
            return Math.sin( localWavePosition * oscillator.twoPI );
        },
        square:function(localWavePosition,dutyCycle,waveSettings){
            return localWavePosition < dutyCycle ? 1 : -1;
        },
        triangle:function(localWavePosition,dutyCycle,waveSettings){
            if(localWavePosition < dutyCycle/2){
                return 2*localWavePosition / dutyCycle;
            }else if(localWavePosition >= 1 - dutyCycle/2){
                return (2*localWavePosition - 2) / dutyCycle;
            }else{
                return (2*localWavePosition - 1) / (dutyCycle - 1);
            }
        },
        noise:function(localWavePosition,dutyCycle,waveSettings){
            return Math.random()*2 - 1;
        },
        additiveSynthesis:function(localWavePosition,dutyCycle,waveSettings){
            let output = 0;
            waveSettings.additiveSynthesis.sin.forEach((value,index) => {
                output += value*Math.sin( (index+1)*oscillator.twoPI*localWavePosition );
            });
            waveSettings.additiveSynthesis.cos.forEach((value,index) => {
                output += value*Math.sin( (index+1)*oscillator.twoPI*localWavePosition );
            });
            return output;
        },
        phaseModulation:function(localWavePosition,dutyCycle,waveSettings){
            const modulationSettings = waveSettings.phaseModulation;

            let output = 0;
            for(let a = 0; a < modulationSettings.length; a++){
                output = modulationSettings[a].power*Math.sin(
                    modulationSettings[a].mux*oscillator.twoPI*localWavePosition + oscillator.halfPI*output
                );
            }

            return output;
        },
    };
}
registerProcessor('oscillator', oscillator);