class nothing extends AudioWorkletProcessor{
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
        
        const input = inputs[0];
        const output = outputs[0];

        for(let channel = 0; channel < input.length; channel++){
            output[channel].set(input[channel]);
        }

        return true;
    }
}
registerProcessor('nothing', nothing);