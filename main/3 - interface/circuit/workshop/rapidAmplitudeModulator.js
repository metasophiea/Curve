this.rapidAmplitudeModulator = function(
    context
){
    //flow
        let inputOption = 'internalOscillator';
        //flow chain
            const flow = {
                signalToModulate:{},

                modulatingSignal:{},
                internalOscillator:{},
                amplitudeControlledModulator:{},

                out:{},
            };

        //signalToModulate
            flow.signalToModulate.gain = 1;
            flow.signalToModulate.node = context.createGain();
            _canvas_.library.audio.changeAudioParam(context,flow.signalToModulate.node.gain, flow.signalToModulate.gain, 0.01, 'instant', true);
        //modulatingSignal
            flow.modulatingSignal.gain = 1;
            flow.modulatingSignal.node = context.createGain();
            _canvas_.library.audio.changeAudioParam(context,flow.modulatingSignal.node.gain, flow.modulatingSignal.gain, 0.01, 'instant', true);
        //internalOscillator
            flow.internalOscillator.frequency = 1;
            flow.internalOscillator.type = 'sine'; 
            flow.internalOscillator.node = context.createOscillator();
            flow.internalOscillator.node.frequency.setTargetAtTime(flow.internalOscillator.frequency, _canvas_.library.audio.context.currentTime, 0);
            flow.internalOscillator.node.type = flow.internalOscillator.type; 
            flow.internalOscillator.node.start();
        //amplitudeControlledModulator
            flow.amplitudeControlledModulator.node = context.createAmplitudeControlledModulator();
        //out
            flow.out.gain = 1;
            flow.out.node = context.createGain();
            _canvas_.library.audio.changeAudioParam(context,flow.out.node.gain, flow.out.gain, 0.01, 'instant', true);

        //do connections
            flow.signalToModulate.node.connect(flow.amplitudeControlledModulator.node, undefined, 0);
            flow.internalOscillator.node.connect(flow.amplitudeControlledModulator.node, undefined, 1);
            flow.amplitudeControlledModulator.node.connect(flow.out.node);

    //input/output node
        this.signalToModulate = function(){
            return flow.signalToModulate.node;
        };
        this.modulatingSignal = function(){
            return flow.modulatingSignal.node;
        };
        this.out = function(){
            return flow.out.node;
        };

    //controls
        this.frequency = function(a,transitionTime=0){
            if(a == undefined){ return flow.internalOscillator.frequency; }
            flow.internalOscillator.frequency = a;
            flow.internalOscillator.node.frequency.linearRampToValueAtTime(flow.internalOscillator.frequency, _canvas_.library.audio.context.currentTime+transitionTime);
        };
        this.waveType = function(a){
            if(a == undefined){ return flow.internalOscillator.type; }
            if(a == 'custom'){
                if(inputOption == 'internalOscillator'){
                    flow.internalOscillator.node.disconnect(flow.amplitudeControlledModulator.node, undefined, 1);
                    flow.modulatingSignal.node.connect(flow.amplitudeControlledModulator.node, undefined, 1);
                    inputOption = 'internalOscillator';
                }
            }else{
                if(inputOption == 'modulatingSignal'){
                    flow.modulatingSignal.node.disconnect(flow.amplitudeControlledModulator.node, undefined, 1);
                    flow.internalOscillator.node.connect(flow.amplitudeControlledModulator.node, undefined, 1);
                    inputOption = 'modulatingSignal';
                }
                flow.internalOscillator.type = a;
                flow.internalOscillator.node.type = flow.internalOscillator.type; 
            }
        };

};