const dev = new function(){
    const prefix = 'core_engine';
    const active = {
        element:false,
        elementLibrary:{
            group:false,
            rectangle:false,
            rectangleWithOutline:false,
            circle:false,
            circleWithOutline:false,
            polygon:false,
            polygonWithOutline:false,
            path:false,
            image:false,
            canvas:false,
            character:false,
            characterString:false,
            characterFonts:false,
        },
        arrangement:false,
        render:false,
        viewport:false,
        stats:false,
        callback:false,
        service:false,
        interface:false,
    };

    this.log = {};
    Object.entries(active).forEach(entry => {
        if(typeof entry[1] == 'object'){
            this.log[entry[0]] = {};
            Object.keys(active[entry[0]]).forEach(key => {
                this.log[entry[0]][key] = function(){
                    if(active[entry[0]][key]){ 
                        console.log( prefix+'.'+entry[0]+'.'+key+arguments[0], ...(new Array(...arguments).slice(1)) );
                    }
                };
            });
        }else{
            this.log[entry[0]] = function(){
                if(active[entry[0]]){ 
                    console.log( prefix+'.'+entry[0]+arguments[0], ...(new Array(...arguments).slice(1)) );
                }
            };
        }
    });

    const countActive = !false;
    const countMemory = {};
    this.count = function(commandTag){
        if(!countActive){return;}
        if(commandTag in countMemory){ countMemory[commandTag]++; }
        else{ countMemory[commandTag] = 1; }
    };
    this.countResults = function(){return countMemory;};
};