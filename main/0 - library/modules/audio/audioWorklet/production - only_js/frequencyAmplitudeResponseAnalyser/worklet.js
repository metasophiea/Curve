// class frequencyAmplitudeResponseAnalyser extends AudioWorkletProcessor{
//     static twoPI = Math.PI*2;

//     static get parameterDescriptors(){
//         return [];
//     }

//     #state = {
//         signalGeneratorGain:1,
//         waveform:0,
//         dutyCycle:0.5,
//         frequency:{
//             current:100,
//             range:{ start:100, end:1000 },
//             stepSize:10,
//             timePerStep:0.005
//         },
//         responseData: [],
//     };
//     #wavePosition = 0;
//     #lastUpdate = 0;
//     #start = false;
//     #active = false;
//     #stepData = [];

//     constructor(options){
//         super(options);
//         const self = this;

//         this.port.onmessage = function(event){
//             if(event.data == 'stop'){
//                 self._active = false;
//                 return;
//             }

//             if(self._active){ return; }

//             if(event.data == 'start'){
//                 self._start = true;
//                 self._active = true;
//                 return;
//             }
//             if(event.data == 'clear'){
//                 this._state.responseData = [];
//                 this._stepData = [];
//                 this._wavePosition = 0;
//                 return;
//             }

//             Object.entries(event.data).forEach(([key,value]) => {
//                 switch(key){
//                     case 'waveform': self._state.waveform = value; break;
//                     case 'signalGeneratorGain': self._state.signalGeneratorGain = value; break;
//                     case 'dutyCycle': self._state.dutyCycle = value; break;

//                     case 'range.start': self._state.frequency.range.start = value; break;
//                     case 'range.end': self._state.frequency.range.end = value; break;
//                     case 'stepSize': self._state.frequency.stepSize = value; break;
//                     case 'timePerStep': self._state.frequency.timePerStep = value; break;
//                 }
//             });
//         };
//         this.port.start();
//     }

//     process(inputs, outputs, parameters){
//         if(!this._active){ return true; }

//         if(this._start){
//             this._state.frequency.current = this._state.frequency.range.start;
//             this._start = false;
//             this._lastUpdate = currentTime;
//         }

        

//         //generator
//             const output = outputs[0];

//             const gain = this._state.signalGeneratorGain;
//             const frequency = this._state.frequency.current;
//             const dutyCycle = this._state.frequency.dutyCycle;

//             for(let channel = 0; channel < output.length; channel++){
//                 for(let a = 0; a < output[channel].length; a++){

//                     this._wavePosition += frequency/sampleRate;
//                     const localWavePosition = this._wavePosition % 1;

//                     switch(this._state.waveform){
//                         case 0: //sin
//                             output[channel][a] = gain*Math.sin( localWavePosition * frequencyAmplitudeResponseAnalyser.twoPI );
//                         break;
//                         case 1: //square
//                             output[channel][a] = gain*(localWavePosition < dutyCycle ? 1 : -1);
//                         break;
//                         case 2: //triangle
//                             if(localWavePosition < dutyCycle/2){
//                                 output[channel][a] = gain*(2*localWavePosition / dutyCycle);
//                             }else if(localWavePosition >= 1 - dutyCycle/2){
//                                 output[channel][a] = gain*((2*localWavePosition - 2) / dutyCycle);
//                             }else{
//                                 output[channel][a] = gain*((2*localWavePosition - 1) / (dutyCycle - 1));
//                             }
//                         break;
//                     }
//                 }
//             }

//         //collector
//             const input = inputs[0];
//             this._stepData.push(...input[0]);
            


//         if( currentTime - this._lastUpdate > this._state.frequency.timePerStep ){
//             this._lastUpdate = currentTime;

//             const result = {
//                 frequency:this._state.frequency.current,
//                 response:Math.max(...(this._stepData).map(a => Math.abs(a)) )
//             };
//             this.port.postMessage({ onValue:result });
//             this._state.responseData.push(result);
//             this._stepData = [];

//             this._state.frequency.current += this._state.frequency.stepSize;
//             if( this._state.frequency.current > this._state.frequency.range.end ){
//                 this.port.postMessage({ onCompletion:this._state.responseData });
//                 this._active = false;
//             }
//         }

//         return true;
//     }
// }
// registerProcessor('frequencyAmplitudeResponseAnalyser', frequencyAmplitudeResponseAnalyser);
















class frequencyAmplitudeResponseAnalyser extends AudioWorkletProcessor{
    static twoPI = Math.PI*2;

    static get parameterDescriptors(){
        return [];
    }

    constructor(options){
        super(options);
        const self = this;

        this._state = {
            signalGeneratorGain:1,
            waveform:'sine',
            dutyCycle:0.5,
            frequency:{
                current:100,
                range:{ start:100, end:1000 },
                stepSize:10,
                timePerStep:0.005
            },
            responseData: [],
        };
        this._wavePosition = 0;
        this._lastUpdate = 0;
        this._start = false;
        this._active = false;
        this._stepData = [];

        this.port.onmessage = function(event){
            if(event.data == 'stop'){
                self.port.postMessage({ onCompletion:self._state.responseData });
                self._active = false;
                return;
            }

            if(self._active){ return; }

            if(event.data == 'start'){
                self._start = true;
                self._active = true;
                return;
            }
            if(event.data == 'clear'){
                self._state.responseData = [];
                self._stepData = [];
                self._wavePosition = 0;
                return;
            }

            Object.entries(event.data).forEach(([key,value]) => {
                switch(key){
                    case 'waveform': self._state.waveform = value; break;
                    case 'signalGeneratorGain': self._state.signalGeneratorGain = value; break;
                    case 'dutyCycle': self._state.dutyCycle = value; break;

                    case 'range.start': self._state.frequency.range.start = value; break;
                    case 'range.end': self._state.frequency.range.end = value; break;
                    case 'stepSize': self._state.frequency.stepSize = value; break;
                    case 'timePerStep': self._state.frequency.timePerStep = value; break;
                }
            });
        };
        this.port.start();
    }

    process(inputs, outputs, parameters){
        if(!this._active){ return true; }

        if(this._start){
            this._state.frequency.current = this._state.frequency.range.start;
            this._start = false;
            this._lastUpdate = currentTime;
        }

        

        //generator
            const output = outputs[0];

            const gain = this._state.signalGeneratorGain;
            const frequency = this._state.frequency.current;
            const dutyCycle = this._state.dutyCycle;

            for(let channel = 0; channel < output.length; channel++){
                for(let a = 0; a < output[channel].length; a++){

                    this._wavePosition += frequency/sampleRate;
                    const localWavePosition = this._wavePosition % 1;

                    switch(this._state.waveform){
                        case 'sine':
                            output[channel][a] = gain*Math.sin( localWavePosition * frequencyAmplitudeResponseAnalyser.twoPI );
                        break;
                        case 'square':
                            output[channel][a] = gain*(localWavePosition < dutyCycle ? 1 : -1);
                        break;
                        case 'triangle':
                            if(localWavePosition < dutyCycle/2){
                                output[channel][a] = gain*(2*localWavePosition / dutyCycle);
                            }else if(localWavePosition >= 1 - dutyCycle/2){
                                output[channel][a] = gain*((2*localWavePosition - 2) / dutyCycle);
                            }else{
                                output[channel][a] = gain*((2*localWavePosition - 1) / (dutyCycle - 1));
                            }
                        break;
                    }
                }
            }

        //collector
            const input = inputs[0];
            this._stepData.push(...input[0]);
            


        if( currentTime - this._lastUpdate > this._state.frequency.timePerStep ){
            this._lastUpdate = currentTime;

            const result = {
                frequency:this._state.frequency.current,
                response:Math.max(...(this._stepData).map(a => Math.abs(a)) )
            };
            this.port.postMessage({ onValue:result });
            this._state.responseData.push(result);
            this._stepData = [];

            this._state.frequency.current += this._state.frequency.stepSize;
            if( this._state.frequency.current > this._state.frequency.range.end ){
                this.port.postMessage({ onCompletion:this._state.responseData });
                this._active = false;
            }
        }

        return true;
    }
}
registerProcessor('frequencyAmplitudeResponseAnalyser', frequencyAmplitudeResponseAnalyser);