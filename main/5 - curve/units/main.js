_canvas_.interface.unit.collection = new function(){
    this.workshop = new function(){
        {{include:0 - workshop/main.js}}
    };
    this.development = new function(){
        {{include:0 - development/main.js}}
    };
    this.alpha = new function(){
        {{include:1 - alpha/main.js}}
    };
    this.curvetech = new function(){
        {{include:2 - curvetech/main.js}}
    };
    this.harbinger = new function(){
        {{include:3 - harbinger/main.js}}
    };
};

_canvas_.interface.unit.collection.metadata = {
    mainList:[
        'alpha',
        'curvetech',
        'harbinger',
    ],
    devList:[
        'development',
        'workshop',
    ],
};