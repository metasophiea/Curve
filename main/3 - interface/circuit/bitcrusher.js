this.bitcrusher = function(
    context
){
    //flow
        //flow chain
            const flow = {
                bitcrusherNode:{}
            };

    //bitcrusherNode
        flow.bitcrusherNode.amplitudeResolution = 10;
        flow.bitcrusherNode.sampleFrequency = 16;
        flow.bitcrusherNode.node = context.createBitcrusher();

    //input/output node
        this.in = function(){return flow.bitcrusherNode.node;}
        this.out = function(a){return flow.bitcrusherNode.node;}

    //controls
        this.amplitudeResolution = function(value){
            if(value == undefined){ return flow.bitcrusherNode.amplitudeResolution; }
            flow.bitcrusherNode.amplitudeResolution = value;
            flow.bitcrusherNode.node.parameters.get('amplitudeResolution').setValueAtTime(value, 0);
        };
        this.sampleFrequency = function(value){
            if(value == undefined){ return flow.bitcrusherNode.sampleFrequency; }
            flow.bitcrusherNode.sampleFrequency = value;
            flow.bitcrusherNode.node.parameters.get('sampleFrequency').setValueAtTime(value, 0);
        };
};