class lagProcessor extends AudioWorkletProcessor{
    static get parameterDescriptors(){
        return [
            {
                name: 'samples',
                defaultValue: 1,
                minValue: 1,
                maxValue: 100,
                automationRate: 'k-rate',
            }
        ];
    }

    constructor(options){
        super(options);
        this._dataArrayWorkingIndex = 0;
        this._dataArray = [];
    }

    process(inputs, outputs, parameters){
        const input = inputs[0];
        const output = outputs[0];
        const samples = parameters.samples[0];
        const _samplesMinusOne = samples-1;

        if( samples != this._dataArray.length ){
            while( samples > this._dataArray.length ){
                this._dataArray.push(0);
            }
            while( samples < this._dataArray.length ){
                this._dataArray.pop();
            }
        }

        for(let channel = 0; channel < input.length; channel++){ 
            for(let a = 0; a < input[channel].length; a++){
                if(this._dataArrayWorkingIndex < _samplesMinusOne){
                    this._dataArrayWorkingIndex++;
                }else{
                    this._dataArrayWorkingIndex = 0;
                }

                this._dataArray[this._dataArrayWorkingIndex] = input[channel][a];
                output[channel][a] = this._dataArray.reduce((a,b) => a + b) / samples;
            }
        }
        
        return true;
    }
}
registerProcessor('lagProcessor', lagProcessor);