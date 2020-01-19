class sqasherDoubler extends AudioWorkletProcessor{
    static get parameterDescriptors(){
        return [];
    }
    
    constructor(options){
        super(options);
    }

    process(inputs, outputs, parameters){
        const input = inputs[0];
        const output = outputs[0];
    
        for(let channel = 0; channel < input.length; channel++){
            const inputChannel = input[channel];
            const outputChannel = output[channel];
    
            for(let a = 0; a < inputChannel.length/2; a++){
                outputChannel[a] = inputChannel[a*2];
                outputChannel[inputChannel.length/2 + a] = inputChannel[a*2];
            }
        }
        return true;
    }
}
registerProcessor('sqasherDoubler', sqasherDoubler);