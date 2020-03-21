// replacement for prior synthesizer; this system reuses oscillators
//  oscillators generated on demand
//  conservitive use of oscillators
//  gainWobble provided by internal LFO
//  detuneWobble not implemented

this.synthesizer_1 = function(
    context,
    waveType='sine', periodicWave={'sin':[0,1,0], 'cos':[0,0,1]}, 
    gain=1, octave=0, detune=0,
    attack={time:0.01, curve:'linear'}, release={time:0.05, curve:'linear'},
    gainWobble={depth:0, period:1, periodMin:0.01, periodMax:1},
    detuneWobble={depth:0, period:1, periodMin:0.01, periodMax:1},
){
    function createOscillator(){
        const data = {
            oscillator: context.createOscillator(),
            gain: context.createGain(),
            // active: false,
        };

        data.oscillator.connect(data.gain);
        data.oscillator.start(0);
        _canvas_.library.audio.changeAudioParam(context, data.gain.gain, 0, 0, 'instant');
        return data;
    }

    //flow chain
        const flow = {
            oscillators: [],
            aggregator: {},
            LFO: {},
            amplitudeModifier: {},
            gain: {},
        };

    //flow
        flow.oscillators[0] = createOscillator();

        flow.aggregator.node = context.createGain();    
        flow.aggregator.node.gain.setTargetAtTime(gain, context.currentTime, 0);
        flow.oscillators[0].gain.connect(flow.aggregator.node);

        flow.LFO = {
            oscillator: context.createOscillator(),
            gain: context.createGain(),
        };
        flow.LFO.oscillator.start(0);
        flow.LFO.oscillator.frequency.setTargetAtTime(1/gainWobble.period, context.currentTime, 0);
        flow.LFO.gain.gain.setTargetAtTime(gainWobble.depth, context.currentTime, 0);
        flow.LFO.oscillator.connect(flow.LFO.gain);

        flow.amplitudeModifier = new _canvas_.library.audio.audioWorklet.amplitudeModifier(_canvas_.library.audio.context);
        flow.LFO.gain.connect(flow.amplitudeModifier);
        flow.amplitudeModifier.divisor.setTargetAtTime(2, context.currentTime, 0);
        flow.amplitudeModifier.offset.setTargetAtTime(1 - gainWobble.depth/2, context.currentTime, 0);

        flow.gain.node = new _canvas_.library.audio.audioWorklet.gain(_canvas_.library.audio.context);
        flow.aggregator.node.connect(flow.gain.node,undefined,0);
        flow.amplitudeModifier.connect(flow.gain.node,undefined,1);

    //output node
        this.out = function(){
            return flow.gain.node;
        }
    
    //controls
        this.perform = function(note){
            //find the oscillator for this note (if there is one)
                const oscillator = flow.oscillators.filter(oscillator => oscillator.noteNumber == note.num && oscillator.stoppingTimeout == undefined )[0];

                if( oscillator != undefined && note.velocity == 0 ){ 
                //tone stopping
                    _canvas_.library.audio.changeAudioParam(context, oscillator.gain.gain, 0, release.time, release.curve);
                    oscillator.stoppingTimeout = setTimeout(function(){
                        oscillator.noteNumber = undefined;
                        oscillator.stoppingTimeout = undefined;
                    }, release.time*1000);
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
                            const tmpOSC = createOscillator();
                            tmpOSC.gain.connect(flow.aggregator.node);
                            flow.oscillators.push(tmpOSC);
                        }

                    //select oscillator
                        const freshOscillator = freeOscillators.length == 0;
                        const oscillatorToUse = freshOscillator ? flow.oscillators[flow.oscillators.length-1] : freeOscillators[0];

                    //activate oscillator
                        if(waveType == 'custom'){
                            oscillatorToUse.oscillator.setPeriodicWave(
                                context.createPeriodicWave(new Float32Array(periodicWave.cos),new Float32Array(periodicWave.sin))
                            );
                        }else{
                            oscillatorToUse.oscillator.type = waveType;
                        }
                        oscillatorToUse.oscillator.frequency.setTargetAtTime(_canvas_.library.audio.num2freq(note.num+12*octave), context.currentTime, 0);
                        oscillatorToUse.noteNumber = note.num;
                        oscillatorToUse.oscillator.detune.setTargetAtTime(detune, context.currentTime, 0);
                        _canvas_.library.audio.changeAudioParam(context, oscillatorToUse.gain.gain, note.velocity, attack.time, attack.curve, !freshOscillator);
                }
        };
        this.panic = function(){
            flow.oscillators.map(a => a.noteNumber).forEach(a => {
                this.perform({num:a,velocity:0});
            });
        };
        this.waveType = function(type,periodicWaveData){
            if(type == undefined && periodicWaveData == undefined){return { type:waveType, periodicWave:periodicWaveData };}

            if(type != undefined){
                waveType = type;
            }
            if(periodicWaveData != undefined){
                periodicWave = periodicWaveData;
            }

            if(type == 'custom'){
                flow.oscillators.forEach(oscillator => {
                    oscillator.oscillator.setPeriodicWave(
                        context.createPeriodicWave(new Float32Array(periodicWave.cos),new Float32Array(periodicWave.sin))
                    );
                });
            }else{
                flow.oscillators.forEach(oscillator => {
                    oscillator.oscillator.type = waveType;
                });
            }
        };
        this.gain = function(target){
            flow.aggregator.node.gain.setTargetAtTime(target, context.currentTime, 0);
        };
        this.octave = function(o){
            if(o == null){return octave;}
            octave = o;
            flow.oscillators.forEach(oscillator => {
                if(oscillator.noteNumber == undefined){return;}
                oscillator.oscillator.frequency.setTargetAtTime(_canvas_.library.audio.num2freq(oscillator.noteNumber+12*octave), context.currentTime, 0);
            });
        };
        this.detune = function(target){
            if(target == null){return detune;}
            detune = target;
            flow.oscillators.forEach(oscillator => {
                oscillator.oscillator.detune.setTargetAtTime(target, context.currentTime, 0);
            });
        };
        this.attack = function(time,curve){
            if( time == undefined && curve == undefined ){ return {time:attack.time, curve:attack.curve}; }
            if(time != undefined){ attack.time = time; }
            if(curve != undefined){ attack.curve = curve; }
        };
        this.release = function(time,curve){
            if( time == undefined && curve == undefined ){ return {time:release.time, curve:release.curve}; }
            if(time != undefined){ release.time = time; }
            if(curve != undefined){ release.curve = curve; }
        };

        this.gainWobbleDepth = function(value){
            if(value == null){return gainWobble.depth; }
            if(value < 0){ value = 0; }
            else if(value > 1){ value = 1; }
            gainWobble.depth = value;
            flow.LFO.gain.gain.setTargetAtTime(value, context.currentTime, 0);
            flow.amplitudeModifier.offset.setTargetAtTime(1 - gainWobble.depth/2, context.currentTime, 0);
        };
        this.gainWobblePeriod = function(value){
            if(value == null){return gainWobble.period; }
            if(value < gainWobble.periodMin){ value = gainWobble.periodMin; }
            else if(value > gainWobble.periodMax){ value = gainWobble.periodMax; }
            gainWobble.period = value;
            flow.LFO.oscillator.frequency.setTargetAtTime(1/value, context.currentTime, 0);
        };
        this.detuneWobbleDepth = function(value){
            if(value == null){return detuneWobble.depth; }
            if(value < 0){ value = 0; }
            else if(value > 1){ value = 1; }
            detuneWobble.depth = value;
            // to do //
        };
        this.detuneWobblePeriod = function(value){
            if(value == null){return detuneWobble.period; }
            if(value < detuneWobble.periodMin){ value = detuneWobble.periodMin; }
            else if(value > detuneWobble.periodMax){ value = detuneWobble.periodMax; }
            detuneWobble.period = value;
            // to do //
        };

        this._dump = function(){
            console.log( 'waveType:',waveType );
            console.log( 'gain:',gain );
            console.log( 'octave:',octave );
            console.log( 'detune:',detune );
            console.log( 'attack:',attack );
            console.log( 'release:',release );
            flow.oscillators.forEach((oscillator,index) => {
                console.log( 'flow.oscillators['+index+']', oscillator );
            });
            console.log( 'flow.aggregator:', flow.aggregator );
        };
};