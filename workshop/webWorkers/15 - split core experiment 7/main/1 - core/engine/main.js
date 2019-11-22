const library = new function(){
    const library = this;
    
    const dev = {
        prefix:'library',

        countActive:!false,
        countMemory:{},
    
        math:{active:false,fontStyle:'color:rgb(195, 81, 172); font-style:italic;'},
        structure:{active:false,fontStyle:'color:rgb(81, 178, 223); font-style:italic;'},
        audio:{active:false,fontStyle:'color:rgb(229, 96, 83); font-style:italic;'},
        font:{active:false,fontStyle:'color:rgb(99, 196, 129); font-style:italic;'},
        misc:{active:false,fontStyle:'color:rgb(243, 194, 95); font-style:italic;'},
    
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
        testLoggers:function(){
            const math = dev.math.active;
            const structure = dev.structure.active;
            const audio = dev.audio.active;
            const font = dev.font.active;
            const misc = dev.misc.active;

            dev.math.active = true;
            dev.structure.active = true;
            dev.audio.active = true;
            dev.font.active = true;
            dev.misc.active = true;

            dev.log.math('.testLoggers -> math');
            dev.log.structure('.testLoggers -> structure');
            dev.log.audio('.testLoggers -> audio');
            dev.log.font('.testLoggers -> font');
            dev.log.misc('.testLoggers -> misc');

            dev.math.active = math;
            dev.structure.active = structure;
            dev.audio.active = audio;
            dev.font.active = font;
            dev.misc.active = misc;
        },
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

    element:{active:false,fontStyle:'color:rgb(195, 81, 172); font-style:italic;'},
    elementLibrary:{active:false,fontStyle:'color:rgb(81, 178, 223); font-style:italic;'},
    arrangement:{active:false,fontStyle:'color:rgb(229, 96, 83); font-style:italic;'},
    render:{active:false,fontStyle:'color:rgb(99, 196, 129); font-style:italic;'},
    viewport:{active:false,fontStyle:'color:rgb(243, 194, 95); font-style:italic;'},
    stats:{active:false,fontStyle:'color:rgb(24, 53, 157); font-style:italic;'},
    callback:{active:false,fontStyle:'color:rgb(66, 145, 115); font-style:italic;'},
    service:{active:false,fontStyle:'color:rgb(145, 125, 124); font-style:italic;'},
    interface:{active:false,fontStyle:'color:rgb(128, 131, 137); font-style:italic;'},

    log:{
        element:function(data){
            if(!dev.element.active){return;}
            console.log('%c'+dev.prefix+'.element'+(new Array(...arguments).join(' ')), dev.element.fontStyle );
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
        service:function(data){
            if(!dev.service.active){return;}
            console.log('%c'+dev.prefix+'.service'+(new Array(...arguments).join(' ')), dev.service.fontStyle );
        },
        interface:function(data){
            if(!dev.interface.active){return;}
            console.log('%c'+dev.prefix+'.interface'+(new Array(...arguments).join(' ')), dev.interface.fontStyle );
        },
    },

    testLoggers:function(){
        const element = dev.element.active;
        const elementLibrary = dev.elementLibrary.active;
        const arrangement = dev.arrangement.active;
        const render = dev.render.active;
        const viewport = dev.viewport.active;
        const stats = dev.stats.active;
        const callback = dev.callback.active;
        const service = dev.service.active;
        const interface = dev.interface.active;

        dev.element.active = true;
        dev.elementLibrary.active = true;
        dev.arrangement.active = true;
        dev.render.active = true;
        dev.viewport.active = true;
        dev.stats.active = true;
        dev.callback.active = true;
        dev.service.active = true;
        dev.interface.active = true;

        dev.log.element('.testLoggers -> element');
        dev.log.elementLibrary('elementType','/address/goes/here/','.testLoggers -> elementLibrary');
        dev.log.arrangement('.testLoggers -> arrangement');
        dev.log.render('.testLoggers -> render');
        dev.log.viewport('.testLoggers -> viewport');
        dev.log.stats('.testLoggers -> stats');
        dev.log.callback('.testLoggers -> callback');
        dev.log.service('.testLoggers -> service');
        dev.log.interface('.testLoggers -> interface');

        dev.element.active = element;
        dev.elementLibrary.active = elementLibrary;
        dev.arrangement.active = arrangement;
        dev.render.active = render;
        dev.viewport.active = viewport;
        dev.stats.active = stats;
        dev.callback.active = callback;
        dev.service.active = service;
        dev.interface.active = interface;
    },
};
const report = {
    info:function(){ console.log(...['core_engine.report.info:'].concat(...new Array(...arguments))); },
    warning:function(){ console.warn(...['core_engine.report.warning:'].concat(...new Array(...arguments))); },
    error:function(){ console.error(...['core_engine.report.error:'].concat(...new Array(...arguments))); },
    testReporters:function(){
        report.info('info');
        report.warning('warning');
        report.error('error');
    },
};

{{include:modules/element.js}}
{{include:modules/arrangement.js}}
{{include:modules/render.js}}
{{include:modules/viewport.js}}
{{include:modules/stats.js}}
{{include:modules/callback.js}}

{{include:service.js}}
{{include:interface.js}}

render.refresh(() => {
    viewport.refresh();
    interface.go();
});