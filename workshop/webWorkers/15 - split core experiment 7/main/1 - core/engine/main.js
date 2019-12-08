{{include:library.js}}

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