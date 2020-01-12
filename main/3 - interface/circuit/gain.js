this.gain = function(
    context
){
    //flow
        //flow chain
            const flow = {
                gainNode:{}
            };

    //gainNode
        flow.gainNode.gain = 1;
        flow.gainNode.node = context.createGain();    
        _canvas_.library.audio.changeAudioParam(context, flow.gainNode.node.gain, flow.gainNode.gain, 0.01, 'instant', true);

    //input/output node
        this.in = function(){return flow.gainNode.node;}
        this.out = function(a){return flow.gainNode.node;}

    //controls
        this.gain = function(value){
            if(value == undefined){ return flow.gainNode.gain; }
            flow.gainNode.gain = value;
            _canvas_.library.audio.changeAudioParam(context, flow.gainNode.node.gain, flow.gainNode.gain, 0.01, 'instant', true);
        };
};