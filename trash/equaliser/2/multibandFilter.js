// parts.circuits.audio.multibandFilter = function(
//     context, bandcount
// ){
//     //flow chain
//         var flow = {
//             inAggregator: {},
//             filterNodes: [],
//             gainNodes: [],
//             outAggregator: {},
//         };

//         //inAggregator
//             flow.inAggregator.gain = 1;
//             flow.inAggregator.node = context.createGain();
//             __globals.utility.audio.changeAudioParam(context,flow.inAggregator.node.gain, flow.inAggregator.gain, 0.01, 'instant', true);

//         //filterNodes
//             for(var a = 0; a < bandcount; a++){
//                 var temp = { frequency:110, Q:0.1, node:context.createBiquadFilter() };
//                 temp.node.type = 'bandpass';
//                 __globals.utility.audio.changeAudioParam(context, temp.node.frequency,110,0.01,'instant',true);
//                 __globals.utility.audio.changeAudioParam(context, temp.node.Q,0.1,0.01,'instant',true);
//                 flow.filterNodes.push(temp);
//             }

//         //gainNodes
//             for(var a = 0; a < bandcount; a++){
//                 var temp = { gain:1, node:context.createGain() };
//                 __globals.utility.audio.changeAudioParam(context, temp.node.gain, temp.gain, 0.01, 'instant', true);
//                 flow.gainNodes.push(temp);
//             }

//         //outAggregator
//             flow.outAggregator.gain = 1;
//             flow.outAggregator.node = context.createGain();
//             __globals.utility.audio.changeAudioParam(context,flow.outAggregator.node.gain, flow.outAggregator.gain, 0.01, 'instant', true);


//     //do connections
//         for(var a = 0; a < bandcount; a++){
//             flow.inAggregator.node.connect(flow.filterNodes[a].node);
//             flow.filterNodes[a].node.connect(flow.gainNodes[a].node);
//             flow.gainNodes[a].node.connect(flow.outAggregator.node);
//         }


//     //input/output node
//         this.in = function(){return flow.inAggregator.node;}
//         this.out = function(){return flow.outAggregator.node;}


//     //controls
//         this.masterGain = function(value){
//             if(value == undefined){return flow.outAggregator.gain;}
//             flow.outAggregator.gain = value;
//             __globals.utility.audio.changeAudioParam(context,flow.outAggregator.node.gain, flow.outAggregator.gain, 0.01, 'instant', true);
//         };
//         this.gain = function(band,value){
//             if(value == undefined){return flow.gainNodes[band].gain;}
//             flow.gainNodes[band].gain = value;
//             __globals.utility.audio.changeAudioParam(context, flow.gainNodes[band].node.gain, flow.gainNodes[band].gain, 0.01, 'instant', true);
//         };
//         this.frequency = function(band,value){
//             if(value == undefined){return flow.filterNodes[band].frequency;}
//             flow.filterNodes[band].frequency = value;
//             __globals.utility.audio.changeAudioParam(context, flow.filterNodes[band].node.frequency,flow.filterNodes[band].frequency,0.01,'instant',true);
//         };
//         this.Q = function(band,value){
//             if(value == undefined){return flow.filterNodes[band].Q;}
//             flow.filterNodes[band].Q = value;
//             __globals.utility.audio.changeAudioParam(context, flow.filterNodes[band].node.Q,flow.filterNodes[band].Q,0.01,'instant',true);
//         };

//         this.kick = function(band){
//             console.log(band);
//             if(band == undefined){for(var a = 0; a < bandcount; a++){this.kick(a);}return;}
//             __globals.utility.audio.changeAudioParam(context, flow.gainNodes[band].node.gain, flow.gainNodes[band].gain, 0.01, 'instant', true);
//             __globals.utility.audio.changeAudioParam(context, flow.filterNodes[band].node.frequency,flow.filterNodes[band].frequency,0.01,'instant',true);
//             __globals.utility.audio.changeAudioParam(context, flow.filterNodes[band].node.Q,flow.filterNodes[band].Q,0.01,'instant',true);
//         };
    
//         this.measureFrequencyResponse = function(band, frequencyArray){
//             //if band is undefined, gather the response for all bands
//             if(band == undefined){ return Array(bandcount).fill(0).map((a,i) => this.measureFrequencyResponse(i,frequencyArray)); }

//             var Float32_frequencyArray = new Float32Array(frequencyArray);
//             var magResponseOutput = new Float32Array(Float32_frequencyArray.length);
//             var phaseResponseOutput = new Float32Array(Float32_frequencyArray.length);
//             flow.filterNodes[band].node.getFrequencyResponse(Float32_frequencyArray,magResponseOutput,phaseResponseOutput);
//             return [magResponseOutput.map(a => a*flow.gainNodes[band].gain*flow.outAggregator.gain),frequencyArray];
//         };
// };