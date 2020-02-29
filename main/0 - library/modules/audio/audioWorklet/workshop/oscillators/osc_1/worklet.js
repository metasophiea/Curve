class osc_1 extends AudioWorkletProcessor{
    static twoPI = Math.PI*2;
    static starterFrequency = 440;
    static maxFrequency = 20000;
    static detuneMux = 0.1;
    static detuneBounds = 1/osc_1.detuneMux;
    static modulationSettings = [
        {pha:4,amp:1},
        {pha:3,amp:1},
        {pha:2,amp:1},
        {pha:1,amp:1},
    ];

    static get parameterDescriptors(){
        return [
            {
                name: 'frequency',
                defaultValue: osc_1.starterFrequency,
                minValue: 0,
                maxValue: osc_1.maxFrequency,
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
                minValue: -osc_1.detuneBounds,
                maxValue: osc_1.detuneBounds,
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
            }
        ];
    }

    constructor(options){
        super(options);
        this._wavePosition = 0;
        // this._modulationSettings = [
        //     {pha:4,amp:1},
        //     {pha:3,amp:1},
        //     {pha:2,amp:1},
        //     {pha:1,amp:1},
        // ];

        this.port.onmessage = function(event){
            osc_1.modulationSettings = event.data;
            console.log( event.data, osc_1.modulationSettings );
        };
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

                this._wavePosition += (frequency*(detune*osc_1.detuneMux + 1))/sampleRate;
                const localWavePosition = this._wavePosition % 1;

                osc_1.modulationSettings.forEach( setting => {
                    output[channel][a] = Math.sin( osc_1.twoPI*localWavePosition*setting.pha + (Math.PI/2)*setting.amp*output[channel][a] );
                } );
                output[channel][a] = gain*output[channel][a];
            }
        }

        return true;
    }
}
registerProcessor('osc_1', osc_1);