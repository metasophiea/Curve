// this.gain = function(
//     context
// ){
//     //flow
//         //flow chain
//             const flow = {
//                 gainNode:{}
//             };

//     //gainNode
//         flow.gainNode.gain = 1;
//         flow.gainNode.node = context.createGain();    
//         _canvas_.library.audio.changeAudioParam(context, flow.gainNode.node.gain, flow.gainNode.gain, 0.01, 'instant', true);

//     //input/output node
//         this.in = function(){return flow.gainNode.node;}
//         this.out = function(a){return flow.gainNode.node;}

//     //controls
//         this.gain = function(value){
//             if(value == undefined){ return flow.gainNode.gain; }
//             flow.gainNode.gain = value;
//             _canvas_.library.audio.changeAudioParam(context, flow.gainNode.node.gain, flow.gainNode.gain, 0.01, 'instant', true);
//         };
// };


this.gain = function(
    context
){
    //flow
        //flow chain
            const flow = {
                controlIn:{},
                gain:{}
            };

        //controlIn
            flow.controlIn = {
                node: new _canvas_.library.audio.audioWorklet.production.only_js.nothing(context),
            };
        //gain
            flow.gain = {
                mode: false,
                gain: 1,
                node: new _canvas_.library.audio.audioWorklet.production.wasm.gain(context),
            };

        flow.controlIn.node.connect(flow.gain.node, undefined, 1);

    //input/output
        this.in = function(){return flow.gain.node;}
        this.out = function(){return flow.gain.node;}
        this.control = function(){return flow.controlIn.node;}

    //controls
        this.mode = function(value){
            if(value == undefined){ return flow.gain.mode; }
            flow.gain.mode = value;
            flow.gain.node.mode = value;
        };
        this.gain = function(value){
            if(value == undefined){ return flow.gain.gain; }
            flow.gain.gain = value;
            _canvas_.library.audio.changeAudioParam(context, flow.gain.node.gain, value, 0.01, 'instant', true);
        };
};