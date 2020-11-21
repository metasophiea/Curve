this.lagProcessor = function(
    context
){
    //lagProcessorNode
        const lagProcessorNode = new _canvas_.library.audio.audioWorklet.production.wasm.lagProcessor(context);

    //input/output node
        this.in = function(){return lagProcessorNode;}
        this.out = function(){return lagProcessorNode;}

    //shutdown
        this.shutdown = function(){
            lagProcessorNode.shutdown();
        }

    //controls
        this.samples = function(value){
            if(value == undefined){ return lagProcessorNode.samples; }
            lagProcessorNode.samples = value;
        };
};