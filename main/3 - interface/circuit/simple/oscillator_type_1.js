this.oscillator_type_1 = function(
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
                node: new _canvas_.library.audio.audioWorklet.production.only_js.nothing(context),
            };
            flow.detuneControl = {
                node: new _canvas_.library.audio.audioWorklet.production.only_js.nothing(context),
            };
            flow.dutyCycleControl = {
                node: new _canvas_.library.audio.audioWorklet.production.only_js.nothing(context),
            };

        //oscillator
            flow.oscillator = {
                frequency: 440,
                gain: 1,
                detune: 0,
                dutyCycle: 0.5,
                node: new _canvas_.library.audio.audioWorklet.production.wasm.oscillator_type_1(_canvas_.library.audio.context)
            };

        flow.gainControl.node.connect(flow.oscillator.node, undefined, 0);
        flow.detuneControl.node.connect(flow.oscillator.node, undefined, 1);
        flow.dutyCycleControl.node.connect(flow.oscillator.node, undefined, 2);
    
    //input/output
        this.out = function(){return flow.oscillator.node;}
        this.gainControl = function(){return flow.gainControl.node;}
        this.detuneControl = function(){return flow.detuneControl.node;}
        this.dutyCycleControl = function(){return flow.dutyCycleControl.node;}

    //shutdown
        this.shutdown = function(){
            flow.gainControl.node.shutdown();
            flow.detuneControl.node.shutdown();
            flow.dutyCycleControl.node.shutdown();
            flow.oscillator.node.shutdown();

            flow.gainControl.node.disconnect(flow.oscillator.node);
            flow.detuneControl.node.disconnect(flow.oscillator.node);
            flow.dutyCycleControl.node.disconnect(flow.oscillator.node);
        }

    //controls
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
};