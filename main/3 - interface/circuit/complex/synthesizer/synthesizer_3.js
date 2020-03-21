//replacement for prior synthesizer; this system uses the custom oscillators and implements an ADSR envelope
//  oscillators generated on demand
//  conservative use of oscillators
//  use of custom oscillator with duty cycle
//  use of custom oscillator audio worklet (which has ADSR envelope built in for gain, detune and dutyCycle)
//  gainWobble provided by internal LFO, or external input
//  detuneWobble provided by internal LFO, or external input
//  dutyCycleWobble provided by internal LFO, or external input

this.synthesizer_2 = function(
    context,
    waveType='sine',
    masterGain=1,
    gain={
        envelope:{
            front:[ {destination:1, elapse:0} ],
            back:[ {destination:0, elapse:0} ],
        },
        mode:'manual',
        manual:{value:1},
        internalLFO:{depth:0, period:1, periodMin:0.01, periodMax:100},
    },
    octave=0,
    detune={
        envelope:{
            front:[ {destination:0, elapse:0} ],
            back:[ {destination:0, elapse:0} ],
        },
        mode:'manual',
        manual:{value:0},
        internalLFO:{depth:0, period:1, periodMin:0.01, periodMax:100},
    },
    dutyCycle={
        envelope:{
            front:[ {destination:0, elapse:0} ],
            back:[ {destination:0, elapse:0} ],
        },
        mode:'manual',
        manual:{value:0.5},
        internalLFO:{depth:0, period:1, periodMin:0.01, periodMax:100},
    },
    additiveSynthesis={
        sin:[1],
        cos:[]
    },
    phaseModulation=[
        {mux:2,power:1},
        {mux:3,power:1},
    ],
){
    //flow
        const flow = {
            controlIn:{
                gain: new _canvas_.library.audio.audioWorklet.nothing(context),
                detune: new _canvas_.library.audio.audioWorklet.nothing(context),
                dutyCycle: new _canvas_.library.audio.audioWorklet.nothing(context),
            },

            LFO:{
                gain:{
                    oscillator: new _canvas_.library.audio.audioWorklet.oscillator(context),
                    amplitudeModifier: new _canvas_.library.audio.audioWorklet.amplitudeModifier(context),
                },
                detune:{
                    oscillator: new _canvas_.library.audio.audioWorklet.oscillator(context),
                },
                dutyCycle:{
                    oscillator: new _canvas_.library.audio.audioWorklet.oscillator(context),
                    amplitudeModifier: new _canvas_.library.audio.audioWorklet.amplitudeModifier(context),
                },
            },

            controlMix:{
                gain: new _canvas_.library.audio.audioWorklet.streamAdder(context),
                detune: new _canvas_.library.audio.audioWorklet.streamAdder(context),
                dutyCycle: new _canvas_.library.audio.audioWorklet.streamAdder(context),
            },

            oscillators: [],
            aggregator: new _canvas_.library.audio.audioWorklet.gain(context),
        };

        flow.LFO.gain.oscillator.frequency.setValueAtTime(1/gain.internalLFO.period, 0);
        flow.LFO.gain.oscillator.gain.setValueAtTime(gain.internalLFO.depth, 0);
        flow.LFO.gain.oscillator.connect(flow.LFO.gain.amplitudeModifier);
        flow.LFO.gain.amplitudeModifier.divisor.setValueAtTime(2, 0);
        flow.LFO.gain.amplitudeModifier.offset.setValueAtTime(1 - gain.internalLFO.depth/2, 0);
        flow.LFO.gain.amplitudeModifier.connect(flow.controlMix.gain,undefined,0);

        flow.LFO.detune.oscillator.frequency.setValueAtTime(1/detune.internalLFO.period, 0);
        flow.LFO.detune.oscillator.gain.setValueAtTime(detune.internalLFO.depth, 0);
        flow.LFO.detune.oscillator.connect(flow.controlMix.detune,undefined,0);

        flow.LFO.dutyCycle.oscillator.frequency.setValueAtTime(1/dutyCycle.internalLFO.period, 0);
        flow.LFO.dutyCycle.oscillator.gain.setValueAtTime(dutyCycle.internalLFO.depth, 0);
        flow.LFO.dutyCycle.oscillator.connect(flow.LFO.dutyCycle.amplitudeModifier);
        flow.LFO.dutyCycle.amplitudeModifier.divisor.setValueAtTime(2, 0);
        flow.LFO.dutyCycle.amplitudeModifier.offset.setValueAtTime(0.5, 0);
        flow.LFO.dutyCycle.amplitudeModifier.connect(flow.controlMix.dutyCycle,undefined,0);

        flow.controlIn.gain.connect(flow.controlMix.gain,undefined,1);
        flow.controlIn.detune.connect(flow.controlMix.detune,undefined,1);
        flow.controlIn.dutyCycle.connect(flow.controlMix.dutyCycle,undefined,1);

    //io
        this.control = new function(){
            this.gain = function(){
                return flow.controlIn.gain;
            };
            this.detune = function(){
                return flow.controlIn.detune;
            };
            this.dutyCycle = function(){
                return flow.controlIn.dutyCycle;
            };
        };
        this.out = function(){
            return flow.aggregator;
        }

    //controls
        this._dump = function(){
            console.log('waveType:', JSON.parse(JSON.stringify(waveType)));
            console.log('gain:', JSON.parse(JSON.stringify(gain)));
            console.log('octave:', JSON.parse(JSON.stringify(octave)));
            console.log('detune:', JSON.parse(JSON.stringify(detune)));
            console.log('dutyCycle:', JSON.parse(JSON.stringify(dutyCycle)));

            console.log('flow',flow);
        };

        this.perform = function(note){
            //find the oscillator for this note (if there is one)
                const oscillator = flow.oscillators.filter(oscillator => oscillator.noteNumber == note.num && oscillator.velocity != 0 )[0];

            if( oscillator != undefined && note.velocity == 0 ){
                //note stopping
                oscillator.stop();
                oscillator.velocity = 0;
            }else if( oscillator != undefined && oscillator.velocity != 0 ){
                //note velocity adjustment
                oscillator.start(note.velocity);
                oscillator.velocity = note.velocity;
            }else if( oscillator == undefined && note.velocity == 0 ){ 
                //don't do anything (you're trying to stop a note that isn't sounding)
            }else{
                //fresh note

                //get free oscillator, or generate new one
                    let oscillatorToUse = undefined;

                    //get free oscillators
                        const freeOscillators = flow.oscillators.filter(oscillator => oscillator.noteNumber == undefined);
                    //generate new oscillator if necessary
                        if(freeOscillators.length > 0){
                            oscillatorToUse = freeOscillators[0];
                        }else{
                            oscillatorToUse = new _canvas_.library.audio.audioWorklet.oscillator(context);
                            oscillatorToUse.connect(flow.aggregator);
                            oscillatorToUse.waveform = waveType;
                            oscillatorToUse.gain_envelope_reporting = true;

                            oscillatorToUse.gain_envelope = gain.envelope;
                            oscillatorToUse.detune_envelope = detune.envelope;
                            oscillatorToUse.dutyCycle_envelope = dutyCycle.envelope;

                            oscillatorToUse.detune.setValueAtTime(detune.manual.value, 0);
                            oscillatorToUse.dutyCycle.setValueAtTime(dutyCycle.manual.value, 0);

                            oscillatorToUse.gain_useControl = gain.mode != 'manual';
                            oscillatorToUse.detune_useControl = detune.mode != 'manual';
                            oscillatorToUse.dutyCycle_useControl = dutyCycle.mode != 'manual';

                            flow.controlMix.gain.connect(oscillatorToUse,undefined,0);
                            flow.controlMix.detune.connect(oscillatorToUse,undefined,1);
                            flow.controlMix.dutyCycle.connect(oscillatorToUse,undefined,2);

                            oscillatorToUse.additiveSynthesis_sin = additiveSynthesis.sin;
                            oscillatorToUse.additiveSynthesis_cos = additiveSynthesis.cos;
                            oscillatorToUse.phaseModulation_settings = phaseModulation.sin;

                            flow.oscillators.push(oscillatorToUse);
                        }

                //activate oscillator
                    oscillatorToUse.frequency.setValueAtTime(_canvas_.library.audio.num2freq(note.num+12*octave),0);
                    oscillatorToUse.noteNumber = note.num;
                    oscillatorToUse.velocity = note.velocity;
                    oscillatorToUse.onEnvelopeEvent = function(event){
                        if(event.aspect == 'gain' && event.phase == 'off'){
                            oscillatorToUse.noteNumber = undefined;
                        }
                    };
                    oscillatorToUse.start(note.velocity);
            }
        };

        this.panic = function(){
            flow.oscillators.map(a => a.noteNumber).filter(a => a != undefined).forEach(a => {
                this.perform({num:a,velocity:0});
            });
        };

        this.masterGain = function(value){
            if(value == undefined){return masterGain;}
            masterGain = value;
            flow.aggregator.gain.setValueAtTime(value, 0);
        };
        this.waveform = function(type){
            if(type == undefined){return waveType;}
            waveType = type;

            flow.oscillators.forEach(oscillator => {
                oscillator.waveform = waveType;
            });
        };
        this.octave = function(target){
            if(target == null){return octave;}
            octave = target;
            flow.oscillators.forEach(oscillator => {
                if(oscillator.noteNumber == undefined){return;}
                oscillator.frequency.setValueAtTime(_canvas_.library.audio.num2freq(oscillator.noteNumber+12*octave), 0);
            });
        };
        this.detune = function(target){
            if(target == null){return detune;}
            detune = target;
            flow.oscillators.forEach(oscillator => {
                oscillator.detune.setValueAtTime(target, 0);
            });
        };
        this.dutyCycle = function(target){
            if(target == null){return detune;}
            dutyCycle = target;
            flow.oscillators.forEach(oscillator => {
                oscillator.dutyCycle.setValueAtTime(target, 0);
            });
        };

        this.gain = new function(){
            this.envelope = function(newEnvelope){
                if(newEnvelope == null){return gain.envelope;}
                gain.envelope = newEnvelope;
                flow.oscillators.forEach(oscillator => {
                    oscillator.gain_envelope = gain.envelope;
                });
            };
            this.mode = function(mode){ // manual / internalLFO / external
                if(mode == null){return gain.mode; }
                gain.mode = mode;

                switch(mode){
                    case 'manual': 
                        flow.LFO.gain.oscillator.stop();
                        flow.oscillators.forEach(oscillator => {
                            oscillator.gain_useControl = false;
                        });
                    break;
                    case 'internalLFO':
                        flow.LFO.gain.oscillator.start();
                        flow.oscillators.forEach(oscillator => {
                            oscillator.gain_useControl = true;
                        });

                        flow.controlMix.gain.mix.setValueAtTime(0, 0);
                    break;
                    case 'external':
                        flow.LFO.gain.oscillator.stop();
                        flow.oscillators.forEach(oscillator => {
                            oscillator.gain_useControl = true;
                        });

                        flow.controlMix.gain.mix.setValueAtTime(1, 0);
                    break;
                }
            };
            this.manual = new function(){
                this.value = function(value){
                    if(value == null){ return gain.manual.value; }
                    gain.manual.value = value;
                    flow.oscillators.forEach(oscillator => {
                        oscillator.gain.setValueAtTime(gain.manual.value, 0);
                    });    
                };
            };
            this.internalLFO = new function(){
                this.depth = function(value){
                    if(value == null){return gain.internalLFO.depth; }
                    if(value < 0){ value = 0; }
                    else if(value > 1){ value = 1; }
                    gain.internalLFO.depth = value;
                    flow.LFO.gain.oscillator.gain.setValueAtTime(gain.internalLFO.depth, 0);
                    flow.LFO.gain.amplitudeModifier.offset.setValueAtTime(1 - gain.internalLFO.depth/2, 0);
                };
                this.period = function(value){
                    if(value == null){ return gain.internalLFO.period; }
                    if(value < gain.internalLFO.periodMin){ value = gain.internalLFO.periodMin; }
                    else if(value > gain.internalLFO.periodMax){ value = gain.internalLFO.periodMax; }
                    gain.internalLFO.period = value;
                    flow.LFO.gain.oscillator.frequency.setValueAtTime(1/gain.internalLFO.period, 0);
                };
            };
        };
        this.detune = new function(){
            this.envelope = function(newEnvelope){
                if(newEnvelope == null){return detune.envelope;}
                detune.envelope = newEnvelope;
                flow.oscillators.forEach(oscillator => {
                    oscillator.detune_envelope = detune.envelope;
                });
            };
            this.mode = function(mode){ // manual / internalLFO / external
                if(mode == null){return detune.mode; }
                detune.mode = mode;

                switch(mode){
                    case 'manual': 
                        flow.LFO.detune.oscillator.stop();
                        flow.oscillators.forEach(oscillator => {
                            oscillator.detune_useControl = false;
                        });
                    break;
                    case 'internalLFO':
                        flow.LFO.detune.oscillator.start();
                        flow.oscillators.forEach(oscillator => {
                            oscillator.detune_useControl = true;
                        });
                        flow.controlMix.detune.mix.setValueAtTime(0, 0);
                    break;
                    case 'external':
                        flow.LFO.detune.oscillator.stop();
                        flow.oscillators.forEach(oscillator => {
                            oscillator.detune_useControl = true;
                        });
                        flow.controlMix.detune.mix.setValueAtTime(1, 0);
                    break;
                }
            };
            this.manual = new function(){
                this.value = function(value){
                    if(value == null){ return detune.manual.value; }
                    detune.manual.value = value;
                    flow.oscillators.forEach(oscillator => {
                        oscillator.detune.setValueAtTime(detune.manual.value, 0);
                    });    
                };
            };
            this.internalLFO = new function(){
                this.depth = function(value){
                    if(value == null){return detune.internalLFO.depth; }
                    if(value < 0){ value = 0; }
                    else if(value > 1){ value = 1; }
                    detune.internalLFO.depth = value;
                    flow.LFO.detune.oscillator.gain.setValueAtTime(detune.internalLFO.depth, 0);
                };
                this.period = function(value){
                    if(value == null){ return detune.internalLFO.period; }
                    if(value < detune.internalLFO.periodMin){ value = detune.internalLFO.periodMin; }
                    else if(value > detune.internalLFO.periodMax){ value = detune.internalLFO.periodMax; }
                    detune.internalLFO.period = value;
                    flow.LFO.detune.oscillator.frequency.setValueAtTime(1/detune.internalLFO.period, 0);
                };
            };
        };
        this.dutyCycle = new function(){
            this.envelope = function(newEnvelope){
                if(newEnvelope == null){return dutyCycle.envelope;}
                dutyCycle.envelope = newEnvelope;
                flow.oscillators.forEach(oscillator => {
                    oscillator.dutyCycle_envelope = dutyCycle.envelope;
                });
            };
            this.mode = function(mode){ // manual / internalLFO / external
                if(mode == null){return dutyCycle.mode; }
                dutyCycle.mode = mode;

                switch(mode){
                    case 'manual': 
                        flow.LFO.dutyCycle.oscillator.stop();
                        flow.oscillators.forEach(oscillator => {
                            oscillator.dutyCycle_useControl = false;
                        });
                    break;
                    case 'internalLFO':
                        flow.LFO.gain.oscillator.start();
                        flow.oscillators.forEach(oscillator => {
                            oscillator.dutyCycle_useControl = true;
                        });
                        flow.controlMix.dutyCycle.mix.setValueAtTime(0, 0);
                    break;
                    case 'external':
                        flow.LFO.gain.oscillator.stop();
                        flow.oscillators.forEach(oscillator => {
                            oscillator.dutyCycle_useControl = true;
                        });
                        flow.controlMix.dutyCycle.mix.setValueAtTime(1, 0);
                    break;
                }
            };
            this.manual = new function(){
                this.value = function(value){
                    if(value == null){ return dutyCycle.manual.value; }
                    dutyCycle.manual.value = value;
                    flow.oscillators.forEach(oscillator => {
                        oscillator.dutyCycle.setValueAtTime(dutyCycle.manual.value, 0);
                    });    
                };
            };
            this.internalLFO = new function(){
                this.depth = function(value){
                    if(value == null){return dutyCycle.internalLFO.depth; }
                    if(value < 0){ value = 0; }
                    else if(value > 1){ value = 1; }
                    dutyCycle.internalLFO.depth = value;
                    flow.LFO.dutyCycle.oscillator.gain.setValueAtTime(dutyCycle.internalLFO.depth, 0);
                    flow.LFO.dutyCycle.amplitudeModifier.offset.setValueAtTime(1 - dutyCycle.internalLFO.depth/2, 0);
                };
                this.period = function(value){
                    if(value == null){ return dutyCycle.internalLFO.period; }
                    if(value < dutyCycle.internalLFO.periodMin){ value = dutyCycle.internalLFO.periodMin; }
                    else if(value > dutyCycle.internalLFO.periodMax){ value = dutyCycle.internalLFO.periodMax; }
                    dutyCycle.internalLFO.period = value;
                    flow.LFO.dutyCycle.oscillator.frequency.setTargetAtTime(1/dutyCycle.internalLFO.period, context.currentTime, 0);
                };
            };
        };

        this.additiveSynthesis = new function(){
            this.sin = function(value){
                if(value == undefined){ return additiveSynthesis.sin; }
                additiveSynthesis.sin = value;
                flow.oscillators.forEach(oscillator => {
                    oscillator.additiveSynthesis_sin = value;
                });
            };
            this.cos = function(value){
                if(value == undefined){ return additiveSynthesis.cos; }
                additiveSynthesis.cos = value;
                flow.oscillators.forEach(oscillator => {
                    oscillator.additiveSynthesis_cos = value;
                });
            };
        };
        this.phaseModulation = function(value){
            if(value == undefined){ return phaseModulation; }
            phaseModulation = value;
            flow.oscillators.forEach(oscillator => {
                oscillator.phaseModulation_settings = phaseModulation;
            });
        };
};