//replacement for prior synthesizer; this system uses the custom oscillators and implements an ADSR envelope
//  oscillators generated on demand
//  conservative use of oscillators
//  use of custom oscillator with duty cycle
//  use of custom oscillator audio worklet (which has ADSR envelope built in for gain, detune and dutyCycle)
//  gainWobble provided by internal LFO, or external input
//  detuneWobble provided by internal LFO, or external input
//  dutyCycleWobble provided by internal LFO, or external input

this.synthesizer_3 = function(
    context,
    waveType='sine',
    gain={
        envelope:{
            front:[ {destination:1, elapse:0} ],
            back:[ {destination:0, elapse:0} ],
        },
        mode:'manual',
        manual:{value:1},
        internalLFO:{depth:0, period:1, periodMin:0.01, periodMax:1},
    },
    octave=0,
    detune={
        envelope:{
            front:[ {destination:1, elapse:0} ],
            back:[ {destination:0, elapse:0} ],
        },
        mode:'manual',
        manual:{value:0},
        internalLFO:{depth:0, period:1, periodMin:0.01, periodMax:1},
    },
    dutyCycle={
        envelope:{
            front:[ {destination:1, elapse:0} ],
            back:[ {destination:0, elapse:0} ],
        },
        mode:'manual',
        manual:{value:0.5},
        internalLFO:{depth:0, period:1, periodMin:0.01, periodMax:1},
    },
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
                    oscillator: new _canvas_.library.audio.audioWorklet.oscillator2(context),
                    amplitudeModifier: new _canvas_.library.audio.audioWorklet.amplitudeModifier(context),
                },
                detune:{
                    oscillator: new _canvas_.library.audio.audioWorklet.oscillator2(context),
                },
                dutyCycle:{
                    oscillator: new _canvas_.library.audio.audioWorklet.oscillator2(context),
                    amplitudeModifier: new _canvas_.library.audio.audioWorklet.amplitudeModifier(context),
                },
            },

            controlMix:{
                gain: new _canvas_.library.audio.audioWorklet.streamAdder(context),
                detune: new _canvas_.library.audio.audioWorklet.streamAdder(context),
                dutyCycle: new _canvas_.library.audio.audioWorklet.streamAdder(context),
            },

            oscillators: [],
            aggregator: new _canvas_.library.audio.audioWorklet.nothing(context),
        };

        flow.LFO.gain.oscillator.frequency.setTargetAtTime(1/gain.internalLFO.period, context.currentTime, 0);
        flow.LFO.gain.oscillator.gain.setTargetAtTime(gain.internalLFO.depth, context.currentTime, 0);
        flow.LFO.gain.oscillator.connect(flow.LFO.gain.amplitudeModifier);
        flow.LFO.gain.amplitudeModifier.divisor.setTargetAtTime(2, context.currentTime, 0);
        flow.LFO.gain.amplitudeModifier.offset.setTargetAtTime(1 - gain.internalLFO.depth/2, context.currentTime, 0);
        flow.LFO.gain.amplitudeModifier.connect(flow.controlMix.gain,undefined,0);

        flow.LFO.detune.oscillator.frequency.setTargetAtTime(1/detune.internalLFO.period, context.currentTime, 0);
        flow.LFO.detune.oscillator.gain.setTargetAtTime(detune.internalLFO.depth, context.currentTime, 0);
        flow.LFO.detune.oscillator.connect(flow.controlMix.detune,undefined,0);

        flow.LFO.dutyCycle.oscillator.frequency.setTargetAtTime(1/dutyCycle.internalLFO.period, context.currentTime, 0);
        flow.LFO.dutyCycle.oscillator.gain.setTargetAtTime(dutyCycle.internalLFO.depth, context.currentTime, 0);
        flow.LFO.dutyCycle.oscillator.connect(flow.LFO.dutyCycle.amplitudeModifier);
        flow.LFO.dutyCycle.amplitudeModifier.divisor.setTargetAtTime(2, context.currentTime, 0);
        flow.LFO.dutyCycle.amplitudeModifier.offset.setTargetAtTime(0.5, context.currentTime, 0);
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
            console.log('flow',flow);
            console.log('waveType', waveType);
            console.log('gain', gain);
            console.log('octave', octave);
            console.log('detune', detune);
            console.log('dutyCycle', dutyCycle);
        };

        this.perform = function(note){
            //find the oscillator for this note (if there is one)
                const oscillator = flow.oscillators.filter(oscillator => oscillator.noteNumber == note.num )[0];

                if( oscillator != undefined && note.velocity == 0 ){ 
                //tone stopping
                    oscillator.stop();
                }else if( oscillator != undefined ){
                //tone velocity adjustment
                    _canvas_.library.audio.changeAudioParam(context, oscillator.gain.gain, note.velocity, 0, 'instant');
                }else if( oscillator == undefined && note.velocity == 0 ){ 
                //don't do anything
                }else{
                //fresh tone
                    //get free oscillators
                        const freeOscillators = flow.oscillators.filter(oscillator => oscillator.noteNumber == undefined);
                        
                    //maintain oscillator pool
                        if( freeOscillators.length < 1 ){
                            const tmpOSC = new _canvas_.library.audio.audioWorklet.oscillator2(context);
                            tmpOSC.connect(flow.aggregator);
                            tmpOSC.waveform = waveType;

                            tmpOSC.gain_envelope = gain.envelope;
                            tmpOSC.detune_envelope = detune.envelope;
                            tmpOSC.dutyCycle_envelope = dutyCycle.envelope;

                            tmpOSC.detune.setTargetAtTime(detune.manual.value, context.currentTime, 0);
                            tmpOSC.dutyCycle.setTargetAtTime(dutyCycle.manual.value, context.currentTime, 0);

                            tmpOSC.gain_useControl = gain.mode != 'manual';
                            tmpOSC.detune_useControl = detune.mode != 'manual';
                            tmpOSC.dutyCycle_useControl = dutyCycle.mode != 'manual';

                            flow.controlMix.gain.connect(tmpOSC,undefined,0);
                            flow.controlMix.detune.connect(tmpOSC,undefined,1);
                            flow.controlMix.dutyCycle.connect(tmpOSC,undefined,2);

                            flow.oscillators.push(tmpOSC);
                        }

                    //select oscillator
                        const freshOscillator = freeOscillators.length == 0;
                        const oscillatorToUse = freshOscillator ? flow.oscillators[flow.oscillators.length-1] : freeOscillators[0];

                    //activate oscillator
                        oscillatorToUse.frequency.setTargetAtTime(_canvas_.library.audio.num2freq(note.num+12*octave), context.currentTime, 0);
                        oscillatorToUse.noteNumber = note.num;
                        oscillatorToUse.onEnvelopeEvent = function(event){
                            if(event == 'off'){
                                oscillatorToUse.noteNumber = undefined;
                            }
                        };
                        oscillatorToUse.start();
                }
        };
        this.panic = function(){
            flow.oscillators.map(a => a.noteNumber).forEach(a => {
                this.perform({num:a,velocity:0});
            });
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
                oscillator.frequency.setTargetAtTime(_canvas_.library.audio.num2freq(oscillator.noteNumber+12*octave), context.currentTime, 0);
            });
        };
        this.detune = function(target){
            if(target == null){return detune;}
            detune = target;
            flow.oscillators.forEach(oscillator => {
                oscillator.detune.setTargetAtTime(target, context.currentTime, 0);
            });
        };
        this.dutyCycle = function(target){
            if(target == null){return detune;}
            dutyCycle = target;
            flow.oscillators.forEach(oscillator => {
                oscillator.dutyCycle.setTargetAtTime(target, context.currentTime, 0);
            });
        };

        this.gain = new function(){
            this.envelope = function(newEnvelope){
                if(newEnvelope == null){return envelope;}
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

                        flow.controlMix.gain.mix.setTargetAtTime(0, context.currentTime, 0);
                        flow.controlMix.detune.mix.setTargetAtTime(0, context.currentTime, 0);
                        flow.controlMix.dutyCycle.mix.setTargetAtTime(0, context.currentTime, 0);
                    break;
                    case 'external':
                        flow.LFO.gain.oscillator.stop();
                        flow.oscillators.forEach(oscillator => {
                            oscillator.gain_useControl = true;
                        });

                        flow.controlMix.gain.mix.setTargetAtTime(1, context.currentTime, 0);
                        flow.controlMix.detune.mix.setTargetAtTime(1, context.currentTime, 0);
                        flow.controlMix.dutyCycle.mix.setTargetAtTime(1, context.currentTime, 0);
                    break;
                }
            };
            this.value = function(value){
                if(value == null){ return gain.manual.value; }
                gain.manual.value = value;
                flow.oscillators.forEach(oscillator => {
                    oscillator.gain.setTargetAtTime(gain.manual.value, context.currentTime, 0);
                });    
            };
            this.internalLFO = new function(){
                this.depth = function(value){
                    if(value == null){return gain.internalLFO.depth; }
                    if(value < 0){ value = 0; }
                    else if(value > 1){ value = 1; }
                    gain.internalLFO.depth = value;
                    flow.LFO.gain.oscillator.gain.setTargetAtTime(gain.internalLFO.depth, context.currentTime, 0);
                    flow.LFO.gain.amplitudeModifier.offset.setTargetAtTime(1 - gain.internalLFO.depth/2, context.currentTime, 0);
                };
                this.period = function(value){
                    if(value == null){ return gain.internalLFO.period; }
                    if(value < gain.internalLFO.periodMin){ value = gain.internalLFO.periodMin; }
                    else if(value > gain.internalLFO.periodMax){ value = gain.internalLFO.periodMax; }
                    gain.internalLFO.period = value;
                    flow.LFO.gain.oscillator.frequency.setTargetAtTime(1/gain.internalLFO.period, context.currentTime, 0);
                };
            };
        };
        this.detune = new function(){
            this.envelope = function(newEnvelope){
                if(newEnvelope == null){return envelope;}
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
                    break;
                    case 'external':
                        flow.LFO.detune.oscillator.stop();
                        flow.oscillators.forEach(oscillator => {
                            oscillator.detune_useControl = true;
                        });    
                    break;
                }
            };
            this.value = function(value){
                if(value == null){ return detune.manual.value; }
                detune.manual.value = value;
                flow.oscillators.forEach(oscillator => {
                    oscillator.detune.setTargetAtTime(detune.manual.value, context.currentTime, 0);
                });    
            };
            this.internalLFO = new function(){
                this.depth = function(value){
                    if(value == null){return detune.internalLFO.depth; }
                    if(value < 0){ value = 0; }
                    else if(value > 1){ value = 1; }
                    detune.internalLFO.depth = value;
                    flow.LFO.detune.oscillator.gain.setTargetAtTime(detune.internalLFO.depth, context.currentTime, 0);
                };
                this.period = function(value){
                    if(value == null){ return detune.internalLFO.period; }
                    if(value < detune.internalLFO.periodMin){ value = detune.internalLFO.periodMin; }
                    else if(value > detune.internalLFO.periodMax){ value = detune.internalLFO.periodMax; }
                    detune.internalLFO.period = value;
                    flow.LFO.detune.oscillator.frequency.setTargetAtTime(1/detune.internalLFO.period, context.currentTime, 0);
                };
            };
        };
        this.dutyCycle = new function(){
            this.envelope = function(newEnvelope){
                if(newEnvelope == null){return envelope;}
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
                    break;
                    case 'external':
                        flow.LFO.gain.oscillator.stop();
                        flow.oscillators.forEach(oscillator => {
                            oscillator.dutyCycle_useControl = true;
                        });    
                    break;
                }
            };
            this.value = function(value){
                if(value == null){ return dutyCycle.manual.value; }
                dutyCycle.manual.value = value;
                flow.oscillators.forEach(oscillator => {
                    oscillator.dutyCycle.setTargetAtTime(dutyCycle.manual.value, context.currentTime, 0);
                });    
            };
            this.internalLFO = new function(){
                this.depth = function(value){
                    if(value == null){return dutyCycle.internalLFO.depth; }
                    if(value < 0){ value = 0; }
                    else if(value > 1){ value = 1; }
                    dutyCycle.internalLFO.depth = value;
                    flow.LFO.dutyCycle.oscillator.gain.setTargetAtTime(dutyCycle.internalLFO.depth, context.currentTime, 0);
                    flow.LFO.dutyCycle.amplitudeModifier.offset.setTargetAtTime(1 - dutyCycle.internalLFO.depth/2, context.currentTime, 0);
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
};