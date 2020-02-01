class testWorklet extends AudioWorkletProcessor{
    static get parameterDescriptors(){
        return [
            {
                name: 'valueA',
                defaultValue: 10,
                minValue: 1,
                maxValue: 100,
                automationRate: 'a-rate', //use the array
            },{
                name: 'valueB',
                defaultValue: 10,
                minValue: 1,
                maxValue: 100,
                automationRate: 'k-rate', //use only the first value in the array
            }
        ];
    }
    
    constructor(options){
        super(options);
        this._lastUpdate = currentTime;
        this._callCount = 0;
    }

    process(inputs, outputs, parameters){
        this._callCount++;
        if( currentTime - this._lastUpdate >= 1 ){
            console.log('----');
            console.log('currentTime:',currentTime);
            console.log('calls since last printing:',this._callCount);
            console.log(' - number of inputs:',inputs.length);
            inputs.forEach((input,index) => {
                console.log('   '+index+' : streams:',input.length,': samples per stream:',input.map(a => a.length));
            });
            console.log(' - number of outputs:',outputs.length);
            outputs.forEach((output,index) => {
                console.log('   '+index+' : streams:',output.length,': samples per stream:',output.map(a => a.length));
            });

            console.log( 'parameters.valueA:',parameters.valueA );
            console.log( 'parameters.valueB:',parameters.valueB );

            this._lastUpdate = currentTime;
            this._callCount = 0;
            return false;
        }




        const input = inputs[0];
        const output = outputs[0];
    
        for(let channel = 0; channel < input.length; channel++){
            const inputChannel = input[channel];
            const outputChannel = output[channel];
    
            for(let a = 0; a < inputChannel.length; a++){
                outputChannel[a] = inputChannel[a];
            }
        }
        return true;
    }
}
registerProcessor('testWorklet', testWorklet);