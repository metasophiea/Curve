this.amplitudeExciter = function(
    context
){
    //flow
        //flow chain
            const flow = {
                amplitudeExciter:{}
            };

    //amplitudeExciter
        flow.amplitudeExciter = {
            sharpness: 10,
            node: new _canvas_.library.audio.audioWorklet.amplitudeExciter(_canvas_.library.audio.context),
        };

    //input/output node
        this.in = function(){return flow.amplitudeExciter.node;}
        this.out = function(a){return flow.amplitudeExciter.node;}

    //controls
        this.sharpness = function(value){
            if(value == undefined){ return flow.amplitudeExciter.sharpness; }
            if(value < 1){value = 1;}
            flow.amplitudeExciter.sharpness = value;
            _canvas_.library.audio.changeAudioParam(_canvas_.library.audio.context, flow.amplitudeExciter.node.sharpness, value, 0.01, 'instant', true);
        };
};