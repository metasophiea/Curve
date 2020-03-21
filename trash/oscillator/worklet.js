// class oscillator extends AudioWorkletProcessor{
//     static twoPI = Math.PI*2;
//     static starterFrequency = 440;

//     static get parameterDescriptors(){
//         return [
//             {
//                 name: 'mode',
//                 defaultValue: 0, // 0 - sine / 1 - square / 2 - triangle/sawtooth/ramp (use duty cycle)
//                 minValue: 0,
//                 maxValue: 3,
//                 automationRate: 'a-rate',
//             },{
//                 name: 'frequency',
//                 defaultValue: oscillator.starterFrequency,
//                 minValue: 0,
//                 maxValue: 20000,
//                 automationRate: 'a-rate',
//             },{
//                 name: 'dutyCycle',
//                 defaultValue: 0.5,
//                 minValue: 0,
//                 maxValue: 1,
//                 automationRate: 'a-rate',
//             }
//         ];
//     }

//     constructor(options){
//         super(options);
//         this._wavePosition = 0;
//         this._waveStep = oscillator.starterFrequency/44100;
//     }

//     process(inputs, outputs, parameters){
//         const output = outputs[0];

//         const frequency_useFirstOnly = parameters.frequency.length == 1;
//         const dutyCycle_useFirstOnly = parameters.dutyCycle.length == 1;

//         switch(parameters.mode[0]){
//             case 0:
//                 for(let channel = 0; channel < output.length; channel++){
//                     for(let a = 0; a < output[channel].length; a++){
//                         if( !frequency_useFirstOnly ){ this._waveStep = parameters.frequency[a]/sampleRate; }
//                         this._wavePosition += this._waveStep;

//                         const waveProgress = this._wavePosition - Math.trunc(this._wavePosition);
//                         output[channel][a] = Math.sin( waveProgress * oscillator.twoPI );
//                     }
//                 }
//             break;
//             case 1:
//                 for(let channel = 0; channel < output.length; channel++){
//                     for(let a = 0; a < output[channel].length; a++){
//                         if( !frequency_useFirstOnly ){ this._waveStep = parameters.frequency[a]/sampleRate; }
//                         this._wavePosition += this._waveStep;

//                         const waveProgress = this._wavePosition - Math.trunc(this._wavePosition);
//                         const dutyCycle = dutyCycle_useFirstOnly ? parameters.dutyCycle[0] : parameters.dutyCycle[a];

//                         output[channel][a] = waveProgress < dutyCycle ? 1 : -1;
//                     }
//                 }
//             break;
//             case 2:
//                 for(let channel = 0; channel < output.length; channel++){
//                     for(let a = 0; a < output[channel].length; a++){
//                         if( !frequency_useFirstOnly ){ this._waveStep = parameters.frequency[a]/sampleRate; }
//                         this._wavePosition += this._waveStep;

//                         const waveProgress = this._wavePosition - Math.trunc(this._wavePosition);
//                         const dutyCycle = dutyCycle_useFirstOnly ? parameters.dutyCycle[0] : parameters.dutyCycle[a];

//                         if(waveProgress < dutyCycle/2){
//                             output[channel][a] = 2*waveProgress / dutyCycle;
//                         }else if(waveProgress >= 1 - dutyCycle/2){
//                             output[channel][a] = (2*waveProgress - 2) / dutyCycle;
//                         }else{
//                             output[channel][a] = (2*waveProgress - 1) / (dutyCycle - 1);
//                         }
//                     }
//                 }
//             break;
//         }

//         return true;
//     }
// }
// registerProcessor('oscillator', oscillator);
































class oscillator extends AudioWorkletProcessor{
    static twoPI = Math.PI*2;
    static starterFrequency = 440;
    static maxFrequency = 20000;
    static detuneMux = 0.1;
    static detuneBounds = 1/oscillator.detuneMux;

    static get parameterDescriptors(){
        return [
            {
                name: 'waveform',
                defaultValue: 0, // 0 - sine / 1 - square / 2 - triangle / 3 - noise
                minValue: 0,
                maxValue: 3,
                automationRate: 'k-rate',
            },{
                name: 'frequency',
                defaultValue: oscillator.starterFrequency,
                minValue: 0,
                maxValue: oscillator.maxFrequency,
                automationRate: 'a-rate',
            },{
                name: 'gain',
                defaultValue: 1,
                minValue: -1,
                maxValue: 1,
                automationRate: 'a-rate',
            },{
                name: 'detune',
                defaultValue: 0,
                minValue: -oscillator.detuneBounds,
                maxValue: oscillator.detuneBounds,
                automationRate: 'a-rate',
            },{
                name: 'dutyCycle',
                defaultValue: 0.5,
                minValue: 0,
                maxValue: 1,
                automationRate: 'a-rate',
            },{
                name: 'gain_mode',
                defaultValue: 0, // 0 - manual / 1 - automatic
                minValue: 0,
                maxValue: 1,
                automationRate: 'k-rate',
            },{
                name: 'detune_mode',
                defaultValue: 0, // 0 - manual / 1 - automatic
                minValue: 0,
                maxValue: 1,
                automationRate: 'k-rate',
            },{
                name: 'dutyCycle_mode',
                defaultValue: 0, // 0 - manual / 1 - automatic
                minValue: 0,
                maxValue: 1,
                automationRate: 'k-rate',
            },
        ];
    }

    constructor(options){
        super(options);
        this._wavePosition = 0;
    }

    process(inputs, outputs, parameters){
        const output = outputs[0];
        const gainControl = inputs[0];
        const detuneControl = inputs[1];
        const dutyCycleControl = inputs[2];

        const frequency_useFirstOnly = parameters.frequency.length == 1;
        const dutyCycle_useFirstOnly = parameters.dutyCycle.length == 1;
        const detune_useFirstOnly = parameters.detune.length == 1;
        const gain_useFirstOnly = parameters.gain.length == 1;

        for(let channel = 0; channel < output.length; channel++){
            for(let a = 0; a < output[channel].length; a++){
                const gain = parameters.gain_mode[0] == 0 ? (gain_useFirstOnly ? parameters.gain[0] : parameters.gain[a]) : gainControl[channel][a];
                const frequency = frequency_useFirstOnly ? parameters.frequency[0] : parameters.frequency[a];
                const detune = parameters.detune_mode[0] == 0 ? (detune_useFirstOnly ? parameters.detune[0] : parameters.detune[a]) : detuneControl[channel][a];
                const dutyCycle = parameters.dutyCycle_mode[0] == 0 ? (dutyCycle_useFirstOnly ? parameters.dutyCycle[0] : parameters.dutyCycle[a]) : dutyCycleControl[channel][a];

                this._wavePosition += (frequency*(detune*oscillator.detuneMux + 1))/sampleRate;
                const localWavePosition = this._wavePosition % 1;

                switch(parameters.waveform[0]){
                    case 0: //sin
                        output[channel][a] = gain*Math.sin( localWavePosition * oscillator.twoPI );
                    break;
                    case 1: //square
                        output[channel][a] = gain*(localWavePosition < dutyCycle ? 1 : -1);
                    break;
                    case 2: //triangle
                        if(localWavePosition < dutyCycle/2){
                            output[channel][a] = gain*(2*localWavePosition / dutyCycle);
                        }else if(localWavePosition >= 1 - dutyCycle/2){
                            output[channel][a] = gain*((2*localWavePosition - 2) / dutyCycle);
                        }else{
                            output[channel][a] = gain*((2*localWavePosition - 1) / (dutyCycle - 1));
                        }
                    break;
                    case 3: //noise
                        output[channel][a] = gain*(Math.random()*2 - 1);
                    break;
                }
            }
        }

        return true;
    }
}
registerProcessor('oscillator', oscillator);








/*

// Phase Modulation
let x = 0;
let freq = 1;
let mux = [
    {pha:1,amp:1},
    {pha:1,amp:1},
    {pha:1,amp:1},
    {pha:1,amp:1},
];
let accumulator = 0;
mux.forEach(current => {
    accumulator = Math.sin(x*freq*current.pha + (Math.PI/2)*current.amp*accumulator);
} );

*/