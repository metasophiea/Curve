_canvas_.interface.unit.collection = new function(){
    this.development = new function(){
        {{include:0 - development/main.js}}
    };
    this.alpha = new function(){
        {{include:1 - alpha/main.js}}
    };
};

_canvas_.interface.unit.collection.metadata = {
    mainList:[
        'alpha',
    ],
    devList:[
        'development',
    ],
};