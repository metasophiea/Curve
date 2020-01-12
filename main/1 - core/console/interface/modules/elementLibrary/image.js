this.image = function(_name){
    genericElementProxy.call(this,'image',_name);

    Object.entries({
        x: 0,
        y: 0,
        angle: 0,
        anchor: {x:0,y:0},
        width: 10,
        height: 10,
        url:'',
        bitmap: undefined,
    }).forEach(([name,defaultValue]) => this.setupSimpleAttribute(name,defaultValue) );
};