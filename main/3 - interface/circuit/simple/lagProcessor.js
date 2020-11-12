this.lagProcessor = function(
    context
){
    //lagProcessorNode
        const lagProcessorNode = new _canvas_.library.audio.audioWorklet.production.only_js.lagProcessor(context);

    //input/output node
        this.in = function(){return lagProcessorNode;}
        this.out = function(a){return lagProcessorNode;}

    //controls
        this.samples = function(value){
            if(value == undefined){ return lagProcessorNode.samples; }
            lagProcessorNode.samples = value;
        };
};