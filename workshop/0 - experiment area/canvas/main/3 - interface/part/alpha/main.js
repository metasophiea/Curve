var interfacePart = this;

this.basic = new function(){
    {{include:basic/*}} /**/
};

this.display = new function(){
    {{include:display/*}} /**/
};

this.control = new function(){
    {{include:control/*}} /**/
};

this.dynamic = new function(){
    {{include:dynamic/*}} /**/
};

{{include:builder.js}}