// this.synthesizer = function(
//     context,
//     waveType='sine', periodicWave={'sin':[0,1], 'cos':[0,0]}, 
//     gain=1, gainWobbleDepth=0, gainWobblePeriod=0, gainWobbleMin=0.01, gainWobbleMax=1,
//     attack={time:0.01, curve:'linear'}, release={time:0.05, curve:'linear'},
//     octave=0,
//     detune=0, detuneWobbleDepth=0, detuneWobblePeriod=0, detuneWobbleMin=0.01, detuneWobbleMax=1
// ){
//     //flow chain
//         const flow = {
//             OSCmaker:{},
//             liveOscillators: {},
//             wobbler_detune: {},
//             aggregator: {},
//             wobbler_gain: {},
//             mainOut: {}
//         };


//         flow.OSCmaker.waveType = waveType;
//         flow.OSCmaker.periodicWave = periodicWave;
//         flow.OSCmaker.attack = attack;
//         flow.OSCmaker.release = release;
//         flow.OSCmaker.octave  = octave;
//         flow.OSCmaker.detune  = detune;
//         flow.OSCmaker.func = function(
//             context, connection, midinumber,
//             type, periodicWave, 
//             gain, attack, release,
//             detune, octave
//         ){
//             return new function(){
//                 this.generator = context.createOscillator();
//                     if(type == 'custom'){ 
//                         this.generator.setPeriodicWave(
//                             context.createPeriodicWave(new Float32Array(periodicWave.cos),new Float32Array(periodicWave.sin))
//                         ); 
//                     }else{ this.generator.type = type; }
//                     this.generator.frequency.setTargetAtTime(_canvas_.library.audio.num2freq(midinumber+12*octave), context.currentTime, 0);
//                     this.generator.detune.setTargetAtTime(detune, context.currentTime, 0);
//                     this.generator.start(0);

//                 this.gain = context.createGain();
//                 this.generator.connect(this.gain);
//                 this.gain.gain.setTargetAtTime(0, context.currentTime, 0);
//                 _canvas_.library.audio.changeAudioParam(context,this.gain.gain, gain, attack.time, attack.curve, false);
//                 this.gain.connect(connection);

//                 this.detune = function(target,time,curve){
//                     _canvas_.library.audio.changeAudioParam(context,this.generator.detune,target,time,curve);
//                 };
//                 this.changeVelocity = function(a){
//                     _canvas_.library.audio.changeAudioParam(context,this.gain.gain,a,attack.time,attack.curve);
//                 };
//                 this.stop = function(){
//                     _canvas_.library.audio.changeAudioParam(context,this.gain.gain,0,release.time,release.curve);
//                     setTimeout(function(that){
//                         that.gain.disconnect(); 
//                         that.generator.stop(); 
//                         that.generator.disconnect(); 
//                         that.gain=null; 
//                         that.generator=null; 
//                         that=null;
//                     }, release.time*1000, this);
//                 };
//             };
//         };


//         flow.wobbler_detune.depth = detuneWobbleDepth;
//         flow.wobbler_detune.period = detuneWobblePeriod;
//         flow.wobbler_detune.phase = true;
//         flow.wobbler_detune.wave = 's';
//         flow.wobbler_detune.interval = null;
//         flow.wobbler_detune.start = function(){
//             if(flow.wobbler_detune.period < detuneWobbleMin || flow.wobbler_detune.period >= detuneWobbleMax){ return; }
//             flow.wobbler_detune.interval = setInterval(function(){
//                 const OSCs = Object.keys(flow.liveOscillators);
//                 if(flow.wobbler_detune.phase){
//                     for(let b = 0; b < OSCs.length; b++){ 
//                         flow.liveOscillators[OSCs[b]].detune(flow.wobbler_detune.depth,0.9*flow.wobbler_detune.period,flow.wobbler_detune.wave);
//                     }
//                 }else{
//                     for(let b = 0; b < OSCs.length; b++){ 
//                         flow.liveOscillators[OSCs[b]].detune(-flow.wobbler_detune.depth,0.9*flow.wobbler_detune.period,flow.wobbler_detune.wave);
//                     }
//                 }
//                 flow.wobbler_detune.phase = !flow.wobbler_detune.phase;
//             }, 1000*flow.wobbler_detune.period);
//         };
//         flow.wobbler_detune.stop = function(){clearInterval(flow.wobbler_detune.interval);};


//         flow.aggregator.node = context.createGain();    
//         flow.aggregator.node.gain.setTargetAtTime(1, context.currentTime, 0);


//         flow.wobbler_gain.depth = gainWobbleDepth;
//         flow.wobbler_gain.period = gainWobblePeriod;
//         flow.wobbler_gain.phase = true;
//         flow.wobbler_gain.wave = 's';
//         flow.wobbler_gain.interval = null;
//         flow.wobbler_gain.start = function(){
//             if(flow.wobbler_gain.period < gainWobbleMin || flow.wobbler_gain.period >= gainWobbleMax){
//                 _canvas_.library.audio.changeAudioParam(context, flow.wobbler_gain.node.gain, 1, 0.01, flow.wobbler_gain.wave );
//                 return;
//             }
//             flow.wobbler_gain.interval = setInterval(function(){
//                 if(flow.wobbler_gain.phase){ _canvas_.library.audio.changeAudioParam(context, flow.wobbler_gain.node.gain, 1, 0.9*flow.wobbler_gain.period, flow.wobbler_gain.wave ); }
//                 else{                        _canvas_.library.audio.changeAudioParam(context, flow.wobbler_gain.node.gain, 1-flow.wobbler_gain.depth,  0.9*flow.wobbler_gain.period, flow.wobbler_gain.wave ); }
//                 flow.wobbler_gain.phase = !flow.wobbler_gain.phase;
//             }, 1000*flow.wobbler_gain.period);
//         };
//         flow.wobbler_gain.stop = function(){clearInterval(flow.wobbler_gain.interval);};
//         flow.wobbler_gain.node = context.createGain();
//         flow.wobbler_gain.node.gain.setTargetAtTime(1, context.currentTime, 0);
//         flow.aggregator.node.connect(flow.wobbler_gain.node);

        
//         flow.mainOut.gain = gain;
//         flow.mainOut.node = context.createGain();
//         flow.mainOut.node.gain.setTargetAtTime(gain, context.currentTime, 0);
//         flow.wobbler_gain.node.connect(flow.mainOut.node);

//     //output node
//         this.out = function(){return flow.mainOut.node;}

//     //controls
//         this.perform = function(note){
//             if( !flow.liveOscillators[note.num] && note.velocity == 0 ){/*trying to stop a non-existant tone*/return;}
//             else if( !flow.liveOscillators[note.num] && note.velocity != 0 ){ 
//                 //create new tone
//                 flow.liveOscillators[note.num] = flow.OSCmaker.func(
//                     context, 
//                     flow.aggregator.node, 
//                     note.num, 
//                     flow.OSCmaker.waveType, 
//                     flow.OSCmaker.periodicWave, 
//                     note.velocity, 
//                     flow.OSCmaker.attack, 
//                     flow.OSCmaker.release, 
//                     flow.OSCmaker.detune, 
//                     flow.OSCmaker.octave
//                 );
//             }
//             else if( note.velocity == 0 ){ 
//                 //stop and destroy tone
//                 flow.liveOscillators[note.num].stop();
//                 delete flow.liveOscillators[note.num];
//             }
//             else{
//                 //adjust tone
//                 flow.liveOscillators[note.num].changeVelocity(note.velocity);
//             }
//         };
//         this.panic = function(){
//             const OSCs = Object.keys(flow.liveOscillators);
//             for(let a = 0; a < OSCs.length; a++){ this.perform( {'num':OSCs[a], 'velocity':0} ); }
//         };
//         this.waveType = function(a){if(a==null){return flow.OSCmaker.waveType;}flow.OSCmaker.waveType=a;};
//         this.periodicWave = function(a){if(a==null){return flow.OSCmaker.periodicWave;}flow.OSCmaker.periodicWave=a;};
//         this.gain = function(target,time,curve){ return _canvas_.library.audio.changeAudioParam(context,flow.mainOut.node.gain,target,time,curve); };
//         this.attack = function(time,curve){
//             if(time==null&&curve==null){return flow.OSCmaker.attack;}
//             flow.OSCmaker.attack.time = time ? time : flow.OSCmaker.attack.time;
//             flow.OSCmaker.attack.curve = curve ? curve : flow.OSCmaker.attack.curve;
//         };
//         this.release = function(time,curve){
//             if(time==null&&curve==null){return flow.OSCmaker.release;}
//             flow.OSCmaker.release.time = time ? time : flow.OSCmaker.release.time;
//             flow.OSCmaker.release.curve = curve ? curve : flow.OSCmaker.release.curve;
//         };
//         this.octave = function(a){if(a==null){return flow.OSCmaker.octave;}flow.OSCmaker.octave=a;};
//         this.detune = function(target,time,curve){
//             if(target==null){return flow.OSCmaker.detune;}

//             //change stored value for any new oscillators that are made
//                 const start = flow.OSCmaker.detune;
//                 const mux = target-start;
//                 const stepsPerSecond = Math.round(Math.abs(mux));
//                 const totalSteps = stepsPerSecond*time;

//                 let steps = [1];
//                 switch(curve){
//                     case 'linear': steps = system.utility.math.curveGenerator.linear(totalSteps); break;
//                     case 'exponential': steps = system.utility.math.curveGenerator.exponential(totalSteps); break;
//                     case 's': steps = system.utility.math.curveGenerator.s(totalSteps,8); break;
//                     case 'instant': default: break;
//                 }
                
//                 if(steps.length != 0){
//                     const interval = setInterval(function(){
//                         flow.OSCmaker.detune = start+(steps.shift()*mux);
//                         if(steps.length == 0){clearInterval(interval);}
//                     },1000/stepsPerSecond);
//                 }

//             //instruct liveOscillators to adjust their values
//                 const OSCs = Object.keys(flow.liveOscillators);
//                 for(let b = 0; b < OSCs.length; b++){ 
//                     flow.liveOscillators[OSCs[b]].detune(target,time,curve);
//                 }
//         };
//         this.gainWobbleDepth = function(value){
//             if(value==null){return flow.wobbler_gain.depth; }
//             flow.wobbler_gain.depth = value;
//             flow.wobbler_gain.stop();
//             flow.wobbler_gain.start();
//         };
//         this.gainWobblePeriod = function(value){
//             if(value==null){return flow.wobbler_gain.period; }
//             flow.wobbler_gain.period = value;
//             flow.wobbler_gain.stop();
//             flow.wobbler_gain.start();
//         };
//         this.detuneWobbleDepth = function(value){
//             if(value==null){return flow.wobbler_detune.depth; }
//             flow.wobbler_detune.depth = value;
//             flow.wobbler_detune.stop();
//             flow.wobbler_detune.start();
//         };
//         this.detuneWobblePeriod = function(value){
//             if(value==null){return flow.wobbler_detune.period; }
//             flow.wobbler_detune.period = value;
//             flow.wobbler_detune.stop();
//             flow.wobbler_detune.start();
//         };
// };









this.synthesizer = function(
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
            amplitudeControlledModulator: {},
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

        flow.amplitudeControlledModulator.node = new _canvas_.library.audio.audioWorklet.amplitudeControlledModulator(_canvas_.library.audio.context);
        flow.aggregator.node.connect(flow.amplitudeControlledModulator.node,undefined,0);
        flow.amplitudeModifier.connect(flow.amplitudeControlledModulator.node,undefined,1);

    //output node
        this.out = function(){
            return flow.amplitudeControlledModulator.node;
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