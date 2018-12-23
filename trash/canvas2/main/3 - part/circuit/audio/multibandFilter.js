this.multibandFilter = function(
    context, bandcount, frames=false
){
    //saved values
        var saved = {
            settings:[], //{Q, gain, frequency, fresh(bool)}
            responses:[], //{magResponse, phaseResponse, frequencyArray}
        };

    //flow chain
        var flow = {
            inAggregator: {},
            filterNodes: [],
            gainNodes: [],
            outAggregator: {},
        };

        //inAggregator
            flow.inAggregator.gain = 1;
            flow.inAggregator.node = context.createGain();
            canvas.library.audio.changeAudioParam(context,flow.inAggregator.node.gain, flow.inAggregator.gain, 0.01, 'instant', true);

        //filterNodes
            function makeGenericFilter(type){
                var temp = { frequency:110, Q:0.1, node:context.createBiquadFilter() };
                temp.node.type = type;
                canvas.library.audio.changeAudioParam(context, temp.node.frequency,110,0.01,'instant',true);
                canvas.library.audio.changeAudioParam(context, temp.node.Q,0.1,0.01,'instant',true);
                return temp;
            }

            if(frames){
                if(bandcount < 2){bandcount = 2;}
                //lowpass
                    flow.filterNodes.push(makeGenericFilter('lowpass'));
                //bands
                    for(var a = 1; a < bandcount-1; a++){ flow.filterNodes.push(makeGenericFilter('bandpass')); }
                //highpass
                    flow.filterNodes.push(makeGenericFilter('highpass'));
            }else{
                //bands
                    for(var a = 0; a < bandcount; a++){ flow.filterNodes.push(makeGenericFilter('bandpass')); }
            }

        //gainNodes
            for(var a = 0; a < bandcount; a++){
                var temp = { gain:1, node:context.createGain() };
                canvas.library.audio.changeAudioParam(context, temp.node.gain, temp.gain, 0.01, 'instant', true);
                flow.gainNodes.push(temp);
                saved.settings[a] = { Q:0.1, gain:1, frequency:110, fresh:true };
            }

        //outAggregator
            flow.outAggregator.gain = 1;
            flow.outAggregator.node = context.createGain();
            canvas.library.audio.changeAudioParam(context,flow.outAggregator.node.gain, flow.outAggregator.gain, 0.01, 'instant', true);


    //do connections
        for(var a = 0; a < bandcount; a++){
            flow.inAggregator.node.connect(flow.filterNodes[a].node);
            flow.filterNodes[a].node.connect(flow.gainNodes[a].node);
            flow.gainNodes[a].node.connect(flow.outAggregator.node);
        }


    //input/output node
        this.in = function(){return flow.inAggregator.node;}
        this.out = function(){return flow.outAggregator.node;}


    //controls
        this.masterGain = function(value){
            if(value == undefined){return flow.outAggregator.gain;}
            flow.outAggregator.gain = value;
            canvas.library.audio.changeAudioParam(context,flow.outAggregator.node.gain, flow.outAggregator.gain, 0.01, 'instant', true);
        };
        this.gain = function(band,value){
            if(value == undefined){return flow.gainNodes[band].gain;}
            flow.gainNodes[band].gain = value;
            canvas.library.audio.changeAudioParam(context, flow.gainNodes[band].node.gain, flow.gainNodes[band].gain, 0.01, 'instant', true);

            saved.settings[band].gain = value;
            saved.settings[band].fresh = true;
        };
        this.frequency = function(band,value){
            if(value == undefined){return flow.filterNodes[band].frequency;}
            flow.filterNodes[band].frequency = value;
            canvas.library.audio.changeAudioParam(context, flow.filterNodes[band].node.frequency,flow.filterNodes[band].frequency,0.01,'instant',true);

            saved.settings[band].frequency = value;
            saved.settings[band].fresh = true;
        };
        this.Q = function(band,value){
            if(value == undefined){return flow.filterNodes[band].Q;}
            flow.filterNodes[band].Q = value;
            canvas.library.audio.changeAudioParam(context, flow.filterNodes[band].node.Q,flow.filterNodes[band].Q,0.01,'instant',true);

            saved.settings[band].Q = value;
            saved.settings[band].fresh = true;
        };
    
        this.measureFrequencyResponse = function(band, frequencyArray){
            //if band is undefined, gather the response for all bands
                if(band == undefined){ return Array(bandcount).fill(0).map((a,i) => this.measureFrequencyResponse(i,frequencyArray)); }

            //if band hasn't had it's setttings changed since last time, just return the last values (multiplied by the master gain)
                if(!saved.settings[band].fresh){
                    return [ saved.responses[band].magResponse.map(a => a*flow.outAggregator.gain), saved.responses[band].requencyArray ];
                }

            //do full calculation of band, save and return
                var Float32_frequencyArray = new Float32Array(frequencyArray);
                var magResponseOutput = new Float32Array(Float32_frequencyArray.length);
                var phaseResponseOutput = new Float32Array(Float32_frequencyArray.length);
                flow.filterNodes[band].node.getFrequencyResponse(Float32_frequencyArray,magResponseOutput,phaseResponseOutput);

                saved.responses[band] = {
                    magResponse:magResponseOutput.map(a => a*flow.gainNodes[band].gain), 
                    phaseResponse:phaseResponseOutput, 
                    frequencyArray:frequencyArray,
                };
                saved.settings[band].fresh = false;
                return [magResponseOutput.map(a => a*flow.gainNodes[band].gain*flow.outAggregator.gain),frequencyArray];
        };
};