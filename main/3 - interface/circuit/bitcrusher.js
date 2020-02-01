this.bitcrusher = function(
    context
){
    //bitcrusherNode
        const bitcrusherNode = new _canvas_.library.audio.audioWorklet.bitcrusher(_canvas_.library.audio.context);

    //input/output node
        this.in = function(){return bitcrusherNode;}
        this.out = function(a){return bitcrusherNode;}

    //controls
        this.amplitudeResolution = function(value){
            if(value == undefined){ return bitcrusherNode.amplitudeResolution; }
            bitcrusherNode.amplitudeResolution = value;
        };
        this.sampleFrequency = function(value){
            if(value == undefined){ return bitcrusherNode.sampleFrequency; }
            bitcrusherNode.sampleFrequency = value;
        };
};