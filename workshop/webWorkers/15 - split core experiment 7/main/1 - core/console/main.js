const self = this;

{{include:../communicationModule.js}}
const communicationModule = new communicationModuleMaker(core_engine,'core_console');

_canvas_.setAttribute('tabIndex',1);

const dev = {
    prefix:'core_console',

    interface:{active:false,fontStyle:'color:rgb(171, 77, 77); font-style:italic;'},

    log:{
        interface:function(data){
            if(!dev.interface.active){return;}
            console.log('%c'+dev.prefix+'.interface'+(new Array(...arguments).join(' ')), dev.interface.fontStyle );
        },
    },
};

{{include:interface.js}}