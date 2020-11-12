_canvas_.library = new function(){
    this.versionInformation = { tick:0, lastDateModified:{y:2020,m:11,d:12} };
    const library = this;
    
    {{include:dev.js}}

    this.math = new function(){
        {{include:modules/math/main.js}}
    };
    this.glsl = new function(){
        {{include:modules/glsl.js}}
    };
    this.structure = new function(){
        {{include:modules/structure.js}}
    };
    this.font = new function(){
        {{include:modules/font.js}}
    };
    this.misc = new function(){
        {{include:modules/misc.js}}
    };
    this.audio = new function(){
        {{include:modules/audio/main.js}}
    };
    const _thirdparty = new function(){
        const thirdparty = this;
        {{include:modules/thirdparty/*}} /**/
    };
};

_canvas_.layers.registerLayer("library", _canvas_.library);
_canvas_.library.audio.nowReady = function(){
    _canvas_.layers.declareLayerAsLoaded("library");
};