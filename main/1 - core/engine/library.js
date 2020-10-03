const library = new function(){
    const library = this;

    {{include:../../0 - library/dev.js}}
    
    this.math = new function(){
        {{include:../../0 - library/modules/math/main.js}}
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
    this._thirdparty = new function(){
        const thirdparty = this;
        {{include:../../0 - library/modules/thirdparty/*}} /**/
    };
    const _thirdparty = this._thirdparty;
};