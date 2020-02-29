class momentaryAmplitudeMeter extends AudioWorkletProcessor{
    static get parameterDescriptors(){
        return [
            {
                name: 'fullSample',
                defaultValue: 0, // 0 - only use the current frame / 1 - collect and use all the data from every frame since the last time a value was returned
                minValue: 0,
                maxValue: 1,
                automationRate: 'k-rate',
            },{
                name: 'updateMode',
                defaultValue: 0, // 0 - by timer / 1 - by request
                minValue: 0,
                maxValue: 1,
                automationRate: 'k-rate',
            },{
                name: 'updateDelay',
                defaultValue: 100,
                minValue: 1,
                maxValue: 1000,
                automationRate: 'k-rate',
            },{
                name: 'calculationMode',
                defaultValue: 3, //max, min, average, absMax, absMin, absAverage
                minValue: 0,
                maxValue: 5,
                automationRate: 'k-rate',
            }
        ];
    }

    constructor(options){
        super(options);
        const self = this;
        this._lastUpdate = currentTime;
        this._dataArray = [];
        this._readingRequested = false;

        this.port.onmessage = function(event){
            if(event.data == 'readingRequest'){
                self._readingRequested = true;
            }
        };
        this.port.start();
    }

    process(inputs, outputs, parameters){
        const input = inputs[0];
        const fullSample = parameters.fullSample[0];
        const updateDelay = parameters.updateDelay[0];
        const calculationMode = parameters.calculationMode[0];

        if(fullSample){
            this._dataArray.push(...input[0]);
        }else{
            this._dataArray = new Array(...input[0]);
        }

        if( 
            (parameters.updateMode[0] == 0 && (currentTime - this._lastUpdate > updateDelay/1000)) ||
            (parameters.updateMode[0] == 1 && this._readingRequested)
        ){
            this._readingRequested = false;
            this._lastUpdate = currentTime;

            switch(calculationMode[0]){
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

            if(fullSample){
                this._dataArray = [];
            }
        }

        return true;
    }
}
registerProcessor('momentaryAmplitudeMeter', momentaryAmplitudeMeter);