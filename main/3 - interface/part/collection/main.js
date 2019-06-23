this.collection = new function(){
    this.basic = new function(){
        {{include:basic/_main.js}}
    };
    this.display = new function(){
        {{include:display/_main.js}}
    };
    this.control = new function(){
        {{include:control/_main.js}}
    };
    this.dynamic = new function(){
        {{include:dynamic/_main.js}}
    };
};