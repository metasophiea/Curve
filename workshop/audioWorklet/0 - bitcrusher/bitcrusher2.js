class Bitcrusher extends AudioWorkletProcessor {
  static get parameterDescriptors(){
    return [{
      name: 'bitDepth',
      defaultValue: 12,
      minValue: 1,
      maxValue: 16
    },{
      name: 'frequencyReduction',
      defaultValue: 0.5,
      minValue: 0,
      maxValue: 1
    }];
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

      let prev = 0;
      for(let i = 0; i < inputChannel.length; i++){
        // if(i%8 == 0){
          prev = inputChannel[i];
        // }
        outputChannel[i] = prev;
      }
    }
    return true;
  }
}

registerProcessor('bitcrusher', Bitcrusher);