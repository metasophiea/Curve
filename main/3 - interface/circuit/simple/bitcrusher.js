this.bitcrusher = function(
    context
){
    //bitcrusherNode
        const bitcrusherNode = new _canvas_.library.audio.audioWorklet.production.wasm.bitcrusher(context);

    //input/output node
        this.in = function(){return bitcrusherNode;}
        this.out = function(a){return bitcrusherNode;}

    //shutdown
        this.shutdown = function(){
            bitcrusherNode.shutdown();
        }

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