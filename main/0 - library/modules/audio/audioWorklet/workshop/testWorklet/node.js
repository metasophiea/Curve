class testWorkerNode extends AudioWorkletNode{
    constructor(context, options={}){
        options.numberOfInputs = 6;
        options.numberOfOutputs = 6;
        options.channelCount = 1;
        super(context, 'testWorklet', options);

        this._superImportantValue = 'farts';

        this.port.onmessage = function(event){
            console.log('worklet.node.onmessage',event);
        };
        this.port.start();
    }

    get superImportantValue(){
        console.log('getting super important value, which happens to be "'+this._superImportantValue+'"');
        return this._superImportantValue;
    }
    set superImportantValue(newValue){
        console.log('the super important value is being changed to "'+newValue+'"');
        this._superImportantValue = newValue;
        this.port.postMessage({ superImportantValue: this._superImportantValue });
    }
    doubleTheSuperImportantValue(){
        console.log('doubling the super important value');
        this._superImportantValue = this._superImportantValue + this._superImportantValue ;
        this.port.postMessage({ superImportantValue: this._superImportantValue });
    }
}