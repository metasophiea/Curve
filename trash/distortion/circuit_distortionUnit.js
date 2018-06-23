parts.audio.distortionUnit = function(
    context,
){
    //flow chain
    var flow = {
        inAggregator: {},
        distortionNode: {},
        outAggregator: {},
    };

    //inAggregator
        flow.inAggregator.gain = 0;
        flow.inAggregator.node = context.createGain();
        __globals.utility.audio.changeAudioParam(context,flow.inAggregator.node.gain, flow.inAggregator.gain, 0.01, 'instant', true);

    //distortionNode
        flow.distortionNode.distortionAmount = 0;
        flow.distortionNode.oversample = 'none'; //'none', '2x', '4x'
        flow.distortionNode.resolution = 100;
        function makeDistortionNode(){
            flow.inAggregator.node.disconnect();
            if(flow.distortionNode.node){flow.distortionNode.node.disconnect();}
            
            flow.distortionNode.node = context.createWaveShaper();
                flow.distortionNode.curve = new Float32Array(__globals.utility.math.curveGenerator.s(flow.distortionNode.resolution,-1,1,flow.distortionNode.distortionAmount));
                flow.distortionNode.node.curve = flow.distortionNode.curve;
                flow.distortionNode.node.oversample = flow.distortionNode.oversample;
                
            flow.inAggregator.node.connect(flow.distortionNode.node);
            flow.distortionNode.node.connect(flow.outAggregator.node);
        }

    //outAggregator
        flow.outAggregator.gain = 0;
        flow.outAggregator.node = context.createGain();    
        __globals.utility.audio.changeAudioParam(context,flow.outAggregator.node.gain, flow.outAggregator.gain, 0.01, 'instant', true);


    //input/output node
        this.in = function(){return flow.inAggregator.node;}
        this.out = function(){return flow.outAggregator.node;}

    //controls
        this.inGain = function(a){
            if(a==null){return flow.inAggregator.gain;}
            flow.inAggregator.gain=a;
            __globals.utility.audio.changeAudioParam(context,flow.inAggregator.node.gain, a, 0.01, 'instant', true);
        };
        this.outGain = function(a){
            if(a==null){return flow.outAggregator.gain;}
            flow.outAggregator.gain=a;
            __globals.utility.audio.changeAudioParam(context,flow.outAggregator.node.gain, a, 0.01, 'instant', true);
        };
        this.distortionAmount = function(a){
            if(a==null){return flow.distortionNode.distortionAmount;}
            flow.distortionNode.distortionAmount=a;
            makeDistortionNode();
        };
        this.oversample = function(a){
            if(a==null){return flow.distortionNode.oversample;}
            flow.distortionNode.oversample=a;
            makeDistortionNode();
        };
        this.resolution = function(a){
            if(a==null){return flow.distortionNode.resolution;}
            flow.distortionNode.resolution = a>=2?a:2;
            makeDistortionNode();
        };

    //setup
        makeDistortionNode();
};