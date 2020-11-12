class testWorklet extends AudioWorkletProcessor{
    static MinimumValue = -10;

    #privateValue = 100;

    static get parameterDescriptors(){
        return [
            {
                name: 'valueA',
                defaultValue: 10,
                minValue: 1,
                maxValue: 100,
                automationRate: 'a-rate', //you should use the array, it's the same length as the block
            },{
                name: 'valueB',
                defaultValue: 10,
                minValue: 1,
                maxValue: 100,
                automationRate: 'k-rate', //you should use only the first value in the array
            }
        ];
    }
    
    constructor(options){
        super(options);
        console.log('<<< constructor >>>');
        console.log('options:',options);

        this._lastUpdate = currentTime;
        this._callCount = 0;

        this.port.onmessage = function(event){
            console.log('worklet.port.onmessage',event);
        };
    }

    process(inputs, outputs, parameters){
        this._callCount++;
        if( currentTime - this._lastUpdate >= 1 ){
            console.log('<<< process >>>');
            console.log('currentTime:',currentTime);
            console.log('currentFrame:',currentFrame);
            console.log('calls since last printing:',this._callCount);
            console.log('samples since last printing:',this._callCount*outputs[0][0].length);
            console.log(' - number of inputs:',inputs.length);
            inputs.forEach((input,index) => {
                console.log('   '+index+' : streams:',input.length,': samples per stream:',input.map(a => a.length));
            });
            console.log(' - number of outputs:',outputs.length);
            outputs.forEach((output,index) => {
                console.log('   '+index+' : streams:',output.length,': samples per stream:',output.map(a => a.length));
            });

            console.log( 'parameters:',parameters );
            console.log( 'parameters.valueA:',parameters.valueA );
            console.log( 'parameters.valueB:',parameters.valueB );

            // console.log( testWorklet.MinimumValue );
            // console.log( this.#privateValue );

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





































// class squareWaveGenerator extends AudioWorkletProcessor{
//     static get parameterDescriptors(){
//         return [];
//     }

//     constructor(options){
//         super(options);
//         this._frequency = 440;
//         this._phaseMux = (2*this._frequency) / sampleRate;
//     }

//     process(inputs, outputs, parameters){
//         const output = outputs[0];
        
//         for(let channel = 0; channel < output.length; channel++){
//             for(let a = 0; a < output[channel].length; a++){
//                 output[channel][a] = Math.sin( Math.PI * this._phaseMux * (currentFrame+a) );
//             }
//         }
//         return true;
//     }
// }
// registerProcessor('squareWaveGenerator', squareWaveGenerator);


















































// class squareWaveGenerator extends AudioWorkletProcessor{
//     static get parameterDescriptors(){
//         return [];
//     }

//     constructor(options){
//         super(options);

//         this._frequency = 440;
//         this._dutyCycle = 0.5;
//         this._frameCount = 0;

//         this._flip = false;

//         // this._data = [];
//     }

//     process(inputs, outputs, parameters){
//         const samplingRate = sampleRate;
//         const output = outputs[0];
        
//         // for(let channel = 0; channel < output.length; channel++){
//         //     for(let a = 0; a < output[channel].length; a++){
//         //         if( this._sampleCount >= samplingRate / (this._frequency*2) ){
//         //             this._sampleCount = 0;
//         //             this._flip = !this._flip;
//         //         }else{
//         //             this._sampleCount++; 
//         //         }
//         //         output[channel][a] = (this._flip ? 1 : 0) * 0.25
//         //     }
//         // }



//         const phaseMux = (2*this._frequency) / samplingRate;
//         function sineWave(sampleNumber){
//             return Math.sin( Math.PI * phaseMux * sampleNumber );
//         }
//         for(let channel = 0; channel < output.length; channel++){
//             for(let a = 0; a < output[channel].length; a++){
//                 output[channel][a] = sineWave(currentFrame+a);
//             }
//             // this._data.push(...output[channel]);

//             // if( this._sampleCount >= samplingRate ){
//             //     this._sampleCount = 0;
//             //     // console.log(this._data);
//             //     // return false;
//             // }





//             // if( this._sampleCount >= 500 ){
//             //     console.log( JSON.stringify(this._data) );
//             //     return false;
//             // }
//         }




//         // // for(let a = 0; a < outputs[0][0].length; a++){
//         // //     this._sampleCount++;
//         // // }
//         // // if( this._sampleCount%44160 == 0 ){
//         // //     console.log( currentTime, this._sampleCount );
//         // // }
//         // if( this._frameCount%345 == 0 ){
//         //     console.log( currentTime, this._frameCount, samplingRate );
//         // }

//         // for(let channel = 0; channel < output.length; channel++){
//         //     for(let a = 0; a < output[channel].length/2; a++){
//         //         output[channel][a] = 1;
//         //     }
//         //     for(let a = output[channel].length/2; a < output[channel].length; a++){
//         //         output[channel][a] = -1;
//         //     }
//         // }

//         this._frameCount++;
//         return true;
//     }
// }
// registerProcessor('squareWaveGenerator', squareWaveGenerator);





// samplingRate = 44160
//1hz = a complete waveform takes 44160 samples
//2hz = a complete waveform takes 22080 samples
//10hz = a complete waveform takes 4416 samples
//80hz = a complete waveform takes 552 samples
//100hz = a complete waveform takes 441.6 samples
//400hz = a complete waveform takes 110.4 samples
//440hz = a complete waveform takes 100.3636... samples
//480hz = a complete waveform takes 92 samples

// samples that a complete waveform takes = samplingRate / frequency of wave
// frequency of wave = samplingRate / samples that a complete waveform takes
// frequency of wave * samples that a complete waveform takes = samplingRate

// 441.6hz = a complete waveform takes 100 samples
// 437.2277227722772hz = a complete waveform takes 101 samples
