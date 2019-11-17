const library = new function(){
    const library = this;
    
    const dev = {
        prefix:'library',

        countActive:!false,
        countMemory:{},
    
        math:{active:false,fontStyle:'color:rgb(87, 161, 80); font-style:italic;'},
        structure:{active:false,fontStyle:'color:rgb(129, 80, 161); font-style:italic;'},
        audio:{active:false,fontStyle:'color:rgb(80, 161, 141); font-style:italic;'},
        font:{active:false,fontStyle:'color:rgb(161, 84, 80); font-style:italic;'},
        misc:{active:false,fontStyle:'color:rgb(80, 134, 161); font-style:italic;'},
    
        log:{
            math:function(data){
                if(!dev.math.active){return;}
                console.log('%c'+dev.prefix+'.math'+(new Array(...arguments).join(' ')), dev.math.fontStyle );
            },
            structure:function(data){
                if(!dev.structure.active){return;}
                console.log('%c'+dev.prefix+'.structure'+(new Array(...arguments).join(' ')), dev.structure.fontStyle );
            },
            audio:function(data){
                if(!dev.audio.active){return;}
                console.log('%c'+dev.prefix+'.audio'+(new Array(...arguments).join(' ')), dev.audio.fontStyle );
            },
            font:function(data){
                if(!dev.font.active){return;}
                console.log('%c'+dev.prefix+'.font'+(new Array(...arguments).join(' ')), dev.font.fontStyle );
            },
            misc:function(data){
                if(!dev.misc.active){return;}
                console.log('%c'+dev.prefix+'.misc'+(new Array(...arguments).join(' ')), dev.misc.fontStyle );
            },
        },
        count:function(commandTag){
            if(!dev.countActive){return;}
            if(commandTag in dev.countMemory){ dev.countMemory[commandTag]++; }
            else{ dev.countMemory[commandTag] = 1; }
        },
    };
    this.dev = {
        countResults:function(){ return dev.countMemory; },
    };
    
    this.math = new function(){
        {{include:../../0 - library/modules/math.js}}
    };
    this.glsl = new function(){
        {{include:../../0 - library/modules/glsl.js}}
    };
    this.font = new function(){
        {{include:../../0 - library/modules/font.js}}
    };
    this.misc = new function(){
        {{include:../../0 - library/modules/misc.js}}
    };
    const _thirdparty = new function(){
        const thirdparty = this;
        {{include:../../0 - library/modules/thirdparty/*}} /**/
    };
};

{{include:../communicationModule.js}}
const communicationModule = new communicationModuleMaker(this,'core_engine');

const dev = {
    prefix:'core_engine',

    // library:{active:!true,fontStyle:'color:rgb(87, 161, 80); font-style:italic;'},
    element:{active:false,fontStyle:'color:rgb(161, 145, 80); font-style:italic;'},
    elementLibrary:{active:false,fontStyle:'color:rgb(129, 80, 161); font-style:italic;'},
    arrangement:{active:false,fontStyle:'color:rgb(80, 161, 141); font-style:italic;'},
    render:{active:false,fontStyle:'color:rgb(161, 84, 80); font-style:italic;'},
    viewport:{active:false,fontStyle:'color:rgb(80, 134, 161); font-style:italic;'},
    stats:{active:false,fontStyle:'color:rgb(87, 80, 161); font-style:italic;'},
    callback:{active:false,fontStyle:'color:rgb(122, 163, 82); font-style:italic;'},
    interface:{active:false,fontStyle:'color:rgb(77, 171, 169); font-style:italic;'},

    log:{
        // library:function(subSection,data){
        //     if(!dev.library.active){return;}
        //     console.log('%c'+dev.prefix+'.library.'+subSection+(new Array(...arguments).slice(1).join(' ')), dev.library.fontStyle );
        // },
        element:function(data){
            if(!dev.element.active){return;}
            console.log('%c'+dev.prefix+'e.element'+(new Array(...arguments).join(' ')), dev.element.fontStyle );
        },
        elementLibrary:function(elementType,address,data){
            if(!dev.elementLibrary.active){return;}
            address = address != undefined ? '['+address+']' : '';
            console.log('%c'+dev.prefix+'.elementLibrary.'+elementType+address+(new Array(...arguments).slice(2).join(' ')), dev.elementLibrary.fontStyle );
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
            console.log('%c'+dev.prefix+'.viewport'+(new Array(...arguments).join(' ')), dev.viewport.fontStyle );
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
const report = {
    info:function(){ console.log(...['core_engine.report.info:'].concat(...new Array(...arguments))); },
    warning:function(){ console.warn(...['core_engine.report.warning:'].concat(...new Array(...arguments))); },
    error:function(){ console.error(...['core_engine.report.error:'].concat(...new Array(...arguments))); },
};

{{include:modules/element.js}}
{{include:modules/arrangement.js}}
{{include:modules/render.js}}
{{include:modules/viewport.js}}
{{include:modules/stats.js}}
{{include:modules/callback.js}}

{{include:interface.js}}

render.refresh(() => {
    viewport.refresh();
    interface.go();
});