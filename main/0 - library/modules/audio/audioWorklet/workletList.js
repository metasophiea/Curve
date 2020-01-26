//main
{
    name:'bitcrusher',
    blob:new Blob([`
        {{include:modules/bitcrusher.js}}
    `], { type: "text/javascript" }),
},
{
    name:'amplitudeModifier',
    blob:new Blob([`
        {{include:modules/amplitudeModifier.js}}
    `], { type: "text/javascript" }),
},
{
    name:'momentaryAmplitudeMeter',
    options:{
        numberOfOutputs:0
    },
    blob:new Blob([`
        {{include:modules/momentaryAmplitudeMeter.js}}
    `], { type: "text/javascript" }),
},
{
    name:'amplitudeControlledModulator',
    options:{
        numberOfInputs:2
    },
    blob:new Blob([`
        {{include:modules/amplitudeControlledModulator.js}}
    `], { type: "text/javascript" }),
},




//development
{
    name:'amplitudeInverter',
    blob:new Blob([`
        {{include:modules/amplitudeInverter.js}}
    `], { type: "text/javascript" }),
},
{
    name:'amplitudePeakAttenuator',
    blob:new Blob([`
        {{include:modules/amplitudePeakAttenuator.js}}
    `], { type: "text/javascript" }),
},
{
    name:'sqasherDoubler',
    blob:new Blob([`
        {{include:modules/sqasherDoubler.js}}
    `], { type: "text/javascript" }),
},
{
    name:'vocoder',
    options:{
        numberOfInputs:2
    },
    blob:new Blob([`
        {{include:modules/vocoder.js}}
    `], { type: "text/javascript" }),
},