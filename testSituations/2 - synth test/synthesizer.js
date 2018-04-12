parts.audio.synthesizer = function(
    context,
    type='sine', periodicWave={'sin':[0,1], 'cos':[0,0]}, 
    gain=1, attack=0.01, release=0.1, detune=0, octave=0
){
    //components
    var node_gain = context.createGain();
        node_gain.gain.value = gain;

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
    function newOSC(
        context, connection, note,
        type='sine', periodicWave={'sin':[0,1], 'cos':[0,0]}, 
        gain=1, attack=0.01, release=0.1, detune=0, octave=0
    ){
        var node_generator = context.createOscillator();
            if(type == 'custom'){ 
                node_generator.setPeriodicWave( 
                    context.createPeriodicWave(new Float32Array(periodicWave.sin),new Float32Array(periodicWave.cos))
                ); 
            }else{ node_generator.type = type; }

            if(octave!=0){ node_generator.frequency.value = __globals.audio.names_frequencies_split[ parseInt(note.name()[0])+octave ][note.name().substring(1)]; }
            else{ node_generator.frequency.value = note.frequency(); }
            node_generator.detune.value = detune;
            node_generator.start(0);

        var node_gain = context.createGain();
            node_generator.connect(node_gain);
            node_gain.gain.value = 0;
            gain *= note.force();
            node_gain.gain.setTargetAtTime(gain, context.currentTime, attack/10);
            node_gain.gain.setTargetAtTime(0, context.currentTime+note.duration(), release/10);
            node_gain.connect(connection);

        setTimeout(function(){node_gain.disconnect(); node_generator.stop(); node_generator.disconnect(); node_gain=null; node_generator=null; },(note.duration()+release)*1000);
    }

    //functions
    this.perform  = function(notes){
        for(var a = 0; a < notes.length; a++){
            newOSC( context, node_gain, notes[a], type, periodicWave, 1, attack, release, detune, octave );
        }
    };
};