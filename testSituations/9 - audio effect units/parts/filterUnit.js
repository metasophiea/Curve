parts.audio.filterUnit = function(
    context
){
    //flow chain
        var flow = {
            inAggregator: {},
            filterNode: {},
            outAggregator: {},
        };

    //inAggregator
        flow.inAggregator.gain = 1;
        flow.inAggregator.node = context.createGain();
        __globals.utility.audio.changeAudioParam(context,flow.inAggregator.node.gain, flow.inAggregator.gain, 0.01, 'instant', true);

    //filterNode
        flow.filterNode.node = context.createBiquadFilter();
	    flow.filterNode.node.type = "highpass";
        flow.filterNode.node.frequency.value = 1000;
        flow.filterNode.node.gain.value = 0.1;
        flow.filterNode.node.Q.value = 10000;


    //outAggregator
        flow.outAggregator.gain = 1;
        flow.outAggregator.node = context.createGain();    
        __globals.utility.audio.changeAudioParam(context,flow.outAggregator.node.gain, flow.outAggregator.gain, 0.01, 'instant', true);


    //do connections
        flow.inAggregator.node.connect(flow.filterNode.node);
        flow.filterNode.node.connect(flow.outAggregator.node);

    //input/output node
        this.in = function(){return flow.inAggregator.node;}
        this.out = function(){return flow.outAggregator.node;}
};