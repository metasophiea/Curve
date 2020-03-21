this.oscillator = function(
    context
){
    const self = this;

    //flow
        //flow chain
            const flow = {
                gainControl:{},
                detuneControl:{},
                dutyCycleControl:{},
                oscillator:{},
            };

        //control streams
            flow.gainControl = {
                node: new _canvas_.library.audio.audioWorklet.nothing(context),
            };
            flow.detuneControl = {
                node: new _canvas_.library.audio.audioWorklet.nothing(context),
            };
            flow.dutyCycleControl = {
                node: new _canvas_.library.audio.audioWorklet.nothing(context),
            };

        //oscillator
            flow.oscillator = {
                frequency: 440,
                gain: 1,
                detune: 0,
                dutyCycle: 0.5,
                node: new _canvas_.library.audio.audioWorklet.oscillator(context),
            };

        flow.gainControl.node.connect(flow.oscillator.node, undefined, 0);
        flow.detuneControl.node.connect(flow.oscillator.node, undefined, 1);
        flow.dutyCycleControl.node.connect(flow.oscillator.node, undefined, 2);
    
    //input/output
        this.out = function(){return flow.oscillator.node;}
        this.gainControl = function(){return flow.gainControl.node;}
        this.detuneControl = function(){return flow.detuneControl.node;}
        this.dutyCycleControl = function(){return flow.dutyCycleControl.node;}

    //controls
        //performace
            this.start = function(){
                flow.oscillator.node.start();
            };
            this.stop = function(){
                flow.oscillator.node.stop();
            };

        //generic controls
            this.waveform = function(value){ // sine / square / triangle / noise / additiveSynthesis / phaseModulation
                if(value == undefined){ return flow.oscillator.node.waveform; }
                flow.oscillator.node.waveform = value;
            };
            this.frequency = function(value){
                if(value == undefined){ return flow.oscillator.frequency; }
                flow.oscillator.frequency = value;
                _canvas_.library.audio.changeAudioParam(context, flow.oscillator.node.frequency, value, 0.01, 'instant', true);
            };
            this.gain = function(value){
                if(value == undefined){ return flow.oscillator.gain; }
                flow.oscillator.gain = value;
                _canvas_.library.audio.changeAudioParam(context, flow.oscillator.node.gain, value, 0.01, 'instant', true);
            };
            this.detune = function(value){
                if(value == undefined){ return flow.oscillator.detune; }
                flow.oscillator.detune = value;
                _canvas_.library.audio.changeAudioParam(context, flow.oscillator.node.detune, value, 0.01, 'instant', true);
            };
            this.dutyCycle = function(value){
                if(value == undefined){ return flow.oscillator.dutyCycle; }
                flow.oscillator.dutyCycle = value;
                _canvas_.library.audio.changeAudioParam(context, flow.oscillator.node.dutyCycle, value, 0.01, 'instant', true);
            };
             
        //control select
            this.gain_useControl = function(value){
                if(value == undefined){ return flow.oscillator.node.gain_useControl; }
                flow.oscillator.node.gain_useControl = value;
            };
            this.detune_useControl = function(value){
                if(value == undefined){ return flow.oscillator.node.detune_useControl; }
                flow.oscillator.node.detune_useControl = value;
            };
            this.dutyCycle_useControl = function(value){
                if(value == undefined){ return flow.oscillator.node.dutyCycle_useControl; }
                flow.oscillator.node.dutyCycle_useControl = value;
            }

        //envelope
            this.gain_envelope = function(value){
                if(value == undefined){ return flow.oscillator.node.gain_envelope; }
                flow.oscillator.node.gain_envelope = value;
            };
            this.detune_envelope = function(value){
                if(value == undefined){ return flow.oscillator.node.detune_envelope; }
                flow.oscillator.node.detune_envelope = value;
            };
            this.dutyCycle_envelope = function(value){
                if(value == undefined){ return flow.oscillator.node.dutyCycle_envelope; }
                flow.oscillator.node.dutyCycle_envelope = value;
            }

        //additional miscellaneous waveform controls
            this,additiveSynthesis_sin = function(value){
                if(value == undefined){ return flow.oscillator.node.additiveSynthesis_sin; }
                flow.oscillator.node.additiveSynthesis_sin = value;
            };
            this,additiveSynthesis_cos = function(value){
                if(value == undefined){ return flow.oscillator.node.additiveSynthesis_cos; }
                flow.oscillator.node.additiveSynthesis_cos = value;
            };

            this.phaseModulation_settings = function(value){
                if(value == undefined){ return flow.oscillator.node.phaseModulation_settings; }
                flow.oscillator.node.phaseModulation_settings = value;
            };

    //callbacks
        flow.oscillator.node.onEnvelopeEvent = function(data){
            if(self.onEnvelopeEvent == undefined){ return; }
            self.onEnvelopeEvent(data);
        };
        this.onEnvelopeEvent = function(){};
};