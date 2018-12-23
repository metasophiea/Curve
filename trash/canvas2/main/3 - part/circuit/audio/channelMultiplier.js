this.channelMultiplier = function(
    context, outputCount=2
){
    //flow
        //flow chain
            var flow = {
                in: {},
                outs:[],
                out_0: {}, out_1: {},
            };
        
        //in
            flow.in.gain = 1;
            flow.in.node = context.createGain();    
            canvas.library.audio.changeAudioParam(context,flow.in.node.gain, flow.in.gain, 0.01, 'instant', true);

        //outs
            for(var a = 0; a < outputCount; a++){
                var temp = { gain:0.5, node:context.createGain() };
                canvas.library.audio.changeAudioParam(context,temp.node.gain, temp.gain, 0.01, 'instant', true);
                flow.outs.push(temp);
                flow.in.node.connect(temp.node);
            }

    //input/output node
        this.in = function(){return flow.in.node;}
        this.out = function(a){return flow.outs[a].node;}

    //controls
        this.inGain = function(a){
            if(a == undefined){return flow.in.gain;}
            flow.in.gain = a;
            canvas.library.audio.changeAudioParam(context,flow.in.node.gain, flow.in.gain, 0.01, 'instant', true);
        };
        this.outGain = function(a,value){
            if(value == undefined){ return flow.outs[a].gain; }
            flow.outs[a].gain = value;
            canvas.library.audio.changeAudioParam(context,flow.outs[a].node.gain, flow.outs[a].gain, 0.01, 'instant', true);
        };
};
    