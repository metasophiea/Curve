class osc_2 extends AudioWorkletProcessor{
    static twoPI = Math.PI*2;
    static starterFrequency = 440;
    static maxFrequency = 20000;
    static detuneMux = 0.1;
    static detuneBounds = 1/osc_2.detuneMux;

    static get parameterDescriptors(){
        return [
            {
                name: 'frequency',
                defaultValue: osc_2.starterFrequency,
                minValue: 0,
                maxValue: osc_2.maxFrequency,
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
                minValue: -osc_2.detuneBounds,
                maxValue: osc_2.detuneBounds,
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
            },



            {
                name: 'harmonic_mux_1',
                defaultValue: 1,
                minValue: 0,
                maxValue: 32,
                automationRate: 'a-rate',
            },{
                name: 'harmonic_mux_2',
                defaultValue: 1,
                minValue: 0,
                maxValue: 32,
                automationRate: 'a-rate',
            },{
                name: 'harmonic_power_1',
                defaultValue: 1,
                minValue: 0,
                maxValue: 32,
                automationRate: 'a-rate',
            },{
                name: 'harmonic_power_2',
                defaultValue: 1,
                minValue: 0,
                maxValue: 32,
                automationRate: 'a-rate',
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

        const frequency_useFirstOnly = parameters.frequency.length == 1;
        const detune_useFirstOnly = parameters.detune.length == 1;
        const gain_useFirstOnly = parameters.gain.length == 1;

        for(let channel = 0; channel < output.length; channel++){
            for(let a = 0; a < output[channel].length; a++){
                const gain = parameters.gain_mode[0] == 0 ? (gain_useFirstOnly ? parameters.gain[0] : parameters.gain[a]) : gainControl[channel][a];
                const frequency = frequency_useFirstOnly ? parameters.frequency[0] : parameters.frequency[a];
                const detune = parameters.detune_mode[0] == 0 ? (detune_useFirstOnly ? parameters.detune[0] : parameters.detune[a]) : detuneControl[channel][a];

                this._wavePosition += (frequency*(detune*osc_2.detuneMux + 1))/sampleRate;
                const localWavePosition = this._wavePosition % 1;

                output[channel][a] = gain*parameters.harmonic_power_1[0]*Math.sin(
                    osc_2.twoPI*localWavePosition*parameters.harmonic_mux_1[0] + (Math.PI/2)*parameters.harmonic_power_2[0]*Math.sin(
                        osc_2.twoPI*localWavePosition*parameters.harmonic_mux_2[0]
                    )
                );
            }
        }

        return true;
    }
}
registerProcessor('osc_2', osc_2);