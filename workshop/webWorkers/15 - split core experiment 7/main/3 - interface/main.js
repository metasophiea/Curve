_canvas_.interface = new function(){
    this.versionInformation = { tick:0, lastDateModified:{y:'????',m:'??',d:'??'} };
    const interface = this;

    const dev = {
        prefix:'interface',

        circuit:{active:!false,fontStyle:'color:rgb(195, 81, 172); font-style:italic;'},
        part:{active:!false,fontStyle:'color:rgb(81, 178, 223); font-style:italic;'},
        unit:{active:!false,fontStyle:'color:rgb(99, 196, 129); font-style:italic;'},

        log:{
            circuit:function(data){
                if(!dev.circuit.active){return;}
                console.log('%c'+dev.prefix+'.circuit'+(new Array(...arguments).join(' ')), dev.circuit.fontStyle );
            },
            part:function(data){
                if(!dev.part.active){return;}
                console.log('%c'+dev.prefix+'.part'+(new Array(...arguments).join(' ')), dev.part.fontStyle );
            },
            unit:function(data){
                if(!dev.unit.active){return;}
                console.log('%c'+dev.prefix+'.unit'+(new Array(...arguments).join(' ')), dev.unit.fontStyle );
            },
        },

        testLoggers:function(){
            const circuit = dev.circuit.active;
            const part = dev.part.active;
            const unit = dev.unit.active;

            dev.circuit.active = true;
            dev.part.active = true;
            dev.unit.active = true;

            dev.log.circuit('.testLoggers -> circuit');
            dev.log.part('.testLoggers -> part');
            dev.log.unit('.testLoggers -> unit');

            dev.circuit.active = circuit;
            dev.part.active = part;
            dev.unit.active = unit;
        },
    };

    this.circuit = new function(){
        {{include:circuit/main.js}}
    };
    this.part = new function(){
        {{include:part/main.js}}
    };
    this.unit = new function(){
        // {{include:unit/main.js}}
    };
};

_canvas_.system.go = function(){
    _canvas_.layers.registerLayerLoaded('interface',_canvas_.interface);
    if(_canvas_.interface.go){_canvas_.interface.go();}
};