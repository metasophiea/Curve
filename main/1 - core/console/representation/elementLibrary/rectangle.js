this.Rectangle = function(_name){
    genericElement.call(this,'Rectangle',_name);

    Object.entries({
        colour: {r:1,g:0,b:0,a:1},
        anchor: {x:0,y:0},
        width: 10,
        height: 10,
    }).forEach(([name,defaultValue]) => this.__setupSimpleAttribute(name,defaultValue) );
};