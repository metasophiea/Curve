this.frequencyResponseMeasure = function(
    context
){
    const self = this;
    const state = {
        currentFrequency:100,
        response:[],
        frequencyRange:{
            start:100, stop:1000,
        },
        stepSize:10,
        timePerStep:0.05,
        scanningInterval:undefined,
    };

    //flow
        //flow chain
            //sending
                const sendingFlow = {
                    oscillator:{},
                };
            //receiving
                const receivingFlow = {
                    momentaryAmplitudeMeter:{},
                };
            
        //sending
            sendingFlow.oscillator = {
                node: new _canvas_.library.audio.audioWorklet.oscillator(context),
            };

        //receiving
            receivingFlow.momentaryAmplitudeMeter = {
                node: new _canvas_.library.audio.audioWorklet.momentaryAmplitudeMeter(context),
            };
            receivingFlow.momentaryAmplitudeMeter.node.updateMode = 1;
            receivingFlow.momentaryAmplitudeMeter.node.reading = function(data){
                state.response.push({frequency:state.currentFrequency, amplitude:data});
            };
        
    //input/output node
        this.in = function(){ return sendingFlow.oscillator.node; }
        this.out = function(){ return receivingFlow.momentaryAmplitudeMeter.node; }
        //development//
        sendingFlow.oscillator.node.connect(receivingFlow.momentaryAmplitudeMeter.node);

    //controls
        this.frequencyRange = function(start,stop){
            if(start == undefined && stop == undefined){ return state.frequencyRange; }
            if(start != undefined){ state.frequencyRange.start = start; }
            if(stop != undefined){ state.frequencyRange.stop = stop; }
        };
        this.stepSize = function(size){
            if(size == undefined){ return state.stepSize; }
            state.stepSize = size;
        };
        this.timePerStep = function(time){
            if(time == undefined){ return state.timePerStep; }
            state.timePerStep = time;
        };

        this.clear = function(){
            state.response = [];
        };
        this.start = function(){
            receivingFlow.momentaryAmplitudeMeter.node.fullSample = 1;

            state.currentFrequency = state.frequencyRange.start;
            state.scanningInterval = setInterval(function(){
                state.currentFrequency += state.stepSize;
                sendingFlow.oscillator.node.frequency.setValueAtTime(state.currentFrequency,0);
                setTimeout(function(){
                    receivingFlow.momentaryAmplitudeMeter.node.requestReading();
                },state.timePerStep*500);

                if( state.currentFrequency > state.frequencyRange.stop ){
                    self.stop();
                }
            },state.timePerStep*1000);
        };
        this.stop = function(){
            if(self.onCompletion != undefined){ self.onCompletion(state.response); }
            clearInterval(state.scanningInterval);
            receivingFlow.momentaryAmplitudeMeter.node.fullSample = 0;
        };

        this.getData = function(){
            return state.response;
        };
        this.onCompletion = function(){};
};