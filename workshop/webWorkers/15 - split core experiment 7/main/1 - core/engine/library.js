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