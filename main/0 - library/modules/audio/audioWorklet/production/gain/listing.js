{
    name:'gain',
    worklet:new Blob([`
        {{include:worklet.js}}
    `], { type: "text/javascript" }),
    class:
        {{include:node.js}}
    ,
},