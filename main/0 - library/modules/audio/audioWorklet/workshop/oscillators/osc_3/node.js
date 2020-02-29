class osc_3 extends AudioWorkletNode{
    constructor(context, options={}){
        options.numberOfInputs = 3;
        options.numberOfOutputs = 1;
        options.channelCount = 1;
        super(context, 'osc_3', options);

        this._modulationSettings = [
            {mux:1,power:1},
            {mux:1,power:1},
        ];

        this.modulationSettings = function(value){
            if(value == undefined){ return this._modulationSettings; }
            this._modulationSettings = value;
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