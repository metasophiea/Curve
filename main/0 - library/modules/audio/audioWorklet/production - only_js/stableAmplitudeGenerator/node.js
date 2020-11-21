class stableAmplitudeGenerator extends AudioWorkletNode{
    constructor(context, options={}){
        //populate options
            options.numberOfInputs = 0;
            options.numberOfOutputs = 1;
            options.channelCount = 1;

        //generate class instance
            super(context, 'stableAmplitudeGenerator', options);

        //shutdown
            this.shutdown = function(){
                this.port.postMessage({command:'shutdown', value:undefined});
                this.port.close();
            };
    }

    get amplitude(){
        return this.parameters.get('amplitude');
    }
}