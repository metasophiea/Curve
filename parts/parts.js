var parts = new function(){
    this.basic = new function(){
        {{include:basic/*}}
    }
    this.modifier = new function(){
        {{include:modifiers/*}}
    }
    this.display = new function(){
        {{include:display/*}}
    }
    this.control = new function(){
        {{include:control/*}}
    }
    this.audio = new function(){
        {{include:audio/*}}
    }
    this.dynamic = new function(){
        {{include:dynamic/*}}
    }
};