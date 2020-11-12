class osc_1 extends AudioWorkletNode{
    constructor(context, options={}){
        options.numberOfInputs = 2;
        options.numberOfOutputs = 1;
        options.channelCount = 1;
        super(context, 'osc_1', options);

        this.data = function(value){
            this.port.postMessage(value);
        };
    }

    get frequency(){
        return this.parameters.get('frequency');
    }
    get gain(){
        return this.parameters.get('gain');
    }
    get detune(){
        return this.parameters.get('detune');
    }
}