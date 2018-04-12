this.synthesizer = function(
    context,
    type='sine', periodicWave={'sin':[0,1], 'cos':[0,0]}, 
    gain=1, attack=0.01, release=0.1, detune=0, octave=0
){
    //components
    var mainOut = context.createGain();
        mainOut.gain.value = gain;

    //live oscillators
    var liveOscillators = {};

    //options
    this.type = function(a){if(a==null){return type;}type=a;};
    this.periodicWave = function(a){if(a==null){return periodicWave;}periodicWave=a;};
    this.gain = function(a){if(a==null){return mainOut.gain.value;}mainOut.gain.value=a;};
    this.attack = function(a){if(a==null){return attack;}attack=a;};
    this.release = function(a){if(a==null){return release;}release=a;};
    this.detune = function(a){if(a==null){return detune;}detune=a;};
    this.octave = function(a){if(a==null){return octave;}octave=a;};

    //output node
    this.out = function(){return mainOut;}

    //oscillator generator
    function makeOSC(
        context, connection, midiNumber,
        type='sine', periodicWave={'sin':[0,1], 'cos':[0,0]}, 
        gain=1, attack=0.01, release=0.1, detune=0, octave=0
    ){
        return new function(){
            this.generator = context.createOscillator();
                if(type == 'custom'){ 
                    this.generator.setPeriodicWave( 
                        context.createPeriodicWave(new Float32Array(periodicWave.sin),new Float32Array(periodicWave.cos))
                    ); 
                }else{ this.generator.type = type; }
                this.generator.frequency.value = __globals.audio.midiNumber_frequency(midiNumber,octave);
                this.generator.detune.value = detune;
                this.generator.start(0);

            this.gain = context.createGain();
                this.generator.connect(this.gain);
                this.gain.gain.value = 0;
                this.gain.gain.setTargetAtTime(gain, context.currentTime, attack/10);
                this.gain.connect(connection);

            this.changeVelocity = function(a){
                this.gain.gain.setTargetAtTime(a, context.currentTime, attack/10);
            };
            this.stop = function(){
                this.gain.gain.setTargetAtTime(0, context.currentTime, release/10);
                setTimeout(function(that){
                    that.gain.disconnect(); 
                    that.generator.stop(); 
                    that.generator.disconnect(); 
                    that.gain=null; 
                    that.generator=null; 
                }, release*1000, this);
            };
        };
    }

    //functions
    this.perform = function(note){
        if( !liveOscillators[note.num] && note.velocity == 0 ){/*trying to stop a non-existant tone*/return;}
        else if( !liveOscillators[note.num] ){ 
            //create new tone
            liveOscillators[note.num] = makeOSC(context, mainOut, note.num, type, periodicWave, note.velocity, attack, release, detune, octave); 
        }
        else if( note.velocity == 0 ){ 
            //stop and destroy tone
            liveOscillators[note.num].stop();
            delete liveOscillators[note.num];
        }
        else{
            //adjust tone
            liveOscillators[note.num].changeVelocity(note.velocity);
        }
    };
    this.panic = function(){
        var OSCs = Object.keys(liveOscillators);
        for(var a = 0; a < OSCs.length; a++){ this.perform( {'num':OSCs[a], 'velocity':0} ); }
    };
};