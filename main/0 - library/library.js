this.versionInformation = { tick:0, lastDateModified:{y:2020,m:1,d:5} };
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
    {{include:modules/audio.js}}
};
const _thirdparty = new function(){
    const thirdparty = this;
    {{include:modules/thirdparty/*}} /**/
};