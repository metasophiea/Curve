this.amplitudePeakAttenuator = function(
    context
){
    //flow
        //flow chain
            const flow = {
                amplitudePeakAttenuator:{}
            };

    //amplitudePeakAttenuator
        flow.amplitudePeakAttenuator = {
            sharpness: 10,
            node: new _canvas_.library.audio.audioWorklet.amplitudePeakAttenuator(_canvas_.library.audio.context),
        };

    //input/output node
        this.in = function(){return flow.amplitudePeakAttenuator.node;}
        this.out = function(a){return flow.amplitudePeakAttenuator.node;}

    //controls
        this.sharpness = function(value){
            if(value == undefined){ return flow.amplitudePeakAttenuator.sharpness; }
            if(value < 1){value = 1;}
            flow.amplitudePeakAttenuator.sharpness = value;
            _canvas_.library.audio.changeAudioParam(_canvas_.library.audio.context, flow.amplitudePeakAttenuator.node.sharpness, value, 0.01, 'instant', true);
        };
};