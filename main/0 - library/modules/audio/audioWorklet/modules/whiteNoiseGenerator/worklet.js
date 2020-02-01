class whiteNoiseGenerator extends AudioWorkletProcessor{
    static get parameterDescriptors(){
        return [];
    }
    
    constructor(options){
        super(options);
    }

    process(inputs, outputs, parameters){
        const output = outputs[0];

        for(let channel = 0; channel < output.length; channel++){
            for(let a = 0; a < output[channel].length; a++){
                output[channel][a] = Math.random()*2 - 1;
            }
        }

        return true;
    }
}
registerProcessor('whiteNoiseGenerator', whiteNoiseGenerator);