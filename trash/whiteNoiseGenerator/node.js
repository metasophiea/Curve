class whiteNoiseGenerator extends AudioWorkletNode{
    constructor(context, options={}){
        //populate options
            options.numberOfInputs = 0;
            options.numberOfOutputs = 1;
            options.channelCount = 1;

        //generate class instance
            super(context, 'whiteNoiseGenerator', options);

        //shutdown
            this.shutdown = function(){
                this.port.postMessage({command:'shutdown', value:undefined});
                this.port.close();
            };
    }
}