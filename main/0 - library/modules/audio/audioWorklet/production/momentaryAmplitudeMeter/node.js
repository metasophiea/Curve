class momentaryAmplitudeMeter extends AudioWorkletNode{
    constructor(context, options={}){
        options.numberOfInputs = 1;
        options.numberOfOutputs = 0;
        options.channelCount = 1;
        super(context, 'momentaryAmplitudeMeter', options);

        const self = this;

        this._fullSample = false;
        this._updateDelay = 100;
        this._calculationMode = 3;

        this.reading = function(){};

        this.port.onmessage = function(event){
            try{
                self.reading(event.data);
            }catch(error){}
        };
        this.port.start();
    }

    get fullSample(){
        return this._fullSample;
    }
    set fullSample(value){
        this._fullSample = value;
        this.parameters.get('fullSample').setValueAtTime(this._fullSample?1:0,0);
    }

    get updateDelay(){
        return this._updateDelay;
    }
    set updateDelay(value){
        this._updateDelay = value;
        this.parameters.get('updateDelay').setValueAtTime(this._updateDelay);
    }

    get calculationMode(){
        return this._calculationMode;
    }
    set calculationMode(value){
        this._calculationMode = value;
        this.parameters.get('calculationMode').setValueAtTime(this._calculationMode);
    }
}