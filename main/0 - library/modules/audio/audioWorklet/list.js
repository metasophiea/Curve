{
    name:'testWorklet',
    worklet:new Blob([`
        {{include:workshop/testWorklet/worklet.js}}
    `], { type: "text/javascript" }),
    class:
        {{include:workshop/testWorklet/node.js}}
    ,
},

{
    name:'squareWaveGenerator',
    worklet:new Blob([`
        {{include:workshop/squareWaveGenerator/worklet.js}}
    `], { type: "text/javascript" }),
    class:
        {{include:workshop/squareWaveGenerator/node.js}}
    ,
},







{
    name:'amplitudeModifier',
    worklet:new Blob([`
        {{include:modules/amplitudeModifier/worklet.js}}
    `], { type: "text/javascript" }),
    class:
        {{include:modules/amplitudeModifier/node.js}}
    ,
},

{
    name:'bitcrusher',
    worklet:new Blob([`
        {{include:modules/bitcrusher/worklet.js}}
    `], { type: "text/javascript" }),
    class:
        {{include:modules/bitcrusher/node.js}}
    ,
},

{
    name:'momentaryAmplitudeMeter',
    worklet:new Blob([`
        {{include:modules/momentaryAmplitudeMeter/worklet.js}}
    `], { type: "text/javascript" }),
    class:
        {{include:modules/momentaryAmplitudeMeter/node.js}}
    ,
},

{
    name:'amplitudeControlledModulator',
    worklet:new Blob([`
        {{include:modules/amplitudeControlledModulator/worklet.js}}
    `], { type: "text/javascript" }),
    class:
        {{include:modules/amplitudeControlledModulator/node.js}}
    ,
},

{
    name:'whiteNoiseGenerator',
    worklet:new Blob([`
        {{include:modules/whiteNoiseGenerator/worklet.js}}
    `], { type: "text/javascript" }),
    class:
        {{include:modules/whiteNoiseGenerator/node.js}}
    ,
},

{
    name:'sigmoid',
    worklet:new Blob([`
        {{include:modules/sigmoid/worklet.js}}
    `], { type: "text/javascript" }),
    class:
        {{include:modules/sigmoid/node.js}}
    ,
},