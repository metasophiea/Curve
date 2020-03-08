// class frequencyAmplitudeResponseAnalyser extends AudioWorkletNode{
//     #state = {
//         waveform:0,
//         signalGeneratorGain:1,
//         dutyCycle:0.5,
//         frequency:{
//             range:{ start:100, end:1000 },
//             stepSize:10,
//             timePerStep:0.005,
//         },
//     };

//     constructor(context, options={}){
//         options.numberOfInputs = 1;
//         options.numberOfOutputs = 1;
//         options.channelCount = 1;
//         super(context, 'frequencyAmplitudeResponseAnalyser', options);
//         const self = this;

//         this.port.onmessage = function(event){
//             Object.entries(event.data).forEach(([key,value]) => {
//                 switch(key){
//                     case 'onValue':
//                         if(self.onValue != undefined){ self.onValue(value); }
//                     break;
//                     case 'onCompletion':
//                         if(self.onCompletion != undefined){ self.onCompletion(value); }
//                     break;
//                 }
//             });
//         };

//         this.start = function(){
//             this.port.postMessage('start');
//         };
//         this.stop = function(){
//             this.port.postMessage('stop');
//         };
//         this.clear = function(){
//             this.port.postMessage('clear');
//         };

//         this.onValue = function(){};
//         this.onCompletion = function(){};
//     }

//     get waveform(){
//         return this._state.waveform;
//     }
//     set waveform(value){
//         this._state.waveform = value;
//         this.port.postMessage({waveform:value});
//     }

//     get signalGeneratorGain(){
//         return this._state.signalGeneratorGain;
//     }
//     set signalGeneratorGain(value){
//         this._state.signalGeneratorGain = value;
//         this.port.postMessage({signalGeneratorGain:value});
//     }

//     get dutyCycle(){
//         return this._state.dutyCycle;
//     }
//     set dutyCycle(value){
//         this._state.dutyCycle = value;
//         this.port.postMessage({dutyCycle:value});
//     }

//     get range(){
//         return this._state.frequency.range;
//     }
//     set range(value){
//         if(value.start == undefined){
//             value.start = this._state.frequency.range.start;
//         }
//         if(value.end == undefined){
//             value.end = this._state.frequency.range.end;
//         }

//         this._state.frequency.range = value;
//         this.port.postMessage({
//             'range.start':this._state.frequency.range.start,
//             'range.end':this._state.frequency.range.end,
//         });
//     }

//     get stepSize(){ 
//         return this._state.frequency.stepSize;
//     }
//     set stepSize(value){
//         this._state.frequency.stepSize = value;
//         this.port.postMessage({stepSize:value});
//     }

//     get timePerStep(){ 
//         return this._state.frequency.timePerStep;
//     }
//     set timePerStep(value){
//         this._state.frequency.timePerStep = value;
//         this.port.postMessage({timePerStep:value});
//     }
// }
















class frequencyAmplitudeResponseAnalyser extends AudioWorkletNode{
    constructor(context, options={}){
        options.numberOfInputs = 1;
        options.numberOfOutputs = 1;
        options.channelCount = 1;
        super(context, 'frequencyAmplitudeResponseAnalyser', options);
        const self = this;

        this._state = {
            waveform:'sine',
            signalGeneratorGain:1,
            dutyCycle:0.5,
            frequency:{
                range:{ start:100, end:1000 },
                stepSize:10,
                timePerStep:0.005,
            },
        };

        this.port.onmessage = function(event){
            Object.entries(event.data).forEach(([key,value]) => {
                switch(key){
                    case 'onValue':
                        if(self.onValue != undefined){ self.onValue(value); }
                    break;
                    case 'onCompletion':
                        if(self.onCompletion != undefined){ self.onCompletion(value); }
                    break;
                }
            });
        };

        this.start = function(){
            this.port.postMessage('start');
        };
        this.stop = function(){
            this.port.postMessage('stop');
        };
        this.clear = function(){
            this.port.postMessage('clear');
        };

        this.onValue = function(){};
        this.onCompletion = function(){};
    }

    get waveform(){
        return this._state.waveform;
    }
    set waveform(value){
        this._state.waveform = value;
        this.port.postMessage({waveform:value});
    }

    get signalGeneratorGain(){
        return this._state.signalGeneratorGain;
    }
    set signalGeneratorGain(value){
        this._state.signalGeneratorGain = value;
        this.port.postMessage({signalGeneratorGain:value});
    }

    get dutyCycle(){
        return this._state.dutyCycle;
    }
    set dutyCycle(value){
        this._state.dutyCycle = value;
        this.port.postMessage({dutyCycle:value});
    }

    get range(){
        return this._state.frequency.range;
    }
    set range(value){
        if(value.start == undefined){
            value.start = this._state.frequency.range.start;
        }
        if(value.end == undefined){
            value.end = this._state.frequency.range.end;
        }

        this._state.frequency.range = value;
        this.port.postMessage({
            'range.start':this._state.frequency.range.start,
            'range.end':this._state.frequency.range.end,
        });
    }

    get stepSize(){ 
        return this._state.frequency.stepSize;
    }
    set stepSize(value){
        this._state.frequency.stepSize = value;
        this.port.postMessage({stepSize:value});
    }

    get timePerStep(){ 
        return this._state.frequency.timePerStep;
    }
    set timePerStep(value){
        this._state.frequency.timePerStep = value;
        this.port.postMessage({timePerStep:value});
    }
}