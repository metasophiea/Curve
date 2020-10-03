this.Circle = function(_name){
    genericElement.call(this,'Circle',_name);

    Object.entries({
        colour: {r:1,g:0,b:0,a:1},
        radius: 10,
        detail: 25,
    }).forEach(([name,defaultValue]) => this.__setupSimpleAttribute(name,defaultValue) );
};