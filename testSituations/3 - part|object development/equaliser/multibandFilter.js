parts.circuits.audio.multibandFilter = function(
    context, bandcount
){
    //flow chain
        var flow = {
            inAggregator: {},
            filterNodes: [],
            outAggregator: {},
        };

    //inAggregator
        flow.inAggregator.gain = 1;
        flow.inAggregator.node = context.createGain();
        __globals.utility.audio.changeAudioParam(context,flow.inAggregator.node.gain, flow.inAggregator.gain, 0.01, 'instant', true);

    //filterNodes
        for(var a = 0; a < bandcount; a++){
            var temp = { frequency:110, q:0.1, gain:1, filterNode:context.createBiquadFilter(), gainNode:context.createGain() };
            temp.filterNode.connect(temp.gainNode);
            temp.filterNode.type = 'bandpass';
            __globals.utility.audio.changeAudioParam(context, temp.filterNode.frequency,110,0.01,'instant',true);
            __globals.utility.audio.changeAudioParam(context, temp.filterNode.Q,0.1,0.01,'instant',true);
            __globals.utility.audio.changeAudioParam(context, temp.gainNode.gain, temp.gain, 0.01, 'instant', true);
            flow.filterNodes.push(temp);
        }

    //outAggregator
        flow.outAggregator.gain = 1;
        flow.outAggregator.node = context.createGain();
        __globals.utility.audio.changeAudioParam(context,flow.outAggregator.node.gain, flow.outAggregator.gain, 0.01, 'instant', true);



    //do connections
        for(var a = 0; a < bandcount; a++){
            flow.inAggregator.node.connect(flow.filterNodes[a].filterNode);
            flow.filterNodes[a].gainNode.connect(flow.outAggregator.node);
        }

    //input/output node
        this.in = function(){return flow.inAggregator.node;}
        this.out = function(){return flow.outAggregator.node;}

    //controls
        this.masterGain = function(value){
            if(value == undefined){return flow.outAggregator.gain;}
            flow.outAggregator.gain = value;
            __globals.utility.audio.changeAudioParam(context,flow.outAggregator.node.gain, flow.outAggregator.gain, 0.01, 'instant', true);
        };
        this.gain = function(band, value){
            if(value == undefined){return flow.filterNodes[band].gain;}
            flow.filterNodes[band].gain = value;
            __globals.utility.audio.changeAudioParam(context, flow.filterNodes[band].gainNode.gain, flow.filterNodes[band].gain, 0.01, 'instant', true);
        };
        this.frequency = function(band, value){
            if(value == undefined){return flow.filterNodes[band].frequency;}
            flow.filterNodes[band].frequency = value;
            __globals.utility.audio.changeAudioParam(context, flow.filterNodes[band].filterNode.frequency,flow.filterNodes[band].frequency,0.01,'instant',true);
        };
        this.Q = function(band, value){ 
            if(value == undefined){return flow.filterNodes[band].Q;}
            flow.filterNodes[band].Q = value;
            __globals.utility.audio.changeAudioParam(context, flow.filterNodes[band].filterNode.Q,value,0.01,'instant',true);
        };
        this.measureFrequencyResponse = function(band, start,end,step){
            var frequencyArray = [];
            for(var a = start; a < end; a += step){frequencyArray.push(a);}
        
            return this.measureFrequencyResponse_values(band, frequencyArray);
        };
        this.measureFrequencyResponse_allBands = function(start,end,step){
            var frequencyArray = [];
            for(var a = start; a < end; a += step){frequencyArray.push(a);}
        
            var outputArray = [];
            for(var a = 0; a < bandcount; a++){
                outputArray.push(this.measureFrequencyResponse_values(a, frequencyArray));
            }
            return outputArray;
        };
        this.measureFrequencyResponse_values = function(band, frequencyArray){
            var Float32_frequencyArray = new Float32Array(frequencyArray);
            var magResponseOutput = new Float32Array(Float32_frequencyArray.length);
            var phaseResponseOutput = new Float32Array(Float32_frequencyArray.length);

            flow.filterNodes[band].filterNode.getFrequencyResponse(Float32_frequencyArray,magResponseOutput,phaseResponseOutput);
            
            return [magResponseOutput.map(a => a*flow.filterNodes[band].gain*flow.outAggregator.gain),frequencyArray];
        };
        this.measureFrequencyResponse_values_allBands = function(frequencyArray){
            var outputArray = [];
            for(var a = 0; a < bandcount; a++){ outputArray.push(this.measureFrequencyResponse_values(a,frequencyArray)); }
            return outputArray;
        };
};