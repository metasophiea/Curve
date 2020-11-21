class stableAmplitudeGenerator extends AudioWorkletProcessor{
    static get parameterDescriptors(){
        return [
            {
                name: 'amplitude',
                defaultValue: 0,
                minValue: -1,
                maxValue: 1,
                automationRate: 'k-rate',
            }
        ];
    }

    constructor(options){
        //construct class instance
            super(options);

        //instance state
            this.shutdown = false;

        //setup message receiver
            const self = this;
            this.port.onmessage = function(event){
                switch(event.data.command){
                    //shutdown
                        case 'shutdown':
                            self.shutdown = true;
                        break;
                }
            };
    }

    process(inputs, outputs, parameters){
        if(this.shutdown){ return false; }

        const output = outputs[0];

        for(let channel = 0; channel < output.length; channel++){
            for(let a = 0; a < output[channel].length; a++){
                output[channel][a] = parameters.amplitude[0];
            }
        }

        return true;
    }
}
registerProcessor('stableAmplitudeGenerator', stableAmplitudeGenerator);