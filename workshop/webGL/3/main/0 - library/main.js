_canvas_.library = new function(){
    var library = this;
    
    this.math = new function(){
        {{include:math.js}}
    };
    this.gsls = new function(){
        {{include:gsls.js}}
    };
    this.structure = new function(){
        {{include:structure.js}}
    };
    this.audio = new function(){
        {{include:audio.js}}
    };
    this.misc = new function(){
        {{include:misc.js}}
    };
    this.thirdparty = new function(){
        {{include:thirdparty.js}}
    };
};