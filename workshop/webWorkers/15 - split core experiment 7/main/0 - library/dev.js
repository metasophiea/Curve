const dev = {
    prefix:'library',

    active:{ math:false, structure:false, audio:false, font:false, misc:false },

    log:{
        math:function(){
            if(!dev.active.math){return;}
            console.log( dev.prefix+'.math'+arguments[0], ...(new Array(...arguments).slice(1)) );
        },
        structure:function(){
            if(!dev.active.structure){return;}
            console.log( dev.prefix+'.structure'+arguments[0], ...(new Array(...arguments).slice(1)) );
        },
        audio:function(){
            if(!dev.active.audio){return;}
            console.log( dev.prefix+'.audio'+arguments[0], ...(new Array(...arguments).slice(1)) );
        },
        font:function(){
            if(!dev.active.font){return;}
            console.log( dev.prefix+'.font'+arguments[0], ...(new Array(...arguments).slice(1)) );
        },
        misc:function(){
            if(!dev.active.misc){return;}
            console.log( dev.prefix+'.misc'+arguments[0], ...(new Array(...arguments).slice(1)) );
        },
    },

    countActive:false,
    countMemory:{},
    count:function(commandTag){
        if(!dev.countActive){return;}
        if(commandTag in dev.countMemory){ dev.countMemory[commandTag]++; }
        else{ dev.countMemory[commandTag] = 1; }
    },
    countResults:function(){return countMemory;},
};