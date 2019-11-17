_canvas_.library = new function(){
    this.versionInformation = { tick:0, lastDateModified:{y:'????',m:'??',d:'??'} };
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
        {{include:modules/math.js}}
    };
    this.glsl = new function(){
        {{include:modules/glsl.js}}
    };
    this.structure = new function(){
        {{include:modules/structure.js}}
    };
    this.audio = new function(){
        {{include:modules/audio.js}}
    };
    this.font = new function(){
        {{include:modules/font.js}}
    };
    this.misc = new function(){
        {{include:modules/misc.js}}
    };
    const _thirdparty = new function(){
        const thirdparty = this;
        {{include:modules/thirdparty/*}} /**/
    };
};

_canvas_.getVersionInformation = function(){
    return Object.keys(_canvas_).filter(item => item!='getVersionInformation').map(item => ({name:item,data:_canvas_[item].versionInformation}));
};