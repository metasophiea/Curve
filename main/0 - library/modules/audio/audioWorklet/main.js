this.audioWorklet = new function(){
    function checkIfReady(){
        return worklets.map(a => a.loaded).reduce((rolling,current) => {return rolling && current;});
    };
    this.nowReady = function(){};

    const worklets = [
        {
            name:'bitcrusher',
            blob:new Blob([`
                {{include:bitcrusher.js}}
            `], { type: "text/javascript" }),
        },
        {
            name:'amplitudeModifier',
            blob:new Blob([`
                {{include:amplitudeModifier.js}}
            `], { type: "text/javascript" }),
        },
        {
            name:'momentaryAmplitudeMeter',
            options:{
                numberOfOutputs:0
            },
            blob:new Blob([`
                {{include:momentaryAmplitudeMeter.js}}
            `], { type: "text/javascript" }),
        },

        {
            name:'amplitudeInverter',
            blob:new Blob([`
                {{include:amplitudeInverter.js}}
            `], { type: "text/javascript" }),
        },
        {
            name:'amplitudePeakAttenuator',
            blob:new Blob([`
                {{include:amplitudePeakAttenuator.js}}
            `], { type: "text/javascript" }),
        },
        {
            name:'modulon',
            options:{
                numberOfInputs:2
            },
            blob:new Blob([`
                {{include:modulon.js}}
            `], { type: "text/javascript" }),
        },
        {
            name:'sqasherDoubler',
            blob:new Blob([`
                {{include:sqasherDoubler.js}}
            `], { type: "text/javascript" }),
        },
        {
            name:'vocoder',
            options:{
                numberOfInputs:2
            },
            blob:new Blob([`
                {{include:vocoder.js}}
            `], { type: "text/javascript" }),
        },
    ];
    
    worklets.forEach(worklet => {
        dev.log.audio('.AudioWorklet -> loading worklet:',worklet.name); //#development
        worklet.loaded = false;

        audio.context.audioWorklet.addModule(window.URL.createObjectURL(worklet.blob)).then( () => {
            dev.log.audio('.AudioWorklet ->',worklet.name,'has been loaded'); //#development
            worklet.loaded = true;
            const creationFunctionName = 'create'+worklet.name.charAt(0).toUpperCase() + worklet.name.slice(1);
            dev.log.audio('.AudioWorklet -> creationFunctionName:',creationFunctionName); //#development
            audio.context[creationFunctionName] = function(){
                return new AudioWorkletNode(_canvas_.library.audio.context, worklet.name, worklet.options);
            };

            if( checkIfReady() && this.nowReady != undefined ){
                this.nowReady();
            }
        } );
    });
};