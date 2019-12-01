this.collection = new function(){
    this.basic = new function(){
        interfacePart.partLibrary.basic = {};
        {{include:basic/*}} /**/
    };
    this.display = new function(){
        interfacePart.partLibrary.display = {};
        {{include:display/*}} /**/
    };
    this.control = new function(){
        interfacePart.partLibrary.control = {};
        {{include:control/*}} /**/
    };
    // this.dynamic = new function(){
    //     interfacePart.partLibrary.dynamic = {};
    //     {{include:dynamic/*}} /**/
    // };
};