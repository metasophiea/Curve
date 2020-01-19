class momentaryAmplitudeMeter extends AudioWorkletProcessor{
    static get parameterDescriptors(){
        return [
            {
                name: 'updateDelay',
                defaultValue: 100,
                minValue: 1,
                maxValue: 1000,
                automationRate: 'a-rate',
            },
            {
                name: 'calculationMode',
                defaultValue: 3, //max, min, average, absMax, absMin, absAverage
                minValue: 0,
                maxValue: 5,
                automationRate: 'a-rate',
            }
        ];
    }

    constructor(options) {
        super(options);
        this._lastUpdate = currentTime;
        this._dataArray = [];
    }

    process(inputs, outputs, parameters){
        const input = inputs[0];
        const updateDelay = parameters.updateDelay;
        const calculationMode = parseInt(parameters.calculationMode);

        if(currentTime - this._lastUpdate > updateDelay/1000){
            this._lastUpdate = currentTime;

            switch(calculationMode){
                case 0: default:
                    this.port.postMessage( Math.max(...this._dataArray) );
                break;
                case 1:
                    this.port.postMessage( Math.min(...this._dataArray) );
                break;
                case 2:
                    this.port.postMessage( this._dataArray.reduce((a,b) => a + b, 0) / this._dataArray.length );
                break;
                case 3:
                    this.port.postMessage( Math.max(...(this._dataArray).map(a => Math.abs(a)) ) );
                break;
                case 4:
                    this.port.postMessage( Math.min(...(this._dataArray).map(a => Math.abs(a)) ) );
                break;
                case 5:
                    this.port.postMessage( this._dataArray.map(a => Math.abs(a)).reduce((a,b) => a + b, 0) / this._dataArray.length );
                break;
            }

            this._dataArray = [];
        }else{
            this._dataArray.push(...input[0]);
        }

        return true;
    }
}
registerProcessor('momentaryAmplitudeMeter', momentaryAmplitudeMeter);