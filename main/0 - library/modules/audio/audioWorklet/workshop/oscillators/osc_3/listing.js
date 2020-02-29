//oscillatorWithMultiLevelPhaseModulation
{
    name:'osc_3',
    worklet:new Blob([`
        {{include:worklet.js}}
    `], { type: "text/javascript" }),
    class:
        {{include:node.js}}
    ,
},