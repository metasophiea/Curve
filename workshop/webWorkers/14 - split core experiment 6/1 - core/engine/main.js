{{include:../communicationModule.js}}
const communicationModule = new communicationModuleMaker(this,'core_engine');

const dev = {
    prefix:'core_engine',

    library:{active:!true,fontStyle:'color:rgb(87, 161, 80); font-style:italic;'},
    element:{active:!true,fontStyle:'color:rgb(161, 145, 80); font-style:italic;'},
    elementLibrary:{active:!true,fontStyle:'color:rgb(129, 80, 161); font-style:italic;'},
    arrangement:{active:!true,fontStyle:'color:rgb(80, 161, 141); font-style:italic;'},
    render:{active:!true,fontStyle:'color:rgb(161, 84, 80); font-style:italic;'},
    viewport:{active:!true,fontStyle:'color:rgb(80, 134, 161); font-style:italic;'},
    stats:{active:!true,fontStyle:'color:rgb(87, 80, 161); font-style:italic;'},
    callback:{active:!true,fontStyle:'color:rgb(122, 163, 82); font-style:italic;'},
    interface:{active:true,fontStyle:'color:rgb(171, 77, 77); font-style:italic;'},

    log:{
        library:function(subSection,data){
            if(!dev.library.active){return;}
            console.log('%c'+dev.prefix+'.library.'+subSection+(new Array(...arguments).slice(1).join(' ')), dev.library.fontStyle );
        },
        element:function(data){
            if(!dev.element.active){return;}
            console.log('%c'+dev.prefix+'e.element'+(new Array(...arguments).join(' ')), dev.element.fontStyle );
        },
        elementLibrary:function(elementType,address,data){
            if(!dev.elementLibrary.active){return;}
            console.log('%c'+dev.prefix+'.elementLibrary.'+elementType+'['+address+']'+(new Array(...arguments).slice(2).join(' ')), dev.elementLibrary.fontStyle );
        },
        arrangement:function(data){
            if(!dev.arrangement.active){return;}
            console.log('%c'+dev.prefix+'.arrangement'+(new Array(...arguments).join(' ')), dev.arrangement.fontStyle );
        },
        render:function(data){
            if(!dev.render.active){return;}
            console.log('%c'+dev.prefix+'.render'+(new Array(...arguments).join(' ')), dev.render.fontStyle );
        },
        viewport:function(data){
            if(!dev.viewport.active){return;}
            console.log('%c'+dev.prefix+'e.viewport'+(new Array(...arguments).join(' ')), dev.viewport.fontStyle );
        },
        stats:function(data){
            if(!dev.stats.active){return;}
            console.log('%c'+dev.prefix+'.stats'+(new Array(...arguments).join(' ')), dev.stats.fontStyle );
        },
        callback:function(data){
            if(!dev.callback.active){return;}
            console.log('%c'+dev.prefix+'.callback'+(new Array(...arguments).join(' ')), dev.callback.fontStyle );
        },
        interface:function(data){
            if(!dev.interface.active){return;}
            console.log('%c'+dev.prefix+'.interface'+(new Array(...arguments).join(' ')), dev.interface.fontStyle );
        },
    },
};

{{include:interface.js}}