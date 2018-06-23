this.synthesizer2 = function(
    context,
    waveType='sine', periodicWave={'sin':[0,1], 'cos':[0,0]}, 
    gain=1, gainWobbleDepth=0, gainWobblePeriod=0, gainWobbleMin=0.01, gainWobbleMax=1,
    attack={time:0.01, curve:'linear'}, release={time:0.05, curve:'linear'},
    octave=0,
    detune=0, detuneWobbleDepth=0, detuneWobblePeriod=0, detuneWobbleMin=0.01, detuneWobbleMax=1
){
    //flow chain
        var flow = {
            OSCmaker:{},
            liveOscillators: {},
            wobbler_detune: {},
            aggregator: {},
            wobbler_gain: {},
            mainOut: {}
        };


        flow.OSCmaker.waveType = waveType;
        flow.OSCmaker.periodicWave = periodicWave;
        flow.OSCmaker.attack = attack;
        flow.OSCmaker.release = release;
        flow.OSCmaker.octave  = octave;
        flow.OSCmaker.detune  = detune;
        flow.OSCmaker.func = function(
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
                    this.generator.frequency.setTargetAtTime(__globals.audio.num2freq(midiNumber,octave), context.currentTime, 0);
                    this.generator.detune.setTargetAtTime(detune, context.currentTime, 0);
                    this.generator.start(0);

                this.gain = context.createGain();
                    this.generator.connect(this.gain);
                    this.gain.gain.setTargetAtTime(0, context.currentTime, 0);
                    __globals.utility.audio.changeAudioParam(context,this.gain.gain, gain, attack.time, attack.curve, false);
                    this.gain.connect(connection);

                this.detune = function(target,time,curve){
                    __globals.utility.audio.changeAudioParam(context,this.generator.detune,target,time,curve);
                };
                this.stop = function(){
                    __globals.utility.audio.changeAudioParam(context,this.gain.gain,0,release.time,release.curve, false);
                    setTimeout(function(that){
                        that.gain.disconnect(); 
                        that.generator.stop(); 
                        that.generator.disconnect(); 
                        that.gain=null; 
                        that.generator=null; 
                        that=null; 
                        delete that;
                    }, release.time*1000, this);
                };
            };
        };


        flow.wobbler_detune.depth = detuneWobbleDepth;
        flow.wobbler_detune.period = detuneWobblePeriod;
        flow.wobbler_detune.phase = true;
        flow.wobbler_detune.wave = 's';
        flow.wobbler_detune.interval = null;
        flow.wobbler_detune.start = function(){
            if(flow.wobbler_detune.period < detuneWobbleMin || flow.wobbler_detune.period >= detuneWobbleMax){ return; }
            flow.wobbler_detune.interval = setInterval(function(){
                var OSCs = Object.keys(flow.liveOscillators);
                if(flow.wobbler_detune.phase){
                    for(var b = 0; b < OSCs.length; b++){ 
                        flow.liveOscillators[OSCs[b]].detune(flow.wobbler_detune.depth,0.9*flow.wobbler_detune.period,flow.wobbler_detune.wave);
                    }
                }else{
                    for(var b = 0; b < OSCs.length; b++){ 
                        flow.liveOscillators[OSCs[b]].detune(-flow.wobbler_detune.depth,0.9*flow.wobbler_detune.period,flow.wobbler_detune.wave);
                    }
                }
                flow.wobbler_detune.phase = !flow.wobbler_detune.phase;
            }, 1000*flow.wobbler_detune.period);
        };
        flow.wobbler_detune.stop = function(){clearInterval(flow.wobbler_detune.interval);};


        flow.aggregator.node = context.createGain();    
        flow.aggregator.node.gain.setTargetAtTime(1, context.currentTime, 0);


        flow.wobbler_gain.depth = gainWobbleDepth;
        flow.wobbler_gain.period = gainWobblePeriod;
        flow.wobbler_gain.phase = true;
        flow.wobbler_gain.wave = 's';
        flow.wobbler_gain.interval = null;
        flow.wobbler_gain.start = function(){
            if(flow.wobbler_gain.period < gainWobbleMin || flow.wobbler_gain.period >= gainWobbleMax){
                __globals.utility.audio.changeAudioParam(context, flow.wobbler_gain.node.gain, 1, 0.01, flow.wobbler_gain.wave );
                return;
            }
            flow.wobbler_gain.interval = setInterval(function(){
                if(flow.wobbler_gain.phase){ __globals.utility.audio.changeAudioParam(context, flow.wobbler_gain.node.gain, 1, 0.9*flow.wobbler_gain.period, flow.wobbler_gain.wave ); }
                else{                        __globals.utility.audio.changeAudioParam(context, flow.wobbler_gain.node.gain, 1-flow.wobbler_gain.depth,  0.9*flow.wobbler_gain.period, flow.wobbler_gain.wave ); }
                flow.wobbler_gain.phase = !flow.wobbler_gain.phase;
            }, 1000*flow.wobbler_gain.period);
        };
        flow.wobbler_gain.stop = function(){clearInterval(flow.wobbler_gain.interval);};
        flow.wobbler_gain.node = context.createGain();
        flow.wobbler_gain.node.gain.setTargetAtTime(1, context.currentTime, 0);
        flow.aggregator.node.connect(flow.wobbler_gain.node);

        
        flow.mainOut.gain = gain;
        flow.mainOut.node = context.createGain();
        flow.mainOut.node.gain.setTargetAtTime(gain, context.currentTime, 0);
        flow.wobbler_gain.node.connect(flow.mainOut.node);

    //output node
        this.out = function(){return flow.mainOut.node;}

    //controls
        this.perform = function(note){
            if( !flow.liveOscillators[note.num] && note.velocity == 0 ){/*trying to stop a non-existant tone*/return;}
            else if( !flow.liveOscillators[note.num] ){ 
                //create new tone
                flow.liveOscillators[note.num] = flow.OSCmaker.func(
                    context, 
                    flow.aggregator.node, 
                    note.num, 
                    flow.OSCmaker.waveType, 
                    flow.OSCmaker.periodicWave, 
                    note.velocity, 
                    flow.OSCmaker.attack, 
                    flow.OSCmaker.release, 
                    flow.OSCmaker.detune, 
                    flow.OSCmaker.octave
                );
            }
            else if( note.velocity == 0 ){ 
                //stop and destroy tone
                flow.liveOscillators[note.num].stop();
                delete flow.liveOscillators[note.num];
            }
            else{
                //adjust tone
                flow.liveOscillators[note.num].osc.changeVelocity(note.velocity);
            }
        };
        this.panic = function(){
            var OSCs = Object.keys(flow.liveOscillators);
            for(var a = 0; a < OSCs.length; a++){ this.perform( {'num':OSCs[a], 'velocity':0} ); }
        };
        this.waveType = function(a){if(a==null){return flow.OSCmaker.waveType;}flow.OSCmaker.waveType=a;};
        this.periodicWave = function(a){if(a==null){return flow.OSCmaker.periodicWave;}flow.OSCmaker.periodicWave=a;};
        this.gain = function(target,time,curve){ return __globals.utility.audio.changeAudioParam(context,flow.mainOut.node.gain,target,time,curve); };
        this.attack = function(time,curve){
            if(time==null&&curve==null){return flow.OSCmaker.attack;}
            flow.OSCmaker.attack.time = time ? time : flow.OSCmaker.attack.time;
            flow.OSCmaker.attack.curve = curve ? curve : flow.OSCmaker.attack.curve;
        };
        this.release = function(time,curve){
            if(time==null&&curve==null){return flow.OSCmaker.release;}
            flow.OSCmaker.release.time = time ? time : flow.OSCmaker.release.time;
            flow.OSCmaker.release.curve = curve ? curve : flow.OSCmaker.release.curve;
        };
        this.octave = function(a){if(a==null){return flow.OSCmaker.octave;}flow.OSCmaker.octave=a;};
        this.detune = function(target,time,curve){
            if(a==null){return flow.OSCmaker.detune;}

            //change stored value for any new oscillators that are made
                var start = flow.OSCmaker.detune;
                var mux = target-start;
                var stepsPerSecond = Math.round(Math.abs(mux));
                var totalSteps = stepsPerSecond*time;

                var steps = [1];
                switch(curve){
                    case 'linear': steps = __globals.utility.math.curveGenerator.linear(totalSteps); break;
                    case 'exponential': steps = __globals.utility.math.curveGenerator.exponential(totalSteps); break;
                    case 's': steps = __globals.utility.math.curveGenerator.s(totalSteps,8); break;
                    case 'instant': default: break;
                }
                
                if(steps.length != 0){
                    var interval = setInterval(function(){
                        flow.OSCmaker.detune = start+(steps.shift()*mux);
                        if(steps.length == 0){clearInterval(interval);}
                    },1000/stepsPerSecond);
                }

            //instruct liveOscillators to adjust their values
                var OSCs = Object.keys(flow.liveOscillators);
                for(var b = 0; b < OSCs.length; b++){ 
                    flow.liveOscillators[OSCs[b]].detune(target,time,curve);
                }
        };
        this.gainWobbleDepth = function(value){
            if(value==null){return flow.wobbler_gain.depth; }
            flow.wobbler_gain.depth = value;
            flow.wobbler_gain.stop();
            flow.wobbler_gain.start();
        };
        this.gainWobblePeriod = function(value){
            if(value==null){return flow.wobbler_gain.period; }
            flow.wobbler_gain.period = value;
            flow.wobbler_gain.stop();
            flow.wobbler_gain.start();
        };
        this.detuneWobbleDepth = function(value){
            if(value==null){return flow.wobbler_detune.depth; }
            flow.wobbler_detune.depth = value;
            flow.wobbler_detune.stop();
            flow.wobbler_detune.start();
        };
        this.detuneWobblePeriod = function(value){
            if(value==null){return flow.wobbler_detune.period; }
            flow.wobbler_detune.period = value;
            flow.wobbler_detune.stop();
            flow.wobbler_detune.start();
        };
};