_canvas_.library = new function(){
    this.versionInformation = { tick:0, lastDateModified:{y:2019,m:5,d:31} };
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
};

_canvas_.getVersionInformation = function(){
    return Object.keys(_canvas_).filter(item => item!='getVersionInformation').map(item => ({name:item,data:_canvas_[item].versionInformation}));
};