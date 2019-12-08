const self = this;

{{include:../communicationModule.js}}
const communicationModule = new communicationModuleMaker(core_engine,'core_console');
this.__com = communicationModule;

_canvas_.setAttribute('tabIndex',1);

const dev = {
    prefix:'core_console',

    interface:{active:false,fontStyle:'color:rgb(195, 81, 172); font-style:italic;'},
    service:{active:false,fontStyle:'color:rgb(81, 178, 223); font-style:italic;'},
    elementLibrary:{active:false,fontStyle:'color:rgb(99, 196, 129); font-style:italic;'},

    log:{
        interface:function(data){
            if(!dev.interface.active){return;}
            console.log('%c'+dev.prefix+'.interface'+(new Array(...arguments).join(' ')), dev.interface.fontStyle );
        },
        elementLibrary:function(data){
            if(!dev.elementLibrary.active){return;}
            console.log('%c'+dev.prefix+'.interface.elementLibrary'+(new Array(...arguments).join(' ')), dev.elementLibrary.fontStyle );
        },
        service:function(data){
            if(!dev.service.active){return;}
            console.log('%c'+dev.prefix+'.service'+(new Array(...arguments).join(' ')), dev.service.fontStyle );
        },
    },
};

{{include:interface/main.js}}
{{include:service.js}}