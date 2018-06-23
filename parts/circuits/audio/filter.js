this.filterUnit = function(
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
	    flow.filterNode.node.type = "lowpass";
        __globals.utility.audio.changeAudioParam(context, flow.filterNode.node.frequency,110,0.01,'instant',true);
        __globals.utility.audio.changeAudioParam(context, flow.filterNode.node.gain,1,0.01,'instant',true);
        __globals.utility.audio.changeAudioParam(context, flow.filterNode.node.Q,0.1,0.01,'instant',true);

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

    //methods
        this.type = function(type){flow.filterNode.node.type = type;};
        this.frequency = function(value){__globals.utility.audio.changeAudioParam(context, flow.filterNode.node.frequency,value,0.01,'instant',true);};
        this.gain = function(value){__globals.utility.audio.changeAudioParam(context, flow.filterNode.node.gain,value,0.01,'instant',true);};
        this.Q = function(value){__globals.utility.audio.changeAudioParam(context, flow.filterNode.node.Q,value,0.01,'instant',true);};
        this.measureFrequencyResponse = function(start,end,step){
            var frequencyArray = [];
            for(var a = start; a < end; a += step){frequencyArray.push(a);}
        
            var Float32_frequencyArray = new Float32Array(frequencyArray);
            var magResponseOutput = new Float32Array(Float32_frequencyArray.length);
            var phaseResponseOutput = new Float32Array(Float32_frequencyArray.length);
        
            flow.filterNode.node.getFrequencyResponse(Float32_frequencyArray,magResponseOutput,phaseResponseOutput);
            return [magResponseOutput,frequencyArray];
        };
};
