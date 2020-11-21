class whiteNoiseGenerator extends AudioWorkletProcessor{
    static get parameterDescriptors(){
        return [];
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
                output[channel][a] = Math.random()*2 - 1;
            }
        }

        return true;
    }
}
registerProcessor('whiteNoiseGenerator', whiteNoiseGenerator);