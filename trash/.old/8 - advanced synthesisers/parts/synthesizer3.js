parts.audio.synthesizer3 = function(
    context,
    waveType='sine', periodicWave={'sin':[0,1], 'cos':[0,0]}, 
    gain=1, gainJourney=[{curve:'linear',time:0.01,velocity:1},{curve:'linear',time:0.05,velocity:1},{curve:'linear',time:0.05,velocity:0}],
    octave=0, detune=0
){
    //flow chain
        var flow = {
            OSCmaker:{},
            liveOscillators: {},
            aggregator: {},
            mainOut: {}
        };

        //OSCmaker
            flow.OSCmaker.waveType = waveType;
            flow.OSCmaker.periodicWave = periodicWave;
            flow.OSCmaker.gainJourney = gainJourney;
            flow.OSCmaker.octave  = octave;
            flow.OSCmaker.detune  = detune;
            flow.OSCmaker.func = function(
                context, connection, midiNumber,
                type, periodicWave, 
                gain, gainJourney,
                detune, octave
            ){
                return new function(){

                    //generator node
                        this.generator = context.createOscillator();
                        if(type == 'custom'){ 
                            this.generator.setPeriodicWave(
                                context.createPeriodicWave(new Float32Array(periodicWave.cos),new Float32Array(periodicWave.sin))
                            ); 
                        }else{ this.generator.type = type; }
                        this.generator.frequency.setTargetAtTime(__globals.audio.num2freq(midiNumber,octave), context.currentTime, 0);
                        this.generator.detune.setTargetAtTime(detune, context.currentTime, 0);
                        this.generator.start(0);

                    //gain node
                        this.gain = context.createGain();
                        this.gain.gain.setTargetAtTime(0, context.currentTime, 0);

                        //journey of the gain
                            __globals.utility.audio.changeAudioParam(context,this.gain.gain, gain*gainJourney[0].velocity, gainJourney[0].time, gainJourney[0].curve, false);
                            var collectiveTime = gainJourney[0].time;
                            for(var a = 1; a < gainJourney.length; a++){
                                setTimeout(function(that,t,stage){
                                    __globals.utility.audio.changeAudioParam(context,that.gain.gain, gain*stage.velocity, stage.time, stage.curve, false);
                                },collectiveTime*1000,this,collectiveTime,gainJourney[a]);
                                collectiveTime += gainJourney[a].time;
                            }

                    //connections
                        this.generator.connect(this.gain);
                        this.gain.connect(connection);

                    //for live detune
                        this.detune = function(target,time,curve){
                            __globals.utility.audio.changeAudioParam(context,this.generator.detune,target,time,curve);
                        };

                    //self destruct
                        setTimeout(function(that){
                            that.gain.disconnect();
                            that.generator.stop();
                            that.generator.disconnect();
                            that.gain=null;
                            that.generator=null;
                            that = null;
                            delete that;
                        }, collectiveTime*1000, this);
                };
            };

        
        //liveOscillators

        //aggregator
            flow.aggregator.node = context.createGain();    
            flow.aggregator.node.gain.setTargetAtTime(1, context.currentTime, 0);

        //mainOut
            flow.mainOut.gain = gain;
            flow.mainOut.node = context.createGain();
            flow.mainOut.node.gain.setTargetAtTime(gain, context.currentTime, 0);
            flow.aggregator.node.connect(flow.mainOut.node);

    //output node
        this.out = function(){return flow.mainOut.node;}

    //controls    
        this.perform = function(note){
            if( note.velocity == 0 ){/*ignore zero-velocity notes*/return;}
            flow.OSCmaker.func(
                context, 
                flow.aggregator.node, 
                note.num, 
                flow.OSCmaker.waveType, 
                flow.OSCmaker.periodicWave, 
                note.velocity, 
                flow.OSCmaker.gainJourney,
                flow.OSCmaker.detune, 
                flow.OSCmaker.octave
            );
        };
        this.panic = function(){
            var OSCs = Object.keys(flow.liveOscillators);
            for(var a = 0; a < OSCs.length; a++){ this.perform( {'num':OSCs[a], 'velocity':0} ); }
        };
};