class nothing extends AudioWorkletNode{
    constructor(context, options={}){
        options.numberOfInputs = 1;
        options.numberOfOutputs = 1;
        options.channelCount = 1;
        super(context, 'nothing', options);

        this.shutdown = function(){
            this.port.postMessage({command:'shutdown'});
            this.port.close();
        };
    }
}