this.filterUnit = function(
    context
){
    //flow chain
        const flow = {
            inAggregator: {},
            filterNode: {},
            outAggregator: {},
        };

    //inAggregator
        flow.inAggregator.gain = 1;
        flow.inAggregator.node = context.createGain();
        _canvas_.library.audio.changeAudioParam(context,flow.inAggregator.node.gain, flow.inAggregator.gain, 0.01, 'instant', true);

    //filterNode
        flow.filterNode.node = context.createBiquadFilter();
	    flow.filterNode.node.type = "lowpass";
        _canvas_.library.audio.changeAudioParam(context, flow.filterNode.node.frequency,110,0.01,'instant',true);
        _canvas_.library.audio.changeAudioParam(context, flow.filterNode.node.gain,1,0.01,'instant',true);
        _canvas_.library.audio.changeAudioParam(context, flow.filterNode.node.Q,0.1,0.01,'instant',true);

    //outAggregator
        flow.outAggregator.gain = 1;
        flow.outAggregator.node = context.createGain();
        _canvas_.library.audio.changeAudioParam(context,flow.outAggregator.node.gain, flow.outAggregator.gain, 0.01, 'instant', true);


    //do connections
        flow.inAggregator.node.connect(flow.filterNode.node);
        flow.filterNode.node.connect(flow.outAggregator.node);

    //input/output node
        this.in = function(){
            return flow.inAggregator.node;
        }
        this.out = function(){
            return flow.outAggregator.node;
        }

    //methods
        this.type = function(type){
            flow.filterNode.node.type = type;
        };
        this.frequency = function(value){
            _canvas_.library.audio.changeAudioParam(context, flow.filterNode.node.frequency,value,0.01,'instant',true);
        };
        this.gain = function(value){
            _canvas_.library.audio.changeAudioParam(context, flow.filterNode.node.gain,value,0.01,'instant',true);
        };
        this.Q = function(value){
            _canvas_.library.audio.changeAudioParam(context, flow.filterNode.node.Q,value,0.01,'instant',true);
        };
        this.measureFrequencyResponse = function(start,end,step){
            const frequencyArray = [];
            for(let a = start; a < end; a += step){frequencyArray.push(a);}
        
            return this.measureFrequencyResponse_values(frequencyArray);
        };
        this.measureFrequencyResponse_values = function(frequencyArray){
            const Float32_frequencyArray = new Float32Array(frequencyArray);
            const magResponseOutput = new Float32Array(Float32_frequencyArray.length);
            const phaseResponseOutput = new Float32Array(Float32_frequencyArray.length);
        
            flow.filterNode.node.getFrequencyResponse(Float32_frequencyArray,magResponseOutput,phaseResponseOutput);
            return [magResponseOutput,frequencyArray];
        };
};
