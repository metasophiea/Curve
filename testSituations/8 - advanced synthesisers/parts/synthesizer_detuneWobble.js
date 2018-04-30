parts.audio.synthesizer_detuneWobble = function(
    context,
    waveType='sine', periodicWave={'sin':[0,1], 'cos':[0,0]}, 
    gain=1, 
    attack={time:0.01, curve:'linear'}, release={time:0.05, curve:'linear'},
    detune=0, octave=0
){
    //components
        var mainOut = context.createGain();
            mainOut.gain.setTargetAtTime(gain, context.currentTime, 0);

    //live oscillators
        var liveOscillators = {};

    //output node
        this.out = function(){return mainOut;}

    //oscillator generator
        function makeOSC(
            context, connection, midiNumber,
            type, periodicWave, 
            gain, attack, release,
            detune, octave
        ){
            return new function(){
                this.generator = context.createOscillator();
                    if(type == 'custom'){ 
                        this.generator.setPeriodicWave(
                            context.createPeriodicWave(new Float32Array(periodicWave.cos),new Float32Array(periodicWave.sin))
                        ); 
                    }else{ this.generator.type = type; }
                    this.generator.frequency.setTargetAtTime(__globals.audio.midiNumber_frequency(midiNumber,octave), context.currentTime, 0);
                    this.generator.detune.setTargetAtTime(detune, context.currentTime, 0);
                    this.generator.start(0);

                this.gain = context.createGain();
                    this.generator.connect(this.gain);
                    this.gain.gain.setTargetAtTime(0, context.currentTime, 0);
                    changeAudioParam(this.gain.gain, gain, attack.time, attack.curve, false);
                    this.gain.connect(connection);

                this.detune = function(target,time,curve){
                    changeAudioParam(this.generator.detune,target,time,curve);
                };
                this.stop = function(){
                    changeAudioParam(this.gain.gain,0,release.time,release.curve, false);
                    setTimeout(function(that){
                        that.gain.disconnect(); 
                        that.generator.stop(); 
                        that.generator.disconnect(); 
                        that.gain=null; 
                        that.generator=null; 
                    }, release.time*1000, this);
                };
            };
        }

    //wobbling detune
        var wobble = {
            phase: true,
            high: 100,
            low: -100,
            period: 0.1,
            wave: 's'
        };
        setInterval(function(){            
            var OSCs = Object.keys(liveOscillators);
            if(wobble.phase){
                for(var b = 0; b < OSCs.length; b++){ 
                    liveOscillators[OSCs[b]].detune(wobble.high,0.9*wobble.period,wobble.wave);
                }
            }else{
                for(var b = 0; b < OSCs.length; b++){ 
                    liveOscillators[OSCs[b]].detune(wobble.low,0.9*wobble.period,wobble.wave);
                }
            }
            wobble.phase = !wobble.phase;
        }, 1000*wobble.period);

    //methods
        this.perform = function(note){
            if( !liveOscillators[note.num] && note.velocity == 0 ){/*trying to stop a non-existant tone*/return;}
            else if( !liveOscillators[note.num] ){ 
                //create new tone
                liveOscillators[note.num] = makeOSC(context, mainOut, note.num, waveType, periodicWave, note.velocity, attack, release, detune, octave); 
            }
            else if( note.velocity == 0 ){ 
                //stop and destroy tone
                liveOscillators[note.num].stop();
                delete liveOscillators[note.num];
            }
        };
        this.panic = function(){
            var OSCs = Object.keys(liveOscillators);
            for(var a = 0; a < OSCs.length; a++){ this.perform( {'num':OSCs[a], 'velocity':0} ); }
        };

    //functions
        function changeAudioParam(audioParam,target,time,curve,cancelScheduledValues=true){
            if(target==null){return audioParam.value;}

            if(cancelScheduledValues){
                audioParam.cancelScheduledValues(context.currentTime);
            }
            
            switch(curve){
                case 'linear': 
                    audioParam.linearRampToValueAtTime(target, context.currentTime+time);
                break;
                case 'exponential':
                    console.warn('2018-4-18 - changeAudioParam:exponential doesn\'t work on chrome');
                    if(target == 0){target = 1/10000;}
                    audioParam.exponentialRampToValueAtTime(target, context.currentTime+time);
                break;
                case 's':
                    var mux = target - audioParam.value;
                    var array = __globals.utility.math.curveGenerator.s(10);
                    for(var a = 0; a < array.length; a++){
                        array[a] = audioParam.value + array[a]*mux;
                    }
                    audioParam.setValueCurveAtTime(new Float32Array(array), context.currentTime, time);
                break;
                case 'instant': default:
                    audioParam.setTargetAtTime(target, context.currentTime, 0.001);
                break;
            }
        }
};