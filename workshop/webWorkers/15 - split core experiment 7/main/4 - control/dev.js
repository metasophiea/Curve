const dev = {
    prefix:'control',

    active:{
        interaction: false,
        viewport: false, 
        scene: false, 
        selection: false, 
        actionRegistry: false,
        queryString: false,
        grapple: false,
        mouse: false, 
        keyboard: false, 
    },

    log:{
        interaction:function(){
            if(!dev.active.interaction){return;}
            console.log( dev.prefix+'.interaction'+arguments[0], ...(new Array(...arguments).slice(1)) );
        },
        viewport:function(){
            if(!dev.active.viewport){return;}
            console.log( dev.prefix+'.viewport'+arguments[0], ...(new Array(...arguments).slice(1)) );
        },
        scene:function(){
            if(!dev.active.scene){return;}
            console.log( dev.prefix+'.scene'+arguments[0], ...(new Array(...arguments).slice(1)) );
        },
        selection:function(){
            if(!dev.active.selection){return;}
            console.log( dev.prefix+'.selection'+arguments[0], ...(new Array(...arguments).slice(1)) );
        },
        actionRegistry:function(){
            if(!dev.active.actionRegistry){return;}
            console.log( dev.prefix+'.actionRegistry'+arguments[0], ...(new Array(...arguments).slice(1)) );
        },
        queryString:function(){
            if(!dev.active.queryString){return;}
            console.log( dev.prefix+'.queryString'+arguments[0], ...(new Array(...arguments).slice(1)) );
        },
        grapple:function(){
            if(!dev.active.grapple){return;}
            console.log( dev.prefix+'.grapple'+arguments[0], ...(new Array(...arguments).slice(1)) );
        },
        mouse:function(){
            if(!dev.active.mouse){return;}
            console.log( dev.prefix+'.mouse.functionList'+arguments[0], ...(new Array(...arguments).slice(1)) );
        },
        keyboard:function(){
            if(!dev.active.keyboard){return;}
            console.log( dev.prefix+'.keyboard.functionList'+arguments[0], ...(new Array(...arguments).slice(1)) );
        },
    },
};