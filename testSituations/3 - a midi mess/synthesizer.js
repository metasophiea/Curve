parts.audio.synthesizer = function(
    context,
    type='sine', periodicWave={'sin':[0,1], 'cos':[0,0]}, 
    gain=1, attack=0.01, release=0.1, detune=0, octave=0
){
    //components
    var node_gain = context.createGain();
        node_gain.gain.value = gain;

    //live oscillators
    var liveOscillators = {};

    //options
    this.type = function(a){if(a==null){return type;}type=a;};
    this.periodicWave = function(a){if(a==null){return periodicWave;}periodicWave=a;};
    this.gain = function(a){if(a==null){return node_gain.gain.value;}node_gain.gain.value=a;};
    this.attack = function(a){if(a==null){return attack;}attack=a;};
    this.release = function(a){if(a==null){return release;}release=a;};
    this.detune = function(a){if(a==null){return detune;}detune=a;};
    this.octave = function(a){if(a==null){return octave;}octave=a;};

    //output node
    this.out = function(){return node_gain;}

    //oscillator generator
    function makeOSC(
        context, connection, midiNumber,
        type='sine', periodicWave={'sin':[0,1], 'cos':[0,0]}, 
        gain=1, attack=0.01, release=0.1, detune=0, octave=0
    ){
        return new function(){
            this.node_generator = context.createOscillator();
                if(type == 'custom'){ 
                    this.node_generator.setPeriodicWave( 
                        context.createPeriodicWave(new Float32Array(periodicWave.sin),new Float32Array(periodicWave.cos))
                    ); 
                }else{ this.node_generator.type = type; }

                this.node_generator.frequency.value = __globals.audio.midiNumber_frequency(midiNumber,octave);
                this.node_generator.detune.value = detune;
                this.node_generator.start(0);
        
            this.node_gain = context.createGain();
                this.node_generator.connect(this.node_gain);
                this.node_gain.gain.value = 0;
                this.node_gain.gain.setTargetAtTime(gain, context.currentTime, attack/10);
                this.node_gain.connect(connection);

            this.changeVelocity = function(a){
                this.node_gain.gain.setTargetAtTime(a, context.currentTime, attack/10);
            };
            this.stop = function(){
                this.node_gain.gain.setTargetAtTime(0, context.currentTime, release/10);
                setTimeout(function(that){
                    that.node_gain.disconnect(); 
                    that.node_generator.stop(); 
                    that.node_generator.disconnect(); 
                    that.node_gain=null; 
                    that.node_generator=null; 
                }, release*1000, this);
            };
        };
    }

    //functions
    this.perform  = function(note){
        console.log(note);
        // // console.log( liveOscillators[note.noteNumber] );
        // // console.log('');
        if( !liveOscillators[note.noteNumber] ){ 
            liveOscillators[note.noteNumber] = makeOSC(context, node_gain, note.noteNumber, type, periodicWave, note.velocity, attack, release, detune, octave); 
        }
        else if( note.velocity == 0 ){ 
            liveOscillators[note.noteNumber].stop();
            delete liveOscillators[note.noteNumber];
        }
        else{ liveOscillators[note.noteNumber].changeVelocity(note.velocity); }
    };
};