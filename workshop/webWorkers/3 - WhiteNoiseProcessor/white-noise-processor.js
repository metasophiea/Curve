// class WhiteNoiseProcessor extends AudioWorkletProcessor {
//     static value = 0;
//     static showValue(){
//         return value;
//     }

//     process(inputs, outputs, parameters){
//         const output = outputs[0]
//         output.forEach(channel => {
//             for (let i = 0; i < channel.length; i++) {
//                 channel[i] = Math.random() * 2 - 1;
//             }
//         })
//         return true
//     }
// }
  
// registerProcessor('white-noise-processor', WhiteNoiseProcessor)

class WhiteNoiseProcessor extends AudioWorkletProcessor {
    process(inputs, outputs, parameters){
        // take the first output
        const output = outputs[0];
        // fill each channel with random values multiplied by gain
        output.forEach(channel => {
            for (let i = 0; i < channel.length; i++) {
            // generate random value for each sample
            // Math.random range is [0; 1); we need [-1; 1]
            // this won't include exact 1 but is fine for now for simplicity
            channel[i] = (Math.random() * 2 - 1) *
                // the array can contain 1 or 128 values
                // depending on if the automation is present
                // and if the automation rate is k-rate or a-rate
                (parameters['customGain'].length > 1 ? parameters['customGain'][i] : parameters['customGain'][0]);
            }
        })
        // as this is a source node which generates its own output,
        // we return true so it won't accidentally get garbage-collected
        // if we don't have any references to it in the main thread
        return true;
    }
        // define the customGain parameter used in process method
    static get parameterDescriptors(){
        return [{
            name: 'customGain',
            defaultValue: 1,
            minValue: 0,
            maxValue: 1,
            automationRate: 'a-rate'
        }];
    }
}
registerProcessor('white-noise-processor', WhiteNoiseProcessor);