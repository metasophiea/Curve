var alphaUnit = this;

this.audioEffectUnits = new function(){
    {{include:audioEffectUnits/*}} /**/
};

this.audioFile = new function(){
    {{include:audioFile/*}} /**/
};

this.humanInputDevices = new function(){
    {{include:humanInputDevices/*}} /**/
};

this.humanOutputDevices = new function(){
    {{include:humanOutputDevices/*}} /**/
};

this.sequencers = new function(){
    {{include:sequencers/*}} /**/
};

this.synthesizers = new function(){
    {{include:synthesizers/*}} /**/
};

this.misc = new function(){
    {{include:misc/*}} /**/
};

{{include:builder.js}}