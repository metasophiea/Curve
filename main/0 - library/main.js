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
    this.font = new function(){
        {{include:font.js}}
    };
    this.misc = new function(){
        {{include:misc.js}}
    };
    var _thirdparty = new function(){
        var thirdparty = this;
        {{include:thirdparty/*}} /**/
    };
    this.__tp = _thirdparty;
};