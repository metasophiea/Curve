this.circle = function(_name){
    genericElementProxy.call(this,'circle',_name);

    Object.entries({
        x: 0,
        y: 0,
        colour: {r:1,g:0,b:0,a:1},
        radius: 10,
    }).forEach(([name,defaultValue]) => this.setupSimpleAttribute(name,defaultValue) );
};