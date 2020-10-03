this.Image = function(_name){
    genericElement.call(this,'Image',_name);

    Object.entries({
        x: 0,
        y: 0,
        angle: 0,
        anchor: {x:0,y:0},
        width: 10,
        height: 10,
        url:undefined,
    }).forEach(([name,defaultValue]) => this.__setupSimpleAttribute(name,defaultValue) );

    Object.entries({
        bitmap: undefined,
    }).forEach(([name,defaultValue]) => this.__setupTransferableAttribute(name,defaultValue) );
};